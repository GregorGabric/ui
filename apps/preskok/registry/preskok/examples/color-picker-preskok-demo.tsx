"use client"

import { useState } from "react"
import { parseColor } from "@react-stately/color"

import { ColorPicker } from "@/registry/preskok/ui/preskok-ui/color-picker"

export default function ColorPickerPreskokDemo() {
  const [color, setColor] = useState(parseColor("hsl(216, 98%, 52%)"))

  return (
    <div className="grid gap-3">
      <ColorPicker
        label="Brand color"
        value={color}
        onChange={setColor}
        description={color.toString("hex")}
        showArrow
      />
      <ColorPicker
        label="With eyedropper"
        defaultValue="hsl(42, 95%, 56%)"
        eyeDropper
        placement="right top"
      />
    </div>
  )
}
