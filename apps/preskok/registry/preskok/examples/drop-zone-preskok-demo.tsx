"use client"

import { useState } from "react"

import { DropZone } from "@/registry/preskok/ui/preskok-ui/drop-zone"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function DropZonePreskokDemo() {
  const [dropped, setDropped] = useState(false)
  return (
    <DropZone onDrop={() => setDropped(true)}>
      <Label>{dropped ? "Dropped" : "Drop your files here"}</Label>
    </DropZone>
  )
}
