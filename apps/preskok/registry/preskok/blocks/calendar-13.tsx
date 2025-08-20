"use client"

import * as React from "react"
import type { CalendarDate } from "@internationalized/date"
import { parseDate } from "@internationalized/date"

import { Label } from "@/registry/preskok/ui/label"
import { Calendar } from "@/registry/preskok/ui/preskok-ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/preskok/ui/select"

export default function Calendar13() {
  // Caption layout modes are not supported by Preskok UI calendar.
  // We keep the dropdown UI as a no-op to demonstrate available options.
  const [dropdown, setDropdown] = React.useState<
    "dropdown" | "dropdown-months" | "dropdown-years"
  >("dropdown")
  const [date, setDate] = React.useState<CalendarDate>(() =>
    parseDate("2025-06-12")
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-block rounded-lg border shadow-sm">
        <Calendar value={date} onChange={setDate} />
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="dropdown" className="px-1">
          Dropdown
        </Label>
        <Select
          value={dropdown}
          onValueChange={(value) =>
            setDropdown(
              value as React.ComponentProps<typeof Calendar>["captionLayout"]
            )
          }
        >
          <SelectTrigger
            id="dropdown"
            size="sm"
            className="bg-background w-full"
          >
            <SelectValue placeholder="Dropdown" />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="dropdown">Month and Year</SelectItem>
            <SelectItem value="dropdown-months">Month Only</SelectItem>
            <SelectItem value="dropdown-years">Year Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
