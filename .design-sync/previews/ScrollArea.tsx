import { ScrollArea } from "preskok"

const vehicleFeatures = [
  "Adaptive Cruise Control",
  "Automatic Emergency Braking",
  "Blind Spot Monitoring",
  "Cross Traffic Alert",
  "Lane Departure Warning",
  "Lane Keep Assist",
  "Forward Collision Warning",
  "Automatic High Beams",
  "Rain Sensing Wipers",
  "Keyless Entry and Start",
  "Dual-Zone Climate Control",
  "Heated Front Seats",
]

export function Vertical() {
  return (
    <ScrollArea className="h-48 w-64 rounded border p-2">
      <h4 className="mb-4 text-sm font-medium">Available Features</h4>
      <div className="space-y-2">
        {vehicleFeatures.map((feature) => (
          <div key={feature} className="text-sm">
            • {feature}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export function Horizontal() {
  return (
    <ScrollArea orientation="horizontal" className="h-32 w-64 rounded border p-2">
      <div className="flex gap-4">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="flex h-20 w-32 shrink-0 items-center justify-center rounded bg-muted text-sm"
          >
            Car {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
