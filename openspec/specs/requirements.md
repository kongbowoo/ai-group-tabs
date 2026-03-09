# Requirements Specification

## ADDED Requirements

### Requirement: Multi-LLM Support

**Description**: System shall support multiple LLM service providers.

#### Scenario: User selects service provider

- **WHEN** user opens settings page
- **THEN** user can select from: OpenAI GPT, DeepSeek, Anthropic Claude, Alibaba Qwen, Google Gemini, or Custom LLM

#### Scenario: User configures custom LLM

- **WHEN** user selects "Custom LLM"
- **THEN** user can input custom API URL and model name

**Status**: ✅ Implemented

---

### Requirement: Custom Categories

**Description**: Users shall be able to customize tab categories.

#### Scenario: User adds new category

- **WHEN** user enters category name in popup and clicks "Add"
- **THEN** new category appears in the list and is saved to storage

#### Scenario: User deletes category

- **WHEN** user clicks delete button on a category
- **THEN** category is removed from the list and storage

#### Scenario: User edits category name

- **WHEN** user modifies category name in input field
- **THEN** changes are saved to storage

**Status**: ✅ Implemented

---

### Requirement: Auto-Grouping

**Description**: New tabs shall be automatically grouped when enabled.

#### Scenario: New tab opened

- **WHEN** `isOn` is true AND tab URL is valid
- **THEN** tab is classified by AI and added to appropriate group

#### Scenario: Tab URL updates

- **WHEN** tab navigates to new URL AND `isOn` is true
- **THEN** tab is re-classified and moved to correct group

#### Scenario: Auto-position enabled

- **WHEN** `isAutoPosition` is true AND tab is rightmost
- **THEN** group is moved to end of window

**Status**: ✅ Implemented

---

### Requirement: Bilingual Support

**Description**: UI shall support English and Chinese languages.

#### Scenario: User changes language

- **WHEN** user selects different language in settings
- **THEN** UI text updates and page reloads

#### Scenario: Default categories translation

- **WHEN** language is Chinese AND types are English defaults
- **THEN** categories display as: 社交，娱乐，阅读材料，教育，生产力，工具

**Status**: ✅ Implemented

---

### Requirement: URL Filtering

**Description**: Users shall be able to configure URL filtering rules.

#### Scenario: User adds filter rule

- **WHEN** user adds DOMAIN rule for "example.com"
- **THEN** tabs from example.com are excluded from grouping

#### Scenario: Multiple filter types

- **WHEN** user configures DOMAIN, DOMAIN-SUFFIX, DOMAIN-KEYWORD, or REGEX rules
- **THEN** matching tabs are excluded from AI classification

**Status**: ✅ Implemented

---

### Requirement: Custom Prompt

**Description**: Users shall be able to customize AI prompt template.

#### Scenario: User edits prompt

- **WHEN** user modifies prompt in settings
- **THEN** prompt is validated for required placeholders

#### Scenario: Invalid prompt

- **WHEN** prompt missing `{{tabURL}}`, `{{tabTitle}}`, or `{{types}}`
- **THEN** warning is displayed and prompt is not saved

**Status**: ✅ Implemented

---

### Requirement: API Key Validation

**Description**: Users shall be able to validate API keys.

#### Scenario: Valid API key

- **WHEN** user clicks "Validate" with valid key
- **THEN** success toast is displayed

#### Scenario: Invalid API key

- **WHEN** user clicks "Validate" with invalid key
- **THEN** error toast displays status and message

**Status**: ✅ Implemented

---

## Non-Functional Requirements

### NFR-1: Performance

- Tab grouping shall complete within reasonable time
- Extension shall not block normal browser usage

### NFR-2: Privacy

- API keys stored locally in Chrome storage
- Only tab URL and title sent to AI API

### NFR-3: Compatibility

- Support Chrome Manifest V3
- Support latest Chrome browser versions

### NFR-4: Maintainability

- TypeScript for type checking
- Prettier for code formatting
