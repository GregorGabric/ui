"use client"

import { Editor } from "@/registry/preskok/ui/preskok-ui/editor/editor"

const starterContent = `
<h2>Preskok Editor</h2>
<p>Draft a product update with headings, lists, and links.</p>
<ul>
  <li>Highlight the release name and date.</li>
  <li>Call out the top three improvements.</li>
  <li>Link to the full changelog.</li>
</ul>
<blockquote>Tip: Select text to reveal formatting tools.</blockquote>
<p><a href="https://preskok.com" rel="noopener noreferrer" target="_blank">Visit preskok.com</a></p>
`

export default function EditorDemo() {
  return (
    <div className="w-full max-w-2xl">
      <Editor
        value={starterContent}
        placeholder="Start writing..."
        className="min-h-[320px]"
        editorContentClassName="min-h-[240px]"
      />
    </div>
  )
}
