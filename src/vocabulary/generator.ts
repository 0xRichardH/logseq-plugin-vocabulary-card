import { generateText, Output } from 'ai';
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
  model?: LanguageModel,
  modelName?: string
): Promise<WordDefinition> {
  const resolvedModel = model ?? await createModel(provider, apiKey, modelName);

  const { output } = await generateText({
    model: resolvedModel,
    output: Output.object({
      schema: WordDefinitionSchema,
    }),
    system: SYSTEM_PROMPT,
    prompt: `Define the word: "${word}"`,
  });

  return output;
}
