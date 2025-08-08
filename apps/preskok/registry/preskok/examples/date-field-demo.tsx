"use client"

import { parseDate } from "@internationalized/date"

import { DateField } from "@/registry/preskok/ui/preskok-ui/date-field"

export default function DateFieldDemo() {
  return (
    <div className="max-w-xs">
      <DateField
        label="Date"
        granularity="day"
        defaultValue={parseDate("2023-10-15")}
      />
    </div>
  )
}
