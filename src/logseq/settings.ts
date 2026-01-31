import type { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';
import type { ProviderName } from '../vocabulary/providers';

const PROVIDER_CONFIGS: Record<ProviderName, { apiKeyTitle: string; apiKeyDesc: string; modelTitle: string; modelDesc: string; baseUrlTitle?: string; baseUrlDesc?: string; baseUrlDefault?: string }> = {
  google: {
    apiKeyTitle: 'Google API Key',
    apiKeyDesc: 'Enter your Gemini API Key',
    modelTitle: 'Model (Optional)',
    modelDesc: 'Default: gemini-2.5-flash',
  },
  openai: {
    apiKeyTitle: 'OpenAI API Key',
    apiKeyDesc: 'Enter your OpenAI API Key',
    modelTitle: 'Model (Optional)',
    modelDesc: 'Default: gpt-5-2',
  },
  anthropic: {
    apiKeyTitle: 'Anthropic API Key',
    apiKeyDesc: 'Enter your Anthropic API Key',
    modelTitle: 'Model (Optional)',
    modelDesc: 'Default: claude-haiku-4-5',
  },
  ollama: {
    apiKeyTitle: 'API Key (Optional)',
    apiKeyDesc: 'Not required for Ollama, but some setups may use it',
    baseUrlTitle: 'Base URL',
    baseUrlDesc: 'Endpoint for local Ollama server',
    baseUrlDefault: 'http://localhost:11434/v1',
    modelTitle: 'Model',
    modelDesc: 'Default: glm-4.7-flash (must be pulled first)',
  },
  openrouter: {
    apiKeyTitle: 'OpenRouter API Key',
    apiKeyDesc: 'Enter your OpenRouter API Key',
    modelTitle: 'Model (Optional)',
    modelDesc: 'Default: google/gemini-2.5-flash',
  },
  custom: {
    apiKeyTitle: 'API Key (Optional)',
    apiKeyDesc: 'API Key if required by your provider',
    baseUrlTitle: 'Base URL',
    baseUrlDesc: 'Full URL to OpenAI-compatible endpoint',
    baseUrlDefault: '',
    modelTitle: 'Model',
    modelDesc: 'Model ID to request',
  },
};

export function getSettingsSchema(provider: ProviderName = 'google'): SettingSchemaDesc[] {
  const config = PROVIDER_CONFIGS[provider];
  const schema: SettingSchemaDesc[] = [
    {
      key: 'provider',
      type: 'enum',
      enumChoices: ['google', 'openai', 'anthropic', 'ollama', 'openrouter', 'custom'],
      enumPicker: 'select',
      default: 'google',
      title: 'AI Provider',
      description: 'Select your preferred AI provider',
    },
  ];

  // Base URL for providers that need it
  if (config.baseUrlTitle) {
    schema.push({
      key: 'baseUrl',
      type: 'string',
      default: config.baseUrlDefault || '',
      title: config.baseUrlTitle,
      description: config.baseUrlDesc || '',
    });
  }

  // API Key (shown for all providers, but marked optional for ollama/custom)
  schema.push({
    key: 'apiKey',
    type: 'string',
    default: '',
    title: config.apiKeyTitle,
    description: config.apiKeyDesc,
  });

  // Model Name
  schema.push({
    key: 'modelName',
    type: 'string',
    default: '',
    title: config.modelTitle,
    description: config.modelDesc,
  });

  // Custom Tags (always present)
  schema.push({
    key: 'customTags',
    type: 'string',
    default: '#words',
    title: 'Custom Tags',
    description: 'Tags to add to vocabulary cards',
  });

  return schema;
}
