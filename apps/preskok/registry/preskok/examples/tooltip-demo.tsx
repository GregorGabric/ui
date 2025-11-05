"use client"

import { InfoIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/preskok/ui/preskok-ui/tooltip"

export default function TooltipDemo() {
  return (
    <div className="flex items-center gap-6">
      <Tooltip>
        <Button intent="primary">Vehicle Details</Button>
        <TooltipContent>
          <strong className="font-semibold">Vehicle specifications</strong>
          <p className="text-muted-fg mt-1 max-w-2xs text-sm text-pretty">
            View detailed vehicle specifications and features.
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <Button intent="outline">Payment Calculator</Button>
        <TooltipContent>
          <strong className="font-semibold">Payment calculator</strong>
          <p className="text-muted-fg mt-1 max-w-2xs text-sm text-pretty">
            Calculate monthly payment based on down payment, interest rate, and
            loan term.
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <Button intent="plain" size="sq-sm">
          <InfoIcon className="h-4 w-4" />
        </Button>
        <TooltipContent>
          <strong className="font-semibold">Certified vehicle</strong>
          <p className="text-muted-fg mt-1 max-w-2xs text-sm text-pretty">
            This vehicle has been certified by our inspection team and comes
            with a 30-day warranty.
          </p>
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center gap-2">
        <span className="text-sm">MPG Rating:</span>
        <Tooltip>
          <TooltipTrigger className="cursor-help border-b border-dashed">
            31 combined
          </TooltipTrigger>
          <TooltipContent>
            <strong className="font-semibold">Fuel economy</strong>
            <p className="text-muted-fg mt-1 max-w-2xs text-sm text-pretty">
              EPA estimated fuel economy: 28 city / 35 highway / 31 combined.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
