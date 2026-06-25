"use client"

import { ColorSlider } from "@/registry/preskok/ui/preskok-ui/color-slider"

export default function ColorSliderPreskokDemo() {
  return (
    <div className="grid gap-5">
      <ColorSlider
        label="Hue"
        channel="hue"
        defaultValue="hsl(216, 98%, 52%)"
      />
      <ColorSlider
        label="Opacity"
        channel="alpha"
        defaultValue="hsla(216, 98%, 52%, 0.65)"
      />
      <ColorSlider
        label="Brightness"
        colorSpace="hsb"
        channel="brightness"
        defaultValue="hsb(216, 98%, 68%)"
      />
    </div>
  )
}
