"use client"

import { useState } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function CalendarMinMaxPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const minDate = today(timeZone)
  const maxDate = minDate.add({ months: 3 })
  const [date, setDate] = useState(() => minDate)

  return (
    <Calendar
      value={date}
      onChange={setDate}
      minValue={minDate}
      maxValue={maxDate}
      aria-label="Select future date"
    />
  )
}
