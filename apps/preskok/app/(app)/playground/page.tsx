"use client"

import { Editor } from "@/registry/preskok/ui/preskok-ui/editor/editor"

export default function PlaygroundPage() {
  return (
    <div className="flex h-screen w-screen flex-1 flex-col">
      <div className="flex max-w-7xl flex-1 flex-col p-20">
        <Editor />
      </div>
    </div>
  )
}
