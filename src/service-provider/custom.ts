import { TabInfo } from "../types";
import Mustache from "mustache";
import { getStorage, removeQueryParameters } from "../utils";
import { DEFAULT_PROMPT } from "../const";

const renderPromptForCustom = async (
  tab: TabInfo,
  types: string[]
): Promise<
  [{ role: string; content: string }, { role: string; content: string }]
> => {
  const prompt: string = (await getStorage("prompt")) || DEFAULT_PROMPT;
  return [
    {
      role: "system",
      content: "You are a browser tab group classificator",
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

export const fetchCustom = async (
  apiKey: string,
  tabInfo: TabInfo,
  types: string[]
) => {
  // Custom API URL set by user
  const apiURL =
    (await getStorage("customApiURL")) ||
    "https://api.openai.com/v1/chat/completions";

  // Custom model name set by user
  const model = (await getStorage("customModel")) || "custom-model";

  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: await renderPromptForCustom(tabInfo, types),
      model,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Custom API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const type: string =
    data.choices?.[0]?.message?.content ||
    data.choices?.[0]?.message?.content?.trim();
  return type;
};
