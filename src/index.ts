import '@logseq/libs';
import { settingsSchema } from './logseq/settings';
import { formatVocabularyCard } from './logseq/blocks';
import { generateVocabularyCard } from './vocabulary/generator';
import { requiresApiKey, type ProviderName } from './vocabulary/providers';

function getActiveConfig() {
  const settings = (logseq.settings ?? {}) as Record<string, unknown>;
  const provider = (settings.provider ?? 'google') as ProviderName;

  return {
    provider,
    apiKey: (settings.aiApiKey as string) || undefined,
    baseUrl: (settings.aiBaseUrl as string) || undefined,
    modelName: (settings.aiModelId as string) || undefined,
    customTags: (settings.customTags ?? '#words') as string,
  };
}

async function main() {
  // Use the static settings schema
  logseq.useSettingsSchema(settingsSchema);

  logseq.Editor.registerSlashCommand('Generate Vocabulary Card', async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (!block?.content) {
      logseq.UI.showMsg('No word found in current block', 'warning');
      return;
    }

    const word = block.content.trim();
    const config = getActiveConfig();

    // Validate API key (required for all except ollama)
    if (requiresApiKey(config.provider) && !config.apiKey) {
      logseq.UI.showMsg(
        `Please configure API key for ${config.provider} in settings`,
        'error'
      );
      return;
    }

    // Validate Base URL for openai-compatible
    if (config.provider === 'openai-compatible' && !config.baseUrl) {
      logseq.UI.showMsg('Base URL is required for openai-compatible provider', 'error');
      return;
    }

    // Validate Model Name for openai-compatible
    if (config.provider === 'openai-compatible' && !config.modelName) {
      logseq.UI.showMsg('Model name is required for openai-compatible provider', 'error');
      return;
    }

    try {
      logseq.UI.showMsg(`Generating card for "${word}"...`, 'info');

      const definition = await generateVocabularyCard({
        word,
        provider: config.provider,
        apiKey: config.apiKey || undefined,
        baseUrl: config.baseUrl || undefined,
        modelName: config.modelName || undefined,
      });

      const lines = formatVocabularyCard(definition, config.customTags);

      await logseq.Editor.updateBlock(block.uuid, lines[0]);

      for (let i = 1; i < lines.length; i++) {
        await logseq.Editor.insertBlock(block.uuid, lines[i], {
          sibling: false,
        });
      }

      logseq.UI.showMsg('Vocabulary card generated!', 'success');
    } catch (error) {
      console.error('Failed to generate vocabulary card:', error);
      logseq.UI.showMsg(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
    }
  });
}

logseq.ready(main).catch(console.error);
