# AI Group Tabs

> **[🇨🇳 中文版本](README_zh.md)** | **[🇺🇸 English](README.md)**

![Frame 7](https://github.com/MichaelYuhe/ai-group-tabs/assets/63531512/fef62a35-8193-4ef1-8082-cfc771d0b4e6)

演示视频：

> [![观看视频](https://img.youtube.com/vi/SjfKiXy3zOc/default.jpg)](https://youtu.be/SjfKiXy3zOc)

## 功能特性

- 🤖 使用 AI 根据自定义类别分组标签页
- 🔑 支持多个大模型提供商 (OpenAI GPT、DeepSeek、Claude、通义千问、Gemini)
- 🌟 **支持自定义大模型** - 可使用任何 OpenAI 兼容格式的 API
- 🌐 多语言支持（English 和 中文）
- 🎨 自定义类别和颜色
- 🔄 自动分组标签页
- ⚙️ 支持自定义模型和 API 服务器

## 支持的大模型提供商

| 提供商               | 默认模型                 | API URL                                                                            |
| -------------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| **OpenAI GPT**       | gpt-3.5-turbo            | https://api.openai.com/v1/chat/completions                                         |
| **DeepSeek**         | deepseek-chat            | https://api.deepseek.com/chat/completions                                          |
| **Anthropic Claude** | claude-3-sonnet-20240229 | https://api.anthropic.com/v1/messages                                              |
| **阿里云通义千问**   | qwen-turbo               | https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions                 |
| **Google Gemini**    | gemini-pro               | https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent |
| **自定义大模型**     | 任意模型                 | 任意 OpenAI 兼容格式的 API 端点                                                    |

## 下载和使用

### 从 Chrome 应用商店下载

https://chromewebstore.google.com/detail/ai-group-tabs/hihpejmkeabgeockcemeikfkkbdofhji

### 从源码安装

从 [发布页面](https://github.com/MichaelYuhe/ai-group-tabs/releases) 下载最新版本的 `dist.zip`，解压后会得到一个名为 `dist` 的文件夹。

打开 Chrome 浏览器，访问 `chrome://extensions/`，在右上角开启 `开发者模式`，然后点击左上角的 `加载已解压的扩展程序`，选择刚才解压的 `dist` 文件夹。

> 您可以在设置页面中更改模型和 API 服务器地址。

## 快速开始

1. 点击扩展图标打开弹出窗口
2. 点击"设置"配置您的 API 密钥
3. 选择您偏好的大模型提供商（GPT、DeepSeek、Claude、通义千问、Gemini 或自定义）
4. 输入您的 API 密钥并点击"验证"进行确认
5. 返回弹出窗口添加您的自定义分组类型
6. 点击"分组标签页"整理您的标签

### 使用自定义大模型

如果您想使用未在上面列出的大模型提供商：

1. 进入设置页面
2. 选择 **"自定义大模型"** 作为服务提供者
3. 输入您的自定义 API 地址（必须是 OpenAI 兼容格式）
4. 输入您的自定义模型名称
5. 输入您的 API 密钥
6. 点击"验证"测试连接

**API 格式要求：**

自定义 API 需要遵循 OpenAI chat completion 格式：

```json
POST {你的 API 地址}
Headers: { "Authorization": "Bearer {你的 API 密钥}" }
Body: {
  "model": "{你的模型名称}",
  "messages": [
    { "role": "system", "content": "You are a browser tab group classificator" },
    { "role": "user", "content": "Classify the tab..." }
  ]
}
```

响应格式：

```json
{
  "choices": [
    {
      "message": {
        "content": "类别名称"
      }
    }
  ]
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## 开发路线图

- [x] 使用 AI 按默认类别分组标签页
- [x] 在弹出窗口中填写 OpenAI API 密钥并保存到 Chrome 存储
- [x] 在弹出窗口中自定义类别
- [x] 自动分组新标签页
- [x] 在 Chrome 应用商店发布
- [x] 更好的提示词工程
- [x] Logo 和名称
- [x] CI/CD 构建和发布新版本
- [x] 添加 Toast 提示
- [x] 使用 Vite 和 pnpm
- [x] 仅在标签页更新时分组已更新的标签
- [x] 自定义模型和 API 服务器
- [x] 支持多个大模型提供商（DeepSeek、Claude、通义千问）
- [x] 多语言支持（English 和 中文）
- [x] 将 API 密钥配置移到设置页面
- [x] 自定义大模型支持（任何 OpenAI 兼容 API）

## 特别感谢

> Everyone contributor can get your one month free of Developer Plan on Zeabur.

[![Deployed on Zeabur](https://zeabur.com/deployed-on-zeabur-dark.svg)](https://zeabur.com?referralCode=MichaelYuhe&utm_source=ai-group-tab&utm_campaign=oss)

## 赞助

> 此扩展永久免费，如果您喜欢这个扩展，可以在这里请我喝杯咖啡 :D

<a href="https://www.buymeacoffee.com/MichaelYuhe" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## 贡献者

<p align="left">
<a href="https://github.com/MichaelYuhe/ai-group-tabs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MichaelYuhe/ai-group-tabs" style="width: 60%"/>
</a></p>
