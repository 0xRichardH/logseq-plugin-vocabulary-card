import '@logseq/libs';
import { getSettingsSchema } from './logseq/settings';
import { formatVocabularyCard } from './logseq/blocks';
import { generateVocabularyCard } from './vocabulary/generator';
import { requiresApiKey, type ProviderName } from './vocabulary/providers';

function getActiveConfig() {
  const settings = (logseq.settings ?? {}) as Record<string, unknown>;
  const provider = (settings.provider ?? 'google') as ProviderName;

  // Construct keys dynamically
  const apiKeyKey = `${provider}ApiKey`;
  const baseUrlKey = `${provider}BaseUrl`;
  const modelKey = `${provider}Model`;

  return {
    provider,
    apiKey: (settings[apiKeyKey] as string) || undefined,
    baseUrl: (settings[baseUrlKey] as string) || undefined,
    modelName: (settings[modelKey] as string) || undefined,
    customTags: (settings.customTags ?? '#words') as string,
  };
}

async function main() {
  // Initial settings registration
  const { provider } = getActiveConfig();
  logseq.useSettingsSchema(getSettingsSchema(provider));

  // Dynamic settings update
  logseq.onSettingsChanged((newSettings, oldSettings) => {
    const previousProvider = oldSettings?.provider;
    if (newSettings.provider !== previousProvider) {
      logseq.useSettingsSchema(
        getSettingsSchema(newSettings.provider as ProviderName)
      );
    }
  });

  logseq.Editor.registerSlashCommand('Generate Vocabulary Card', async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (!block?.content) {
      logseq.UI.showMsg('No word found in current block', 'warning');
      return;
    }

    const word = block.content.trim();
    const config = getActiveConfig();

    // Validate API key
    if (requiresApiKey(config.provider) && !config.apiKey) {
      // Custom provider might have optional API key depending on the backend,
      // but if requiresApiKey says true, we generally enforce it.
      // However, for 'custom', the schema title says "Optional".
      // Let's relax the check for custom if it's truly optional.
      if (config.provider !== 'custom') {
        logseq.UI.showMsg(
          `Please configure ${config.provider} API key in settings`,
          'error'
        );
        return;
      }
    }

    // Validate Base URL
    if (config.provider === 'custom' && !config.baseUrl) {
      logseq.UI.showMsg('Base URL is required for custom provider', 'error');
      return;
    }

    // Validate Model Name for custom provider
    if (config.provider === 'custom' && !config.modelName) {
      logseq.UI.showMsg('Model name is required for custom provider', 'error');
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
