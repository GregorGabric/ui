"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { getLocalTimeZone, parseDate } from "@internationalized/date"
import type { RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function Calendar07() {
  const [range, setRange] = React.useState<RangeValue<CalendarDate>>(() => ({
    start: parseDate("2025-06-18"),
    end: parseDate("2025-07-07"),
  }))

  const getNights = (value: RangeValue<CalendarDate>) => {
    if (!value || !value.start || !value.end) return 0
    const tz = getLocalTimeZone()
    const start = value.start.toDate(tz)
    const end = value.end.toDate(tz)
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000))
  }

  const nights = getNights(range)

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="inline-block rounded-lg border shadow-sm">
        <RangeCalendar
          value={range}
          onChange={setRange}
          visibleDuration={{ months: 2 }}
          errorMessage={
            nights > 0 && (nights < 2 || nights > 20)
              ? "Your stay must be between 2 and 20 nights"
              : undefined
          }
        />
      </div>
      <div className="text-muted-foreground text-center text-xs">
        Your stay must be between 2 and 20 nights
      </div>
    </div>
  )
}
