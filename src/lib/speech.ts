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
  return voices.filter((v) => v.lang.startsWith("ja") || v.lang.includes("ja_JP") || v.lang.includes("ja-JP"));
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

  // 2. Filter voices matching target gender
  const genderVoices = voices.filter((v) => detectVoiceGender(v) === gender);

  // Preferred high quality voice names by gender
  const preferredFemale = ["kyoko", "nanami", "haruka", "ayumi", "google 日本語", "ja-jp"];
  const preferredMale = ["otoya", "hattori", "keita", "ichiro", "takumi", "naoki"];

  const searchList = genderVoices.length > 0 ? genderVoices : voices;
  const preferredOrder = gender === "male" ? preferredMale : preferredFemale;

  for (const pref of preferredOrder) {
    const found = searchList.find((v) => v.name.toLowerCase().includes(pref));
    if (found) return { voice: found, gender };
  }

  return { voice: searchList[0] || null, gender };
}

/** Speak Japanese text aloud with selected voice, gender pitch modulation, and speed. */
export function speakJapanese(text: string, overrideGender?: VoiceGender, rate = 0.9): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const targetGender = overrideGender || getVoiceGender();
  const { voice, gender } = getBestJapaneseVoice(targetGender);

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = rate;

  if (voice) {
    utter.voice = voice;
  }

  // Pitch modulation to ensure distinct male / female voice depth even on fallback voices
  if (gender === "male") {
    utter.pitch = 0.85; // lower pitch for male voice
  } else {
    utter.pitch = 1.05; // slightly higher pitch for female voice
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// Prime speech voices when loaded asynchronously in WebKit/Chromium browsers
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getAvailableJapaneseVoices();
  };
}
