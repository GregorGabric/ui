"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function Calendar21() {
  const [range, setRange] = React.useState<RangeValue<CalendarDate>>(() => ({
    start: parseDate("2025-06-12"),
    end: parseDate("2025-06-17"),
  }))

  return (
    <div className="inline-block rounded-lg border shadow-sm">
      {/* Custom day content (price labels) is not supported in Preskok UI calendar */}
      <RangeCalendar value={range} onChange={setRange} />
    </div>
  )
}
