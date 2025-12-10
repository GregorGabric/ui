"use client"

import {
  DateRangePicker,
  DateRangePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-range-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export function Component() {
  return (
    <div className="max-w-xs">
      <DateRangePicker visibleDuration={{ months: 2 }}>
        <Label>Event date</Label>
        <DateRangePickerTrigger />
      </DateRangePicker>
    </div>
  )
}
