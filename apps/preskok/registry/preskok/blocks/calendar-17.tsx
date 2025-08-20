"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"

import { Card, CardContent, CardFooter } from "@/registry/preskok/ui/card"
import { Input } from "@/registry/preskok/ui/input"
import { Label } from "@/registry/preskok/ui/label"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar17() {
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )

  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <div className="inline-block rounded-lg border shadow-sm">
          <Calendar
            value={date}
            onChange={setDate}
            className="[--cell-size:--spacing(10.5)]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t px-4 !pt-4 *:[div]:w-full">
        <div>
          <Label htmlFor="time-from" className="sr-only">
            Start Time
          </Label>
          <Input
            id="time-from"
            type="time"
            step="1"
            defaultValue="10:30:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
        <span>-</span>
        <div>
          <Label htmlFor="time-to" className="sr-only">
            End Time
          </Label>
          <Input
            id="time-to"
            type="time"
            step="1"
            defaultValue="12:30:00"
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </CardFooter>
    </Card>
  )
}
