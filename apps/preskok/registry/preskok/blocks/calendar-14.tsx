"use client"

import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar14() {
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )
  const pad2 = (n: number) => String(n).padStart(2, "0")
  const bookedDateKeys = new Set(
    Array.from({ length: 12 }, (_, i) => `2025-06-${pad2(15 + i)}`)
  )

  const isBooked = (d: CalendarDate) =>
    bookedDateKeys.has(`${d.year}-${pad2(d.month)}-${pad2(d.day)}`)

  return (
    <div className="inline-block rounded-lg border shadow-sm">
      <Calendar value={date} onChange={setDate} isDateUnavailable={isBooked} />
    </div>
  )
}
