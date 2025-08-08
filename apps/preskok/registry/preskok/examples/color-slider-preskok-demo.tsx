"use client"

import { ColorPicker } from "@/registry/preskok/ui/preskok-ui/color-picker"
import { ColorSlider } from "@/registry/preskok/ui/preskok-ui/color-slider"

export default function ColorSliderPreskokDemo() {
  return (
    <ColorPicker defaultValue="hsl(216, 98%, 52%)">
      <ColorSlider channel="hue" label="Hue" />
    </ColorPicker>
  )
}
