"use client"

import { ColorPicker } from "@/registry/preskok/ui/preskok-ui/color-picker"

export default function ColorPickerPreskokDemo() {
  return (
    <div className="flex flex-col gap-2">
      <ColorPicker label="Pick color" defaultValue="hsl(216, 98%, 52%)" />
      <ColorPicker label="With Eyedropper" eyeDropper />
    </div>
  )
}
