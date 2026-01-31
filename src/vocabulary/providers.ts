import type { LanguageModel } from 'ai';

export type ProviderName = 'google' | 'openai' | 'anthropic' | 'ollama' | 'openrouter' | 'custom';

export interface CreateModelOptions {
  provider: ProviderName;
  apiKey?: string;
  baseUrl?: string;
  modelName?: string;
}

const PROVIDER_DEFAULTS: Record<string, { baseUrl: string; model: string }> = {
  ollama: { baseUrl: 'http://localhost:11434/v1', model: 'glm-4.7-flash' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: 'google/gemini-2.5-flash' },
};

export function requiresApiKey(provider: ProviderName): boolean {
  return provider !== 'ollama';
}

export async function createModel(options: CreateModelOptions): Promise<LanguageModel> {
  const { provider, apiKey, baseUrl, modelName } = options;

  switch (provider) {
    case 'google': {
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      return createGoogleGenerativeAI({
        apiKey: apiKey!,
        baseURL: baseUrl || undefined,
      })(modelName ?? 'gemini-2.5-flash');
    }
    case 'openai': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      return createOpenAI({
        apiKey: apiKey!,
        baseURL: baseUrl || undefined,
      })(modelName ?? 'gpt-5-2');
    }
    case 'anthropic': {
      const { createAnthropic } = await import('@ai-sdk/anthropic');
      return createAnthropic({
        apiKey: apiKey!,
        baseURL: baseUrl || undefined,
      })(modelName ?? 'claude-haiku-4-5');
    }
    case 'openai': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      return createOpenAI({ 
        apiKey: apiKey!,
        baseURL: baseUrl || undefined
      })(modelName ?? 'gpt-5-2');
    }
    case 'anthropic': {
      const { createAnthropic } = await import('@ai-sdk/anthropic');
      return createAnthropic({ 
        apiKey: apiKey!,
        baseURL: baseUrl || undefined
      })(modelName ?? 'claude-haiku-4-5');
    }
    case 'ollama': {
      const { createOpenAICompatible } = await import('@ai-sdk/openai-compatible');
      const defaults = PROVIDER_DEFAULTS.ollama;
      const provider = createOpenAICompatible({
        name: 'ollama',
        baseURL: baseUrl ?? defaults.baseUrl,
        apiKey: 'ollama',
      });
      return provider.chatModel(modelName ?? defaults.model);
    }
    case 'openrouter': {
      const { createOpenAICompatible } = await import('@ai-sdk/openai-compatible');
      const defaults = PROVIDER_DEFAULTS.openrouter;
      const provider = createOpenAICompatible({
        name: 'openrouter',
        baseURL: baseUrl ?? defaults.baseUrl,
        apiKey: apiKey!,
      });
      return provider.chatModel(modelName ?? defaults.model);
    }
    case 'custom': {
      const { createOpenAICompatible } = await import('@ai-sdk/openai-compatible');
      if (!baseUrl) throw new Error('Base URL required for custom provider');
      if (!modelName) throw new Error('Model name required for custom provider');
      const provider = createOpenAICompatible({
        name: 'custom',
        baseURL: baseUrl,
        apiKey: apiKey ?? 'none',
      });
      return provider.chatModel(modelName);
    }
  }
}
