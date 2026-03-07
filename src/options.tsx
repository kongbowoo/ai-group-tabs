import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./options.css";
import { getStorage, setStorage } from "./utils";
import Switch from "./components/Switch";
import FilterRules from "./components/FilterRules";
import { FilterRuleItem, ServiceProvider } from "./types";
import { DEFAULT_PROMPT } from "./const";
import { validateApiKey } from "./services";
import { LoadingSpinner } from "./components/LoadingSpinner";

type Language = "en" | "zh";

const translations = {
  en: {
    tabs: [
      "Basic Settings",
      "Prompt Settings",
      "Style Settings",
      "Feature Flags",
    ],
    chooseServiceProvider: "Choose a service provider",
    chooseModel: "Choose a model",
    apiKeyUrl: "API URL",
    apiKey: "API Key",
    filterRule: "Filter Rule",
    filterRuleDescription:
      'Filter rules will be applied before sending to the API. For example, if you add a filtering rule for "google.com", google.com will not be grouped.',
    prompt: "Prompt",
    promptFormatWarning:
      "{{tabURL}} {{tabTitle}} {{types}} must be in the prompt",
    enableColorsCustomization: "Enable Colors Customization",
    language: "Language",
    validate: "Validate",
    pleaseEnterApiKey: "Please enter an API key",
  },
  zh: {
    tabs: ["基本设置", "提示词设置", "样式设置", "功能开关"],
    chooseServiceProvider: "选择服务提供者",
    chooseModel: "选择模型",
    apiKeyUrl: "API 地址",
    apiKey: "API 密钥",
    filterRule: "过滤规则",
    filterRuleDescription:
      '过滤规则将在发送到 API 之前应用。例如，如果您添加了 "google.com" 的过滤规则，google.com 将不会被分组。',
    prompt: "提示词",
    promptFormatWarning: "{{tabURL}} {{tabTitle}} {{types}} 必须包含在提示词中",
    enableColorsCustomization: "启用颜色自定义",
    language: "语言",
    validate: "验证",
    pleaseEnterApiKey: "请输入 API 密钥",
  },
};

const serviceProviderTranslations = {
  en: {
    GPT: "OpenAI GPT",
    DeepSeek: "DeepSeek",
    Claude: "Anthropic Claude",
    Qwen: "Alibaba Cloud Qwen",
    Gemini: "Google Gemini",
  },
  zh: {
    GPT: "OpenAI GPT",
    DeepSeek: "深度求索 DeepSeek",
    Claude: "Anthropic Claude",
    Qwen: "阿里云通义千问",
    Gemini: "Google Gemini",
  },
};

const modelTranslations = {
  en: {
    chooseModel: "Choose a model",
    gpt4: "GPT 4",
    gpt4_32k: "GPT 4 32k",
    gpt35_turbo_1106: "GPT 3.5 turbo 1106",
    gpt35_turbo: "GPT 3.5 turbo",
    deepseek_chat: "DeepSeek Chat",
    deepseek_coder: "DeepSeek Coder",
    qwen_turbo: "Qwen Turbo",
    qwen_plus: "Qwen Plus",
    qwen_max: "Qwen Max",
    qwen_max_longcontext: "Qwen Max LongContext",
    claude_3_5_sonnet: "Claude 3.5 Sonnet",
    claude_3_opus: "Claude 3 Opus",
    claude_3_sonnet: "Claude 3 Sonnet",
    claude_3_haiku: "Claude 3 Haiku",
  },
  zh: {
    chooseModel: "选择模型",
    gpt4: "GPT 4",
    gpt4_32k: "GPT 4 32k",
    gpt35_turbo_1106: "GPT 3.5 turbo 1106",
    gpt35_turbo: "GPT 3.5 turbo",
    deepseek_chat: "DeepSeek Chat",
    deepseek_coder: "DeepSeek Coder",
    qwen_turbo: "通义千问 Turbo",
    qwen_plus: "通义千问 Plus",
    qwen_max: "通义千问 Max",
    qwen_max_longcontext: "通义千问 Max LongContext",
    claude_3_5_sonnet: "Claude 3.5 Sonnet",
    claude_3_opus: "Claude 3 Opus",
    claude_3_sonnet: "Claude 3 Sonnet",
    claude_3_haiku: "Claude 3 Haiku",
  },
};

