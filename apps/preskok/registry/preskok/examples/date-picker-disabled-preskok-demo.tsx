"use client"

import { parseDate } from "@internationalized/date"

import {
  DatePicker,
  DatePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function DatePickerDisabledPreskokDemo() {
  return (
    <div className="max-w-xs">
      <DatePicker defaultValue={parseDate("2026-05-20")} isDisabled>
        <Label>Read-only date</Label>
        <DatePickerTrigger />
      </DatePicker>
    </div>
  )
}
