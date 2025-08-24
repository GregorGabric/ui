"use client"

import { Meter } from "@/registry/preskok/ui/preskok-ui/meter"
import { ProgressBar } from "@/registry/preskok/ui/preskok-ui/progress-bar"

export default function ProgressDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Vehicle Assembly Progress</h4>
        <ProgressBar label="Engine Installation" value={75} />
        <ProgressBar label="Interior Assembly" value={45} />
        <ProgressBar label="Quality Inspection" value={90} />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Performance Metrics</h4>
        <Meter
          label="Fuel Tank Level"
          value={68}
          minValue={0}
          maxValue={100}
          formatOptions={{ style: "percent" }}
        />
        <Meter
          label="Battery Charge"
          value={85}
          minValue={0}
          maxValue={100}
          formatOptions={{ style: "percent" }}
        />
        <Meter
          label="Tire Pressure"
          value={32}
          minValue={0}
          maxValue={50}
          formatOptions={{
            style: "unit",
            unit: "pound-force-per-square-inch",
            unitDisplay: "short",
          }}
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Service Status</h4>
        <ProgressBar
          label="Oil Change Service"
          value={100}
          className="[&_[data-slot=fill]]:bg-green-500 [&_[data-slot=track]]:bg-green-100"
        />
        <ProgressBar
          label="Brake Inspection"
          value={25}
          className="[&_[data-slot=fill]]:bg-yellow-500"
        />
      </div>
    </div>
  )
}
