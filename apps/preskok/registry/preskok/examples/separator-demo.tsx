"use client"

import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"

export default function SeparatorDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Vehicle Details</h3>
        <Separator className="my-4" />
        <div className="space-y-2">
          <p>Make: Toyota</p>
          <p>Model: Camry</p>
          <p>Year: 2024</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span>Engine</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Transmission</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Drivetrain</span>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Pricing</h3>
        <Separator className="my-4" />
        <div className="space-y-2">
          <p>MSRP: $28,400</p>
          <p>Dealer Price: $26,800</p>
          <p>Your Price: $25,200</p>
        </div>
      </div>
    </div>
  )
}
