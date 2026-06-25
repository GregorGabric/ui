"use client"

import { useState } from "react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { FileTrigger } from "@/registry/preskok/ui/preskok-ui/file-trigger"

export default function FileTriggerPreskokDemo() {
  const [selection, setSelection] = useState("No files selected")

  function handleSelect(files: FileList | null) {
    if (!files) {
      setSelection("No files selected")
      return
    }

    setSelection(
      Array.from(files)
        .map((file) => file.name)
        .join(", ")
    )
  }

  return (
    <div className="bg-background w-full max-w-4xl space-y-5 rounded-xl border p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <FileTrigger
          acceptedFileTypes={["image/png", "image/jpeg"]}
          onSelect={handleSelect}
        >
          Upload image
        </FileTrigger>
        <FileTrigger allowsMultiple onSelect={handleSelect}>
          Upload multiple
        </FileTrigger>
        <FileTrigger acceptDirectory onSelect={handleSelect}>
          Upload folder
        </FileTrigger>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <FileTrigger
          defaultCamera="environment"
          acceptedFileTypes={["image/*"]}
          onSelect={handleSelect}
          isCircle
          size="sq-md"
          aria-label="Open camera"
        />
        <FileTrigger
          acceptedFileTypes={["image/png", "image/jpeg"]}
          onSelect={handleSelect}
          intent="plain"
          className="px-0"
        >
          <Avatar initials="MC" alt="Maya Chen" size="sm" />
          Replace avatar
        </FileTrigger>
      </div>

      <div className="flex flex-wrap gap-3">
        <FileTrigger isPending>Scanning files</FileTrigger>
        <FileTrigger isDisabled>Locked</FileTrigger>
      </div>

      <p className="text-muted-foreground text-sm text-pretty">{selection}</p>
    </div>
  )
}
