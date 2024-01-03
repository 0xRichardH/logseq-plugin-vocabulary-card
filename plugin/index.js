import * as wasm from "logseq-plugin-vocabulary-card";
import "@logseq/libs"

async function main() {
  logseq.useSettingsSchema([{
    key: "gemini_ai_api_key",
    description: "Gemini AI API Key",
    type: "string",
    default: "",
    title: "API key for Gemini AI, you can get it from https://ai.google.dev/",
  }, {
    key: "custom_tags",
    description: "Custom tags",
    type: "string",
    default: "#words",
    title: "Custom tags for vocabulary card",
  }])

  logseq.Editor.registerSlashCommand(
    '📙 Generate Vocabulary Card',
    async () => {
      const gemini_ai_api_key = logseq.settings["gemini_ai_api_key"]
      if (!gemini_ai_api_key) {
        logseq.App.showMsg("Please set Gemini AI API Key first")
        return
      }
      const custom_tags = logseq.settings["custom_tags"]

      const { content, uuid } = await logseq.Editor.getCurrentBlock()
      await logseq.Editor.updateBlock(uuid, `${content} loading...`);

      try {
        const word = await wasm.define_word(content, gemini_ai_api_key)
        await logseq.Editor.updateBlock(uuid, `${word.word} #card ${custom_tags}`);
        await logseq.Editor.insertBlock(uuid, `*${word.pronunciation}*`, { before: false, sibling: false, focus: false, isPageBlock: false })
        await logseq.Editor.insertBlock(uuid, `**${word.definition}**`, { before: false, sibling: false, focus: false, isPageBlock: false })
        await logseq.Editor.insertBlock(uuid, `**Examples:**`, { before: false, sibling: false, focus: false, isPageBlock: false })
        await logseq.Editor.insertBlock(uuid, `${word.examples[0]}`, { before: false, sibling: false, focus: false, isPageBlock: false })
        await logseq.Editor.insertBlock(uuid, `${word.examples[1]}`, { before: false, sibling: false, focus: false, isPageBlock: false })
      } catch (e) {
        logseq.App.showMsg("Failed to generate vocabulary card." + e)
      }
    },
  )
}

// bootstrap
logseq.ready(main).catch(console.error)
