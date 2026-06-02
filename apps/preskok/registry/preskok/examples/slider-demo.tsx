"use client"

import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  Slider,
  SliderOutput,
  SliderTrack,
} from "@/registry/preskok/ui/preskok-ui/slider"

export default function SliderDemo() {
  return (
    <Slider defaultValue={250} minValue={100} maxValue={500} step={10}>
      <div className="flex items-center justify-between">
        <Label>Engine Power</Label>
        <SliderOutput />
      </div>
      <SliderTrack />
    </Slider>
  )
}
