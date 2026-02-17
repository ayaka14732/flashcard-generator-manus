import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/contexts/I18nContext";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { toast } from "sonner";
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
// Returns: { word?, translation?, wordHtml?, translationHtml? }
// Note: If wordHtml/translationHtml is provided, word/translation becomes optional
// Pre-loaded libraries: TshetUinh, TshetUinhDeriverTools, TshetUinhExamples

function process({ word, translation }) {
  // Example 1: Plain text transformation
  // return { word: word.toUpperCase(), translation: translation.toUpperCase() };
  
  // Example 2: HTML-only return (word/translation optional when HTML provided)
  // return { 
  //   wordHtml: '<span style="color: red;">' + word + '</span>',
  //   translationHtml: '<span style="font-size: 2em;">' + translation + '</span>'
  // };
  
  // Example 3: Use tshet-uinh library
  // const 音韻地位 = TshetUinh.音韻地位.from描述('羣開三A支平');
  // return { word: 音韻地位.描述, translation: translation };
  
  // Example 4: Use tshet-uinh-examples for Baxter transcription
  // const 音韻地位 = TshetUinh.音韻地位.from描述(translation);
  // const 推導白一平轉寫 = TshetUinhExamples.baxter({ 版本: "1992" });
  // return { word, translation: 推導白一平轉寫(音韻地位) };
  
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
  const [editorCode, setEditorCode] = useState(code);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showTestResult, setShowTestResult] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorCode(value);
      setHasUnsavedChanges(value !== code);
    }
  };

  const handleSaveCode = () => {
    setCode(editorCode);
    setHasUnsavedChanges(false);
    toast.success("Code saved successfully");
  };

  const handleTestCode = () => {
    try {
      const testInput = { word: "test", translation: "測試" };
      // eslint-disable-next-line no-eval
      const func = eval(`(${editorCode})`);
      const result = func(testInput);
      setTestResult(JSON.stringify(result, null, 2));
      setShowTestResult(true);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setShowTestResult(true);
    }
  };

  const handleResetCode = () => {
    setEditorCode(DEFAULT_CODE);
    setHasUnsavedChanges(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[90vw] !max-w-[1600px] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">{t.settings}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Configure vocabulary, timing, and post-processing code
          </p>
        </DialogHeader>

        <Tabs defaultValue="config" className="flex-1 flex flex-col min-h-0">
          <TabsList className="flex-shrink-0 w-full grid grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="code">Code Editor</TabsTrigger>
          </TabsList>

          {/* Configuration Tab - Merged General + Timing */}
          <TabsContent value="config" className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Language Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Interface Language</Label>
                  <LanguageSwitcher />
                </div>

                {/* Vocabulary URL */}
                <div className="space-y-3">
                  <Label htmlFor="vocab-url" className="text-base font-semibold">
                    {t.vocabularyUrl}
                  </Label>
                  <Input
                    id="vocab-url"
                    value={vocabularyUrl}
                    onChange={(e) => setVocabularyUrl(e.target.value)}
                    placeholder="https://example.com/vocabulary.tsv"
                  />
                  <p className="text-sm text-muted-foreground">
                    {t.vocabularyUrlHint}
                  </p>
                </div>

                {/* Load Button */}
                <Button
                  onClick={onLoadVocabulary}
                  className="w-full"
                  size="lg"
                >
                  {t.loadVocabulary}
                </Button>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Timing Settings */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Timing Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="word-time" className="text-sm">
                        {t.wordDisplayTime}
                      </Label>
                      <Input
                        id="word-time"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={wordDisplayTime}
                        onChange={(e) => setWordDisplayTime(parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="both-time" className="text-sm">
                        {t.bothDisplayTime}
                      </Label>
                      <Input
                        id="both-time"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={bothDisplayTime}
                        onChange={(e) => setBothDisplayTime(parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* Swap Setting */}
                <div className="flex items-center justify-between p-4 border rounded">
                  <div className="space-y-1">
                    <Label htmlFor="swap-toggle" className="text-base font-semibold cursor-pointer">
                      {t.swapWordTranslation}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t.swapWordTranslationHint}
                    </p>
                  </div>
                  <Switch
                    id="swap-toggle"
                    checked={swapWordTranslation}
                    onCheckedChange={setSwapWordTranslation}
                  />
                </div>

                {/* Instructions */}
                <div className="p-4 bg-muted/50 rounded space-y-2">
                  <h4 className="text-sm font-semibold">{t.instructions}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Press <kbd className="px-1 py-0.5 bg-background border rounded text-xs">S</kbd> to open settings</li>
                    <li>Press <kbd className="px-1 py-0.5 bg-background border rounded text-xs">ESC</kbd> to close dialogs</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Code Editor Tab */}
          <TabsContent value="code" className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Post-Processing Code</h3>
                <p className="text-sm text-muted-foreground">
                  Write JavaScript to transform flashcard content
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleResetCode} variant="outline" size="sm">
                  Reset to Default
                </Button>
                <Button onClick={handleTestCode} variant="outline" size="sm">
                  Test Code
                </Button>
                <Button
                  onClick={handleSaveCode}
                  disabled={!hasUnsavedChanges}
                  size="sm"
                >
                  {hasUnsavedChanges ? "Save Changes *" : "Saved"}
                </Button>
              </div>
            </div>

            <div className="border rounded overflow-hidden">
              <Editor
                height="600px"
                defaultLanguage="javascript"
                value={editorCode}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Test Result Dialog */}
            {showTestResult && (
              <div className="p-4 border rounded bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Test Result</h4>
                  <Button
                    onClick={() => setShowTestResult(false)}
                    variant="ghost"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
                <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                  {testResult}
                </pre>
              </div>
            )}

            {/* Library Documentation */}
            <div className="p-4 bg-muted/50 rounded space-y-3">
              <h4 className="text-sm font-semibold">Pre-loaded Libraries</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <code className="px-1.5 py-0.5 bg-background rounded text-xs">TshetUinh</code> - 
                  Core library for Middle Chinese phonology
                </p>
                <p>
                  <code className="px-1.5 py-0.5 bg-background rounded text-xs">TshetUinhDeriverTools</code> - 
                  Derivation tools for phonological analysis
                </p>
                <p>
                  <code className="px-1.5 py-0.5 bg-background rounded text-xs">TshetUinhExamples</code> - 
                  Example derivers including Baxter transcription
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
