"use client"

import { useState } from "react"
import type { CalendarDate } from "@internationalized/date"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue, RangeValue } from "react-aria-components"

import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function RangeCalendarValidationPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const [range, setRange] = useState<RangeValue<CalendarDate> | null>(() => ({
    start: today(timeZone).add({ days: 2 }),
    end: today(timeZone).add({ days: 5 }),
  }))
  const minTripDate = today(timeZone)
  const maxTripDate = minTripDate.add({ months: 2 })

  const isWeekend = (value: DateValue) => {
    const day = value.toDate(timeZone).getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="space-y-3">
      <RangeCalendar
        value={range}
        onChange={setRange}
        minValue={minTripDate}
        maxValue={maxTripDate}
        isDateUnavailable={isWeekend}
        aria-label="Validated trip dates"
      />
      <p className="text-muted-foreground text-sm">
        Range must stay within 2 months and excludes weekends.
      </p>
    </div>
  )
}
