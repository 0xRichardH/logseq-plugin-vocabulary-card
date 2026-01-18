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
    key: 'googleModel',
    type: 'string',
    default: '',
    title: 'Google Model (Optional)',
    description: 'Custom Google model name (default: gemini-2.5-flash)',
  },
  {
    key: 'openaiModel',
    type: 'string',
    default: '',
    title: 'OpenAI Model (Optional)',
    description: 'Custom OpenAI model name (default: gpt-5-2)',
  },
  {
    key: 'anthropicModel',
    type: 'string',
    default: '',
    title: 'Anthropic Model (Optional)',
    description: 'Custom Anthropic model name (default: claude-haiku-4-5)',
  },
  {
    key: 'customTags',
    type: 'string',
    default: '#words',
    title: 'Custom Tags',
    description: 'Tags to add to vocabulary cards',
  },
];
