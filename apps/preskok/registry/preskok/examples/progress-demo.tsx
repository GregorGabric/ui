"use client"

import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  Meter,
  MeterHeader,
  MeterTrack,
  MeterValue,
} from "@/registry/preskok/ui/preskok-ui/meter"
import {
  ProgressBar,
  ProgressBarHeader,
  ProgressBarTrack,
  ProgressBarValue,
} from "@/registry/preskok/ui/preskok-ui/progress-bar"

export default function ProgressDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Vehicle Assembly Progress</h4>
        <ProgressBar value={75}>
          <ProgressBarHeader>
            <Label>Engine Installation</Label>
            <ProgressBarValue />
          </ProgressBarHeader>
          <ProgressBarTrack />
        </ProgressBar>
        <ProgressBar value={45}>
          <ProgressBarHeader>
            <Label>Interior Assembly</Label>
            <ProgressBarValue />
          </ProgressBarHeader>
          <ProgressBarTrack />
        </ProgressBar>
        <ProgressBar value={90}>
          <ProgressBarHeader>
            <Label>Quality Inspection</Label>
            <ProgressBarValue />
          </ProgressBarHeader>
          <ProgressBarTrack />
        </ProgressBar>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Performance Metrics</h4>
        <Meter
          value={68}
          minValue={0}
          maxValue={100}
          formatOptions={{ style: "percent" }}
        >
          <MeterHeader>
            <Label>Fuel Tank Level</Label>
            <MeterValue />
          </MeterHeader>
          <MeterTrack />
        </Meter>
        <Meter
          value={85}
          minValue={0}
          maxValue={100}
          formatOptions={{ style: "percent" }}
        >
          <MeterHeader>
            <Label>Battery Charge</Label>
            <MeterValue />
          </MeterHeader>
          <MeterTrack />
        </Meter>
        <Meter value={32} minValue={0} maxValue={50}>
          <MeterHeader>
            <Label>Tire Pressure</Label>
            <MeterValue />
          </MeterHeader>
          <MeterTrack />
        </Meter>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Service Status</h4>
        <ProgressBar
          value={100}
          className="[&_[data-slot=progress-bar-track]>div>div]:bg-green-100 [&_[data-slot=progress-content]]:bg-green-500"
        >
          <ProgressBarHeader>
            <Label>Oil Change Service</Label>
            <ProgressBarValue />
          </ProgressBarHeader>
          <ProgressBarTrack />
        </ProgressBar>
        <ProgressBar
          value={25}
          className="[&_[data-slot=progress-content]]:bg-yellow-500"
        >
          <ProgressBarHeader>
            <Label>Brake Inspection</Label>
            <ProgressBarValue />
          </ProgressBarHeader>
          <ProgressBarTrack />
        </ProgressBar>
      </div>
    </div>
  )
}
