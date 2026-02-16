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
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 300);
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
          animation: "gridPulse 2s ease-in-out infinite",
        }}
      />

      {/* Flashcard Content */}
      <div
        className={`relative z-10 text-center transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Word */}
        <div
          className="font-display text-6xl md:text-7xl lg:text-8xl text-white mb-8"
          style={{ letterSpacing: "-0.02em" }}
        >
          {word}
        </div>

        {/* Translation */}
        <div
          className={`font-display text-4xl md:text-5xl lg:text-6xl transition-all duration-200 ${
            displayState === "both"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
          style={{
            color: "oklch(0.7 0.1 210)",
            letterSpacing: "-0.02em",
          }}
        >
          {translation}
        </div>
      </div>

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
