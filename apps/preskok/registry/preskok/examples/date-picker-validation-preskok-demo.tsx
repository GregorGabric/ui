"use client"

import { getLocalTimeZone, today } from "@internationalized/date"
import type { DateValue } from "react-aria-components/DatePicker"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  DatePicker,
  DatePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-picker"
import { FieldError, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Form } from "@/registry/preskok/ui/preskok-ui/form"

export default function DatePickerValidationPreskokDemo() {
  const timeZone = getLocalTimeZone()
  const minMeetingDate = today(timeZone)
  const maxMeetingDate = minMeetingDate.add({ months: 1 })

  const isWeekend = (value: DateValue) => {
    const day = value.toDate(timeZone).getDay()
    return day === 0 || day === 6
  }

  return (
    <Form onSubmit={(e) => e.preventDefault()} className="max-w-xs space-y-2">
      <DatePicker
        className="mb-2"
        isRequired
        minValue={minMeetingDate}
        maxValue={maxMeetingDate}
        isDateUnavailable={isWeekend}
        validate={(value) => {
          if (!value) {
            return "Please select a meeting date."
          }

          const day = value.toDate(timeZone).getDay()
          if (day === 0 || day === 6) {
            return "Weekends are unavailable."
          }

          return null
        }}
      >
        <Label>Team meeting</Label>
        <DatePickerTrigger />
        <FieldError />
      </DatePicker>
      <Button type="submit">Schedule meeting</Button>
    </Form>
  )
}
