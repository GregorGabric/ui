"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/button"
import { Label } from "@/registry/preskok/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/preskok/ui/popover"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"

export default function Calendar22() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<CalendarDate | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toDate("UTC").toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <div className="inline-block rounded-lg border shadow-sm">
            {/* Dropdown caption layout is not applicable; header includes dropdowns by default */}
            <Calendar
              value={date}
              onChange={(value) => {
                setDate(value)
                setOpen(false)
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
