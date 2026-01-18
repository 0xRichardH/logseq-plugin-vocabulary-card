import '@logseq/libs';
import { settingsSchema } from './logseq/settings';
import { formatVocabularyCard } from './logseq/blocks';
import { generateVocabularyCard } from './vocabulary/generator';
import type { ProviderName } from './vocabulary/providers';

async function main() {
  logseq.useSettingsSchema(settingsSchema);

  logseq.Editor.registerSlashCommand('Generate Vocabulary Card', async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (!block?.content) {
      logseq.UI.showMsg('No word found in current block', 'warning');
      return;
    }

    const word = block.content.trim();
    const settings = logseq.settings;
    const provider = (settings?.provider ?? 'google') as ProviderName;
    const apiKey = settings?.apiKey as string;
    const customTags = (settings?.customTags ?? '#words') as string;

    if (!apiKey) {
      logseq.UI.showMsg('Please configure your API key in settings', 'error');
      return;
    }

    try {
      logseq.UI.showMsg(`Generating card for "${word}"...`, 'info');

      const definition = await generateVocabularyCard(word, provider, apiKey);
      const lines = formatVocabularyCard(definition, customTags);

      await logseq.Editor.updateBlock(block.uuid, lines[0]);

      for (let i = 1; i < lines.length; i++) {
        await logseq.Editor.insertBlock(block.uuid, lines[i], { sibling: false });
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
