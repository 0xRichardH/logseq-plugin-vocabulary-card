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
