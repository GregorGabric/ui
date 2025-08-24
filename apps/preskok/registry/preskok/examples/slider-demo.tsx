"use client"

import { Slider } from "@/registry/preskok/ui/preskok-ui/slider"

export default function SliderDemo() {
  return (
    <Slider
      label="Engine Power"
      defaultValue={250}
      minValue={100}
      maxValue={500}
      step={10}
    />
  )
}
