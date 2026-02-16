import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/contexts/I18nContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { X } from "lucide-react";

interface SettingsPanelProps {
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
}

export default function SettingsPanel({
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
}: SettingsPanelProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-card border-l border-border z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <h2 className="text-xl font-semibold">
              {t.configuration}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Language Switcher */}
          <div className="mb-6 pb-6 border-b border-border">
            <LanguageSwitcher />
          </div>

          {/* Vocabulary URL */}
          <div className="space-y-3 mb-6">
            <Label htmlFor="vocab-url">
              {t.vocabularyUrl}
            </Label>
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
            <Button
              onClick={onLoadVocabulary}
              className="w-full"
            >
              {t.loadVocabulary}
            </Button>
          </div>

          {/* Timing Controls */}
          <div className="space-y-6 mb-6 pb-6 border-b border-border">
            <div className="space-y-3">
              <Label htmlFor="word-time">
                {t.wordDisplayTime}
              </Label>
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
              <Label htmlFor="both-time">
                {t.bothDisplayTime}
              </Label>
              <Input
                id="both-time"
                type="number"
                min="0.5"
                step="0.5"
                value={bothDisplayTime}
                onChange={(e) => setBothDisplayTime(parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Swap Option */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
            <div className="space-y-1">
              <Label htmlFor="swap">
                {t.swapWordTranslation}
              </Label>
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

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{t.instructions}</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              {t.instructionsList.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
