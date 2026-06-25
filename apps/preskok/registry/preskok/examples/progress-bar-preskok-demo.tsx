"use client"

import { useEffect, useState } from "react"

import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  ProgressBar,
  ProgressBarHeader,
  ProgressBarTrack,
  ProgressBarValue,
} from "@/registry/preskok/ui/preskok-ui/progress-bar"

export function Component() {
  const [value, setValue] = useState(35)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => Math.min(prev + 5, 100))
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid w-full max-w-md gap-5">
      <ProgressBar value={value}>
        <ProgressBarHeader>
          <Label>Importing customers</Label>
          <ProgressBarValue />
        </ProgressBarHeader>
        <Description>Determinate progress with a visible value.</Description>
        <ProgressBarTrack />
      </ProgressBar>
      <ProgressBar isIndeterminate>
        <ProgressBarHeader>
          <Label>Syncing webhooks</Label>
        </ProgressBarHeader>
        <Description>Indeterminate progress for unknown durations.</Description>
        <ProgressBarTrack />
      </ProgressBar>
    </div>
  )
}
