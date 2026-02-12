"use client"

import { ColorField } from "@/registry/preskok/ui/preskok-ui/color-field"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"

export default function ColorFieldPreskokDemo() {
  return (
    <ColorField>
      <Label>Color</Label>
      <Input placeholder="#000" />
    </ColorField>
  )
}
