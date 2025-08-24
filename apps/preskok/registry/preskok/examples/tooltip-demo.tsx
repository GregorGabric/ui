"use client"

import { InfoIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Tooltip } from "@/registry/preskok/ui/preskok-ui/tooltip"

export default function TooltipDemo() {
  return (
    <div className="flex items-center gap-6">
      <Tooltip label="View detailed vehicle specifications and features">
        <Button intent="primary">Vehicle Details</Button>
      </Tooltip>

      <Tooltip label="Calculate monthly payment based on down payment, interest rate, and loan term">
        <Button intent="outline">Payment Calculator</Button>
      </Tooltip>

      <Tooltip label="This vehicle has been certified by our inspection team and comes with a 30-day warranty">
        <Button intent="ghost" size="sq-sm">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </Tooltip>

      <div className="flex items-center gap-2">
        <span className="text-sm">MPG Rating:</span>
        <Tooltip label="EPA estimated fuel economy: 28 city / 35 highway / 31 combined">
          <span className="cursor-help border-b border-dashed">
            31 combined
          </span>
        </Tooltip>
      </div>
    </div>
  )
}
