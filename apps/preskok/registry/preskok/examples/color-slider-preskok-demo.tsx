"use client"

import { ColorSlider } from "@/registry/preskok/ui/preskok-ui/color-slider"

export default function ColorSliderPreskokDemo() {
  return (
    <ColorSlider
      label="Fill color"
      channel="hue"
      defaultValue="hsl(0, 100%, 50%)"
    />
  )
}
