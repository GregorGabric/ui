"use client"

import { useMemo } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { PieChart } from "@/registry/preskok/ui/preskok-ui/pie-chart"

export default function PieChartPreskokDemo() {
  const data = useMemo(
    () => [
      { name: "Sedan", amount: 420 },
      { name: "SUV", amount: 580 },
      { name: "Truck", amount: 260 },
      { name: "EV", amount: 180 },
    ],
    []
  )

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Vehicle category breakdown</CardTitle>
        <CardDescription>
          Share of inventory by vehicle category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart
          className="mx-auto h-56"
          data={data}
          dataKey="amount"
          nameKey="name"
          config={{
            Sedan: { label: "Sedan" },
            SUV: { label: "SUV" },
            Truck: { label: "Truck" },
            EV: { label: "EV" },
          }}
        />
      </CardContent>
    </Card>
  )
}
