import { generateText, Output } from 'ai';
import type { LanguageModel } from 'ai';
import { WordDefinitionSchema, type WordDefinition } from './schema';
import { createModel, type ProviderName } from './providers';

export const SYSTEM_PROMPT = `You are a vocabulary dictionary assistant. 
Provide accurate word definitions with phonetic pronunciation, 
clear explanations, and helpful example sentences.`;

export interface GenerateOptions {
  word: string;
  provider: ProviderName;
  apiKey?: string;
  baseUrl?: string;
  modelName?: string;
  model?: LanguageModel;
}

export async function generateVocabularyCard(options: GenerateOptions): Promise<WordDefinition> {
  const { word, provider, apiKey, baseUrl, modelName, model } = options;

  const resolvedModel = model ?? await createModel({ provider, apiKey, baseUrl, modelName });

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
