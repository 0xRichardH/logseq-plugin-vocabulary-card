import * as wasm from "logseq-plugin-vocabulary-card";
import "@logseq/libs"

async function main() {
  logseq.App.showMsg("hello world")

  logseq.Editor.registerSlashCommand(
    '💥 Big Bang',
    async () => {
      const { content, uuid } = await logseq.Editor.getCurrentBlock()
      const text = wasm.greet(content)

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
