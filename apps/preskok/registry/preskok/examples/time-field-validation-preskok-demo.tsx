"use client"

import { useState } from "react"
import { Time } from "@internationalized/date"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { DateInput } from "@/registry/preskok/ui/preskok-ui/date-field"
import {
  Description,
  FieldError,
  Label,
} from "@/registry/preskok/ui/preskok-ui/field"
import { Form } from "@/registry/preskok/ui/preskok-ui/form"
import { Switch, SwitchLabel } from "@/registry/preskok/ui/preskok-ui/switch"
import { TimeField } from "@/registry/preskok/ui/preskok-ui/time-field"

export default function TimeFieldValidationPreskokDemo() {
  const [hourCycle, setHourCycle] = useState<12 | 24>(12)
  const openingTime = new Time(9, 0)
  const closingTime = new Time(17, 30)

  return (
    <Form onSubmit={(e) => e.preventDefault()} className="max-w-xs space-y-4">
      <Switch
        isSelected={hourCycle === 12}
        onChange={() =>
          setHourCycle((prevHourCycle) => (prevHourCycle === 12 ? 24 : 12))
        }
      >
        <SwitchLabel>{hourCycle} hour format</SwitchLabel>
      </Switch>

      <TimeField
        isRequired
        hourCycle={hourCycle}
        defaultValue={new Time(10, 30)}
        minValue={openingTime}
        maxValue={closingTime}
        validate={(value) => {
          if (!value) {
            return "Please choose an appointment time."
          }

          if (value.hour === 12 && value.minute > 30) {
            return "12:30 PM to 1:00 PM is unavailable."
          }

          return null
        }}
      >
        <Label>Service appointment</Label>
        <Description>
          {hourCycle === 12
            ? "Pick a time between 9:00 AM and 5:30 PM."
            : "Pick a time between 09:00 and 17:30."}
        </Description>
        <DateInput />
        <FieldError />
      </TimeField>
      <Button type="submit">Book appointment</Button>
    </Form>
  )
}
