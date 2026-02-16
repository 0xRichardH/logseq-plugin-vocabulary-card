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

function isStructuredOutputError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const errorName = error.constructor.name;
    
    return (
      errorName === 'AI_NoObjectGeneratedError' ||
      (message.includes('response_format') && message.includes('not supported')) ||
      (message.includes('json_object') && message.includes('not supported')) ||
      message.includes('json mode cannot be combined with')
    );
  }
  return false;
}

async function generateWithManualParsing(
  model: LanguageModel,
  word: string
): Promise<WordDefinition> {
  const { text } = await generateText({
    model,
    system: `${SYSTEM_PROMPT}\n\nIMPORTANT: Respond ONLY with valid JSON in the following format:
{
  "word": "string",
  "pronunciation": "string",
  "definition": "string",
  "examples": ["sentence1", "sentence2"]
}`,
    prompt: `Define the word: "${word}" and respond with JSON only.`,
  });

  const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleanedText);
  return WordDefinitionSchema.parse(parsed);
}

export async function generateVocabularyCard(options: GenerateOptions): Promise<WordDefinition> {
  const { word, provider, apiKey, baseUrl, modelName, model } = options;

  const resolvedModel = model ?? await createModel({ provider, apiKey, baseUrl, modelName });

  try {
    const { output } = await generateText({
      model: resolvedModel,
      output: Output.object({
        schema: WordDefinitionSchema,
      }),
      system: SYSTEM_PROMPT,
      prompt: `Define the word: "${word}"`,
    });

    return output;
  } catch (error) {
    if (isStructuredOutputError(error)) {
      console.warn('Structured output not supported by this model, falling back to manual JSON parsing');
      return generateWithManualParsing(resolvedModel, word);
    }
    throw error;
  }
}
