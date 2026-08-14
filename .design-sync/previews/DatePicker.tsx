import { CalendarDate } from "@internationalized/date"
import { DatePicker, DatePickerTrigger, Label } from "preskok"

export function Basic() {
  return (
    <div className="max-w-xs">
      <DatePicker value={new CalendarDate(2026, 4, 12)}>
        <Label>Event date</Label>
        <DatePickerTrigger />
      </DatePicker>
    </div>
  )
}

export function Empty() {
  return (
    <div className="max-w-xs">
      <DatePicker>
        <Label>Event date</Label>
        <DatePickerTrigger />
      </DatePicker>
    </div>
  )
}
