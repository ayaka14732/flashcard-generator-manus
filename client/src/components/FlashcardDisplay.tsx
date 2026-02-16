/**
 * FlashcardDisplay Component
 * Design: Brutalist Digital Learning
 * - Deep black background with cyan-blue grid pattern
 * - Sharp geometric layout, no rounded corners
 * - High contrast typography with Space Grotesk
 * - Minimal animations (200-300ms transitions)
 */

import { useEffect, useState } from "react";

interface FlashcardDisplayProps {
  word: string;
  translation: string;
  wordDisplayTime: number;
  bothDisplayTime: number;
  onComplete: () => void;
}

type DisplayState = "word-only" | "both" | "transitioning";

export default function FlashcardDisplay({
  word,
  translation,
  wordDisplayTime,
  bothDisplayTime,
  onComplete,
}: FlashcardDisplayProps) {
  const [displayState, setDisplayState] = useState<DisplayState>("word-only");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    setDisplayState("word-only");

    const wordTimer = setTimeout(() => {
      setDisplayState("both");
    }, wordDisplayTime * 1000);

    const bothTimer = setTimeout(() => {
      onComplete();
    }, (wordDisplayTime + bothDisplayTime) * 1000);

    return () => {
      clearTimeout(wordTimer);
      clearTimeout(bothTimer);
    };
  }, [word, translation, wordDisplayTime, bothDisplayTime, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.3 0.1 210) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.3 0.1 210) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Flashcard Content */}
      <div className="relative z-10 text-center">
        {/* Word */}
        <div
          className="text-6xl md:text-7xl lg:text-8xl text-white mb-8 font-bold"
        >
          {word}
        </div>

        {/* Translation */}
        <div
          className={`text-4xl md:text-5xl lg:text-6xl ${
            displayState === "both" ? "opacity-100" : "opacity-0"
          }`}
          style={{
            color: "oklch(0.7 0.1 210)",
          }}
        >
          {translation}
        </div>
      </div>


    </div>
  );
}
