"use client"

import {
  DatePicker,
  DatePickerTrigger,
} from "@/registry/preskok/ui/preskok-ui/date-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"

export default function DatePickerPreskokDemo() {
  return (
    <div className="max-w-xs">
      <DatePicker>
        <Label>Event date</Label>
        <DatePickerTrigger />
      </DatePicker>
    </div>
  )
}
