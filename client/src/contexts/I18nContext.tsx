import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "zh" | "ja";

interface Translations {
  // Header
  appTitle: string;
  
  // Home page
  welcomeTitle: string;
  welcomeSubtitle: string;
  openSettings: string;
  
  // Settings panel
  configuration: string;
  vocabularyUrl: string;
  vocabularyUrlPlaceholder: string;
  vocabularyUrlHint: string;
  loadVocabulary: string;
  wordDisplayTime: string;
  bothDisplayTime: string;
  swapWordTranslation: string;
  swapWordTranslationHint: string;
  instructions: string;
  instructionsList: string[];
  
  // Post-processing panel
  postProcessing: string;
  testCode: string;
  resetToDefault: string;
  postProcessingInstructions: string;
  postProcessingInstructionsList: string[];
  
  // Progress
  progressFormat: string;
  
  // Toasts
  toastNoUrl: string;
  toastLoadSuccess: string;
  toastLoadError: string;
  toastCompleted: string;
  toastTestSuccess: string;
  toastTestError: string;
  
  // Buttons
  settings: string;
  postProcessingButton: string;
  
  // Time units
  seconds: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appTitle: "FLASHCARD GENERATOR",
    welcomeTitle: "FLASHCARD GENERATOR",
    welcomeSubtitle: "Load your vocabulary file to begin. Press S for settings or E for post-processing.",
    openSettings: "OPEN SETTINGS",
    configuration: "CONFIGURATION",
    vocabularyUrl: "VOCABULARY URL",
    vocabularyUrlPlaceholder: "https://example.com/vocab.txt",
    vocabularyUrlHint: "Format: translation\\tword (tab-separated, one per line)",
    loadVocabulary: "LOAD VOCABULARY",
    wordDisplayTime: "WORD DISPLAY TIME (seconds)",
    bothDisplayTime: "BOTH DISPLAY TIME (seconds)",
    swapWordTranslation: "SWAP WORD & TRANSLATION",
    swapWordTranslationHint: "Display translation first, then word",
    instructions: "INSTRUCTIONS",
    instructionsList: [
      "Provide a URL to a vocabulary file",
      "File format: translation\\tword (tab-separated)",
      "Adjust display timing as needed",
      "Use post-processing for custom transformations",
      "Press ESC to close settings",
    ],
    postProcessing: "POST-PROCESSING",
    testCode: "TEST CODE",
    resetToDefault: "RESET TO DEFAULT",
    postProcessingInstructions: "INSTRUCTIONS",
    postProcessingInstructionsList: [
      "Write a function that transforms word/translation pairs",
      "Function receives: { word, translation }",
      "Function must return: { word, translation }",
      "Test your code before closing the panel",
      "Changes apply to all flashcards",
    ],
    progressFormat: "{current} / {total}",
    toastNoUrl: "Please provide a vocabulary URL",
    toastLoadSuccess: "Loaded {count} flashcards",
    toastLoadError: "Failed to load vocabulary",
    toastCompleted: "Completed all flashcards! Starting over...",
    toastTestSuccess: "Test successful!\\nInput: {input}\\nOutput: {output}",
    toastTestError: "Function must return { word: string, translation: string }",
    settings: "Settings (S)",
    postProcessingButton: "Post-Processing (E)",
    seconds: "seconds",
  },
  zh: {
    appTitle: "閃卡生成器",
    welcomeTitle: "閃卡生成器",
    welcomeSubtitle: "加載詞庫文件開始學習。按 S 打開設置，按 E 打開後處理編輯器。",
    openSettings: "打開設置",
    configuration: "配置",
    vocabularyUrl: "詞庫 URL",
    vocabularyUrlPlaceholder: "https://example.com/vocab.txt",
    vocabularyUrlHint: "格式：翻譯\\t詞（製表符分隔，每行一個）",
    loadVocabulary: "加載詞庫",
    wordDisplayTime: "詞顯示時間（秒）",
    bothDisplayTime: "兩者顯示時間（秒）",
    swapWordTranslation: "調轉詞與翻譯",
    swapWordTranslationHint: "先顯示翻譯，再顯示詞",
    instructions: "說明",
    instructionsList: [
      "提供詞庫文件的 URL",
      "文件格式：翻譯\\t詞（製表符分隔）",
      "根據需要調整顯示時間",
      "使用後處理進行自定義轉換",
      "按 ESC 關閉設置",
    ],
    postProcessing: "後處理",
    testCode: "測試代碼",
    resetToDefault: "重置為默認",
    postProcessingInstructions: "說明",
    postProcessingInstructionsList: [
      "編寫一個轉換詞/翻譯對的函數",
      "函數接收：{ word, translation }",
      "函數必須返回：{ word, translation }",
      "關閉面板前測試你的代碼",
      "更改應用於所有閃卡",
    ],
    progressFormat: "{current} / {total}",
    toastNoUrl: "請提供詞庫 URL",
    toastLoadSuccess: "已加載 {count} 張閃卡",
    toastLoadError: "加載詞庫失敗",
    toastCompleted: "已完成所有閃卡！重新開始...",
    toastTestSuccess: "測試成功！\\n輸入：{input}\\n輸出：{output}",
    toastTestError: "函數必須返回 { word: string, translation: string }",
    settings: "設置 (S)",
    postProcessingButton: "後處理 (E)",
    seconds: "秒",
  },
  ja: {
    appTitle: "フラッシュカードジェネレーター",
    welcomeTitle: "フラッシュカードジェネレーター",
    welcomeSubtitle: "語彙ファイルを読み込んで開始します。設定は S キー、後処理は E キーを押してください。",
    openSettings: "設定を開く",
    configuration: "設定",
    vocabularyUrl: "語彙 URL",
    vocabularyUrlPlaceholder: "https://example.com/vocab.txt",
    vocabularyUrlHint: "形式：翻訳\\t単語（タブ区切り、1行に1つ）",
    loadVocabulary: "語彙を読み込む",
    wordDisplayTime: "単語表示時間（秒）",
    bothDisplayTime: "両方表示時間（秒）",
    swapWordTranslation: "単語と翻訳を入れ替える",
    swapWordTranslationHint: "翻訳を先に表示し、次に単語を表示",
    instructions: "説明",
    instructionsList: [
      "語彙ファイルの URL を提供してください",
      "ファイル形式：翻訳\\t単語（タブ区切り）",
      "必要に応じて表示時間を調整してください",
      "カスタム変換には後処理を使用してください",
      "ESC キーを押して設定を閉じます",
    ],
    postProcessing: "後処理",
    testCode: "コードをテスト",
    resetToDefault: "デフォルトにリセット",
    postProcessingInstructions: "説明",
    postProcessingInstructionsList: [
      "単語/翻訳ペアを変換する関数を記述してください",
      "関数が受け取るもの：{ word, translation }",
      "関数が返すもの：{ word, translation }",
      "パネルを閉じる前にコードをテストしてください",
      "変更はすべてのフラッシュカードに適用されます",
    ],
    progressFormat: "{current} / {total}",
    toastNoUrl: "語彙 URL を入力してください",
    toastLoadSuccess: "{count} 枚のフラッシュカードを読み込みました",
    toastLoadError: "語彙の読み込みに失敗しました",
    toastCompleted: "すべてのフラッシュカードが完了しました！最初から開始します...",
    toastTestSuccess: "テスト成功！\\n入力：{input}\\n出力：{output}",
    toastTestError: "関数は { word: string, translation: string } を返す必要があります",
    settings: "設定 (S)",
    postProcessingButton: "後処理 (E)",
    seconds: "秒",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
