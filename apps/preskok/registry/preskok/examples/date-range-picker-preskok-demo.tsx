"use client"

import {
  DateRangePicker,
  DateRangePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-range-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export function Component() {
  return (
    <DateRangePicker>
      <Label>Event date</Label>
      <DateRangePickerTrigger />
    </DateRangePicker>
  )
}
