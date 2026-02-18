"use client"

import { useState } from "react"
import { Time } from "@internationalized/date"

import { DateInput } from "@/registry/preskok/ui/preskok-ui/date-field"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Switch, SwitchLabel } from "@/registry/preskok/ui/preskok-ui/switch"
import { TimeField } from "@/registry/preskok/ui/preskok-ui/time-field"

export default function TimeFieldHourCyclePreskokDemo() {
  const [hourCycle, setHourCycle] = useState<12 | 24>(24)
  const [value, setValue] = useState(new Time(13, 45))

  return (
    <div className="flex flex-col gap-y-6">
      <Switch
        isSelected={hourCycle === 24}
        onChange={() =>
          setHourCycle((prevHourCycle) => (prevHourCycle === 24 ? 12 : 24))
        }
      >
        <SwitchLabel>{hourCycle} hour</SwitchLabel>
      </Switch>
      <TimeField
        value={value}
        onChange={(newValue) => {
          if (newValue) {
            setValue(newValue)
          }
        }}
        hourCycle={hourCycle}
      >
        <Label>Event time</Label>
        <DateInput />
      </TimeField>
    </div>
  )
}
