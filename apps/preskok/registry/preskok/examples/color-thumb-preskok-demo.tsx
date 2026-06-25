"use client"

import { ColorArea } from "@/registry/preskok/ui/preskok-ui/color-area"

export default function ColorThumbPreskokDemo() {
  return (
    <ColorArea
      defaultValue="hsb(216, 98%, 68%)"
      colorSpace="hsb"
      xChannel="saturation"
      yChannel="brightness"
    />
  )
}
