"use client"

import { Button, buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/preskok/ui/preskok-ui/popover"

export default function PopoverDemo() {
  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger className={buttonStyles({ intent: "outline" })}>
          Vehicle Info
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">2024 Honda Accord</h4>
              <p className="text-muted-foreground text-sm">
                Mid-size sedan with hybrid powertrain
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Engine:</span> 2.0L Hybrid
              </div>
              <div>
                <span className="font-medium">MPG:</span> 48 city / 47 hwy
              </div>
              <div>
                <span className="font-medium">Seats:</span> 5
              </div>
              <div>
                <span className="font-medium">Cargo:</span> 16.7 cu ft
              </div>
            </div>
            <Button size="sm" className="w-full">
              Schedule Test Drive
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger className={buttonStyles({ intent: "outline" })}>
          Financing Options
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-3">
            <h4 className="font-semibold">Financing Calculator</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Vehicle Price:</span>
                <span className="font-medium">$32,400</span>
              </div>
              <div className="flex justify-between">
                <span>Down Payment:</span>
                <span className="font-medium">$5,000</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Term:</span>
                <span className="font-medium">60 months</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Est. Monthly:</span>
                <span className="font-semibold">$487/mo</span>
              </div>
            </div>
            <Button size="sm" className="w-full">
              Apply for Financing
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
