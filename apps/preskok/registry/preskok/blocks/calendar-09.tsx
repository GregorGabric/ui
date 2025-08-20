"use client"

import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function Calendar09() {
  const [range, setRange] = React.useState<RangeValue<CalendarDate>>(() => ({
    start: parseDate("2025-06-17"),
    end: parseDate("2025-06-20"),
  }))

  const isWeekend = (d: CalendarDate) => d.dayOfWeek === 0 || d.dayOfWeek === 6

  return (
    <div className="inline-block rounded-lg border shadow-sm">
      <RangeCalendar
        value={range}
        onChange={setRange}
        visibleDuration={{ months: 2 }}
        isDateUnavailable={isWeekend}
      />
    </div>
  )
}
