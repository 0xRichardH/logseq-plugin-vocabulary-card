# Migration Plan: Bun + AI SDK + TypeScript

## Overview

Refactoring the Logseq Vocabulary Card plugin from Rust/WASM + JavaScript to pure TypeScript with Bun and AI SDK.

## Summary

| Aspect | Current | Target |
|--------|---------|--------|
| **Runtime** | Rust/WASM + JS | Pure TypeScript |
| **Package Manager** | pnpm | Bun |
| **Bundler** | Webpack 4.x | Bun bundler |
| **AI Framework** | Raw HTTP to Gemini | AI SDK |
| **Default Provider** | Gemini Pro | Gemini 2.5 Flash |
| **Type Safety** | None (JS) | Full (TS + Zod) |

## Project Structure

```
logseq-plugin-vocabulary-card/
├── src/
│   ├── index.ts                 # Plugin entry point
│   ├── vocabulary/
│   │   ├── schema.ts            # Zod schema for WordDefinition
│   │   ├── generator.ts         # AI SDK structured output
│   │   └── providers.ts         # Multi-provider factory
│   ├── logseq/
│   │   ├── settings.ts          # Plugin settings definition
│   │   └── blocks.ts            # Card block formatting
│   └── types.ts                 # Shared TypeScript types
├── package.json
├── tsconfig.json
├── logo.svg                     # Keep existing asset
└── README.md
```

## Dependencies

```json
{
  "dependencies": {
    "@logseq/libs": "^0.0.17",
    "ai": "^4.0.0",
    "@ai-sdk/google": "^1.0.0",
    "@ai-sdk/openai": "^1.0.0",
    "@ai-sdk/anthropic": "^1.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.5.0"
  }
}
```

## Key Files

### `src/vocabulary/schema.ts`

```typescript
import { z } from 'zod';

export const WordDefinitionSchema = z.object({
  word: z.string().describe('The vocabulary word'),
  pronunciation: z.string().describe('IPA or phonetic spelling'),
  definition: z.string().describe('Clear, concise meaning'),
  examples: z.array(z.string()).length(2).describe('Two example sentences'),
  image: z.string().url().optional().describe('URL to a relevant image'),
});

export type WordDefinition = z.infer<typeof WordDefinitionSchema>;
```

### `src/vocabulary/providers.ts`

```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModel } from 'ai';

export type ProviderName = 'google' | 'openai' | 'anthropic';

export function createModel(provider: ProviderName, apiKey: string): LanguageModel {
  switch (provider) {
    case 'google':
      return createGoogleGenerativeAI({ apiKey })('gemini-2.5-flash-preview-04-17');
    case 'openai':
      return createOpenAI({ apiKey })('gpt-4o-mini');
    case 'anthropic':
      return createAnthropic({ apiKey })('claude-3-haiku-20240307');
  }
}
```

### `src/vocabulary/generator.ts`

```typescript
import { generateObject } from 'ai';
import { WordDefinitionSchema, type WordDefinition } from './schema';
import { createModel, type ProviderName } from './providers';

const SYSTEM_PROMPT = `You are a vocabulary dictionary assistant. 
Provide accurate word definitions with phonetic pronunciation, 
clear explanations, and helpful example sentences.`;

export async function generateVocabularyCard(
  word: string,
  provider: ProviderName,
  apiKey: string
): Promise<WordDefinition> {
  const model = createModel(provider, apiKey);
  
  const { object } = await generateObject({
    model,
    schema: WordDefinitionSchema,
    system: SYSTEM_PROMPT,
    prompt: `Define the word: "${word}"`,
  });
  
  return object;
}
```

### `src/logseq/settings.ts`

```typescript
import type { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

export const settingsSchema: SettingSchemaDesc[] = [
  {
    key: 'provider',
    type: 'enum',
    enumChoices: ['google', 'openai', 'anthropic'],
    enumPicker: 'select',
    default: 'google',
    title: 'AI Provider',
    description: 'Select your preferred AI provider',
  },
  {
    key: 'apiKey',
    type: 'string',
    default: '',
    title: 'API Key',
    description: 'API key for the selected provider',
  },
  {
    key: 'customTags',
    type: 'string',
    default: '#words',
    title: 'Custom Tags',
    description: 'Tags to add to vocabulary cards',
  },
];
```

### `src/logseq/blocks.ts`

```typescript
import type { WordDefinition } from '../vocabulary/schema';

export function formatVocabularyCard(
  definition: WordDefinition,
  customTags: string
): string[] {
  return [
    `${definition.word} #card ${customTags}`,
    `*${definition.pronunciation}*`,
    `**${definition.definition}**`,
    ...definition.examples,
  ];
}
```

### `src/index.ts`

```typescript
import '@logseq/libs';
import { settingsSchema } from './logseq/settings';
import { formatVocabularyCard } from './logseq/blocks';
import { generateVocabularyCard } from './vocabulary/generator';
import type { ProviderName } from './vocabulary/providers';

async function main() {
  logseq.useSettingsSchema(settingsSchema);

  logseq.Editor.registerSlashCommand('Generate Vocabulary Card', async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (!block?.content) {
      logseq.UI.showMsg('No word found in current block', 'warning');
      return;
    }

    const word = block.content.trim();
    const settings = logseq.settings;
    const provider = (settings?.provider ?? 'google') as ProviderName;
    const apiKey = settings?.apiKey as string;
    const customTags = (settings?.customTags ?? '#words') as string;

    if (!apiKey) {
      logseq.UI.showMsg('Please configure your API key in settings', 'error');
      return;
    }

    try {
      logseq.UI.showMsg(`Generating card for "${word}"...`, 'info');
      
      const definition = await generateVocabularyCard(word, provider, apiKey);
      const lines = formatVocabularyCard(definition, customTags);

      // Update current block and insert children
      await logseq.Editor.updateBlock(block.uuid, lines[0]);
      
      for (let i = 1; i < lines.length; i++) {
        await logseq.Editor.insertBlock(block.uuid, lines[i], { sibling: false });
      }

      logseq.UI.showMsg('Vocabulary card generated!', 'success');
    } catch (error) {
      console.error('Failed to generate vocabulary card:', error);
      logseq.UI.showMsg(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  });
}

logseq.ready(main).catch(console.error);
```

## Migration Steps

1. **Remove Rust/WASM** - Delete `lib/` directory
2. **Restructure** - Move from `plugin/` to root with `src/`
3. **Initialize Bun** - `bun init`, update `package.json`
4. **Install dependencies** - `bun add @logseq/libs ai @ai-sdk/google @ai-sdk/openai @ai-sdk/anthropic zod`
5. **Implement TypeScript modules** - Create files per structure above
6. **Configure TypeScript** - Set up `tsconfig.json` for ESM
7. **Test locally** - Load unpacked plugin in Logseq dev mode
8. **Update CI/CD** - Simplify `.github/workflows/publish.yml` (no wasm-pack)

## Benefits

1. **~80% less code** - No WASM boilerplate, HTTP handling, or JSON parsing
2. **Type safety end-to-end** - Zod validates AI responses automatically
3. **Multi-provider** - Switch between Google/OpenAI/Anthropic via settings
4. **Simpler builds** - Single `bun build` command, no wasm-pack
5. **Better DX** - Fast builds, hot reload with `--watch`
6. **Future-proof** - Easy to add Mastra later if you need memory/agents
