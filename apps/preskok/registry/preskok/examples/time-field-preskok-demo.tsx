"use client"

import { Time } from "@internationalized/date"

import { DateInput } from "@/registry/preskok/ui/preskok-ui/date-field"
import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { TimeField } from "@/registry/preskok/ui/preskok-ui/time-field"

export default function TimeFieldPreskokDemo() {
  return (
    <div className="grid w-full max-w-xl gap-4 rounded-xl border bg-background p-5 shadow-sm sm:grid-cols-2">
      <TimeField
        defaultValue={new Time(9, 30)}
        minValue={new Time(8, 0)}
        hourCycle={12}
      >
        <Label>Pickup window</Label>
        <Description>Earliest available slot.</Description>
        <DateInput className="min-w-36" />
      </TimeField>
      <TimeField defaultValue={new Time(17, 0)} hourCycle={24}>
        <Label>Dispatch cutoff</Label>
        <Description>Operations uses 24-hour time.</Description>
        <DateInput className="min-w-36" />
      </TimeField>
    </div>
  )
}
