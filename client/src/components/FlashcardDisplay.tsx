interface FlashcardDisplayProps {
  word: string;
  translation: string;
  wordHtml?: string;
  translationHtml?: string;
  displayState: "word" | "both";
}

export default function FlashcardDisplay({
  word,
  translation,
  wordHtml,
  translationHtml,
  displayState,
}: FlashcardDisplayProps) {
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
        {wordHtml ? (
          <div
            className="text-6xl md:text-7xl lg:text-8xl text-white mb-8 font-bold"
            dangerouslySetInnerHTML={{ __html: wordHtml }}
          />
        ) : (
          <div className="text-6xl md:text-7xl lg:text-8xl text-white mb-8 font-bold">
            {word}
          </div>
        )}

        {/* Translation */}
        {translationHtml ? (
          <div
            className={`text-4xl md:text-5xl lg:text-6xl ${
              displayState === "both" ? "opacity-100" : "opacity-0"
            }`}
            style={{
              color: "oklch(0.7 0.1 210)",
            }}
            dangerouslySetInnerHTML={{ __html: translationHtml }}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
}
