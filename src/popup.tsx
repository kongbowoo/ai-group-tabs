import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { batchGroupTabs } from "./services";
import { getStorage, setStorage } from "./utils";
import Input from "./components/Input";
import Switch from "./components/Switch";
import { ColorPicker } from "./components/ColorPicker";
import {
  Color,
  DEFAULT_GROUP,
  DEFAULT_GROUP_ZH,
  CATEGORY_TRANSLATIONS,
  TabColorConfig,
} from "./const";
import { toast } from "./components/toast";
import { ServiceProvider } from "./types";

import "./popup.css";

type Language = "en" | "zh";

const translations = {
  en: {
    title: "AI Group Tab",
    apiKeyRequired: "API Key Required",
    apiKeyRequiredDesc: "Please configure your API key in settings",
    settings: "Settings",
    groupType: "Group Type",
    add: "Add",
    delete: "Delete",
    groupExistingTabs: "Group Tabs",
    ungroupAll: "Ungroup All",
    allowAutomaticGrouping: "Auto Grouping",
    allowAutomaticPosition: "Auto Position",
  },
  zh: {
    title: "AI 标签分组",
    apiKeyRequired: "需要 API 密钥",
    apiKeyRequiredDesc: "请先在设置中配置 API 密钥",
    settings: "设置",
    groupType: "分组类型",
    add: "添加",
    delete: "删除",
    groupExistingTabs: "分组标签页",
    ungroupAll: "取消分组",
    allowAutomaticGrouping: "自动分组",
    allowAutomaticPosition: "自动定位",
  },
};

const getApiKeyHrefMap = {
  Gemini: "https://ai.google.dev/",
  GPT: "https://platform.openai.com/api-keys",
  DeepSeek: "https://platform.deepseek.com/",
  Claude: "https://console.anthropic.com/settings/keys",
  Qwen: "https://dashscope.console.aliyuncs.com/apiKey",
  Custom: "#",
};

// Translate category name based on language
const translateCategory = (name: string, language: Language): string => {
  if (language === "zh" && CATEGORY_TRANSLATIONS[name]) {
    return CATEGORY_TRANSLATIONS[name];
  }
  return name;
};

// Reverse translate Chinese category name to English
const reverseTranslateCategory = (name: string): string => {
  for (const [en, zh] of Object.entries(CATEGORY_TRANSLATIONS)) {
    if (zh === name) {
      return en;
    }
  }
  return name;
};

// Check if types are the default English types
const isDefaultEnglishTypes = (types: string[]): boolean => {
  return (
    types.length === DEFAULT_GROUP.length &&
    types.every((type, idx) => type === DEFAULT_GROUP[idx])
  );
};

// Check if types are the default Chinese types
const isDefaultChineseTypes = (types: string[]): boolean => {
  return (
    types.length === DEFAULT_GROUP_ZH.length &&
    types.every((type, idx) => type === DEFAULT_GROUP_ZH[idx])
  );
};

