import type { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

export const settingsSchema: SettingSchemaDesc[] = [
  // --- Provider Selection ---
  {
    key: 'provider',
    type: 'enum',
    enumChoices: ['google', 'openai', 'anthropic', 'ollama', 'openrouter', 'custom'],
    enumPicker: 'select',
    default: 'google',
    title: 'AI Provider',
    description: 'Select which provider to use for generation. Configure the specific settings below.',
  },

  // --- Google Settings ---
  {
    key: 'googleHeading',
    type: 'heading',
    default: null,
    title: 'Google Gemini',
    description: '',
  },
  {
    key: 'googleApiKey',
    type: 'string',
    default: '',
    title: 'API Key',
    description: 'Enter your Gemini API Key',
  },
  {
    key: 'googleBaseUrl',
    type: 'string',
    default: '',
    title: 'Base URL (Optional)',
    description: 'Override default Google API endpoint',
  },
  {
    key: 'googleModelName',
    type: 'string',
    default: 'gemini-2.5-flash',
    title: 'Model Name',
    description: 'Default: gemini-2.5-flash',
  },

  // --- OpenAI Settings ---
  {
    key: 'openaiHeading',
    type: 'heading',
    default: null,
    title: 'OpenAI',
    description: '',
  },
  {
    key: 'openaiApiKey',
    type: 'string',
    default: '',
    title: 'API Key',
    description: 'Enter your OpenAI API Key',
  },
  {
    key: 'openaiBaseUrl',
    type: 'string',
    default: '',
    title: 'Base URL (Optional)',
    description: 'Override default OpenAI API endpoint',
  },
  {
    key: 'openaiModelName',
    type: 'string',
    default: 'gpt-5-2',
    title: 'Model Name',
    description: 'Default: gpt-5-2',
  },

  // --- Anthropic Settings ---
  {
    key: 'anthropicHeading',
    type: 'heading',
    default: null,
    title: 'Anthropic',
    description: '',
  },
  {
    key: 'anthropicApiKey',
    type: 'string',
    default: '',
    title: 'API Key',
    description: 'Enter your Anthropic API Key',
  },
  {
    key: 'anthropicBaseUrl',
    type: 'string',
    default: '',
    title: 'Base URL (Optional)',
    description: 'Override default Anthropic API endpoint',
  },
  {
    key: 'anthropicModelName',
    type: 'string',
    default: 'claude-haiku-4-5',
    title: 'Model Name',
    description: 'Default: claude-haiku-4-5',
  },

  // --- Ollama Settings ---
  {
    key: 'ollamaHeading',
    type: 'heading',
    default: null,
    title: 'Ollama (Local)',
    description: '',
  },
  {
    key: 'ollamaBaseUrl',
    type: 'string',
    default: 'http://localhost:11434/v1',
    title: 'Base URL',
    description: 'Endpoint for local Ollama server',
  },
  {
    key: 'ollamaModelName',
    type: 'string',
    default: 'glm-4.7-flash',
    title: 'Model Name',
    description: 'Default: glm-4.7-flash (must be pulled first)',
  },
  {
    key: 'ollamaApiKey',
    type: 'string',
    default: '',
    title: 'API Key (Optional)',
    description: 'Not usually required for local Ollama',
  },

  // --- OpenRouter Settings ---
  {
    key: 'openrouterHeading',
    type: 'heading',
    default: null,
    title: 'OpenRouter',
    description: '',
  },
  {
    key: 'openrouterApiKey',
    type: 'string',
    default: '',
    title: 'API Key',
    description: 'Enter your OpenRouter API Key',
  },
  {
    key: 'openrouterBaseUrl',
    type: 'string',
    default: '',
    title: 'Base URL (Optional)',
    description: 'Override default OpenRouter API endpoint',
  },
  {
    key: 'openrouterModelName',
    type: 'string',
    default: 'google/gemini-2.5-flash',
    title: 'Model Name',
    description: 'Default: google/gemini-2.5-flash',
  },

  // --- Custom Settings ---
  {
    key: 'customHeading',
    type: 'heading',
    default: null,
    title: 'Custom Provider',
    description: '',
  },
  {
    key: 'customBaseUrl',
    type: 'string',
    default: '',
    title: 'Base URL',
    description: 'Full URL to OpenAI-compatible endpoint',
  },
  {
    key: 'customModelName',
    type: 'string',
    default: '',
    title: 'Model Name',
    description: 'Model ID to request',
  },
  {
    key: 'customApiKey',
    type: 'string',
    default: '',
    title: 'API Key (Optional)',
    description: 'API Key if required by your provider',
  },

  // --- Shared Settings ---
  {
    key: 'sharedHeading',
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
