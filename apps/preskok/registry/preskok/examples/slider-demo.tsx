"use client"

import { useState } from "react"

import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  Slider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "@/registry/preskok/ui/preskok-ui/slider"

export default function SliderDemo() {
  const [currentValue, setCurrentValue] = useState(42)
  const [finalValue, setFinalValue] = useState(42)

  function handleChange(value: number | number[]) {
    if (!Array.isArray(value)) {
      setCurrentValue(value)
    }
  }

  function handleChangeEnd(value: number | number[]) {
    if (!Array.isArray(value)) {
      setFinalValue(value)
    }
  }

  return (
    <div className="grid w-full max-w-md gap-6">
      <Slider
        value={currentValue}
        onChange={handleChange}
        onChangeEnd={handleChangeEnd}
        minValue={0}
        maxValue={100}
        step={1}
      >
        <div className="flex items-center justify-between">
          <Label>Rollout percentage</Label>
          <SliderOutput />
        </div>
        <SliderTrack />
      </Slider>
      <p className="-mt-4 text-sm text-muted-foreground">
        Current {currentValue}% / committed {finalValue}%
      </p>
      <Slider defaultValue={[20, 80]} minValue={0} maxValue={100} step={5}>
        <div className="flex items-center justify-between">
          <Label>Budget range</Label>
          <SliderOutput />
        </div>
        <SliderTrack>
          <SliderFill />
          <SliderThumb index={0} aria-label="Minimum budget" />
          <SliderThumb index={1} aria-label="Maximum budget" />
        </SliderTrack>
      </Slider>
    </div>
  )
}
