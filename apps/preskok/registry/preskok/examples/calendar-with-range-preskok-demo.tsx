"use client"

import { parseDate } from "@internationalized/date"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function CalendarWithRangePreskokDemo() {
  return (
    <RangeCalendar
      defaultValue={{
        start: parseDate("2026-04-10"),
        end: parseDate("2026-04-16"),
      }}
      aria-label="Select date range"
    />
  )
}
