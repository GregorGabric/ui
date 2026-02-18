"use client"

import { DateInput } from "@/registry/preskok/ui/preskok-ui/date-field"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { TimeField } from "@/registry/preskok/ui/preskok-ui/time-field"

export default function TimeFieldPreskokDemo() {
  return (
    <div className="space-y-4">
      <TimeField>
        <Label>Start time</Label>
        <DateInput />
      </TimeField>
      <TimeField>
        <Label>End time</Label>
        <DateInput />
      </TimeField>
    </div>
  )
}
