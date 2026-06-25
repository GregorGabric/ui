"use client"

import { useState } from "react"

import {
  Description,
  FieldError,
  Label,
} from "@/registry/preskok/ui/preskok-ui/field"
import {
  NumberField,
  NumberInput,
} from "@/registry/preskok/ui/preskok-ui/number-field"

export default function NumberFieldPreskokDemo() {
  const [seats, setSeats] = useState(12)

  return (
    <div className="grid w-full max-w-sm gap-4">
      <NumberField
        value={seats}
        onChange={setSeats}
        minValue={1}
        maxValue={100}
        step={1}
        isRequired
      >
        <Label>Team seats</Label>
        <Description>Use steppers or type a value from 1 to 100.</Description>
        <NumberInput />
        <FieldError />
      </NumberField>
      <NumberField
        defaultValue={49}
        minValue={0}
        step={5}
        formatOptions={{ style: "currency", currency: "USD" }}
      >
        <Label>Monthly add-on budget</Label>
        <NumberInput />
      </NumberField>
    </div>
  )
}
