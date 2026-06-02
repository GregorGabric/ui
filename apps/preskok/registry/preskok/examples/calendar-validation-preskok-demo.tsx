"use client"

import { useState } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components/Calendar"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function CalendarValidationPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const [date, setDate] = useState(() => today(timeZone).add({ days: 1 }))
  const minBookingDate = today(timeZone)
  const maxBookingDate = minBookingDate.add({ days: 21 })

  const isWeekend = (value: DateValue) => {
    const day = value.toDate(timeZone).getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="space-y-3">
      <Calendar
        value={date}
        onChange={setDate}
        minValue={minBookingDate}
        maxValue={maxBookingDate}
        isDateUnavailable={isWeekend}
        aria-label="Validated booking date"
      />
      <p className="text-muted-foreground text-sm">
        Select a weekday within the next 21 days.
      </p>
    </div>
  )
}
