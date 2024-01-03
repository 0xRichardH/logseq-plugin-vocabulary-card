import * as wasm from "logseq-plugin-vocabulary-card";
import "@logseq/libs"

async function main() {
  logseq.useSettingsSchema([{
    key: "gemini_ai_api_key",
    description: "Gemini AI API Key",
    type: "string",
    default: "",
    title: "API key for Gemini AI, you can get it from https://ai.google.dev/",
  }])

  logseq.App.showMsg("hello world")

  logseq.Editor.registerSlashCommand(
    '📙 Generate Vocabulary Card',
    async () => {
      const gemini_ai_api_key = logseq.settings["gemini_ai_api_key"]
      if (!gemini_ai_api_key) {
        logseq.App.showMsg("Please set Gemini AI API Key first")
        return
      }

      const { content, uuid } = await logseq.Editor.getCurrentBlock()
      const word = await wasm.define_word(content, gemini_ai_api_key)
      const text = word.definition;

      console.log(word.pronunciation);

      logseq.App.showMsg(`
        [:div.p-2
          [:h1 "#${uuid}"]
          [:h2.text-xl "${text}"]]
      `)
    },
  )
}

// bootstrap
logseq.ready(main).catch(console.error)
