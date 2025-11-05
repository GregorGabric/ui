"use client"

import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  NumberField,
  NumberInput,
} from "@/registry/preskok/ui/preskok-ui/number-field"

export default function NumberFieldPreskokDemo() {
  return (
    <NumberField>
      <Label>Cookies</Label>
      <NumberInput />
    </NumberField>
  )
}
