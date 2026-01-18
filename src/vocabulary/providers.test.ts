import { describe, it, expect } from 'bun:test';
import { createModel, type ProviderName } from './providers';

describe('createModel', () => {
  const testApiKey = 'test-api-key-12345';

  it('creates Google Gemini model with default version', async () => {
    const model = await createModel('google', testApiKey);

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gemini-2.5-flash');
    expect(modelObj.provider).toBe('google.generative-ai');
  });

  it('creates Google Gemini model with custom model name', async () => {
    const model = await createModel('google', testApiKey, 'gemini-3-flash-preview');

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gemini-3-flash-preview');
    expect(modelObj.provider).toBe('google.generative-ai');
  });

  it('creates OpenAI model with default version', async () => {
    const model = await createModel('openai', testApiKey);

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gpt-5-2');
    expect(modelObj.provider).toBe('openai.responses');
  });

  it('creates OpenAI model with custom model name', async () => {
    const model = await createModel('openai', testApiKey, 'gpt-4o-mini');

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gpt-4o-mini');
    expect(modelObj.provider).toBe('openai.responses');
  });

  it('creates Anthropic model with default version', async () => {
    const model = await createModel('anthropic', testApiKey);

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('claude-haiku-4-5');
    expect(modelObj.provider).toBe('anthropic.messages');
  });

  it('creates Anthropic model with custom model name', async () => {
    const model = await createModel('anthropic', testApiKey, 'claude-opus-4-5-20251101');

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('claude-opus-4-5-20251101');
    expect(modelObj.provider).toBe('anthropic.messages');
  });

  it('handles all provider types exhaustively', async () => {
    const providers: ProviderName[] = ['google', 'openai', 'anthropic'];
    const expectedProviderStrings: Record<ProviderName, string> = {
      google: 'google.generative-ai',
      openai: 'openai.responses',
      anthropic: 'anthropic.messages',
    };

    for (const provider of providers) {
      const model = await createModel(provider, testApiKey);
      expect(model).toBeDefined();
      const modelObj = model as { provider: string };
      expect(modelObj.provider).toBe(expectedProviderStrings[provider]);
    }
  });
});
