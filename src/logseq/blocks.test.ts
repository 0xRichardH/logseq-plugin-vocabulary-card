import { describe, it, expect } from 'bun:test';
import { formatVocabularyCard } from './blocks';
import type { WordDefinition } from '../vocabulary/schema';

describe('formatVocabularyCard', () => {
  const sampleDefinition: WordDefinition = {
    word: 'ephemeral',
    pronunciation: '/ɪˈfem(ə)rəl/',
    definition: 'lasting for a very short time',
    examples: ['Fame is ephemeral.', 'The ephemeral beauty of cherry blossoms.'],
  };

  it('formats card with all required fields', () => {
    const lines = formatVocabularyCard(sampleDefinition, '#words');

    expect(lines).toHaveLength(5);
    expect(lines[0]).toBe('ephemeral #card #words');
    expect(lines[1]).toBe('*/ɪˈfem(ə)rəl/*');
    expect(lines[2]).toBe('**lasting for a very short time**');
    expect(lines[3]).toBe('Fame is ephemeral.');
    expect(lines[4]).toBe('The ephemeral beauty of cherry blossoms.');
  });

  it('applies custom tags correctly', () => {
    const lines = formatVocabularyCard(sampleDefinition, '#vocabulary #english');

    expect(lines[0]).toBe('ephemeral #card #vocabulary #english');
  });

  it('handles empty custom tags', () => {
    const lines = formatVocabularyCard(sampleDefinition, '');

    expect(lines[0]).toBe('ephemeral #card ');
  });

  it('preserves special characters in pronunciation', () => {
    const definition: WordDefinition = {
      word: 'naïve',
      pronunciation: '/naɪˈiːv/',
      definition: 'showing a lack of experience',
      examples: ['A naïve approach.', 'She was naïve about politics.'],
    };

    const lines = formatVocabularyCard(definition, '#words');

    expect(lines[1]).toBe('*/naɪˈiːv/*');
  });

  it('handles definition with markdown-like characters', () => {
    const definition: WordDefinition = {
      word: 'asterisk',
      pronunciation: '/ˈæstərɪsk/',
      definition: 'the symbol * used in printing',
      examples: ['Add an asterisk here.', 'The asterisk marks a footnote.'],
    };

    const lines = formatVocabularyCard(definition, '#words');

    expect(lines[2]).toBe('**the symbol * used in printing**');
  });
});
