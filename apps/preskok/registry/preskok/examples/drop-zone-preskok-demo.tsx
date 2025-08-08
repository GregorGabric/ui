"use client"

import { DropZone } from "@/registry/preskok/ui/preskok-ui/drop-zone"

export default function DropZonePreskokDemo() {
  return (
    <DropZone onDrop={() => {}}>
      <div slot="label">Drag and drop files here</div>
      <div slot="description">or click to select files</div>
    </DropZone>
  )
}
