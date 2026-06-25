"use client"

import { ColorWheel } from "@/registry/preskok/ui/preskok-ui/color-wheel"

export default function ColorWheelPreskokDemo() {
  return (
    <div className="grid gap-4">
      <ColorWheel defaultValue="hsl(216, 98%, 52%)" aria-label="Hue" />
      <ColorWheel
        defaultValue="hsl(42, 95%, 56%)"
        isDisabled
        aria-label="Hue"
      />
    </div>
  )
}
