import { describe, it, expect } from 'bun:test';
import { createModel, requiresApiKey, type ProviderName } from './providers';

describe('createModel', () => {
  const testApiKey = 'test-api-key-12345';

  it('creates Google Gemini model with default version', async () => {
    const model = await createModel({ provider: 'google', apiKey: testApiKey });

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gemini-2.5-flash');
    expect(modelObj.provider).toBe('google.generative-ai');
  });

  it('creates Google Gemini model with custom model name', async () => {
    const model = await createModel({ provider: 'google', apiKey: testApiKey, modelName: 'gemini-3-flash-preview' });

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gemini-3-flash-preview');
    expect(modelObj.provider).toBe('google.generative-ai');
  });

  it('creates OpenAI model with default version', async () => {
    const model = await createModel({ provider: 'openai', apiKey: testApiKey });

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gpt-5-2');
    expect(modelObj.provider).toBe('openai.responses');
  });

  it('creates OpenAI model with custom model name', async () => {
    const model = await createModel({ provider: 'openai', apiKey: testApiKey, modelName: 'gpt-4o-mini' });

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('gpt-4o-mini');
    expect(modelObj.provider).toBe('openai.responses');
  });

  it('creates Anthropic model with default version', async () => {
    const model = await createModel({ provider: 'anthropic', apiKey: testApiKey });

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('claude-haiku-4-5');
    expect(modelObj.provider).toBe('anthropic.messages');
  });

  it('creates Anthropic model with custom model name', async () => {
    const model = await createModel({ provider: 'anthropic', apiKey: testApiKey, modelName: 'claude-opus-4-5-20251101' });

    expect(model).toBeDefined();
    const modelObj = model as { modelId: string; provider: string };
    expect(modelObj.modelId).toBe('claude-opus-4-5-20251101');
    expect(modelObj.provider).toBe('anthropic.messages');
  });

  describe('ollama', () => {
    it('creates model with default base URL', async () => {
      const model = await createModel({ provider: 'ollama' });

      expect(model).toBeDefined();
      const modelObj = model as { modelId: string };
      expect(modelObj.modelId).toBe('glm-4.7-flash');
    });

    it('creates model with custom base URL', async () => {
      const model = await createModel({
        provider: 'ollama',
        baseUrl: 'http://192.168.1.100:11434/v1',
        modelName: 'mistral',
      });

      expect(model).toBeDefined();
      const modelObj = model as { modelId: string };
      expect(modelObj.modelId).toBe('mistral');
    });
  });

  describe('openrouter', () => {
    it('creates model with API key', async () => {
      const model = await createModel({
        provider: 'openrouter',
        apiKey: 'sk-or-test-key',
      });

      expect(model).toBeDefined();
      const modelObj = model as { modelId: string };
      expect(modelObj.modelId).toBe('google/gemini-2.5-flash');
    });

    it('creates model with custom model', async () => {
      const model = await createModel({
        provider: 'openrouter',
        apiKey: 'sk-or-test-key',
        modelName: 'anthropic/claude-3-haiku',
      });

      expect(model).toBeDefined();
      const modelObj = model as { modelId: string };
      expect(modelObj.modelId).toBe('anthropic/claude-3-haiku');
    });
  });

  describe('custom', () => {
    it('throws when baseUrl is missing', async () => {
      await expect(
        createModel({ provider: 'custom', modelName: 'test-model' })
      ).rejects.toThrow('Base URL required');
    });

    it('throws when modelName is missing', async () => {
      await expect(
        createModel({ provider: 'custom', baseUrl: 'http://localhost:8080/v1' })
      ).rejects.toThrow('Model name required');
    });

    it('creates model with custom config', async () => {
      const model = await createModel({
        provider: 'custom',
        baseUrl: 'http://localhost:8080/v1',
        modelName: 'my-model',
        apiKey: 'my-key',
      });

      expect(model).toBeDefined();
      const modelObj = model as { modelId: string };
      expect(modelObj.modelId).toBe('my-model');
    });
  });

  it('handles all provider types exhaustively', async () => {
    type TestableProvider = Exclude<ProviderName, 'custom'>;
    const providers: TestableProvider[] = ['google', 'openai', 'anthropic', 'ollama', 'openrouter'];
    const expectedProviderStrings: Record<TestableProvider, string> = {
      google: 'google.generative-ai',
      openai: 'openai.responses',
      anthropic: 'anthropic.messages',
      ollama: 'ollama.chat',
      openrouter: 'openrouter.chat',
    };

    for (const provider of providers) {
      const model = await createModel({
        provider,
        apiKey: provider === 'ollama' ? undefined : testApiKey,
      });
      expect(model).toBeDefined();
      const modelObj = model as { provider: string };
      expect(modelObj.provider).toBe(expectedProviderStrings[provider]);
    }
  });
});

describe('requiresApiKey', () => {
  it('returns false for ollama', () => {
    expect(requiresApiKey('ollama')).toBe(false);
  });

  it('returns true for cloud providers', () => {
    const cloudProviders: ProviderName[] = ['google', 'openai', 'anthropic', 'openrouter', 'custom'];
    cloudProviders.forEach((p) => expect(requiresApiKey(p)).toBe(true));
  });
});
