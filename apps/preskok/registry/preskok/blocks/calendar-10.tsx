"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { getLocalTimeZone, parseDate, today } from "@internationalized/date"

import { Button } from "@/registry/preskok/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/card"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar10() {
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment</CardTitle>
        <CardDescription>Find a date</CardDescription>
        <CardAction>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setDate(today(getLocalTimeZone()))
            }}
          >
            Today
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="inline-block rounded-lg border shadow-sm">
          <Calendar value={date} onChange={setDate} />
        </div>
      </CardContent>
    </Card>
  )
}
