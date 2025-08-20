"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"
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

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export default function Calendar28() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<CalendarDate | undefined>(
    parseDate("2025-06-01")
  )
  const [value, setValue] = React.useState(formatDate(date))

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Subscription Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => {
            const date = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(date)) {
              setDate(
                parseDate(
                  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
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
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
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
    </div>
  )
}
