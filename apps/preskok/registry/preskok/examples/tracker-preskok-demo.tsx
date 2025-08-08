"use client"

import {
  Tracker,
  type TrackerBlockProps,
} from "@/registry/preskok/ui/preskok-ui/tracker"

const data: TrackerBlockProps[] = Array.from({ length: 30 }).map((_, i) => ({
  key: i,
  color: i % 5 === 0 ? "bg-primary" : undefined,
  tooltip: `Day ${i + 1}: ${i % 5 === 0 ? "Active" : "Idle"}`,
}))

export default function TrackerPreskokDemo() {
  return (
    <div className="w-full max-w-xl">
      <Tracker data={data} />
    </div>
  )
}
