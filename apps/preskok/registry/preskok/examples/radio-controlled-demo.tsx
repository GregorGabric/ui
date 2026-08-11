"use client"

import { useState } from "react"

import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"

export default function RadioControlledDemo() {
  const [selected, setSelected] = useState("")

  return (
    <div className="flex flex-col gap-2">
      <RadioGroup
        value={selected}
        onChange={setSelected}
        className="flex flex-col"
      >
        <Label>Body style</Label>
        <Radio value="sedan">Sedan</Radio>
        <Radio value="suv">SUV</Radio>
        <Radio value="coupe">Coupe</Radio>
        <Radio value="hatchback">Hatchback</Radio>
        <Radio value="truck">Truck</Radio>
      </RadioGroup>

      <Description className="block [&>strong]:text-foreground">
        Selected body style: <strong>{selected || "-"}</strong>
      </Description>
    </div>
  )
}
