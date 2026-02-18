"use client"

import { parseDate } from "@internationalized/date"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function CalendarMultipleMonthsPreskokDemo() {
  return (
    <RangeCalendar
      defaultValue={{
        start: parseDate("2026-04-10"),
        end: parseDate("2026-04-18"),
      }}
      visibleDuration={{ months: 2 }}
      aria-label="Select trip dates"
    />
  )
}
