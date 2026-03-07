import { TabInfo } from "../types";
import { getServiceProvider } from "../utils";
import { fetchGemini } from "./gemini";
import { fetchGpt } from "./gpt";
import { fetchDeepSeek } from "./deepseek";
import { fetchClaude } from "./anthropic";
import { fetchQwen } from "./qwen";

const fetchMap = {
  GPT: fetchGpt,
  Gemini: fetchGemini,
  DeepSeek: fetchDeepSeek,
  Claude: fetchClaude,
  Qwen: fetchQwen,
} as const;

export const fetchType = async (
  apiKey: string,
  tabInfo: TabInfo,
  types: string[]
) => {
  const serviceProvider = await getServiceProvider();
  if (!fetchMap[serviceProvider]) {
    throw new Error("unexpected serviceProvider: " + serviceProvider);
  }
  return fetchMap[serviceProvider](apiKey, tabInfo, types);
};
