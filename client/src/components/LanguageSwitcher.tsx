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
      >
        EN
      </Button>
      <Button
        variant={language === "zh" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("zh")}
      >
        中文
      </Button>
      <Button
        variant={language === "ja" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("ja")}
      >
        日本語
      </Button>
    </div>
  );
}
