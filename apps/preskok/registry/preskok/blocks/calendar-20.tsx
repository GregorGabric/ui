"use client"

import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"

import { Button } from "@/registry/preskok/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/preskok/ui/card"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar20() {
  const [date, setDate] = React.useState<CalendarDate | undefined>(() =>
    parseDate("2025-06-12")
  )
  const [selectedTime, setSelectedTime] = React.useState<string | null>("10:00")
  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15
    const hour = Math.floor(totalMinutes / 60) + 9
    const minute = totalMinutes % 60
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const bookedDates = new Set(
    Array.from({ length: 3 }, (_, i) =>
      parseDate(`2025-06-${(17 + i).toString().padStart(2, "0")}`)
    )
  )
  const isBooked = (d: CalendarDate) =>
    bookedDates.has(
      parseDate(
        `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`
      )
    )

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <div className="inline-block rounded-lg border shadow-sm">
            <Calendar
              value={date}
              onChange={setDate}
              isDateUnavailable={isBooked}
              className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            />
          </div>
        </div>
        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Your meeting is booked for{" "}
              <span className="font-medium">
                {" "}
                {`${date.toDate("UTC").toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}`}{" "}
              </span>
              at <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime}
          className="w-full md:ml-auto md:w-auto"
          variant="outline"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}
