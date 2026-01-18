# logseq-plugin-vocabulary-card

A Logseq plugin for creating vocabulary flashcards using AI. Supports multiple AI providers (Google Gemini, OpenAI, Anthropic).

## Demo

![demo](./demo.gif)

## Features

- Generate vocabulary cards with pronunciation, definition, and example sentences
- Multi-provider support: Google Gemini (default), OpenAI, Anthropic
- Customizable tags for flashcard organization

## Installation

1. Open Logseq and go to **Settings** → **Plugins**
2. Click **Marketplace**
3. Search for "Vocabulary Card"
4. Click **Install**

### Configuration

After installation, configure the plugin:

1. Go to **Settings** → **Plugins** → **Vocabulary Card Generator** (gear icon)
2. Select your AI provider (Google Gemini, OpenAI, or Anthropic)
3. Enter your API key for the selected provider

## Usage

1. Type a word in any block
2. Type `/Generate Vocabulary Card` or use the slash command menu
3. The plugin generates a flashcard with:
   - Pronunciation (IPA)
   - Definition
   - Two example sentences

The card is automatically formatted with `#card` tag for use with Logseq's flashcard feature.

## Local Development

### Prerequisites

- [Bun](https://bun.sh/) installed
- API key for your preferred AI provider

### Setup

```bash
# Install dependencies
bun install

# Build the plugin
bun run build

# Or watch mode for development
bun run dev
```

### Testing in Logseq

1. Enable Developer Mode in Logseq:
   - Click the three-dots menu → Settings → Advanced → Enable "Developer mode"

2. Load the plugin:
   - Click the three-dots menu → Plugins
   - Click "Load unpacked plugin"
   - Select the `logseq-plugin-vocabulary-card` folder (the root folder, not `dist/`)

3. Configure the plugin:
   - Go to plugin settings
   - Select your AI provider (google, openai, or anthropic)
   - Enter your API key

4. Use the plugin:
   - Type a word in a block
   - Type `/Generate Vocabulary Card` to invoke the slash command
   - The plugin will generate a flashcard with pronunciation, definition, and examples

### Type Checking

```bash
bun run typecheck
```

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| provider | AI provider (google, openai, anthropic) | google |
| apiKey | API key for the selected provider | - |
| customTags | Tags to add to vocabulary cards | #words |
