"use client"

import { useState } from "react"
import { parseColor } from "react-stately/Color"

import { ColorSwatch } from "@/registry/preskok/ui/preskok-ui/color-swatch"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/preskok/ui/preskok-ui/color-swatch-picker"

export default function ColorSwatchPreskokDemo() {
  const [value, setValue] = useState(() => parseColor("#2563eb"))

  return (
    <div className="grid gap-3">
      <ColorSwatchPicker
        aria-label="Pick color"
        value={value}
        onChange={setValue}
        className="grid grid-cols-4 gap-2 sm:grid-cols-7"
      >
        {colors.map((color) => (
          <ColorSwatchPickerItem
            key={color.value}
            color={color.value}
            isDisabled={color.isDisabled}
          >
            <ColorSwatch />
          </ColorSwatchPickerItem>
        ))}
      </ColorSwatchPicker>
      <p className="text-sm text-muted-foreground">
        Selected: {value.toString("hex")}
      </p>
    </div>
  )
}

const colors = [
  { value: "#ffffff" },
  { value: "#111827" },
  { value: "#2563eb" },
  { value: "#16a34a" },
  { value: "#f59e0b" },
  { value: "#dc2626" },
  { value: "#9333ea", isDisabled: true },
]
