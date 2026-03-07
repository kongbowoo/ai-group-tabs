# AI Group Tabs

![Frame 7](https://github.com/MichaelYuhe/ai-group-tabs/assets/63531512/fef62a35-8193-4ef1-8082-cfc771d0b4e6)

Demo Video:

> [![Watch the video](https://img.youtube.com/vi/SjfKiXy3zOc/default.jpg)](https://youtu.be/SjfKiXy3zOc)

## Features

- 🤖 Group tabs with AI by custom categories
- 🔑 Support multiple LLM providers (OpenAI GPT, DeepSeek, Claude, Qwen, Gemini)
- 🌐 Multi-language support (English & 中文)
- 🎨 Custom categories and colors
- 🔄 Automatic tab grouping
- ⚙️ Custom model and API server support

## Supported LLM Providers

| Provider               | Default Model            | API URL                                                                            |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| **OpenAI GPT**         | gpt-3.5-turbo            | https://api.openai.com/v1/chat/completions                                         |
| **DeepSeek**           | deepseek-chat            | https://api.deepseek.com/chat/completions                                          |
| **Anthropic Claude**   | claude-3-sonnet-20240229 | https://api.anthropic.com/v1/messages                                              |
| **Alibaba Cloud Qwen** | qwen-turbo               | https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions                 |
| **Google Gemini**      | gemini-pro               | https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent |

## Download and Start Using

### Download from Chrome Web Store

https://chromewebstore.google.com/detail/ai-group-tabs/hihpejmkeabgeockcemeikfkkbdofhji

### Download from source

Download the latest released `dist.zip` from [the release page](https://github.com/MichaelYuhe/ai-group-tabs/releases), unzip after download, you will get a folder named `dist`.

Open Chrome, go to `chrome://extensions/`, turn on `Developer mode` on the top right corner, click `Load unpacked` on the top left corner, select the `dist` folder you just unziled.

> You can change the model and API server in the options page.

## Quick Start

1. Click the extension icon to open the popup
2. Click "Settings" to configure your API key
3. Select your preferred LLM provider (GPT, DeepSeek, Claude, Qwen, or Gemini)
4. Enter your API key and click "Validate" to verify
5. Go back to popup and add your custom group types
6. Click "Group Tabs" to organize your tabs

## Development

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build
```

## Roadmap

- [x] Group tabs with AI by default categories
- [x] Fill OpenAI API key in popup and save in Chrome storage
- [x] Customize categories in popup
- [x] Group new tabs automatically
- [x] Publish on Chrome store
- [x] Better prompt engineering
- [x] Logo and name
- [x] CI / CD for build and release new version
- [x] Add toast
- [x] Use Vite and pnpm
- [x] Group the updated tab only when a tab is updated
- [x] Custom model and API server
- [x] Support multiple LLM providers (DeepSeek, Claude, Qwen)
- [x] Multi-language support (English & 中文)
- [x] Move API key configuration to settings page

## Special Thanks

> Everyone contributor can get your one month free of Developer Plan on Zeabur.

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com?referralCode=MichaelYuhe&utm_source=ai-group-tab&utm_campaign=oss)

## Sponsor

> This extension is free forever, if you love this extension, you can buy me a coffee here :D

<a href="https://www.buymeacoffee.com/MichaelYuhe" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Contributors

<p align="left">
<a href="https://github.com/MichaelYuhe/ai-group-tabs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MichaelYuhe/ai-group-tabs" style="width: 60%"/>
</a></p>
