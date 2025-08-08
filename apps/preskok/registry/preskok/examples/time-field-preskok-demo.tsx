"use client"

import { TimeField } from "@/registry/preskok/ui/preskok-ui/time-field"

export default function TimeFieldPreskokDemo() {
  return (
    <div className="space-y-4">
      <TimeField label="Start time" />
      <TimeField label="End time" />
    </div>
  )
}
