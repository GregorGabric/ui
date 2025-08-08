"use client"

import { parseDate } from "@internationalized/date"

import { DateRangePicker } from "@/registry/preskok/ui/preskok-ui/date-range-picker"

export default function DateRangePickerPreskokDemo() {
  return (
    <div className="max-w-sm">
      <DateRangePicker
        label="Date range"
        visibleDuration={{ months: 2 }}
        defaultValue={{
          start: parseDate("2024-02-10"),
          end: parseDate("2024-02-20"),
        }}
      />
    </div>
  )
}
