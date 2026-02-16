/**
 * PostProcessingPanel Component
 * Design: Brutalist Digital Learning
 * - Code editor with Fira Code monospace font
 * - Syntax highlighting via textarea styling
 * - Sharp rectangular design, minimal padding
 * - High contrast for code readability
 */

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface PostProcessingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  setCode: (code: string) => void;
}

const DEFAULT_CODE = `// Post-processing function
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

export default function PostProcessingPanel({
  isOpen,
  onClose,
  code,
  setCode,
}: PostProcessingPanelProps) {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTest = () => {
    try {
      // Test the code with sample data
      const testData = { word: "hello", translation: "你好" };
      // eslint-disable-next-line no-eval
      const result = eval(`(${code})({ word: "${testData.word}", translation: "${testData.translation}" })`);
      
      if (!result || typeof result.word !== "string" || typeof result.translation !== "string") {
        setError("Function must return { word: string, translation: string }");
      } else {
        setError(null);
        alert(`Test successful!\nInput: ${JSON.stringify(testData)}\nOutput: ${JSON.stringify(result)}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code");
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setError(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-card border-l-2 border-border z-50 overflow-y-auto">
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-border">
            <h2 className="font-mono text-xl font-medium tracking-tight">
              POST-PROCESSING
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex-1 min-h-0">
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(null);
                }}
                className="w-full h-full bg-black border-2 border-border p-4 font-code text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                spellCheck={false}
                style={{
                  tabSize: 2,
                  lineHeight: "1.5",
                }}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/20 border-2 border-destructive p-3">
                <p className="font-mono text-xs text-destructive-foreground">
                  ERROR: {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleTest}
                variant="outline"
                className="flex-1 font-mono text-sm h-10"
              >
                TEST CODE
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 font-mono text-sm h-10"
              >
                RESET TO DEFAULT
              </Button>
            </div>

            {/* Instructions */}
            <div className="space-y-2 pt-4 border-t-2 border-border">
              <h3 className="font-mono text-sm font-medium">INSTRUCTIONS</h3>
              <ul className="font-mono text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Write a function that transforms word/translation pairs</li>
                <li>Function receives: {"{ word, translation }"}</li>
                <li>Function must return: {"{ word, translation }"}</li>
                <li>Test your code before closing the panel</li>
                <li>Changes apply to all flashcards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
