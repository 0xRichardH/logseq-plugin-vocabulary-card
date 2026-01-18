import { describe, it, expect } from 'bun:test';
import { createModel, type ProviderName } from './providers';

describe('createModel', () => {
  const testApiKey = 'test-api-key-12345';

  it('creates Google Gemini model', () => {
    const model = createModel('google', testApiKey);

    expect(model).toBeDefined();
    // Use type assertion to access LanguageModelV3 properties
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gemini-2.5-flash-preview-04-17');
    expect(modelObj.provider).toBe('google.generative-ai');
  });

  it('creates OpenAI model', () => {
    const model = createModel('openai', testApiKey);

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gpt-4o-mini');
    expect(modelObj.provider).toBe('openai.responses');
  });

  it('creates Anthropic model', () => {
    const model = createModel('anthropic', testApiKey);

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('claude-3-haiku-20240307');
    expect(modelObj.provider).toBe('anthropic.messages');
  });

  it('handles all provider types exhaustively', () => {
    const providers: ProviderName[] = ['google', 'openai', 'anthropic'];
    const expectedProviderStrings: Record<ProviderName, string> = {
      google: 'google.generative-ai',
      openai: 'openai.responses',
      anthropic: 'anthropic.messages',
    };

    for (const provider of providers) {
      const model = createModel(provider, testApiKey);
      expect(model).toBeDefined();
      const modelObj = model as { provider: string };
      expect(modelObj.provider).toBe(expectedProviderStrings[provider]);
    }
  });
});
