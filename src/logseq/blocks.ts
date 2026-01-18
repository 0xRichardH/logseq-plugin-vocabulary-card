import type { WordDefinition } from '../vocabulary/schema';

export function formatVocabularyCard(
  definition: WordDefinition,
  customTags: string
): string[] {
  return [
    `${definition.word} #card ${customTags}`,
    `*${definition.pronunciation}*`,
    `**${definition.definition}**`,
    ...definition.examples,
  ];
}
