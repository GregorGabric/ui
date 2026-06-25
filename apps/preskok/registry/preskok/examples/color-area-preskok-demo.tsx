"use client"

import { ColorArea } from "@/registry/preskok/ui/preskok-ui/color-area"
import { ColorField } from "@/registry/preskok/ui/preskok-ui/color-field"
import { ColorSlider } from "@/registry/preskok/ui/preskok-ui/color-slider"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"

export default function ColorAreaPreskokDemo() {
  return (
    <div className="grid gap-3">
      <ColorArea
        defaultValue="hsb(216, 98%, 68%)"
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
      />
      <ColorSlider
        defaultValue="hsb(216, 98%, 68%)"
        colorSpace="hsb"
        channel="hue"
        label="Hue"
      />
      <ColorField defaultValue="hsb(216, 98%, 68%)" aria-label="Hex">
        <Input placeholder="#000000" />
      </ColorField>
    </div>
  )
}
