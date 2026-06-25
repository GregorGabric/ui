"use client"

import { CheckIcon } from "lucide-react"

import { ProgressCircle } from "@/registry/preskok/ui/preskok-ui/progress-circle"

export default function ProgressCirclePreskokDemo() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="flex items-center gap-2">
        <ProgressCircle value={72} className="text-primary size-5" />
        <span className="text-sm">72% uploaded</span>
      </div>
      <div className="flex items-center gap-2">
        <ProgressCircle
          isIndeterminate
          className="text-muted-foreground size-5"
        />
        <span className="text-sm">Processing</span>
      </div>
      <div className="text-success flex items-center gap-2">
        <CheckIcon className="size-5" />
        <span className="text-sm">Complete</span>
      </div>
    </div>
  )
}
