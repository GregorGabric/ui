"use client"

import { useState } from "react"
import { parseColor } from "@react-stately/color"

import { ColorSwatchPicker } from "@/registry/preskok/ui/preskok-ui/color-swatch-picker"

export default function ColorSwatchPickerPreskokDemo() {
  const [value, setValue] = useState(parseColor("#0d6efd"))
  return (
    <ColorSwatchPicker
      aria-label="Pick color"
      value={value}
      onChange={setValue}
      className="grid grid-cols-3 gap-2 lg:grid-cols-6"
    >
      <ColorSwatchPicker.Item color="#3b83f614" />
      <ColorSwatchPicker.Item color="#10b981" />
      <ColorSwatchPicker.Item color="#f97316" />
      <ColorSwatchPicker.Item color="#8b5cf6" />
      <ColorSwatchPicker.Item color="#ef4444" />
      <ColorSwatchPicker.Item color="#6366f1" />
    </ColorSwatchPicker>
  )
}
