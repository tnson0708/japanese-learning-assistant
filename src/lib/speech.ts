export type VoiceGender = "female" | "male";

export interface VoiceOption {
  name: string;
  gender: VoiceGender;
  lang: string;
  isDefault?: boolean;
}

const GENDER_STORAGE_KEY = "kana_dojo_voice_gender";
const VOICE_NAME_STORAGE_KEY = "kana_dojo_voice_name";

let currentGender: VoiceGender = "female";
let currentVoiceName: string | null = null;

// Initialize saved settings on client
if (typeof window !== "undefined") {
  const savedGender = localStorage.getItem(GENDER_STORAGE_KEY) as VoiceGender | null;
  if (savedGender === "female" || savedGender === "male") {
    currentGender = savedGender;
  }
  currentVoiceName = localStorage.getItem(VOICE_NAME_STORAGE_KEY);
}

/** Get currently selected voice gender ("female" | "male"). */
export function getVoiceGender(): VoiceGender {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(GENDER_STORAGE_KEY) as VoiceGender | null;
    if (saved === "female" || saved === "male") {
      return saved;
    }
  }
  return currentGender;
}

/** Set preferred voice gender ("female" | "male"). */
export function setVoiceGender(gender: VoiceGender): void {
  currentGender = gender;
  if (typeof window !== "undefined") {
    localStorage.setItem(GENDER_STORAGE_KEY, gender);
    // Reset specific voice name so best matching gender voice is selected automatically
    localStorage.removeItem(VOICE_NAME_STORAGE_KEY);
    currentVoiceName = null;
  }
}

/** Get list of all installed Japanese voices on user device. */
export function getAvailableJapaneseVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.filter((v) => {
    const lang = v.lang.toLowerCase().replace("_", "-");
    return lang.startsWith("ja") || lang === "ja-jp";
  });
}

/** Classify voice gender based on voice name heuristics (macOS / Windows / Android / iOS / Chrome). */
export function detectVoiceGender(voice: SpeechSynthesisVoice): VoiceGender {
  const name = voice.name.toLowerCase();
  const maleKeywords = ["otoya", "hattori", "keita", "ichiro", "takumi", "naoki", "male", "man", "george", "taro"];
  if (maleKeywords.some((kw) => name.includes(kw))) {
    return "male";
  }
  return "female"; // Kyoko, Nanami, Haruka, Ayumi, Google 日本語 defaults to natural female
}

/** Find best matching Japanese voice for target gender and settings. */
export function getBestJapaneseVoice(targetGender?: VoiceGender): { voice: SpeechSynthesisVoice | null; gender: VoiceGender } {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return { voice: null, gender: targetGender || "female" };
  }

  const voices = getAvailableJapaneseVoices();
  const gender = targetGender || getVoiceGender();

  if (voices.length === 0) {
    return { voice: null, gender };
  }

  // 1. If user selected a specific voice name in settings
  if (currentVoiceName) {
    const userVoice = voices.find((v) => v.name === currentVoiceName);
    if (userVoice) {
      return { voice: userVoice, gender: detectVoiceGender(userVoice) };
    }
  }

  // 2. Prefer local (on-device) voices over network/cloud ones. Network
  // voices (e.g. Chrome's "Google 日本語") depend on a live connection to
  // Google's synthesis servers and have a well-documented failure mode:
  // they report success — no error event, speak() proceeds normally — but
  // produce zero audible output when that connection is unavailable,
  // blocked, or the backend is having issues. A local voice, even an
  // unfamiliar one we don't recognize by name, is far more reliable.
  const localVoices = voices.filter((v) => v.localService);
  const pool = localVoices.length > 0 ? localVoices : voices;

  // 3. Filter voices matching target gender
  const genderVoices = pool.filter((v) => detectVoiceGender(v) === gender);

  // Preferred high quality voice names by gender
  const preferredFemale = ["kyoko", "nanami", "haruka", "ayumi", "google 日本語", "ja-jp", "ja_jp"];
  const preferredMale = ["otoya", "hattori", "keita", "ichiro", "takumi", "naoki"];

  const searchList = genderVoices.length > 0 ? genderVoices : pool;
  const preferredOrder = gender === "male" ? preferredMale : preferredFemale;

  for (const pref of preferredOrder) {
    const found = searchList.find((v) => v.name.toLowerCase().includes(pref));
    if (found) return { voice: found, gender };
  }

  return { voice: searchList[0] || null, gender };
}

// Keep strong JS references to active utterances to prevent V8 garbage collection
// mid-speech in Chrome/Chromium browsers, which causes SpeechSynthesis to permanently freeze.
const activeUtterances = new Set<SpeechSynthesisUtterance>();

