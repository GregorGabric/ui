"use client"

import { useState } from "react"
import { parseColor } from "@react-stately/color"

import { ColorSwatch } from "@/registry/preskok/ui/preskok-ui/color-swatch"
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "@/registry/preskok/ui/preskok-ui/color-swatch-picker"

export default function ColorSwatchPreskokDemo() {
  const [value, setValue] = useState(() => parseColor("#000000"))

  return (
    <ColorSwatchPicker
      aria-label="Pick color"
      value={value}
      onChange={setValue}
      className="grid grid-cols-3 gap-2 lg:grid-cols-6"
    >
      <ColorSwatchPickerItem color="#ffffff">
        <ColorSwatch />
      </ColorSwatchPickerItem>
      <ColorSwatchPickerItem color="#f59e0b">
        <ColorSwatch />
      </ColorSwatchPickerItem>
      <ColorSwatchPickerItem color="#84cc16">
        <ColorSwatch />
      </ColorSwatchPickerItem>
      <ColorSwatchPickerItem color="#000000">
        <ColorSwatch />
      </ColorSwatchPickerItem>
      <ColorSwatchPickerItem color="#ec4899">
        <ColorSwatch />
      </ColorSwatchPickerItem>
      <ColorSwatchPickerItem color="#f43f5e">
        <ColorSwatch />
      </ColorSwatchPickerItem>
    </ColorSwatchPicker>
  )
}