function BasicSettings({ language }: { language: Language }) {
  const [model, setModel] = useState<string | undefined>("gpt-3.5-turbo");
  const [serviceProvider, setServiceProvider] =
    useState<ServiceProvider>("GPT");
  const [apiURL, setApiURL] = useState<string | undefined>(
    "https://api.openai.com/v1/chat/completions"
  );
  const [apiKey, setApiKey] = useState<string | undefined>("");
  const [filterRules, setFilterRules] = useState<FilterRuleItem[] | undefined>([
    { id: 0, type: "DOMAIN", rule: "" },
  ]);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  useEffect(() => {
    getStorage<string>("model").then(setModel);
    getStorage<ServiceProvider>("serviceProvider").then((value) => {
      if (value) {
        setServiceProvider(value);
      }
    });
    getStorage<string>("apiURL").then(setApiURL);
    getStorage<string>("openai_key").then(setApiKey);
    getStorage<FilterRuleItem[]>("filterRules").then(setFilterRules);
  }, []);

  const updateModel = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
    setStorage("model", e.target.value);
  }, []);

  const updateServiceProvider = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setServiceProvider(e.target.value as ServiceProvider);
      setStorage("serviceProvider", e.target.value);
      if (e.target.value === "DeepSeek") {
        setApiURL("https://api.deepseek.com/chat/completions");
        setStorage("apiURL", "https://api.deepseek.com/chat/completions");
      } else if (e.target.value === "GPT") {
        setApiURL("https://api.openai.com/v1/chat/completions");
        setStorage("apiURL", "https://api.openai.com/v1/chat/completions");
      } else if (e.target.value === "Qwen") {
        setApiURL(
          "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
        );
        setStorage(
          "apiURL",
          "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
        );
      }
    },
    []
  );

  const updateApiURL = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setApiURL(e.target.value);
    setStorage("apiURL", e.target.value);
  }, []);

  const updateApiKey = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  }, []);

  const updateKeyInStorage = useCallback(() => {
    setStorage("openai_key", apiKey);
  }, [apiKey]);

  const handleValidateApiKey = async () => {
    if (!apiKey || apiKey.length <= 0) {
      toast.warn(translations[language].pleaseEnterApiKey);
      return false;
    }
    setIsValidating(true);
    await validateApiKey(apiKey, serviceProvider);
    setIsValidating(false);
  };

  const updateFilterRules = useCallback((rules: FilterRuleItem[]) => {
    setFilterRules(rules);
    setStorage("filterRules", rules);
  }, []);

  const getModelOptions = () => {
    switch (serviceProvider) {
      case "DeepSeek":
        return [
          {
            value: "deepseek-chat",
            label: modelTranslations[language].deepseek_chat,
          },
          {
            value: "deepseek-coder",
            label: modelTranslations[language].deepseek_coder,
          },
        ];
      case "Qwen":
        return [
          {
            value: "qwen-turbo",
            label: modelTranslations[language].qwen_turbo,
          },
          { value: "qwen-plus", label: modelTranslations[language].qwen_plus },
          { value: "qwen-max", label: modelTranslations[language].qwen_max },
          {
            value: "qwen-max-longcontext",
            label: modelTranslations[language].qwen_max_longcontext,
          },
        ];
      case "Claude":
        return [
          {
            value: "claude-3-5-sonnet-20241022",
            label: modelTranslations[language].claude_3_5_sonnet,
          },
          {
            value: "claude-3-opus-20240229",
            label: modelTranslations[language].claude_3_opus,
          },
          {
            value: "claude-3-sonnet-20240229",
            label: modelTranslations[language].claude_3_sonnet,
          },
          {
            value: "claude-3-haiku-20240307",
            label: modelTranslations[language].claude_3_haiku,
          },
        ];
      case "GPT":
      default:
        return [
          { value: "gpt-4", label: modelTranslations[language].gpt4 },
          { value: "gpt-4-32k", label: modelTranslations[language].gpt4_32k },
          {
            value: "gpt-3.5-turbo-1106",
            label: modelTranslations[language].gpt35_turbo_1106,
          },
          {
            value: "gpt-3.5-turbo",
            label: modelTranslations[language].gpt35_turbo,
          },
        ];
    }
  };

  const showModelSelect = ["GPT", "DeepSeek", "Claude", "Qwen"].includes(
    serviceProvider
  );
  const t = translations[language];

  return (
    <div className="flex flex-col gap-y-8 p-4">
      {/* Language Setting */}
      <div className="flex flex-col gap-y-2">
        <label htmlFor="language" className="text-xl font-medium">
          {t.language}
        </label>
        <LanguageSelector language={language} />
      </div>

      {/* Service Provider Setting */}
      <div className="flex flex-col gap-y-2">
        <label htmlFor="serviceProvider" className="text-xl font-medium">
          {t.chooseServiceProvider}
        </label>

        <select
          value={serviceProvider}
          onChange={updateServiceProvider}
          id="serviceProvider"
          className="bg-gray-50 border w-64 border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block"
        >
          <option value="GPT">
            {serviceProviderTranslations[language].GPT}
          </option>
          <option value="DeepSeek">
            {serviceProviderTranslations[language].DeepSeek}
          </option>
          <option value="Claude">
            {serviceProviderTranslations[language].Claude}
          </option>
          <option value="Qwen">
            {serviceProviderTranslations[language].Qwen}
          </option>
          <option value="Gemini">
            {serviceProviderTranslations[language].Gemini}
          </option>
        </select>
      </div>

      {showModelSelect && (
        <>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="model" className="text-xl font-medium">
              {t.chooseModel}
            </label>

            <select
              value={model}
              onChange={updateModel}
              id="model"
              className="bg-gray-50 border w-64 border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block"
            >
              <option value="">
                {modelTranslations[language].chooseModel}
              </option>
              {getModelOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="api_url" className="text-xl font-medium">
              {t.apiKeyUrl}
            </label>

            <input
              className="bg-gray-50 border w-64 border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block"
              value={apiURL}
              onChange={updateApiURL}
              id="api_url"
            />
          </div>
        </>
      )}

      {/* API Key Setting */}
      <div className="flex flex-col gap-y-2">
        <label htmlFor="api-key" className="text-xl font-medium">
          {t.apiKey}
        </label>
        <div className="flex items-center gap-x-2">
          <input
            className="bg-gray-50 border w-64 border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block px-3 py-2"
            type="password"
            value={apiKey}
            onChange={updateApiKey}
            onBlur={updateKeyInStorage}
            id="api-key"
            placeholder={t.apiKey}
          />
          <button
            onClick={handleValidateApiKey}
            disabled={!apiKey}
            className="rounded-md flex items-center w-fit bg-primary/lg px-2.5 py-1.5 text-sm font-semibold
            text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 disabled:bg-primary/sm"
          >
            {isValidating && <LoadingSpinner />}
            {t.validate}
          </button>
        </div>
      </div>

      {/* Filter Rule Setting */}
      <div className="flex flex-col gap-y-2">
        <label htmlFor="filterRule" className="text-xl font-medium">
          {t.filterRule}
        </label>

        <div>
          <label htmlFor="filterRule" className="text-sm font-normal w-96">
            {t.filterRuleDescription}
          </label>
        </div>

        <FilterRules
          updateFilterRules={updateFilterRules}
          filterRules={filterRules || []}
        />
      </div>
    </div>
  );
}

