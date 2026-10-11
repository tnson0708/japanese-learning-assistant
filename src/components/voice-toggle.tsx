"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  getVoiceGender,
  setVoiceGender,
  speakJapanese,
  type VoiceGender,
} from "@/lib/speech";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export function VoiceToggle() {
  const { language } = useLanguage();
  const [gender, setGenderState] = useState<VoiceGender>("female");

  useEffect(() => {
    setGenderState(getVoiceGender());
  }, []);

  const handleGenderChange = (newGender: VoiceGender) => {
    setGenderState(newGender);
    setVoiceGender(newGender);
    // Preview speech aloud when switching voice
    const sampleText = newGender === "female" ? "こんにちは" : "はじめまして";
    speakJapanese(sampleText, newGender);
  };

  const femaleLabel = language === "vi" ? "Nữ" : "Female";
  const maleLabel = language === "vi" ? "Nam" : "Male";

  const nextGender: VoiceGender = gender === "female" ? "male" : "female";

  return (
    <>
      {/* Mobile: one button showing the current voice, tap to switch */}
      <button
        type="button"
        onClick={() => handleGenderChange(nextGender)}
        className="sm:hidden flex size-9 items-center justify-center rounded-lg border border-input bg-background text-base shadow-2xs cursor-pointer"
        title={
          language === "vi"
            ? `Giọng đọc ${gender === "female" ? femaleLabel : maleLabel} — chạm để đổi`
            : `${gender === "female" ? femaleLabel : maleLabel} voice — tap to switch`
        }
        aria-label={
          nextGender === "female"
            ? "Switch to female Japanese voice"
            : "Switch to male Japanese voice"
        }
      >
        <span>{gender === "female" ? "👩" : "👨"}</span>
      </button>

      <div className="hidden sm:flex items-center rounded-full border bg-muted/80 p-1 text-xs shadow-2xs">
        <button
          type="button"
          onClick={() => handleGenderChange("female")}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold transition-all duration-150",
            gender === "female"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground font-normal opacity-70 hover:opacity-100"
          )}
          title={language === "vi" ? "Giọng đọc Nữ" : "Female Japanese Voice"}
          aria-label="Female Japanese Voice"
        >
          <span>👩</span>
          <span className="hidden 2xl:inline">{femaleLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => handleGenderChange("male")}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold transition-all duration-150",
            gender === "male"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground font-normal opacity-70 hover:opacity-100"
          )}
          title={language === "vi" ? "Giọng đọc Nam" : "Male Japanese Voice"}
          aria-label="Male Japanese Voice"
        >
          <span>👨</span>
          <span className="hidden 2xl:inline">{maleLabel}</span>
        </button>
      </div>
    </>
  );
}
