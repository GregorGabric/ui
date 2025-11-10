"use client"

import {
  DateField,
  DateInput,
} from "@/registry/preskok/ui/preskok-ui/date-field"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function DateFieldDemo() {
  return (
    <DateField>
      <Label>Event date</Label>
      <DateInput />
    </DateField>
  )
}
