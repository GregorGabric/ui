"use client"

import { useState } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components/Calendar"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function CalendarControlledPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const [date, setDate] = useState(() => today(timeZone))

  const selectedDate = (value: DateValue | null | undefined) =>
    value?.toDate(timeZone).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) ?? "No date selected"

  return (
    <div className="space-y-3">
      <Calendar value={date} onChange={setDate} aria-label="Controlled date" />
      <p className="text-sm text-muted-foreground">
        Selected: {selectedDate(date)}
      </p>
    </div>
  )
}