const Group = ({ language }: { language: Language }) => {
  const [storedTypes, setStoredTypes] = useState<string[]>([]);
  const [displayTypes, setDisplayTypes] = useState<string[]>([]);
  const [newType, setNewType] = useState<string>("");
  const [color, setColor] = useState<Color>(Color.grey);
  const [colors, setColors] = useState<Color[]>([]);
  const [colorsEnabled, setColorsEnabled] = useState<boolean>(false);
  const t = translations[language];

  // Load types from storage
  useEffect(() => {
    getStorage<string[]>("types").then((types) => {
      if (!types) {
        // Initialize with default based on language
        const defaultTypes =
          language === "zh" ? DEFAULT_GROUP_ZH : DEFAULT_GROUP;
        setStoredTypes(defaultTypes);
        setDisplayTypes(defaultTypes);
        setStorage<string[]>("types", defaultTypes);
        return;
      }

      // Migrate English default types to Chinese if language is Chinese
      if (language === "zh" && isDefaultEnglishTypes(types)) {
        setStoredTypes(DEFAULT_GROUP_ZH);
        setDisplayTypes(DEFAULT_GROUP_ZH);
        setStorage<string[]>("types", DEFAULT_GROUP_ZH);
        return;
      }

      // Migrate Chinese default types to English if language is English
      if (language === "en" && isDefaultChineseTypes(types)) {
        setStoredTypes(DEFAULT_GROUP);
        setDisplayTypes(DEFAULT_GROUP);
        setStorage<string[]>("types", DEFAULT_GROUP);
        return;
      }

      setStoredTypes(types);
      setDisplayTypes(types);
    });
    getStorage<Color[]>("colors").then((colors) => {
      if (colors) setColors(colors);
    });
    getStorage<boolean>("colorsEnabled").then((colorsEnabled) => {
      if (colorsEnabled !== undefined) setColorsEnabled(colorsEnabled);
    });
  }, []);

  // Update display types when language changes
  useEffect(() => {
    if (storedTypes.length === 0) return;

    if (language === "zh" && isDefaultEnglishTypes(storedTypes)) {
      setDisplayTypes(DEFAULT_GROUP_ZH);
    } else if (language === "en" && isDefaultChineseTypes(storedTypes)) {
      setDisplayTypes(DEFAULT_GROUP);
    } else {
      setDisplayTypes(storedTypes);
    }
  }, [language, storedTypes]);

  return (
    <div className="flex flex-col gap-y-2 mb-3">
      <div className="flex items-center gap-x-2 mb-2">
        <h2 className="text-sm font-medium text-gray-700">{t.groupType}</h2>
      </div>
      <form
        onSubmit={(e) => {
          if (!newType) {
            return;
          }
          const newStoredTypes = [...storedTypes, newType];
          const newDisplayTypes = [...displayTypes, newType];
          const newColors = colorsEnabled
            ? [...colors, color]
            : [
                ...colors,
                TabColorConfig.map(({ name }) => name)[
                  Math.floor(Math.random() * TabColorConfig.length)
                ],
              ];
          setNewType("");
          setStoredTypes(newStoredTypes);
          setDisplayTypes(newDisplayTypes);
          setColors(newColors);
          e.preventDefault();

          setStorage<string[]>("types", newStoredTypes);
          setStorage<string[]>("colors", newColors);
        }}
      >
        <div className="flex items-center gap-x-2">
          <Input
            type="text"
            value={newType}
            placeholder={t.groupType}
            onChange={(e) => {
              setNewType(e.target.value);
            }}
          />
          {colorsEnabled && <ColorPicker color={color} onChange={setColor} />}
          <button
            disabled={!newType}
            className="rounded-md w-fit bg-primary/lg px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:bg-primary/sm whitespace-nowrap"
          >
            {t.add}
          </button>
        </div>
      </form>

      {displayTypes.map((type, idx) => (
        <div className="flex items-center gap-x-2" key={idx}>
          <Input
            placeholder={t.groupType}
            value={type}
            onChange={(e) => {
              const newDisplayTypes = [...displayTypes];
              newDisplayTypes[idx] = e.target.value;
              setDisplayTypes(newDisplayTypes);

              // Update stored types with the new value
              // If it's a Chinese default type, convert to English for storage
              const newValue = reverseTranslateCategory(e.target.value);
              const newStoredTypes = [...storedTypes];
              if (isDefaultChineseTypes(storedTypes)) {
                // Currently storing in Chinese, update directly
                newStoredTypes[idx] = e.target.value;
              } else {
                // Currently storing in English, convert new value
                newStoredTypes[idx] = newValue;
              }
              setStoredTypes(newStoredTypes);
              setStorage<string[]>("types", newStoredTypes);
            }}
          />
          {colorsEnabled && (
            <ColorPicker
              color={colors[idx]}
              onChange={(newColor) => {
                const newColors = [...colors];
                newColors[idx] = newColor;
                setColors(newColors);
                setStorage<string[]>("colors", newColors);
              }}
            />
          )}
          <button
            onClick={() => {
              const newStoredTypes = [...storedTypes];
              const newDisplayTypes = [...displayTypes];
              newStoredTypes.splice(idx, 1);
              newDisplayTypes.splice(idx, 1);
              setStoredTypes(newStoredTypes);
              setDisplayTypes(newDisplayTypes);
              setStorage<string[]>("types", newStoredTypes);
            }}
            className="rounded-md px-3 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap"
          >
            {t.delete}
          </button>
        </div>
      ))}
    </div>
  );
};

