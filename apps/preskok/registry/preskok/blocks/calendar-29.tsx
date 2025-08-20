"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"
import { parseDate as parseNatural } from "chrono-node"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/button"
import { Input } from "@/registry/preskok/ui/input"
import { Label } from "@/registry/preskok/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/preskok/ui/popover"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

function formatDate(date: CalendarDate | undefined) {
  if (!date) {
    return ""
  }

  return date.toDate("UTC").toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function Calendar29() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("In 2 days")
  const initial = parseNatural(value)
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    initial
      ? parseDate(
          `${initial.getFullYear()}-${String(initial.getMonth() + 1).padStart(2, "0")}-${String(initial.getDate()).padStart(2, "0")}`
        )
      : undefined
  )

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Schedule Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="Tomorrow or next week"
          className="bg-background pr-10"
          onChange={(e) => {
            setValue(e.target.value)
            const d = parseNatural(e.target.value)
            if (d) {
              setDate(
                parseDate(
                  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
                )
              )
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <div className="inline-block rounded-lg border shadow-sm">
              <Calendar
                value={date}
                onChange={(value) => {
                  setDate(value)
                  setValue(formatDate(value))
                  setOpen(false)
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="text-muted-foreground px-1 text-sm">
        Your post will be published on{" "}
        <span className="font-medium">{formatDate(date)}</span>.
      </div>
    </div>
  )
}
