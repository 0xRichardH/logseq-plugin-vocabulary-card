import { describe, it, expect } from 'bun:test';
import type { LanguageModel } from 'ai';
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

    const result = await generateVocabularyCard({
      word: 'ephemeral',
      provider: 'google',
      apiKey: 'fake-api-key',
      model: createMockModel(mockResponse),
    });

    expect(result.word).toBe('ephemeral');
    expect(result.pronunciation).toBe('/ɪˈfem(ə)rəl/');
    expect(result.definition).toBe('lasting for a very short time');
    expect(result.examples).toHaveLength(2);
  });

  it('accepts custom model name parameter', async () => {
    const mockResponse = {
      word: 'test',
      pronunciation: '/test/',
      definition: 'a test word',
      examples: ['First example.', 'Second example.'],
    };

    const result = await generateVocabularyCard({
      word: 'test',
      provider: 'google',
      apiKey: 'fake-api-key',
      model: createMockModel(mockResponse),
      modelName: 'gemini-3-flash-preview',
    });

    expect(result.word).toBe('test');
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
        generateVocabularyCard({
          word: 'test',
          provider: 'google',
          apiKey: 'fake-key',
          model: invalidModel,
        })
      ).rejects.toThrow();
    });

    it('throws when response is missing required fields', async () => {
      const incompleteResponse = {
        word: 'test',
        pronunciation: '/test/',
      };

      const invalidModel = createMockModel(incompleteResponse);

      await expect(
        generateVocabularyCard({
          word: 'test',
          provider: 'google',
          apiKey: 'fake-key',
          model: invalidModel,
        })
      ).rejects.toThrow();
    });

    it('throws when examples array has wrong length', async () => {
      const wrongExamplesResponse = {
        word: 'test',
        pronunciation: '/test/',
        definition: 'a test word',
        examples: ['Only one example'],
      };

      const invalidModel = createMockModel(wrongExamplesResponse);

      await expect(
        generateVocabularyCard({
          word: 'test',
          provider: 'google',
          apiKey: 'fake-key',
          model: invalidModel,
        })
      ).rejects.toThrow();
    });

    it('falls back to manual JSON parsing when structured output is not supported', async () => {
      const fallbackResponse = {
        word: 'ephemeral',
        pronunciation: '/ɪˈfem(ə)rəl/',
        definition: 'lasting for a very short time',
        examples: ['Fame is ephemeral.', 'The ephemeral beauty of cherry blossoms.'],
      };

      let callCount = 0;
      const mockModel = new MockLanguageModelV3({
        doGenerate: async () => {
          callCount++;
          if (callCount === 1) {
            throw new Error('response_format.type not supported by this model');
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(fallbackResponse) }],
            finishReason: { unified: 'stop', raw: undefined },
            usage: {
              inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
              outputTokens: { total: 20, text: 20, reasoning: undefined },
            },
            warnings: [],
          };
        },
      });

      const result = await generateVocabularyCard({
        word: 'ephemeral',
        provider: 'google',
        apiKey: 'fake-key',
        model: mockModel as unknown as LanguageModel,
      });

      expect(callCount).toBe(2);
      expect(result.word).toBe('ephemeral');
      expect(result.examples).toHaveLength(2);
    });

    it('handles markdown code blocks in fallback response', async () => {
      const fallbackResponse = {
        word: 'luminous',
        pronunciation: '/ˈlo͞omənəs/',
        definition: 'full of or shedding light; bright or shining',
        examples: ['The luminous moon illuminated the path.', 'Her luminous smile lit up the room.'],
      };

      let callCount = 0;
      const mockModel = new MockLanguageModelV3({
        doGenerate: async () => {
          callCount++;
          if (callCount === 1) {
            throw new Error('json_object not supported');
          }
          return {
            content: [{ type: 'text', text: '```json\n' + JSON.stringify(fallbackResponse) + '\n```' }],
            finishReason: { unified: 'stop', raw: undefined },
            usage: {
              inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
              outputTokens: { total: 20, text: 20, reasoning: undefined },
            },
            warnings: [],
          };
        },
      });

      const result = await generateVocabularyCard({
        word: 'luminous',
        provider: 'google',
        apiKey: 'fake-key',
        model: mockModel as unknown as LanguageModel,
      });

      expect(callCount).toBe(2);
      expect(result.word).toBe('luminous');
      expect(result.examples).toHaveLength(2);
    });

    it('re-throws non-structured-output errors', async () => {
      const mockError = new Error('API key invalid');

      const mockModel = new MockLanguageModelV3({
        doGenerate: async () => {
          throw mockError;
        },
      });

      await expect(
        generateVocabularyCard({
          word: 'test',
          provider: 'google',
          apiKey: 'bad-key',
          model: mockModel as unknown as LanguageModel,
        })
      ).rejects.toThrow('API key invalid');
    });
  });
});
