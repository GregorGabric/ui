"use client"

import { FileTrigger } from "@/registry/preskok/ui/preskok-ui/file-trigger"

export default function FileTriggerPreskokDemo() {
  return (
    <div className="flex items-center gap-3">
      <FileTrigger onSelect={() => {}}>Upload file</FileTrigger>
      <FileTrigger allowsMultiple onSelect={() => {}}>
        Upload multiple
      </FileTrigger>
    </div>
  )
}
