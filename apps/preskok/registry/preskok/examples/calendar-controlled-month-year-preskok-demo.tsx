"use client"

import { useState } from "react"
import type { CalendarDate } from "@internationalized/date"
import { getLocalTimeZone, today } from "@internationalized/date"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function CalendarControlledMonthYearPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const [date, setDate] = useState<CalendarDate | null>(null)
  const [focusedDate, setFocusedDate] = useState(() => today(timeZone))

  return (
    <div className="space-y-3">
      <Calendar
        value={date}
        onChange={setDate}
        focusedValue={focusedDate}
        onFocusChange={setFocusedDate}
        aria-label="Select date with controlled focus"
      />
      <Button
        intent="outline"
        size="sm"
        onPress={() => setFocusedDate(today(timeZone))}
      >
        Jump to current month
      </Button>
    </div>
  )
}
