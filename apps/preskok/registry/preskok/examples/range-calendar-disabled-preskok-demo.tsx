"use client"

import { parseDate } from "@internationalized/date"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function RangeCalendarDisabledPreskokDemo() {
  return (
    <RangeCalendar
      defaultValue={{
        start: parseDate("2026-05-03"),
        end: parseDate("2026-05-08"),
      }}
      isDisabled
      aria-label="Disabled trip dates"
    />
  )
}
