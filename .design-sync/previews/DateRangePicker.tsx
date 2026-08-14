import { CalendarDate } from "@internationalized/date"
import { DateRangePicker, DateRangePickerTrigger, Label } from "preskok"

export function Basic() {
  return (
    <div className="max-w-xs">
      <DateRangePicker
        value={{
          start: new CalendarDate(2026, 4, 8),
          end: new CalendarDate(2026, 4, 14),
        }}
        visibleDuration={{ months: 2 }}
      >
        <Label>Event date</Label>
        <DateRangePickerTrigger />
      </DateRangePicker>
    </div>
  )
}

export function Empty() {
  return (
    <div className="max-w-xs">
      <DateRangePicker visibleDuration={{ months: 2 }}>
        <Label>Event date</Label>
        <DateRangePickerTrigger />
      </DateRangePicker>
    </div>
  )
}
