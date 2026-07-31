"use client"

import { useState } from "react"
import { parseColor, type Color } from "react-stately/Color"

import { ColorField } from "@/registry/preskok/ui/preskok-ui/color-field"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"

export default function ColorFieldPreskokDemo() {
  const [color, setColor] = useState(parseColor("#1d4ed8"))

  function handleColorChange(value: Color | null) {
    if (value) {
      setColor(value)
    }
  }

  return (
    <div className="grid gap-4">
      <ColorField value={color} onChange={handleColorChange}>
        <Label>Hex</Label>
        <Input placeholder="#000000" />
      </ColorField>
      <div className="grid gap-3 sm:grid-cols-3">
        <ColorField
          value={color}
          onChange={handleColorChange}
          colorSpace="hsl"
          channel="hue"
        >
          <Label>Hue</Label>
          <Input />
        </ColorField>
        <ColorField
          value={color}
          onChange={handleColorChange}
          colorSpace="hsl"
          channel="saturation"
        >
          <Label>Saturation</Label>
          <Input />
        </ColorField>
        <ColorField
          value={color}
          onChange={handleColorChange}
          colorSpace="hsl"
          channel="lightness"
        >
          <Label>Lightness</Label>
          <Input />
        </ColorField>
      </div>
      <p className="text-muted-foreground text-sm">
        Current value: {color.toString("hex")}
      </p>
    </div>
  )
}
