import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/contexts/I18nContext";
import Editor from "@monaco-editor/react";
import { Save } from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

interface UnifiedSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vocabularyUrl: string;
  setVocabularyUrl: (url: string) => void;
  wordDisplayTime: number;
  setWordDisplayTime: (time: number) => void;
  bothDisplayTime: number;
  setBothDisplayTime: (time: number) => void;
  swapWordTranslation: boolean;
  setSwapWordTranslation: (swap: boolean) => void;
  onLoadVocabulary: () => void;
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

export default function UnifiedSettingsDialog({
  isOpen,
  onClose,
  vocabularyUrl,
  setVocabularyUrl,
  wordDisplayTime,
  setWordDisplayTime,
  bothDisplayTime,
  setBothDisplayTime,
  swapWordTranslation,
  setSwapWordTranslation,
  onLoadVocabulary,
  code,
  setCode,
}: UnifiedSettingsDialogProps) {
  const { t } = useI18n();
  const [editorValue, setEditorValue] = useState(code);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    input: string;
    output: string;
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value);
      setHasUnsavedChanges(value !== code);
      setError(null);
    }
  };

  const handleSave = () => {
    setCode(editorValue);
    setHasUnsavedChanges(false);
  };

  const handleTest = async () => {
    try {
      const testData = { word: "hello", translation: "你好" };
      const TshetUinh = await import("tshet-uinh");
      // eslint-disable-next-line no-eval
      const result = (function () {
        const func = eval(`(${editorValue})`);
        return func.call({ TshetUinh }, testData);
      })();

      if (
        !result ||
        typeof result.word !== "string" ||
        typeof result.translation !== "string"
      ) {
        setError(t.toastTestError);
        setTestResult(null);
      } else {
        setError(null);
        setTestResult({
          input: JSON.stringify(testData, null, 2),
          output: JSON.stringify(result, null, 2),
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code");
      setTestResult(null);
    }
  };

  const handleReset = () => {
    setEditorValue(DEFAULT_CODE);
    setHasUnsavedChanges(DEFAULT_CODE !== code);
    setError(null);
    setTestResult(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[1400px] w-[98vw] h-[98vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t.configuration}</DialogTitle>
            <DialogDescription>
              Configure vocabulary, timing, and post-processing code
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="timing">Timing</TabsTrigger>
              <TabsTrigger value="code">
                Code Editor
                {hasUnsavedChanges && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-yellow-500" />
                )}
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="flex-1 overflow-y-auto space-y-6 p-4">
              {/* Language Switcher */}
              <div className="space-y-3">
                <Label>Interface Language</Label>
                <LanguageSwitcher />
              </div>

              {/* Vocabulary URL */}
              <div className="space-y-3">
                <Label htmlFor="vocab-url">{t.vocabularyUrl}</Label>
                <Input
                  id="vocab-url"
                  type="url"
                  value={vocabularyUrl}
                  onChange={(e) => setVocabularyUrl(e.target.value)}
                  placeholder={t.vocabularyUrlPlaceholder}
                />
                <p className="text-sm text-muted-foreground">
                  {t.vocabularyUrlHint}
                </p>
                <Button onClick={onLoadVocabulary} className="w-full">
                  Load Vocabulary
                </Button>
              </div>

              {/* Swap Option */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <Label htmlFor="swap">{t.swapWordTranslation}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.swapWordTranslationHint}
                  </p>
                </div>
                <Switch
                  id="swap"
                  checked={swapWordTranslation}
                  onCheckedChange={setSwapWordTranslation}
                />
              </div>
            </TabsContent>

            {/* Timing Tab */}
            <TabsContent value="timing" className="flex-1 overflow-y-auto space-y-6 p-4">
              <div className="space-y-3">
                <Label htmlFor="word-time">{t.wordDisplayTime}</Label>
                <Input
                  id="word-time"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={wordDisplayTime}
                  onChange={(e) => setWordDisplayTime(parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="both-time">{t.bothDisplayTime}</Label>
                <Input
                  id="both-time"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={bothDisplayTime}
                  onChange={(e) => setBothDisplayTime(parseFloat(e.target.value))}
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-2">{t.instructions}</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {t.instructionsList.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Code Editor Tab */}
            <TabsContent value="code" className="flex-1 flex flex-col space-y-4 min-h-0 p-4">
              <div className="flex-1 min-h-[500px] border border-border rounded overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={editorValue}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                  }}
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-destructive/20 border border-destructive p-3 rounded">
                  <p className="text-sm text-destructive-foreground font-semibold mb-1">
                    ERROR
                  </p>
                  <p className="text-sm text-destructive-foreground font-mono">
                    {error}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  variant="default"
                  className="flex-1"
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleTest} variant="outline" className="flex-1">
                  {t.testCode}
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  {t.resetToDefault}
                </Button>
              </div>

              {/* Instructions */}
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-semibold">
                  {t.postProcessingInstructions}
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {t.postProcessingInstructionsList.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
                <div className="mt-3 p-3 bg-muted rounded">
                  <p className="text-sm font-semibold mb-1">tshet-uinh Library</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    The tshet-uinh library is pre-loaded and available as{" "}
                    <code className="bg-black/20 px-1 py-0.5 rounded">
                      TshetUinh
                    </code>
                  </p>
                  <code className="text-xs bg-black/20 px-2 py-1 rounded block">
                    const 音韻地位 = TshetUinh.音韻地位.from描述('羣開三A支平');
                  </code>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Test Result Dialog */}
      <Dialog open={!!testResult} onOpenChange={() => setTestResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Successful</DialogTitle>
            <DialogDescription>
              Your code executed successfully with the test data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">Input:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                {testResult?.input}
              </pre>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Output:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                {testResult?.output}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
