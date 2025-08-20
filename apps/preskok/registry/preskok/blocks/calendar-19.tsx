"use client"

import * as React from "react"
import { getLocalTimeZone, parseDate, today } from "@internationalized/date"
import type { CalendarDate } from "@internationalized/date"

import { Button } from "@/registry/preskok/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/preskok/ui/card"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar19() {
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )

  return (
    <Card className="max-w-[300px] py-4">
      <CardContent className="px-4">
        <div className="inline-block rounded-lg border shadow-sm">
          <Calendar
            value={date}
            onChange={setDate}
            className="[--cell-size:--spacing(9.5)]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t px-4 !pt-4">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              const base = today(getLocalTimeZone())
              setDate(base.add({ days: preset.value }))
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}
