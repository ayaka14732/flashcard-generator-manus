/**
 * SettingsPanel Component
 * Design: Brutalist Digital Learning
 * - Side panel with sharp rectangular design
 * - IBM Plex Mono for all UI text
 * - Minimal padding, dense information layout
 * - No rounded corners, high contrast inputs
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-card border-l-2 border-border z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-border">
            <h2 className="font-mono text-xl font-medium tracking-tight">
              CONFIGURATION
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

          {/* Vocabulary URL */}
          <div className="space-y-3 mb-6">
            <Label htmlFor="vocab-url" className="font-mono text-sm font-medium">
              VOCABULARY URL
            </Label>
            <Input
              id="vocab-url"
              type="url"
              value={vocabularyUrl}
              onChange={(e) => setVocabularyUrl(e.target.value)}
              placeholder="https://example.com/vocab.txt"
              className="font-mono text-sm h-10"
            />
            <p className="font-mono text-xs text-muted-foreground">
              Format: translation\tword (tab-separated, one per line)
            </p>
            <Button
              onClick={onLoadVocabulary}
              className="w-full font-mono text-sm h-10"
            >
              LOAD VOCABULARY
            </Button>
          </div>

          {/* Timing Controls */}
          <div className="space-y-6 mb-6 pb-6 border-b-2 border-border">
            <div className="space-y-3">
              <Label htmlFor="word-time" className="font-mono text-sm font-medium">
                WORD DISPLAY TIME (seconds)
              </Label>
              <Input
                id="word-time"
                type="number"
                min="0.5"
                step="0.5"
                value={wordDisplayTime}
                onChange={(e) => setWordDisplayTime(parseFloat(e.target.value))}
                className="font-mono text-sm h-10"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="both-time" className="font-mono text-sm font-medium">
                BOTH DISPLAY TIME (seconds)
              </Label>
              <Input
                id="both-time"
                type="number"
                min="0.5"
                step="0.5"
                value={bothDisplayTime}
                onChange={(e) => setBothDisplayTime(parseFloat(e.target.value))}
                className="font-mono text-sm h-10"
              />
            </div>
          </div>

          {/* Swap Option */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-border">
            <div className="space-y-1">
              <Label htmlFor="swap" className="font-mono text-sm font-medium">
                SWAP WORD & TRANSLATION
              </Label>
              <p className="font-mono text-xs text-muted-foreground">
                Display translation first, then word
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
            <h3 className="font-mono text-sm font-medium">INSTRUCTIONS</h3>
            <ul className="font-mono text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Provide a URL to a vocabulary file</li>
              <li>File format: translation\tword (tab-separated)</li>
              <li>Adjust display timing as needed</li>
              <li>Use post-processing for custom transformations</li>
              <li>Press ESC to close settings</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
