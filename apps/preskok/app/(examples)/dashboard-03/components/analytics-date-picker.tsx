"use client"

import { getLocalTimeZone, today } from "@internationalized/date"

import { DateRangePicker } from "@/registry/preskok/ui/preskok-ui/date-range-picker"

export function AnalyticsDatePicker() {
  const now = today(getLocalTimeZone())
  const defaultValue = {
    start: now.subtract({ days: 20 }),
    end: now,
  }

  return (
    <DateRangePicker
      aria-label="Analytics date range"
      defaultValue={defaultValue}
      visibleDuration={{ months: 2 }}
      className="w-fit"
    />
  )
}
