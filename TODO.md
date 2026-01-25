# TODO

## Future Work

### Image Generation with Gemini Nano Banana

Add AI-generated images to vocabulary cards using Gemini Nano Banana.

**Context:**
- The `image` field was removed from `WordDefinitionSchema` in January 2026 because LLM-provided URLs were often invalid
- Images should be generated locally using Gemini Nano Banana instead of relying on external URLs

**Implementation Tasks:**

1. **Schema Update** (`src/vocabulary/schema.ts`)
   - Add back `image` field to `WordDefinitionSchema`
   - Type: `z.string().optional()` or `z.instanceof(Buffer).optional()`
   - Decision needed: Store as base64 string, Buffer, or file path?

2. **Image Generation** (new file: `src/vocabulary/image-generator.ts`)
   - Integrate Gemini Nano Banana API
   - Generate contextual images based on vocabulary word
   - Handle generation failures gracefully (image remains optional)
   - Add caching to avoid regenerating same word images

3. **Block Formatting** (`src/logseq/blocks.ts`)
   - Add back image rendering logic
   - Handle different image storage formats (base64, file path, etc.)
   - Consider Logseq's image handling capabilities

4. **Settings** (`src/logseq/settings.ts`)
   - Add toggle to enable/disable image generation
   - Add Gemini Nano Banana API configuration
   - Consider performance/cost settings (image resolution, generation limits)

5. **Testing**
   - Add tests for image generation in `src/vocabulary/image-generator.test.ts`
   - Update `src/vocabulary/generator.test.ts` to handle optional images
   - Update `src/logseq/blocks.test.ts` to test image rendering

6. **Documentation**
   - Update README.md with image generation feature
   - Add Gemini Nano Banana setup instructions
   - Document image storage and caching strategy

**Technical Considerations:**
- Image storage: How does Logseq handle embedded images? File system vs base64?
- Performance: Should image generation be async/background?
- Caching: Cache generated images to avoid API costs?
- Fallback: What happens if image generation fails or times out?

**References:**
- Gemini Nano Banana API documentation: [link needed]
- Logseq asset handling: [link needed]
