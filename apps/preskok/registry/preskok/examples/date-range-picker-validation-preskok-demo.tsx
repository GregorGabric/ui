"use client"

import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  DateRangePicker,
  DateRangePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-range-picker"
import { FieldError, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Form } from "@/registry/preskok/ui/preskok-ui/form"

export default function DateRangePickerValidationPreskokDemo() {
  const timeZone = getLocalTimeZone()

  const getDayDifference = (start: DateValue, end: DateValue) => {
    const diffMs =
      end.toDate(timeZone).getTime() - start.toDate(timeZone).getTime()
    return Math.round(diffMs / 86_400_000)
  }

  return (
    <Form onSubmit={(e) => e.preventDefault()} className="max-w-xs">
      <DateRangePicker
        validate={(range) => {
          if (!range?.start || !range?.end) {
            return null
          }

          return getDayDifference(range.start, range.end) > 7
            ? "Maximum booking duration is 1 week."
            : null
        }}
        defaultValue={{
          start: today(timeZone),
          end: today(timeZone).add({ weeks: 2 }),
        }}
        className="mb-2"
      >
        <Label>Room booking</Label>
        <DateRangePickerTrigger />
        <FieldError />
      </DateRangePicker>
      <Button type="submit">Book Room</Button>
    </Form>
  )
}
