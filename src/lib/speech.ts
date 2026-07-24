let cachedJaVoice: SpeechSynthesisVoice | null | undefined;

function getJapaneseVoice(): SpeechSynthesisVoice | null {
  if (cachedJaVoice !== undefined) return cachedJaVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedJaVoice =
    voices.find((v) => v.lang === "ja-JP") ??
    voices.find((v) => v.lang.startsWith("ja")) ??
    null;
  return cachedJaVoice;
}

/** Speak Japanese text aloud via the browser's SpeechSynthesis API. */
export function speakJapanese(text: string, rate = 0.9): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  utter.rate = rate;
  const voice = getJapaneseVoice();
  if (voice) utter.voice = voice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// Voice lists load asynchronously in some browsers; prime the cache once available.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    cachedJaVoice = undefined;
  });
}
