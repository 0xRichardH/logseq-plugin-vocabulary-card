import { generateObject } from 'ai';
import type { LanguageModel } from 'ai';
import { WordDefinitionSchema, type WordDefinition } from './schema';
import { createModel, type ProviderName } from './providers';

export const SYSTEM_PROMPT = `You are a vocabulary dictionary assistant. 
Provide accurate word definitions with phonetic pronunciation, 
clear explanations, and helpful example sentences.`;

export async function generateVocabularyCard(
  word: string,
  provider: ProviderName,
  apiKey: string,
  model?: LanguageModel
): Promise<WordDefinition> {
  const resolvedModel = model ?? createModel(provider, apiKey);

  const { object } = await generateObject({
    model: resolvedModel,
    schema: WordDefinitionSchema,
    system: SYSTEM_PROMPT,
    prompt: `Define the word: "${word}"`,
  });

  return object;
}