/** Speak Japanese text aloud with selected voice, gender pitch modulation, and speed. */
export function speakJapanese(text: string, overrideGender?: VoiceGender, rate = 0.9): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  try {
    const synth = window.speechSynthesis;
    if (synth.paused) {
      synth.resume();
    }

    const targetGender = overrideGender || getVoiceGender();
    const { voice, gender } = getBestJapaneseVoice(targetGender);

    if (!voice) {
      const allVoices = synth.getVoices();
      console.error(
        allVoices.length === 0
          ? "TTS: speechSynthesis.getVoices() returned zero voices — this browser/OS has no speech engine available (common on Linux without speech-dispatcher, or a browser still loading its voice list). Speech will be silent."
          : `TTS: no Japanese (ja-JP) voice found among ${allVoices.length} installed voice(s). Falling back to lang="ja-JP" with the browser's default voice, which many engines silently ignore. Install a Japanese voice/language pack in the OS to fix this.`
      );
    } else if (!voice.localService) {
      console.warn(
        `TTS: using network voice "${voice.name}" — this streams audio from a remote server (e.g. Google's). If it produces no sound with no error, the connection to that service is being blocked (firewall/extension) or the backend is down. Installing a local Japanese voice in the OS avoids this entirely.`
      );
    }

    const wasSpeaking = synth.speaking || synth.pending;
    if (wasSpeaking) {
      synth.cancel();
      activeUtterances.clear();
    }

    const doSpeak = () => {
      try {
        const utter = new SpeechSynthesisUtterance(text);
        activeUtterances.add(utter);

        utter.lang = "ja-JP";
        utter.rate = rate;

        // Only assign voice if strictly a Japanese voice
        if (voice && voice.lang.toLowerCase().replace("_", "-").startsWith("ja")) {
          utter.voice = voice;
        }

        if (gender === "male") {
          utter.pitch = 0.85;
        } else {
          utter.pitch = 1.05;
        }

        let started = false;
        utter.onstart = () => {
          started = true;
        };

        utter.onend = () => {
          activeUtterances.delete(utter);
        };

        utter.onerror = (e) => {
          activeUtterances.delete(utter);

          // Ignore normal 'canceled' and 'interrupted' events during fast item switching
          if (e.error === "canceled" || e.error === "interrupted") return;

          console.error("TTS utterance error event:", e.error);

          // Fallback: If synthesis failed with explicit voice, retry using system default ja-JP
          if ((e.error === "synthesis-failed" || e.error === "voice-unavailable") && utter.voice) {
            const fallbackUtter = new SpeechSynthesisUtterance(text);
            activeUtterances.add(fallbackUtter);
            fallbackUtter.lang = "ja-JP";
            fallbackUtter.rate = rate;
            fallbackUtter.onend = () => activeUtterances.delete(fallbackUtter);
            fallbackUtter.onerror = () => activeUtterances.delete(fallbackUtter);
            synth.speak(fallbackUtter);
          }
        };

        synth.speak(utter);

        // Some browsers (older WebKit, some Android WebViews) neither fire an
        // error event nor start speaking when synthesis is silently refused —
        // this is the "no error, no sound" failure mode. Surface it explicitly
        // instead of leaving it a silent mystery.
        window.setTimeout(() => {
          if (!started && !synth.speaking && !synth.pending) {
            console.error(
              "TTS: speechSynthesis.speak() produced no 'start' event and the engine is idle — this browser silently refused to speak, with no error event fired. Check that the tab/system isn't muted, and that a Japanese voice is installed."
            );
          }
        }, 800);
      } catch (err) {
        console.warn("Speech synthesis notice:", err);
      }
    };

    if (wasSpeaking) {
      // Small delay after canceling previous active speech to allow Chromium IPC to finish cancel
      window.setTimeout(doSpeak, 40);
    } else {
      doSpeak();
    }
  } catch (err) {
    console.warn("Speech synthesis outer notice:", err);
  }
}

// Prime speech voices immediately, and again once the async voice list
// finishes loading (WebKit/Chromium fire 'voiceschanged' after page load).
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    getAvailableJapaneseVoices();
  };

  // Chrome/Chromium has a long-standing bug where its speechSynthesis engine
  // silently wedges — stops producing any audio, with no error — after being
  // used repeatedly over an extended session (exactly what happens during a
  // long listening-practice run that auto-speaks one item every few
  // seconds). Once wedged, it stays broken for the rest of the page's life,
  // even for unrelated speak() calls elsewhere. The documented mitigation is
  // to periodically "nudge" the engine with pause()+resume() while it's
  // actively speaking, which keeps it from ever reaching that stuck state.
  // See: https://bugs.chromium.org/p/chromium/issues/detail?id=679437
  const win = window as unknown as { __kanaDojoSpeechKeepAlive?: boolean };
  if (!win.__kanaDojoSpeechKeepAlive) {
    win.__kanaDojoSpeechKeepAlive = true;
    window.setInterval(() => {
      const synth = window.speechSynthesis;
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 5000);
  }
}
