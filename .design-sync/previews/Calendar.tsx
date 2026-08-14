import { CalendarDate } from "@internationalized/date"
import { Calendar } from "preskok"

export function Basic() {
  return (
    <div className="flex justify-center">
      <Calendar
        value={new CalendarDate(2026, 4, 12)}
        aria-label="Select a date"
      />
    </div>
  )
}

export function Disabled() {
  return (
    <div className="flex justify-center">
      <Calendar
        value={new CalendarDate(2026, 4, 12)}
        isDisabled
        aria-label="Disabled date"
      />
    </div>
  )
}
