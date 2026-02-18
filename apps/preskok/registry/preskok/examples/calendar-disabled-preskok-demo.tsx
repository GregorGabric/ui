"use client"

import { getLocalTimeZone, today } from "@internationalized/date"

import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function CalendarDisabledPreskokDemo() {
  return (
    <Calendar
      defaultValue={today(getLocalTimeZone()).add({ days: 5 })}
      isDisabled
      aria-label="Disabled calendar"
    />
  )
}
