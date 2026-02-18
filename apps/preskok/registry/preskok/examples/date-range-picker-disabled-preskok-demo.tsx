"use client"

import { parseDate } from "@internationalized/date"

import {
  DateRangePicker,
  DateRangePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-range-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function DateRangePickerDisabledPreskokDemo() {
  return (
    <div className="max-w-xs">
      <DateRangePicker
        isDisabled
        defaultValue={{
          start: parseDate("2026-05-03"),
          end: parseDate("2026-05-07"),
        }}
      >
        <Label>Closed period</Label>
        <DateRangePickerTrigger />
      </DateRangePicker>
    </div>
  )
}
