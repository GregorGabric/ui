"use client"

import { useState } from "react"
import type { CalendarDate } from "@internationalized/date"
import { getLocalTimeZone, parseDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components/DateRangePicker"

import {
  DateRangePicker,
  DateRangePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-range-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function DateRangePickerControlledPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const [range, setRange] = useState<RangeValue<CalendarDate> | null>(() => ({
    start: parseDate("2026-04-08"),
    end: parseDate("2026-04-14"),
  }))

  const selectedRange =
    range?.start && range?.end
      ? `${range.start.toDate(timeZone).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })} - ${range.end.toDate(timeZone).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`
      : "No range selected"

  return (
    <div className="max-w-xs space-y-3">
      <DateRangePicker
        value={range}
        onChange={setRange}
        visibleDuration={{ months: 2 }}
      >
        <Label>Event date</Label>
        <DateRangePickerTrigger />
      </DateRangePicker>
      <p className="text-muted-foreground text-sm">Selected: {selectedRange}</p>
    </div>
  )
}
