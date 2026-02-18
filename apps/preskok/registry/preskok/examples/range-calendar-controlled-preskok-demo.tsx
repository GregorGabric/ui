"use client"

import { useState } from "react"
import type { CalendarDate } from "@internationalized/date"
import { getLocalTimeZone, parseDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function RangeCalendarControlledPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const [range, setRange] = useState<RangeValue<CalendarDate> | null>(() => ({
    start: parseDate("2026-04-10"),
    end: parseDate("2026-04-16"),
  }))

  const selectedRange =
    range?.start && range?.end
      ? `${range.start.toDate(timeZone).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })} - ${range.end.toDate(timeZone).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })}`
      : "No range selected"

  return (
    <div className="space-y-3">
      <RangeCalendar
        value={range}
        onChange={setRange}
        aria-label="Controlled trip dates"
      />
      <p className="text-muted-foreground text-sm">Selected: {selectedRange}</p>
    </div>
  )
}
