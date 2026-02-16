import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="font-mono text-xs h-8 px-3"
      >
        EN
      </Button>
      <Button
        variant={language === "zh" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("zh")}
        className="font-mono text-xs h-8 px-3"
      >
        中文
      </Button>
      <Button
        variant={language === "ja" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("ja")}
        className="font-mono text-xs h-8 px-3"
      >
        日本語
      </Button>
    </div>
  );
}
