/**
 * Home Page - Flashcard Generator
 * Design: Brutalist Digital Learning
 * - Full viewport flashcard display with grid background
 * - Settings and post-processing panels slide in from right
 * - Keyboard shortcuts for quick access
 * - Minimal UI, maximum focus on content
 */

import FlashcardDisplay from "@/components/FlashcardDisplay";
import PostProcessingPanel from "@/components/PostProcessingPanel";
import SettingsPanel from "@/components/SettingsPanel";
import { Button } from "@/components/ui/button";
import { Code, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FlashcardPair {
  word: string;
  translation: string;
}

const DEFAULT_POST_PROCESSING = `// Post-processing function
// Receives: { word, translation }
// Returns: { word, translation }

function process({ word, translation }) {
  // Example: Convert to uppercase
  // return { word: word.toUpperCase(), translation: translation.toUpperCase() };
  
  // Example: Add prefix
  // return { word: "→ " + word, translation: "← " + translation };
  
  // Default: no transformation
  return { word, translation };
}`;

export default function Home() {
  // Settings state
  const [vocabularyUrl, setVocabularyUrl] = useState("https://files.manuscdn.com/user_upload_by_module/session_file/310519663323892428/HBgHuOeOJYodGIQm.txt");
  const [wordDisplayTime, setWordDisplayTime] = useState(2);
  const [bothDisplayTime, setBothDisplayTime] = useState(1);
  const [swapWordTranslation, setSwapWordTranslation] = useState(false);
  const [postProcessingCode, setPostProcessingCode] = useState(DEFAULT_POST_PROCESSING);

  // Flashcard state
  const [flashcards, setFlashcards] = useState<FlashcardPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Panel state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [postProcessingOpen, setPostProcessingOpen] = useState(false);

  // Load vocabulary from URL
  const loadVocabulary = async () => {
    if (!vocabularyUrl) {
      toast.error("Please provide a vocabulary URL");
      return;
    }

    try {
      const response = await fetch(vocabularyUrl);
      if (!response.ok) throw new Error("Failed to fetch vocabulary");

      const text = await response.text();
      const lines = text.split("\n").filter((line) => line.trim());

      const pairs: FlashcardPair[] = lines.map((line) => {
        const [translation, word] = line.split("\t");
        if (!translation || !word) {
          throw new Error("Invalid format: each line must be 'translation\\tword'");
        }
        return { word: word.trim(), translation: translation.trim() };
      });

      if (pairs.length === 0) {
        throw new Error("No valid flashcard pairs found");
      }

      setFlashcards(pairs);
      setCurrentIndex(0);
      setIsPlaying(true);
      setSettingsOpen(false);
      toast.success(`Loaded ${pairs.length} flashcards`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load vocabulary");
    }
  };

  // Apply post-processing to current flashcard
  const getCurrentFlashcard = (): FlashcardPair | null => {
    if (flashcards.length === 0 || currentIndex >= flashcards.length) return null;

    let pair = flashcards[currentIndex];

    // Apply swap if enabled
    if (swapWordTranslation) {
      pair = { word: pair.translation, translation: pair.word };
    }

    // Apply post-processing
    try {
      // eslint-disable-next-line no-eval
      const processedPair = eval(`(${postProcessingCode})(${JSON.stringify(pair)})`);
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

  // Handle flashcard completion
  const handleComplete = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop back to start
      setCurrentIndex(0);
      toast.success("Completed all flashcards! Starting over...");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSettingsOpen(false);
        setPostProcessingOpen(false);
      } else if (e.key === "s" && !settingsOpen && !postProcessingOpen) {
        setSettingsOpen(true);
      } else if (e.key === "e" && !settingsOpen && !postProcessingOpen) {
        setPostProcessingOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settingsOpen, postProcessingOpen]);

  const currentFlashcard = getCurrentFlashcard();

  return (
    <div className="min-h-screen relative">
      {/* Main Display */}
      {isPlaying && currentFlashcard ? (
        <FlashcardDisplay
          key={currentIndex}
          word={currentFlashcard.word}
          translation={currentFlashcard.translation}
          wordDisplayTime={wordDisplayTime}
          bothDisplayTime={bothDisplayTime}
          onComplete={handleComplete}
        />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center">
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

          {/* Welcome Message */}
          <div className="relative z-10 text-center space-y-6">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-4">
              FLASHCARD GENERATOR
            </h1>
            <p className="font-mono text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Load your vocabulary file to begin. Press S for settings or E for post-processing.
            </p>
            <Button
              onClick={() => setSettingsOpen(true)}
              size="lg"
              className="font-mono text-sm h-12 px-8"
            >
              OPEN SETTINGS
            </Button>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          className="h-12 w-12 bg-card/90 backdrop-blur"
          title="Settings (S)"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPostProcessingOpen(true)}
          className="h-12 w-12 bg-card/90 backdrop-blur"
          title="Post-Processing (E)"
        >
          <Code className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Indicator */}
      {isPlaying && flashcards.length > 0 && (
        <div className="fixed top-6 left-6 z-30">
          <div className="bg-card/90 backdrop-blur border-2 border-border px-4 py-2">
            <p className="font-mono text-sm">
              {currentIndex + 1} / {flashcards.length}
            </p>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <SettingsPanel
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
      />

      {/* Post-Processing Panel */}
      <PostProcessingPanel
        isOpen={postProcessingOpen}
        onClose={() => setPostProcessingOpen(false)}
        code={postProcessingCode}
        setCode={setPostProcessingCode}
      />
    </div>
  );
}
