"use client"

import { useState } from "react"
import { parseColor } from "@react-stately/color"

import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/preskok/ui/preskok-ui/color-swatch-picker"

export default function ColorSwatchPickerPreskokDemo() {
  const [value, setValue] = useState(parseColor("#0d6efd"))
  return (
    <ColorSwatchPicker
      aria-label="Pick color"
      value={value}
      onChange={setValue}
      className="grid grid-cols-3 gap-2 lg:grid-cols-6"
    >
      <ColorSwatchPickerItem color="#3b83f614" />
      <ColorSwatchPickerItem color="#10b981" />
      <ColorSwatchPickerItem color="#f97316" />
      <ColorSwatchPickerItem color="#8b5cf6" />
      <ColorSwatchPickerItem color="#ef4444" />
      <ColorSwatchPickerItem color="#6366f1" />
    </ColorSwatchPicker>
  )
}
