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

const services = [
  ["14 Aug 2026", "98,420 km", "Annual service, cabin filter"],
  ["2 Mar 2026", "91,050 km", "Winter tyres fitted"],
  ["19 Sep 2025", "84,700 km", "Brake pads and discs, front axle"],
  ["7 Jun 2025", "80,110 km", "Annual service, oil and filter"],
  ["28 Nov 2024", "73,900 km", "Battery replaced"],
  ["11 Jun 2024", "68,300 km", "Timing belt and water pump"],
  ["3 Jan 2024", "62,840 km", "Wiper blades, washer pump"],
  ["22 Jun 2023", "57,200 km", "Annual service, air filter"],
  ["9 Dec 2022", "50,060 km", "Rear shock absorbers"],
  ["16 Jun 2022", "44,500 km", "Annual service, brake fluid"],
  ["4 Feb 2022", "38,900 km", "Software update, recall 23V-114"],
  ["30 Jun 2021", "31,250 km", "Annual service, oil and filter"],
  ["12 Jan 2021", "24,800 km", "Windscreen replaced"],
  ["18 Jun 2020", "16,400 km", "First service"],
]

export default function SheetScrollableDemo() {
  return (
    <Sheet>
      <Button intent="outline">Service history</Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Service history</SheetTitle>
          <SheetDescription>
            Škoda Superb 2.0 TDI · {services.length} records
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <ol className="divide-y text-sm">
            {services.map(([date, mileage, work]) => (
              <li key={date} className="grid gap-0.5 py-3">
                <span className="font-medium">{work}</span>
                <span className="text-muted-foreground tabular-nums">
                  {date} · {mileage}
                </span>
              </li>
            ))}
          </ol>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Close</SheetClose>
          <SheetClose intent="primary">Download PDF</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
