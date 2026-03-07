import { TabInfo } from "../types";
import Mustache from "mustache";
import { getStorage, removeQueryParameters } from "../utils";
import { DEFAULT_PROMPT } from "../const";

const renderPromptForOpenAI = async (
  tab: TabInfo,
  types: string[]
): Promise<
  [{ role: string; content: string }, { role: string; content: string }]
> => {
  const prompt: string = (await getStorage("prompt")) || DEFAULT_PROMPT;
  return [
    {
      role: "system",
      content: "You are a brwoser tab group classificator",
    },
    {
      role: "user",
      content: Mustache.render(prompt, {
        tabURL: removeQueryParameters(tab.url),
        tabTitle: tab.title,
        types: types.join(", "),
      }),
    },
  ];
};

export const fetchDeepSeek = async (
  apiKey: string,
  tabInfo: TabInfo,
  types: string[]
) => {
  // DeepSeek API is compatible with OpenAI API format
  // See https://platform.deepseek.com/api-docs/
  const apiURL =
    (await getStorage("apiURL")) || "https://api.deepseek.com/chat/completions";

  const model = (await getStorage("model")) || "deepseek-chat";

  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Api-Key": apiKey,
    },
    body: JSON.stringify({
      messages: await renderPromptForOpenAI(tabInfo, types),
      model,
    }),
  });

  const data = await response.json();
  const type: string = data.choices[0].message.content;
  return type;
};
