import { TabInfo } from "../types";
import Mustache from "mustache";
import { getStorage, removeQueryParameters } from "../utils";
import { DEFAULT_PROMPT } from "../const";

const renderPromptForAnthropic = async (
  tab: TabInfo,
  types: string[]
): Promise<{ role: string; content: string }[]> => {
  const prompt: string = (await getStorage("prompt")) || DEFAULT_PROMPT;
  return [
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

export const fetchClaude = async (
  apiKey: string,
  tabInfo: TabInfo,
  types: string[]
) => {
  // Anthropic Claude API
  // See https://docs.anthropic.com/claude/reference/messages_post
  const apiURL = "https://api.anthropic.com/v1/messages";

  const model = (await getStorage("model")) || "claude-3-sonnet-20240229";

  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 100,
      messages: await renderPromptForAnthropic(tabInfo, types),
    }),
  });

  const data = await response.json();
  const type: string = data.content[0].text;
  return type;
};
