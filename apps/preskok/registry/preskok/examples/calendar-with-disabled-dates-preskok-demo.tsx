"use client"

import { useState } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components/Calendar"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function CalendarWithDisabledDatesPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const [date, setDate] = useState(() => today(timeZone))

  const isDateUnavailable = (value: DateValue) => {
    const day = value.toDate(timeZone).getDay()
    return day === 0 || day === 6
  }

  return (
    <Calendar
      value={date}
      onChange={setDate}
      isDateUnavailable={isDateUnavailable}
      aria-label="Select a weekday"
    />
  )
}
