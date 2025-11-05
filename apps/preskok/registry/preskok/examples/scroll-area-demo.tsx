"use client"

import { ScrollArea } from "@/registry/preskok/ui/preskok-ui/scroll-area"

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
  "Power Adjustable Seats",
  "Leather Interior",
  "Sunroof/Moonroof",
  "Premium Audio System",
  "Navigation System",
  "Wireless Charging",
  "USB Ports",
  "Bluetooth Connectivity",
  "Apple CarPlay",
  "Android Auto",
  "Backup Camera",
  "360-Degree Camera",
  "Parking Sensors",
]

export default function ScrollAreaDemo() {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-48 w-64 rounded border p-4">
        <h4 className="mb-4 text-sm font-medium">Available Features</h4>
        <div className="space-y-2">
          {vehicleFeatures.map((feature, index) => (
            <div key={index} className="text-sm">
              • {feature}
            </div>
          ))}
        </div>
      </ScrollArea>

      <ScrollArea className="h-32 w-64 rounded border p-4">
        <div className="flex space-x-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="bg-muted flex h-20 w-32 flex-shrink-0 items-center justify-center rounded"
            >
              Car {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
