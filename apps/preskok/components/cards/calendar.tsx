"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { DateRangePicker } from "@/registry/preskok/ui/preskok-ui/date-range-picker"

export function CardsCalendar() {
  return (
    <Card className="col-span-2 hidden place-items-center sm:flex">
      <CardHeader>
        <CardTitle>Shipments by Date</CardTitle>
        <CardDescription>
          Select a date range to analyze pickups, deliveries, and transit
          performance across your fleet.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="flex flex-col gap-4">
          <DateRangePicker className="max-w-max" label="Shipment window" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground text-xs">
                Deliveries scheduled
              </div>
              <div className="text-lg font-semibold">128</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground text-xs">On‑time rate</div>
              <div className="text-lg font-semibold">96.2%</div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground text-xs">
                Avg. transit time
              </div>
              <div className="text-lg font-semibold">1.8 days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
