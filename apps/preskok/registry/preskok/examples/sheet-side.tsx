"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/registry/preskok/ui/preskok-ui/sheet"

export default function SheetSide() {
  return (
    <div className="flex gap-2">
      <Sheet>
        <SheetTrigger>
          <Button intent="outline" size="sm">
            Left
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Filters</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Price Range</label>
                <p className="text-muted-foreground text-xs">
                  $15,000 - $50,000
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Mileage</label>
                <p className="text-muted-foreground text-xs">
                  Under 25,000 miles
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Fuel Type</label>
                <p className="text-muted-foreground text-xs">
                  Gasoline, Hybrid, Electric
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger>
          <Button intent="outline" size="sm">
            Right
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Comparison</h3>
            <div className="space-y-3">
              <div className="rounded border p-3">
                <h4 className="font-medium">Toyota Camry</h4>
                <p className="text-muted-foreground text-sm">$28,400</p>
              </div>
              <div className="rounded border p-3">
                <h4 className="font-medium">Honda Accord</h4>
                <p className="text-muted-foreground text-sm">$26,800</p>
              </div>
              <Button className="w-full">Compare Selected</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger>
          <Button intent="outline" size="sm">
            Top
          </Button>
        </SheetTrigger>
        <SheetContent side="top">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Special Offer</h3>
            <p className="text-muted-foreground">
              Get 0.9% APR financing on select 2024 models
            </p>
            <Button>Learn More</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger>
          <Button intent="outline" size="sm">
            Bottom
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Trade-In Value</h3>
            <p className="text-muted-foreground">
              Get an instant estimate for your current vehicle
            </p>
            <Button>Get Trade Value</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
