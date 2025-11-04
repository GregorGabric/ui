"use client"

import { Meter } from "@/registry/preskok/ui/preskok-ui/meter"

export default function MeterPreskokDemo() {
  return (
    <div className="space-y-6">
      <Meter label="Storage Used" value={25} />

      <Meter label="CPU Usage" value={68} />

      <Meter label="Memory" value={85} />

      <Meter label="Bandwidth" value={45} maxValue={100} />

      <Meter label="Disk Space" value={92} />
    </div>
  )
}
