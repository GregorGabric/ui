"use client"

import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function Calendar04() {
  const [dateRange, setDateRange] = React.useState<RangeValue<CalendarDate>>(
    () => ({
      start: parseDate("2025-06-09"),
      end: parseDate("2025-06-26"),
    })
  )

  return (
    <div className="inline-block rounded-lg border shadow-sm">
      <RangeCalendar value={dateRange} onChange={setDateRange} />
    </div>
  )
}
