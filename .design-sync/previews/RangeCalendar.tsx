import { CalendarDate } from "@internationalized/date"
import { RangeCalendar } from "preskok"

export function Basic() {
  return (
    <RangeCalendar
      value={{
        start: new CalendarDate(2026, 4, 10),
        end: new CalendarDate(2026, 4, 16),
      }}
      aria-label="Trip dates"
    />
  )
}

export function TwoMonths() {
  return (
    <RangeCalendar
      value={{
        start: new CalendarDate(2026, 4, 10),
        end: new CalendarDate(2026, 4, 16),
      }}
      visibleDuration={{ months: 2 }}
      aria-label="Trip dates across two months"
    />
  )
}
