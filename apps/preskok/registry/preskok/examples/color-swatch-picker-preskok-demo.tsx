"use client"

import { ColorSwatchPicker } from "@/registry/preskok/ui/preskok-ui/color-swatch-picker"

export default function ColorSwatchPickerPreskokDemo() {
  return (
    <ColorSwatchPicker aria-label="Accent color">
      {Array.from({ length: 5 }).map((_, i) => (
        <ColorSwatchPicker.Item key={i} />
      ))}
    </ColorSwatchPicker>
  )
}
