"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/preskok/ui/preskok-ui/sheet"

const specs = [
  ["Mileage", "42,180 km"],
  ["Fuel", "Diesel"],
  ["Gearbox", "Automatic"],
  ["Power", "140 kW"],
  ["First registration", "03/2022"],
  ["Location", "Ljubljana"],
]

export default function SheetSnapPointsDemo() {
  return (
    <Sheet>
      <Button intent="outline">View vehicle</Button>
      <SheetContent side="bottom" isFloat={false} snapPoints={[240]}>
        <SheetHeader>
          <SheetTitle>Škoda Octavia Combi</SheetTitle>
          <SheetDescription>
            Drag up for the full spec sheet, or swipe down to dismiss.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <dl className="divide-y text-sm">
            {specs.map(([term, value]) => (
              <div key={term} className="flex justify-between py-3">
                <dt className="text-muted-foreground">{term}</dt>
                <dd className="font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </SheetBody>
        <SheetFooter>
          <SheetClose intent="primary" className="w-full">
            Place a bid
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
