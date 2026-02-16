import type { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

export const settingsSchema: SettingSchemaDesc[] = [
  // --- Provider Selection ---
  {
    key: 'provider',
    type: 'enum',
    enumChoices: ['google', 'openai', 'anthropic', 'ollama', 'openrouter', 'openai-compatible'],
    enumPicker: 'select',
    default: 'google',
    title: 'AI Provider',
    description: 'Select which provider to use for generation. Configure the specific settings below.',
  },

  // --- AI Configuration ---
  {
    key: 'aiConfigHeading',
    type: 'heading',
    default: null,
    title: 'AI Configuration',
    description: '',
  },
  {
    key: 'aiModelId',
    type: 'string',
    default: '',
    title: 'Model ID',
    description: 'Model identifier (e.g., gemini-2.5-flash, gpt-5-2, claude-haiku-4-5)',
  },
  {
    key: 'aiApiKey',
    type: 'string',
    default: '',
    title: 'API Key (Optional)',
    description: 'API key for the provider (not required for Ollama and some other providers)',
  },
  {
    key: 'aiBaseUrl',
    type: 'string',
    default: '',
    title: 'Base URL (Optional)',
    description: 'Override the default API endpoint URL',
  },

  // --- General Settings ---
  {
    key: 'generalHeading',
    type: 'heading',
    default: null,
    title: 'General',
    description: '',
  },
  {
    key: 'customTags',
    type: 'string',
    default: '#words',
    title: 'Custom Tags',
    description: 'Tags to add to vocabulary cards',
  },
];
