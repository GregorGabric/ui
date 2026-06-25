"use client"

import { ColorSwatch } from "@/registry/preskok/ui/preskok-ui/color-swatch"

export default function ColorSwatchPreskokDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ColorSwatch color="#ffffff" aria-label="White" />
      <ColorSwatch color="#2563eb" aria-label="Blue" />
      <ColorSwatch color="#14b8a6" aria-label="Teal" />
      <ColorSwatch color="#111827" aria-label="Slate" />
    </div>
  )
}