function LanguageSelector({ language }: { language: Language }) {
  const updateLanguage = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    setStorage("language", newLanguage);
    window.location.reload();
  }, []);

  return (
    <select
      value={language}
      onChange={updateLanguage}
      id="language"
      className="bg-gray-50 border w-64 border-gray-300 text-gray-900 text-sm rounded-lg
      focus:ring-blue-500 focus:border-blue-500 block"
    >
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  );
}

function PromptSettings({ language }: { language: Language }) {
  const [prompt, setPrompt] = useState<string | undefined>(DEFAULT_PROMPT);
  const [isPromptValid, setIsPromptValid] = useState<boolean>(true);
  const t = translations[language];

  const promptFormatWarning: string = t.promptFormatWarning;

  useEffect(() => {
    getStorage<string>("prompt").then(setPrompt);
  }, []);

  const updatePrompt = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt: string = e.target.value;
    setIsPromptValid(
      /{{tabURL}}/.test(newPrompt) &&
        /{{tabTitle}}/.test(newPrompt) &&
        /{{types}}/.test(newPrompt)
    );
    if (isPromptValid) {
      setPrompt(newPrompt);
      setStorage("prompt", newPrompt);
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-8 p-4">
      <div className="flex flex-col gap-y-2">
        <label htmlFor="prompt" className="text-xl font-medium">
          {t.prompt}
        </label>
        {isPromptValid && (
          <label
            htmlFor="prompt"
            className="text-sm font-normal w-64 text-blue-500"
          >
            {promptFormatWarning}
          </label>
        )}

        {!isPromptValid && (
          <div
            className=" w-64 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{promptFormatWarning}</span>
          </div>
        )}

        <textarea
          className="bg-gray-50 border w-64 h-64 border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block"
          value={prompt}
          onChange={updatePrompt}
          id="prompt"
        />
      </div>
    </div>
  );
}

