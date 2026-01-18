import { z } from 'zod';

export const WordDefinitionSchema = z.object({
  word: z.string().describe('The vocabulary word'),
  pronunciation: z.string().describe('IPA or phonetic spelling'),
  definition: z.string().describe('Clear, concise meaning'),
  examples: z.array(z.string()).length(2).describe('Two example sentences'),
  image: z.string().url().optional().describe('URL to a relevant image'),
});

export type WordDefinition = z.infer<typeof WordDefinitionSchema>;
