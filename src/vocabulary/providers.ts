import type { LanguageModel } from 'ai';

export type ProviderName = 'google' | 'openai' | 'anthropic';

export async function createModel(
  provider: ProviderName,
  apiKey: string,
  modelName?: string
): Promise<LanguageModel> {
  switch (provider) {
    case 'google': {
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      return createGoogleGenerativeAI({ apiKey })(modelName ?? 'gemini-2.5-flash');
    }
    case 'openai': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      return createOpenAI({ apiKey })(modelName ?? 'gpt-5-2');
    }
    case 'anthropic': {
      const { createAnthropic } = await import('@ai-sdk/anthropic');
      return createAnthropic({ apiKey })(modelName ?? 'claude-haiku-4-5');
    }
  }
}
