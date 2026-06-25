"use client"

import { parseDate } from "@internationalized/date"

import {
  DateField,
  DateInput,
} from "@/registry/preskok/ui/preskok-ui/date-field"
import {
  Description,
  FieldError,
  Label,
} from "@/registry/preskok/ui/preskok-ui/field"

export default function DateFieldDemo() {
  return (
    <div className="grid gap-4">
      <DateField
        defaultValue={parseDate("2026-07-18")}
        minValue={parseDate("2026-07-01")}
        maxValue={parseDate("2026-08-31")}
        isRequired
      >
        <Label>Launch date</Label>
        <Description>Choose a date in the approved summer window.</Description>
        <DateInput />
        <FieldError />
      </DateField>
      <DateField defaultValue={parseDate("2026-07-18")} isReadOnly>
        <Label>Read-only date</Label>
        <DateInput />
      </DateField>
    </div>
  )
}