const Popup = () => {
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider>(
    "GPT"
  );
  const [apiKey, setApiKey] = useState<string | undefined>("");
  const [types, setTypes] = useState<string[]>([]);
  const [isOn, setIsOn] = useState<boolean | undefined>(true);
  const [isAutoPosition, setIsAutoPosition] = useState<boolean | undefined>(
    false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>("zh");

  useEffect(() => {
    getStorage<string>("openai_key").then(setApiKey);
    getStorage<boolean>("isOn").then(setIsOn);
    getStorage<boolean>("isAutoPosition").then(setIsAutoPosition);
    getStorage<string[]>("types").then((types) => {
      if (!types) {
        // Initialize with default based on language setting
        const defaultTypes = DEFAULT_GROUP;
        setTypes(defaultTypes);
        setStorage<string[]>("types", defaultTypes);
        return;
      }
      setTypes(types);
    });
    getStorage<ServiceProvider>("serviceProvider").then((value) => {
      if (value) {
        setServiceProvider(value);
      }
    });
    getStorage<Language>("language").then((lang) => {
      if (lang === "en" || lang === "zh") {
        setLanguage(lang);
      }
    });
  }, []);

  const getAllTabsInfo = async () => {
    // Use stored types for grouping (API expects English)
    let typesToUse = types;
    if (language === "zh" && isDefaultChineseTypes(types)) {
      // Convert Chinese default types to English for API
      typesToUse = DEFAULT_GROUP;
    }

    if (!apiKey || !typesToUse || !typesToUse.length) {
      toast.warn(translations[language].apiKeyRequired);
      return;
    }
    try {
      setIsLoading(true);
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const result = await batchGroupTabs(tabs, typesToUse, apiKey);
      chrome.runtime.sendMessage({ result });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error("Failed to group tabs: " + error.message);
      } else {
        toast.error("Failed to group tabs");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disableGrouping = () => {
    setIsOn((isOn) => {
      setStorage("isOn", !isOn);
      return !isOn;
    });
  };

  const enableAutoPosition = () => {
    setIsAutoPosition(() => {
      setStorage("isAutoPosition", !isAutoPosition);
      return !isAutoPosition;
    });
  };

  const ungroup = async () => {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      chrome.tabs.ungroup(tabs.map((tab) => tab.id!));
      toast.success("Ungrouped all tabs");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error("Failed to ungroup tabs: " + error.message);
      } else {
        toast.error("Failed to ungroup tabs");
      }
    }
  };

  const t = translations[language];
  const hasApiKey = apiKey && apiKey.length > 0;

  return (
    <div className="p-6 pb-9 min-w-[28rem]">
      <div className="flex items-center mb-6 justify-between">
        <h1 className="text-xl font-bold">{t.title}</h1>
        <button
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
          className="flex items-center gap-x-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <img src="/cog.svg" alt="cog" className="w-5 h-5" />
          {t.settings}
        </button>
      </div>

      {!hasApiKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-yellow-800">
            {t.apiKeyRequiredDesc} -{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                chrome.runtime.openOptionsPage();
              }}
              className="text-yellow-600 hover:text-yellow-800 font-medium underline"
            >
              {t.settings}
            </a>
          </p>
        </div>
      )}

      <Group language={language} />

      <div className="flex items-center gap-x-3 mb-3">
        <button
          disabled={!hasApiKey || !types || !types.length}
          className="inline-flex items-center rounded-md bg-primary/lg px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:bg-primary/sm whitespace-nowrap"
          onClick={getAllTabsInfo}
        >
          {isLoading && <LoadingSpinner />}
          {t.groupExistingTabs}
        </button>

        <button
          className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 focus-visible:outline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap"
          onClick={ungroup}
        >
          {t.ungroupAll}
        </button>
      </div>

      <Switch
        isChecked={!!isOn}
        text={t.allowAutomaticGrouping}
        onChange={disableGrouping}
      />

      <Switch
        isChecked={!!isAutoPosition}
        text={t.allowAutomaticPosition}
        onChange={enableAutoPosition}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
