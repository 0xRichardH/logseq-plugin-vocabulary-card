# Agent Guidelines

## Project Overview

Logseq plugin that generates vocabulary flashcards using AI (Google Gemini, OpenAI, Anthropic).
Built with Bun, TypeScript, and AI SDK v6.

## Commands

### Build & Development
```bash
bun run build        # Production build (minified)
bun run dev          # Development build with watch mode
bun run typecheck    # TypeScript type checking (tsc --noEmit)
```

### Testing
```bash
bun test                              # Run all tests
bun test src/vocabulary/generator     # Run tests in a specific file
bun test --test-name-pattern "returns valid"  # Run tests matching pattern
```

### Pre-commit Checklist
Always run before committing:
```bash
bun run typecheck && bun test
```

## Project Structure

```
src/
├── index.ts                 # Plugin entry point (Logseq integration)
├── vocabulary/
│   ├── schema.ts            # Zod schema for WordDefinition
│   ├── generator.ts         # AI SDK generateObject() wrapper
│   ├── generator.test.ts    # Generator tests with MockLanguageModelV3
│   ├── providers.ts         # Multi-provider factory (Google/OpenAI/Anthropic)
│   └── providers.test.ts    # Provider tests
└── logseq/
    ├── settings.ts          # Plugin settings schema
    ├── blocks.ts            # Card formatting logic
    └── blocks.test.ts       # Formatting tests
```

## Code Style

### Imports
- Use named imports, avoid default imports
- Group imports: external packages first, then local modules
- Use `type` keyword for type-only imports

```typescript
// External packages
import { generateObject } from 'ai';
import type { LanguageModel } from 'ai';

// Local modules
import { WordDefinitionSchema, type WordDefinition } from './schema';
import { createModel, type ProviderName } from './providers';
```

### Types
- Never use `any` - use `unknown` and narrow with type guards
- Export types alongside their implementations
- Use Zod schemas for runtime validation, infer TypeScript types from them
- Prefer `type` over `interface` for object shapes

```typescript
// Define schema, infer type
export const WordDefinitionSchema = z.object({
  word: z.string().describe('The vocabulary word'),
  examples: z.array(z.string()).length(2),
});
export type WordDefinition = z.infer<typeof WordDefinitionSchema>;
```

### Functions
- Use explicit return types on exported functions
- Prefer arrow functions for inline callbacks
- Use `async/await` over raw Promises

```typescript
export function createModel(provider: ProviderName, apiKey: string): LanguageModel {
  // ...
}

export async function generateVocabularyCard(
  word: string,
  provider: ProviderName,
  apiKey: string,
  model?: LanguageModel
): Promise<WordDefinition> {
  // ...
}
```

### Error Handling
- Use try/catch for async operations that may fail
- Log errors to console before re-throwing or displaying to user
- Use `instanceof Error` check for type-safe error messages

```typescript
try {
  const result = await generateVocabularyCard(word, provider, apiKey);
} catch (error) {
  console.error('Failed to generate:', error);
  const message = error instanceof Error ? error.message : 'Unknown error';
  logseq.UI.showMsg(`Error: ${message}`, 'error');
}
```

### Naming Conventions
- Files: `kebab-case.ts`, test files: `kebab-case.test.ts`
- Types/Interfaces: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE` for module-level constants
- Zod schemas: `PascalCaseSchema` suffix

### Comments
- Do NOT add comments unless explicitly requested
- Code should be self-documenting through clear naming

## Testing

### Framework
- Bun test runner (`bun:test`)
- Use `MockLanguageModelV3` from `ai/test` for AI SDK mocks

### Test Structure
```typescript
import { describe, it, expect } from 'bun:test';
import { MockLanguageModelV3 } from 'ai/test';

describe('functionName', () => {
  it('describes expected behavior', async () => {
    // Arrange
    const mockModel = new MockLanguageModelV3({ /* ... */ });
    
    // Act
    const result = await functionUnderTest(mockModel);
    
    // Assert
    expect(result.field).toBe('expected');
  });

  describe('error handling', () => {
    it('throws when given invalid input', async () => {
      await expect(functionUnderTest(badInput)).rejects.toThrow();
    });
  });
});
```

### Mock Pattern for AI SDK
```typescript
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
```

## Dependencies

- **Runtime:** Bun
- **AI:** `ai` (AI SDK v6), `@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/anthropic`
- **Validation:** `zod` v4
- **Logseq:** `@logseq/libs`

## Git

- Sign all commits (`git commit -S`)
- Never commit API keys or secrets
- Run `bun run typecheck && bun test` before committing

## Code Design Principles

### Single Responsibility
- One function = one task
- One file = one concern (schema, generator, providers, etc.)
- Extract logic into separate functions when a function does multiple things

### Dependency Injection
Functions that use external services (AI models) should accept them as optional parameters for testing:

```typescript
export async function generateVocabularyCard(
  word: string,
  provider: ProviderName,
  apiKey: string,
  model?: LanguageModel  // Allows injecting MockLanguageModelV3 in tests
): Promise<WordDefinition> {
  const resolvedModel = model ?? createModel(provider, apiKey);
  // ...
}
```
