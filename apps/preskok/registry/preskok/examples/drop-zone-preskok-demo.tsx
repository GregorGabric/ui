"use client"

import { useState } from "react"

import { DropZone } from "@/registry/preskok/ui/preskok-ui/drop-zone"
import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function DropZonePreskokDemo() {
  const [message, setMessage] = useState("Drop files here")

  return (
    <DropZone
      getDropOperation={(types) => {
        if (types.has("image/png") || types.has("image/jpeg")) {
          return "copy"
        }

        return "cancel"
      }}
      onDrop={() => setMessage("Image files accepted")}
    >
      <Label>{message}</Label>
      <Description>
        PNG and JPEG files are accepted; other types are rejected.
      </Description>
    </DropZone>
  )
}
