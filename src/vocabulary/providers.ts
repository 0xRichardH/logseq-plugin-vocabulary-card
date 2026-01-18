import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModel } from 'ai';

export type ProviderName = 'google' | 'openai' | 'anthropic';

export function createModel(provider: ProviderName, apiKey: string): LanguageModel {
  switch (provider) {
    case 'google':
      return createGoogleGenerativeAI({ apiKey })('gemini-2.5-flash-preview-04-17');
    case 'openai':
      return createOpenAI({ apiKey })('gpt-4o-mini');
    case 'anthropic':
      return createAnthropic({ apiKey })('claude-3-haiku-20240307');
  }
}
