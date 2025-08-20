"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function Calendar11() {
  const [range, setRange] = React.useState<RangeValue<CalendarDate>>(() => ({
    start: parseDate("2025-06-17"),
    end: parseDate("2025-06-20"),
  }))

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="inline-block rounded-lg border shadow-sm">
        <RangeCalendar
          value={range}
          onChange={setRange}
          visibleDuration={{ months: 2 }}
          minValue={parseDate("2025-06-01")}
          maxValue={parseDate("2025-07-31")}
        />
      </div>
      <div className="text-muted-foreground text-center text-xs">
        We are open in June and July only.
      </div>
    </div>
  )
}