function StyleSettings() {
  return <div className="flex flex-col p-4"></div>;
}

function FeatureFlags({ language }: { language: Language }) {
  const [isColorsEnabled, setIsColorsEnabled] = useState<boolean | undefined>(
    false
  );
  const t = translations[language];

  useEffect(() => {
    getStorage<boolean>("colorsEnabled").then(setIsColorsEnabled);
  }, []);

  const updateColorsEnabled = useCallback(() => {
    setIsColorsEnabled(!isColorsEnabled);
    setStorage("colorsEnabled", !isColorsEnabled);
  }, [isColorsEnabled]);

  return (
    <div className="flex flex-col p-4">
      <Switch
        isChecked={isColorsEnabled !== undefined ? isColorsEnabled : false}
        onChange={() => {
          updateColorsEnabled();
        }}
        text={t.enableColorsCustomization}
      />
    </div>
  );
}

const Options = () => {
  const [activeTab, setActiveTab] = useState<string>("Basic Settings");
  const [language, setLanguage] = useState<Language>("zh");

  useEffect(() => {
    getStorage<Language>("language").then((lang) => {
      if (lang === "en" || lang === "zh") {
        setLanguage(lang);
      }
    });
  }, []);

  const t = translations[language];

  return (
    <div className="w-screen h-screen bg-slate-100 flex justify-center p-12">
      <div className="w-full max-w-4xl flex flex-col">
        <div className="flex w-full p-2 bg-slate-200 rounded-2xl mb-4">
          {t.tabs.map((tab) => (
            <button
              key={tab}
              className={`${
                activeTab === tab ? "bg-white" : ""
              } flex-1 text-center py-4 font-medium rounded-lg`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === t.tabs[0] && <BasicSettings language={language} />}
        {activeTab === t.tabs[1] && <PromptSettings language={language} />}
        {activeTab === t.tabs[2] && <StyleSettings />}
        {activeTab === t.tabs[3] && <FeatureFlags language={language} />}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
