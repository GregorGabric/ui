"use client"

import { useState } from "react"
import {
  getLocalTimeZone,
  parseDate,
  type CalendarDate,
} from "@internationalized/date"

import {
  DatePicker,
  DatePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function DatePickerControlledPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const [date, setDate] = useState<CalendarDate | null>(() =>
    parseDate("2026-04-12")
  )

  const selectedDate = date
    ? date.toDate(timeZone).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No date selected"

  return (
    <div className="max-w-xs space-y-3">
      <DatePicker value={date} onChange={setDate}>
        <Label>Interview date</Label>
        <DatePickerTrigger />
      </DatePicker>
      <p className="text-muted-foreground text-sm">Selected: {selectedDate}</p>
    </div>
  )
}
