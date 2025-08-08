"use client"

import { ColorField } from "@/registry/preskok/ui/preskok-ui/color-field"

export default function ColorFieldPreskokDemo() {
  return (
    <ColorField
      label="Brand color"
      placeholder="#2563eb"
      defaultValue="#2563eb"
      description="Choose a hex color."
    />
  )
}
