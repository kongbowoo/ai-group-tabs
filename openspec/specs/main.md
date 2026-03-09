# Main Specification

## Project Overview

AI Group Tabs is a Chrome browser extension that uses AI large language models to automatically group browser tabs by content categories.

## Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm 8.11.0
- **Platform**: Chrome Extension (Manifest V3)

### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                   AI Group Tabs                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │   popup     │    │   options   │    │  background │ │
│  │   (UI)      │    │   (Settings)│    │  (Worker)   │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘         │
│                            │                            │
│         ┌──────────────────┴──────────────────┐         │
│         │         service-provider            │         │
│         │  (GPT, DeepSeek, Claude, etc.)      │         │
│         └─────────────────────────────────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### File Structure

| File            | Description                                              |
| --------------- | -------------------------------------------------------- |
| `popup.tsx`     | Popup UI for triggering grouping and managing categories |
| `options.tsx`   | Settings page for API keys, providers, language          |
| `background.ts` | Service Worker for auto-grouping on tab create/update    |
| `services.ts`   | API service layer for LLM communication                  |
| `const.ts`      | Constants including default categories and translations  |
| `types.ts`      | TypeScript type definitions                              |
| `utils.ts`      | Utility functions                                        |

### Service Providers

- `gpt.ts` - OpenAI GPT API
- `deepseek.ts` - DeepSeek API
- `anthropic.ts` - Anthropic Claude API
- `qwen.ts` - Alibaba Cloud Qwen API
- `gemini.ts` - Google Gemini API
- `custom.ts` - Custom LLM (OpenAI-compatible format)

## Functional Requirements

### FR-1: Multi-LLM Support

System shall support multiple LLM service providers including OpenAI GPT, DeepSeek, Anthropic Claude, Alibaba Qwen, Google Gemini, and custom OpenAI-compatible APIs.

### FR-2: Custom Categories

Users shall be able to add, edit, and delete custom tab categories with optional color assignment.

### FR-3: Auto-Grouping

When enabled, new tabs shall be automatically grouped based on AI classification of URL and title.

### FR-4: Bilingual Support

UI shall support both English and Chinese with automatic category name translation for default categories.

### FR-5: URL Filtering

Users shall be able to configure URL filtering rules (DOMAIN, DOMAIN-SUFFIX, DOMAIN-KEYWORD, REGEX) to exclude certain tabs from grouping.

### FR-6: Custom Prompt

Users shall be able to customize the AI prompt template with required placeholders: `{{tabURL}}`, `{{tabTitle}}`, `{{types}}`.

## Data Storage

### Chrome Storage Keys

| Key               | Type            | Description           |
| ----------------- | --------------- | --------------------- |
| `openai_key`      | string          | API key               |
| `serviceProvider` | ServiceProvider | Selected LLM provider |
| `apiURL`          | string          | API endpoint URL      |
| `model`           | string          | Model name            |
| `types`           | string[]        | Custom category list  |
| `colors`          | Color[]         | Category colors       |
| `isOn`            | boolean         | Auto-grouping enabled |
| `language`        | "en" \| "zh"    | UI language           |

## Default Categories

### English

Social, Entertainment, Read Material, Education, Productivity, Utilities

### Chinese (中文)

社交，娱乐，阅读材料，教育，生产力，工具
