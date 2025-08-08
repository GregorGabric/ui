"use client"

import { useState } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function CalendarPreskokDemo() {
  const [date, setDate] = useState(() => today(getLocalTimeZone()))

  return (
    <div className="flex justify-center">
      <Calendar value={date} onChange={setDate} aria-label="Select a date" />
    </div>
  )
}
