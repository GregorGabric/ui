"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"
import { Clock2Icon } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/registry/preskok/ui/card"
import { Input } from "@/registry/preskok/ui/input"
import { Label } from "@/registry/preskok/ui/label"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar16() {
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )

  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <div className="inline-block rounded-lg border shadow-sm">
          <Calendar value={date} onChange={setDate} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-6 border-t px-4 !pt-4">
        <div className="flex w-full flex-col gap-3">
          <Label htmlFor="time-from">Start Time</Label>
          <div className="relative flex w-full items-center gap-2">
            <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
            <Input
              id="time-from"
              type="time"
              step="1"
              defaultValue="10:30:00"
              className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <Label htmlFor="time-to">End Time</Label>
          <div className="relative flex w-full items-center gap-2">
            <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
            <Input
              id="time-to"
              type="time"
              step="1"
              defaultValue="12:30:00"
              className="appearance-none pl-8 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
