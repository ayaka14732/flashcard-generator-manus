import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
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

export default function PostProcessingPanel({
  isOpen,
  onClose,
  code,
  setCode,
}: PostProcessingPanelProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    try {
      // Test the code with sample data
      const testData = { word: "hello", translation: "你好" };
      // Import TshetUinh dynamically to make it available in eval context
      const TshetUinh = await import("tshet-uinh");
      // eslint-disable-next-line no-eval
      const result = (function() {
        const func = eval(`(${code})`);
        return func.call({ TshetUinh }, testData);
      })();
      
      if (!result || typeof result.word !== "string" || typeof result.translation !== "string") {
        setError(t.toastTestError);
      } else {
        setError(null);
        const message = t.toastTestSuccess
          .replace("{input}", JSON.stringify(testData))
          .replace("{output}", JSON.stringify(result));
        alert(message);
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
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-card border-l border-border z-50 overflow-y-auto">
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <h2 className="text-xl font-semibold">
              {t.postProcessing}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
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
                className="w-full h-full bg-black border border-border p-4 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                spellCheck={false}
                style={{
                  tabSize: 2,
                  lineHeight: "1.5",
                }}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/20 border border-destructive p-3 rounded">
                <p className="text-sm text-destructive-foreground">
                  ERROR: {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleTest}
                variant="outline"
                className="flex-1"
              >
                {t.testCode}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                {t.resetToDefault}
              </Button>
            </div>

            {/* Instructions */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold">{t.postProcessingInstructions}</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                {t.postProcessingInstructionsList.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
              <div className="mt-3 p-3 bg-muted rounded">
                <p className="text-sm font-semibold mb-1">tshet-uinh Library</p>
                <p className="text-xs text-muted-foreground mb-2">
                  The tshet-uinh library is pre-loaded and available as <code className="bg-black/20 px-1 py-0.5 rounded">TshetUinh</code>
                </p>
                <code className="text-xs bg-black/20 px-2 py-1 rounded block">
                  const 音韻地位 = TshetUinh.音韻地位.from描述('羣開三A支平');
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
