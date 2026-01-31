import type { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';
import type { ProviderName } from '../vocabulary/providers';

export function getSettingsSchema(provider: ProviderName = 'google'): SettingSchemaDesc[] {
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

  switch (provider) {
    case 'google':
      schema.push(
        { key: 'googleApiKey', type: 'string', default: '', title: 'Google API Key', description: 'Enter your Gemini API Key' },
        { key: 'googleModel', type: 'string', default: '', title: 'Google Model (Optional)', description: 'Default: gemini-2.5-flash' }
      );
      break;
    case 'openai':
      schema.push(
        { key: 'openaiApiKey', type: 'string', default: '', title: 'OpenAI API Key', description: 'Enter your OpenAI API Key' },
        { key: 'openaiModel', type: 'string', default: '', title: 'OpenAI Model (Optional)', description: 'Default: gpt-5-2' }
      );
      break;
    case 'anthropic':
      schema.push(
        { key: 'anthropicApiKey', type: 'string', default: '', title: 'Anthropic API Key', description: 'Enter your Anthropic API Key' },
        { key: 'anthropicModel', type: 'string', default: '', title: 'Anthropic Model (Optional)', description: 'Default: claude-haiku-4-5' }
      );
      break;
    case 'ollama':
      schema.push(
        { key: 'ollamaBaseUrl', type: 'string', default: 'http://localhost:11434/v1', title: 'Ollama Base URL', description: 'Endpoint for local Ollama server' },
        { key: 'ollamaModel', type: 'string', default: 'glm-4.7-flash', title: 'Ollama Model', description: 'Model to use (must be pulled first)' }
      );
      break;
    case 'openrouter':
      schema.push(
        { key: 'openrouterApiKey', type: 'string', default: '', title: 'OpenRouter API Key', description: 'Enter your OpenRouter API Key' },
        { key: 'openrouterModel', type: 'string', default: '', title: 'OpenRouter Model (Optional)', description: 'Default: google/gemini-2.5-flash' }
      );
      break;
    case 'custom':
      schema.push(
        { key: 'customBaseUrl', type: 'string', default: '', title: 'Custom Provider URL', description: 'Full URL to OpenAI-compatible endpoint (e.g. http://localhost:1234/v1)' },
        { key: 'customApiKey', type: 'string', default: '', title: 'Custom API Key (Optional)', description: 'API Key if required by provider' },
        { key: 'customModel', type: 'string', default: '', title: 'Custom Model Name', description: 'Model ID to request' }
      );
      break;
  }

  schema.push({
    key: 'customTags',
    type: 'string',
    default: '#words',
    title: 'Custom Tags',
    description: 'Tags to add to vocabulary cards',
  });

  return schema;
}
