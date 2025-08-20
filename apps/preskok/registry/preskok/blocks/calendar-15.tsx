"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar15() {
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )

  return (
    <div className="inline-block rounded-lg border shadow-sm">
      {/* Week numbers are not supported by Preskok UI calendar */}
      <Calendar value={date} onChange={setDate} />
    </div>
  )
}
