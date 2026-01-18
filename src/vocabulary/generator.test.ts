import { describe, it, expect } from 'bun:test';
import { MockLanguageModelV3 } from 'ai/test';
import { generateVocabularyCard } from './generator';

function createMockModel(response: object) {
  return new MockLanguageModelV3({
    doGenerate: async () => ({
      content: [{ type: 'text', text: JSON.stringify(response) }],
      finishReason: { unified: 'stop', raw: undefined },
      usage: {
        inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
        outputTokens: { total: 20, text: 20, reasoning: undefined },
      },
      warnings: [],
    }),
  });
}

describe('generateVocabularyCard', () => {
  it('returns valid WordDefinition from AI response', async () => {
    const mockResponse = {
      word: 'ephemeral',
      pronunciation: '/ɪˈfem(ə)rəl/',
      definition: 'lasting for a very short time',
      examples: ['Fame is ephemeral.', 'The ephemeral beauty of cherry blossoms.'],
    };

    const result = await generateVocabularyCard(
      'ephemeral',
      'google',
      'fake-api-key',
      createMockModel(mockResponse)
    );

    expect(result.word).toBe('ephemeral');
    expect(result.pronunciation).toBe('/ɪˈfem(ə)rəl/');
    expect(result.definition).toBe('lasting for a very short time');
    expect(result.examples).toHaveLength(2);
    expect(result.image).toBeUndefined();
  });

  it('includes optional image field when provided', async () => {
    const mockResponse = {
      word: 'cat',
      pronunciation: '/kæt/',
      definition: 'a small domesticated carnivorous mammal',
      examples: ['The cat sat on the mat.', 'She has a black cat.'],
      image: 'https://example.com/cat.jpg',
    };

    const result = await generateVocabularyCard(
      'cat',
      'google',
      'fake-api-key',
      createMockModel(mockResponse)
    );

    expect(result.image).toBe('https://example.com/cat.jpg');
  });

  describe('error handling', () => {
    it('throws when AI returns invalid JSON', async () => {
      const invalidModel = new MockLanguageModelV3({
        doGenerate: async () => ({
          content: [{ type: 'text', text: 'not valid json' }],
          finishReason: { unified: 'stop', raw: undefined },
          usage: {
            inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
            outputTokens: { total: 20, text: 20, reasoning: undefined },
          },
          warnings: [],
        }),
      });

      await expect(
        generateVocabularyCard('test', 'google', 'fake-key', invalidModel)
      ).rejects.toThrow();
    });

    it('throws when response is missing required fields', async () => {
      const incompleteResponse = {
        word: 'test',
        pronunciation: '/test/',
        // missing: definition, examples
      };

      const invalidModel = createMockModel(incompleteResponse);

      await expect(
        generateVocabularyCard('test', 'google', 'fake-key', invalidModel)
      ).rejects.toThrow();
    });

    it('throws when examples array has wrong length', async () => {
      const wrongExamplesResponse = {
        word: 'test',
        pronunciation: '/test/',
        definition: 'a test word',
        examples: ['Only one example'], // should be exactly 2
      };

      const invalidModel = createMockModel(wrongExamplesResponse);

      await expect(
        generateVocabularyCard('test', 'google', 'fake-key', invalidModel)
      ).rejects.toThrow();
    });
  });
});
