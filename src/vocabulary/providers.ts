import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModel } from 'ai';

export type ProviderName = 'google' | 'openai' | 'anthropic';

export function createModel(
  provider: ProviderName,
  apiKey: string,
  modelName?: string
): LanguageModel {
  switch (provider) {
    case 'google':
      return createGoogleGenerativeAI({ apiKey })(modelName ?? 'gemini-2.5-flash');
    case 'openai':
      return createOpenAI({ apiKey })(modelName ?? 'gpt-5-2');
    case 'anthropic':
      return createAnthropic({ apiKey })(modelName ?? 'claude-haiku-4-5');
  }
}
