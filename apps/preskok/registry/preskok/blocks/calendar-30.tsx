"use client"

import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"
import { formatDateRange } from "little-date"
import { ChevronDownIcon } from "lucide-react"
import type { RangeValue } from "react-aria-components"

import { Button } from "@/registry/preskok/ui/button"
import { Label } from "@/registry/preskok/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/preskok/ui/popover"
import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

export default function Calendar30() {
  const [range, setRange] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate("2025-06-04"),
    end: parseDate("2025-06-10"),
  })

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="dates" className="px-1">
        Select your stay
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-56 justify-between font-normal"
          >
            {range?.start && range?.end
              ? formatDateRange(
                  range.start.toDate("UTC"),
                  range.end.toDate("UTC"),
                  {
                    includeTime: false,
                  }
                )
              : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <div className="inline-block rounded-lg border shadow-sm">
            <RangeCalendar
              value={range}
              onChange={(value) => {
                setRange(value)
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
