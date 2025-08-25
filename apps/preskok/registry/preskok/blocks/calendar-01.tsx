"use client"

import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar01() {
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )

  return (
    <div className="inline-block rounded-lg border shadow-sm">
      <Calendar value={date} onChange={setDate} defaultValue={date} />
    </div>
  )
}
