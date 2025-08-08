"use client"

import { parseDate } from "@internationalized/date"

import { DatePicker } from "@/registry/preskok/ui/preskok-ui/date-picker"

export default function DatePickerPreskokDemo() {
  return (
    <div className="max-w-xs">
      <DatePicker
        label="Pick a date"
        granularity="day"
        defaultValue={parseDate("2024-01-20")}
      />
    </div>
  )
}
