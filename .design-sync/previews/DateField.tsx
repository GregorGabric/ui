import { CalendarDate } from "@internationalized/date"
import { DateField, DateInput, Description, FieldError, Label } from "preskok"

export function Basic() {
  return (
    <div className="grid gap-4">
      <DateField
        defaultValue={new CalendarDate(2026, 7, 18)}
        minValue={new CalendarDate(2026, 7, 1)}
        maxValue={new CalendarDate(2026, 8, 31)}
        isRequired
      >
        <Label>Launch date</Label>
        <Description>Choose a date in the approved summer window.</Description>
        <DateInput />
        <FieldError />
      </DateField>
      <DateField defaultValue={new CalendarDate(2026, 7, 18)} isReadOnly>
        <Label>Read-only date</Label>
        <DateInput />
      </DateField>
    </div>
  )
}
