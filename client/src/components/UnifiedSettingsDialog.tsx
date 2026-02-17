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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const PRESET_TUPA = `function process({ word, translation }) {
  const tupa = TshetUinhExamples.tupa();
  const word_1 = word.split(' ').map(p => {
    const 當前音韻地位 = TshetUinh.壓縮表示.decode音韻編碼(p);
    const res = tupa(當前音韻地位);
    const style = 當前音韻地位.聲 === '上' ? "transform: rotate(-12deg); transform-origin: left center;" : 當前音韻地位.聲 === '去' ? "transform: rotate(12deg); transform-origin: left center;" : "";
    return \`<span style="display: inline-block; \${style}">\${res}</span>\`;
  }).join(' ');
  return { wordHtml: word_1 , translation };
}`;

const PRESET_BAXTER = `function process({ word, translation }) {
  const baxter = TshetUinhExamples.baxter();
  const word_1 = word.split(' ').map(p => {
    const 當前音韻地位 = TshetUinh.壓縮表示.decode音韻編碼(p);
    const res = baxter(當前音韻地位);
    const style = 當前音韻地位.聲 === '上' ? "transform: rotate(-12deg); transform-origin: left center;" : 當前音韻地位.聲 === '去' ? "transform: rotate(12deg); transform-origin: left center;" : "";
    return \`<span style="display: inline-block; \${style}">\${res}</span>\`;
  }).join(' ');
  return { wordHtml: word_1 , translation };
}`;

const PRESETS = {
  default: { 
    name: "Default (No transformation)", 
    code: DEFAULT_CODE,
    vocabularyUrl: "/sample_dict.tsv",
    swap: false
  },
  tupa: { 
    name: "切韻拼音 (Tupa)", 
    code: PRESET_TUPA,
    vocabularyUrl: "/sample_dict.tsv",
    swap: false
  },
  baxter: { 
    name: "白一平轉寫 (Baxter)", 
    code: PRESET_BAXTER,
    vocabularyUrl: "/sample_dict.tsv",
    swap: false
  },
};

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
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showTestResult, setShowTestResult] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleTestCode = () => {
    try {
      const testInput = { word: "test", translation: "測試" };
      // eslint-disable-next-line no-eval
      eval(code);
      // @ts-ignore
      const result = process(testInput);
      setTestResult(JSON.stringify(result, null, 2));
      setShowTestResult(true);
    } catch (error) {
      setTestResult(`Error: ${(error as Error).message}`);
      setShowTestResult(true);
    }
  };

  const handlePresetChange = (presetKey: string) => {
    const preset = PRESETS[presetKey as keyof typeof PRESETS];
    if (preset) {
      setCode(preset.code);
      setVocabularyUrl(preset.vocabularyUrl);
      setSwapWordTranslation(preset.swap);
      toast.success(`Preset loaded: ${preset.name}`);
    }
  };

  const handleStart = () => {
    onLoadVocabulary();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[90vw] !max-w-[1600px] !h-[90vh] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Settings (S)</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure your flashcard experience
          </p>
        </DialogHeader>

        <Tabs defaultValue="start" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="start">Start</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Page 1: Start Page */}
          <TabsContent value="start" className="flex-1 overflow-y-auto mt-4 space-y-4">
            {/* Preset Selector */}
            <div className="space-y-2">
              <Label htmlFor="preset-select" className="text-base font-semibold">
                Load Preset Template
              </Label>
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger id="preset-select" className="max-w-md">
                  <SelectValue placeholder="Select a preset template..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vocabulary URL */}
            <div className="space-y-2">
              <Label htmlFor="vocab-url" className="text-base font-semibold">
                Vocabulary URL
              </Label>
              <Input
                id="vocab-url"
                type="text"
                value={vocabularyUrl}
                onChange={(e) => setVocabularyUrl(e.target.value)}
                placeholder="https://example.com/vocabulary.tsv"
                className="max-w-2xl"
              />
              <p className="text-sm text-muted-foreground">
                Format: translation\tword (tab-separated, one per line)
              </p>
            </div>

            {/* Swap Setting */}
            <div className="flex items-center justify-between p-4 border rounded max-w-2xl">
              <div className="space-y-1">
                <Label htmlFor="swap-toggle" className="text-base font-semibold cursor-pointer">
                  {t.swapWordTranslation}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Display translation first, then word
                </p>
              </div>
              <Switch
                id="swap-toggle"
                checked={swapWordTranslation}
                onCheckedChange={setSwapWordTranslation}
              />
            </div>

            {/* Code Editor */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Post-processing Code
              </Label>
              <div className="border rounded overflow-hidden">
                <Editor
                  height="500px"
                  defaultLanguage="javascript"
                  value={code}
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
            </div>

            {/* Test Button */}
            <div className="flex gap-2">
              <Button onClick={handleTestCode} variant="outline">
                Test Code
              </Button>
            </div>

            {/* Test Result Dialog */}
            {showTestResult && (
              <div className="p-4 border rounded bg-muted">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">Test Result</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTestResult(false)}
                  >
                    Close
                  </Button>
                </div>
                <pre className="text-sm bg-background p-4 rounded overflow-x-auto">
                  {testResult}
                </pre>
              </div>
            )}

            {/* Documentation */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold">Pre-loaded Libraries:</p>
              <ul className="space-y-1">
                <li>
                  • <code className="bg-muted px-1 rounded">TshetUinh</code> - 音韻地位處理
                </li>
                <li>
                  • <code className="bg-muted px-1 rounded">TshetUinhDeriverTools</code> - 推導工具
                </li>
                <li>
                  • <code className="bg-muted px-1 rounded">TshetUinhExamples</code> - 示例推導方案
                  (tupa, baxter, etc.)
                </li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="pt-4 border-t">
              <Button onClick={handleStart} className="w-full max-w-md" size="lg">
                Start Flashcards
              </Button>
            </div>
          </TabsContent>

          {/* Page 2: Settings */}
          <TabsContent value="settings" className="flex-1 overflow-y-auto mt-4 space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Language Switcher */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Interface Language</Label>
                <LanguageSwitcher />
              </div>

              {/* Timing Settings */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Timing Settings</Label>
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

              {/* Instructions */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Instructions</Label>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Press <kbd className="px-2 py-1 bg-muted rounded text-xs">s</kbd> to open
                    settings
                  </li>
                  <li>
                    • Press <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd> to close
                    dialogs
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
