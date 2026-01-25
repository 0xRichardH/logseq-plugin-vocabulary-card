import type { WordDefinition } from '../vocabulary/schema';

export function formatVocabularyCard(
  definition: WordDefinition,
  customTags: string
): string[] {
  const lines = [
    `${definition.word} #card ${customTags}`,
    `*${definition.pronunciation}*`,
    `**${definition.definition}**`,
    ...definition.examples,
  ];

  if (definition.image) {
    lines.push(`![Image](${definition.image})`);
  }

  return lines;
}
