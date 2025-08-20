"use client"

import * as React from "react"
import { type CalendarDate } from "@internationalized/date"
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

export default function Calendar23() {
  const [range, setRange] = React.useState<
    RangeValue<CalendarDate> | undefined
  >(undefined)

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
              ? `${range.start.toDate("UTC").toLocaleDateString()} - ${range.end.toDate("UTC").toLocaleDateString()}`
              : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <div className="inline-block rounded-lg border shadow-sm">
            {/* Dropdown caption layout is not applicable; header includes dropdowns by default */}
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
