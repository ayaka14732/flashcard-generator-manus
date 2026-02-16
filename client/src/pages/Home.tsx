import FlashcardDisplay from "@/components/FlashcardDisplay";
import UnifiedSettingsDialog from "@/components/UnifiedSettingsDialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as TshetUinh from "tshet-uinh";

interface FlashcardPair {
  word: string;
  translation: string;
}

const DEFAULT_POST_PROCESSING = `// Post-processing function
// Receives: { word, translation }
// Returns: { word, translation }
// Note: tshet-uinh library is pre-loaded and available as TshetUinh

function process({ word, translation }) {
  // Example: Convert to uppercase
  // return { word: word.toUpperCase(), translation: translation.toUpperCase() };
  
  // Example: Add prefix
  // return { word: "→ " + word, translation: "← " + translation };
  
  // Example: Use tshet-uinh library
  // const 音韻地位 = TshetUinh.音韻地位.from描述('羣開三A支平');
  // return { word: 音韻地位.描述, translation: translation };
  
  // Default: no transformation
  return { word, translation };
}`;

export default function Home() {
  const { t } = useI18n();

  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [vocabularyUrl, setVocabularyUrl] = useState(
    "https://raw.githubusercontent.com/nk2028/tshet-uinh-flashcard/refs/heads/main/public/data/data_small.tsv"
  );
  const [wordDisplayTime, setWordDisplayTime] = useState(2);
  const [bothDisplayTime, setBothDisplayTime] = useState(1);
  const [swapWordTranslation, setSwapWordTranslation] = useState(false);
  const [postProcessingCode, setPostProcessingCode] = useState(
    DEFAULT_POST_PROCESSING
  );

  // Flashcard state
  const [flashcards, setFlashcards] = useState<FlashcardPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayState, setDisplayState] = useState<"word" | "both">("word");

  // Load vocabulary
  const loadVocabulary = async () => {
    try {
      const response = await fetch(vocabularyUrl);
      if (!response.ok) throw new Error("Failed to fetch vocabulary");

      const text = await response.text();
      const lines = text.trim().split("\n");
      const pairs: FlashcardPair[] = lines
        .map((line) => {
          const [translation, word] = line.split("\t");
          if (translation && word) {
            return { word: word.trim(), translation: translation.trim() };
          }
          return null;
        })
        .filter((pair): pair is FlashcardPair => pair !== null);

      if (pairs.length === 0) {
        throw new Error("No valid flashcard pairs found");
      }

      setFlashcards(pairs);
      setCurrentIndex(0);
      setIsPlaying(true);
      setDisplayState("word");
      setSettingsOpen(false);
      toast.success(t.toastLoadSuccess.replace("{count}", pairs.length.toString()));
    } catch (error) {
      console.error("Error loading vocabulary:", error);
      toast.error(t.toastLoadError);
    }
  };

  // Process flashcard with post-processing
  const processFlashcard = (pair: FlashcardPair): FlashcardPair => {
    // Swap if needed
    if (swapWordTranslation) {
      pair = { word: pair.translation, translation: pair.word };
    }

    // Apply post-processing
    try {
      // Make TshetUinh available in eval context
      // eslint-disable-next-line no-eval
      const processedPair = (function () {
        const func = eval(`(${postProcessingCode})`);
        return func.call({ TshetUinh }, pair);
      })();
      if (
        processedPair &&
        typeof processedPair.word === "string" &&
        typeof processedPair.translation === "string"
      ) {
        return processedPair;
      }
    } catch (error) {
      console.error("Post-processing error:", error);
    }

    return pair;
  };

  // Flashcard display logic
  useEffect(() => {
    if (!isPlaying || flashcards.length === 0) return;

    setDisplayState("word");

    const wordTimer = setTimeout(() => {
      setDisplayState("both");

      const bothTimer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % flashcards.length;
        setCurrentIndex(nextIndex);
      }, bothDisplayTime * 1000);

      return () => clearTimeout(bothTimer);
    }, wordDisplayTime * 1000);

    return () => clearTimeout(wordTimer);
  }, [
    isPlaying,
    currentIndex,
    flashcards.length,
    wordDisplayTime,
    bothDisplayTime,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        setSettingsOpen(true);
      } else if (e.key === "Escape") {
        setSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const currentPair =
    flashcards.length > 0 ? processFlashcard(flashcards[currentIndex]) : null;

  return (
    <div className="min-h-screen relative">
      {/* Settings Button - Top Right */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-6 right-6 z-30 bg-card/90 backdrop-blur border border-border"
        onClick={() => setSettingsOpen(true)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Progress Indicator */}
      {isPlaying && flashcards.length > 0 && (
        <div className="fixed top-6 left-6 z-30">
          <div className="bg-card/90 backdrop-blur border-2 border-border px-4 py-2">
            <p className="text-sm">
              {t.progressFormat
                .replace("{current}", (currentIndex + 1).toString())
                .replace("{total}", flashcards.length.toString())}
            </p>
          </div>
        </div>
      )}

      {/* Flashcard Display */}
      {isPlaying && currentPair ? (
        <FlashcardDisplay
          word={currentPair.word}
          translation={currentPair.translation}
          displayState={displayState}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-4 font-bold">
              FLASHCARD GENERATOR
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {t.welcomeSubtitle}
            </p>
            <Button
              onClick={() => setSettingsOpen(true)}
              size="lg"
              className="h-12 px-8"
            >
              {t.openSettings}
            </Button>
          </div>
        </div>
      )}

      {/* Unified Settings Dialog */}
      <UnifiedSettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        vocabularyUrl={vocabularyUrl}
        setVocabularyUrl={setVocabularyUrl}
        wordDisplayTime={wordDisplayTime}
        setWordDisplayTime={setWordDisplayTime}
        bothDisplayTime={bothDisplayTime}
        setBothDisplayTime={setBothDisplayTime}
        swapWordTranslation={swapWordTranslation}
        setSwapWordTranslation={setSwapWordTranslation}
        onLoadVocabulary={loadVocabulary}
        code={postProcessingCode}
        setCode={setPostProcessingCode}
      />
    </div>
  );
}
