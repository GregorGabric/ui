"use client"

import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function Calendar05() {
  const [dateRange, setDateRange] = React.useState<RangeValue<CalendarDate>>(
    () => ({
      start: parseDate("2025-06-12"),
      end: parseDate("2025-07-15"),
    })
  )

  return (
    <div className="inline-block rounded-lg border shadow-sm">
      <RangeCalendar
        value={dateRange}
        onChange={setDateRange}
        visibleDuration={{ months: 2 }}
      />
    </div>
  )
}
