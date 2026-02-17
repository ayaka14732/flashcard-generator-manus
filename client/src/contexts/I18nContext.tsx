import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "zh" | "ja";

interface Translations {
  // Header
  appTitle: string;
  
  // Home page
  welcomeTitle: string;
  welcomeSubtitle: string;
  openSettings: string;
  
  // Settings dialog
  settingsTitle: string;
  settingsSubtitle: string;
  tabStart: string;
  tabSettings: string;
  
  // Preset
  loadPresetTemplate: string;
  selectPresetPlaceholder: string;
  
  // Configuration
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
  
  // Code editor
  postProcessingCode: string;
  testCode: string;
  testResult: string;
  closeTestResult: string;
  preloadedLibraries: string;
  startFlashcards: string;
  
  // Settings page
  interfaceLanguage: string;
  timingSettings: string;
  
  // Post-processing panel
  postProcessing: string;
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
  toastPresetLoaded: string;
  
  // Buttons
  settings: string;
  postProcessingButton: string;
  
  // Time units
  seconds: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appTitle: "Flashcard Generator",
    welcomeTitle: "Flashcard Generator",
    welcomeSubtitle: "Load your vocabulary file to begin. Press S for settings.",
    openSettings: "Open Settings",
    settingsTitle: "Settings (S)",
    settingsSubtitle: "Configure your flashcard experience",
    tabStart: "Start",
    tabSettings: "Settings",
    loadPresetTemplate: "Load Preset Template",
    selectPresetPlaceholder: "Select a preset template...",
    configuration: "Settings",
    vocabularyUrl: "Vocabulary URL",
    vocabularyUrlPlaceholder: "https://example.com/vocab.txt",
    vocabularyUrlHint: "Format: translation\\tword (tab-separated, one per line)",
    loadVocabulary: "Load Vocabulary",
    wordDisplayTime: "Word Display Time (seconds)",
    bothDisplayTime: "Both Display Time (seconds)",
    swapWordTranslation: "Swap Word & Translation",
    swapWordTranslationHint: "Display translation first, then word",
    instructions: "Instructions",
    instructionsList: [
      "Press s to open settings",
      "Press ESC to close dialogs",
    ],
    postProcessingCode: "Post-processing Code",
    testCode: "Test Code",
    testResult: "Test Result",
    closeTestResult: "Close",
    preloadedLibraries: "Pre-loaded Libraries:",
    startFlashcards: "Start Flashcards",
    interfaceLanguage: "Interface Language",
    timingSettings: "Timing Settings",
    postProcessing: "Post-Processing",
    resetToDefault: "Reset to Default",
    postProcessingInstructions: "Instructions",
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
    toastPresetLoaded: "Preset loaded: {name}",
    settings: "Settings (S)",
    postProcessingButton: "Post-Processing (E)",
    seconds: "seconds",
  },
  zh: {
    appTitle: "閃卡生成器",
    welcomeTitle: "閃卡生成器",
    welcomeSubtitle: "加載詞庫文件開始學習。按 S 打開設置。",
    openSettings: "打開設置",
    settingsTitle: "設置 (S)",
    settingsSubtitle: "配置你的閃卡體驗",
    tabStart: "開始",
    tabSettings: "設置",
    loadPresetTemplate: "加載預設模板",
    selectPresetPlaceholder: "選擇預設模板...",
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
      "按 s 打開設置",
      "按 ESC 關閉對話框",
    ],
    postProcessingCode: "後處理代碼",
    testCode: "測試代碼",
    testResult: "測試結果",
    closeTestResult: "關閉",
    preloadedLibraries: "預加載庫：",
    startFlashcards: "開始閃卡",
    interfaceLanguage: "界面語言",
    timingSettings: "時間設置",
    postProcessing: "後處理",
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
    toastPresetLoaded: "預設已加載：{name}",
    settings: "設置 (S)",
    postProcessingButton: "後處理 (E)",
    seconds: "秒",
  },
  ja: {
    appTitle: "フラッシュカードジェネレーター",
    welcomeTitle: "フラッシュカードジェネレーター",
    welcomeSubtitle: "語彙ファイルを読み込んで開始します。設定は S キーを押してください。",
    openSettings: "設定を開く",
    settingsTitle: "設定 (S)",
    settingsSubtitle: "フラッシュカード体験を設定する",
    tabStart: "開始",
    tabSettings: "設定",
    loadPresetTemplate: "プリセットテンプレートを読み込む",
    selectPresetPlaceholder: "プリセットテンプレートを選択...",
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
      "s キーを押して設定を開く",
      "ESC キーを押してダイアログを閉じる",
    ],
    postProcessingCode: "後処理コード",
    testCode: "コードをテスト",
    testResult: "テスト結果",
    closeTestResult: "閉じる",
    preloadedLibraries: "プリロードされたライブラリ：",
    startFlashcards: "フラッシュカードを開始",
    interfaceLanguage: "インターフェース言語",
    timingSettings: "タイミング設定",
    postProcessing: "後処理",
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
    toastPresetLoaded: "プリセットが読み込まれました：{name}",
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
