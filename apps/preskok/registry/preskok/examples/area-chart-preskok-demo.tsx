"use client"

import { useMemo } from "react"

import { AreaChart } from "@/registry/preskok/ui/preskok-ui/area-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"

type SalesPoint = {
  day: string
  suv: number
  sedan: number
  truck: number
}

export default function AreaChartPreskokDemo() {
  const salesData: Array<SalesPoint> = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        day: `Day ${i + 1}`,
        suv: Math.floor(20 + Math.random() * 60),
        sedan: Math.floor(15 + Math.random() * 50),
        truck: Math.floor(10 + Math.random() * 40),
      })),
    []
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle sales last 7d</CardTitle>
        <CardDescription>
          Sales volume across SUV, Sedan, and Truck segments for the last 7
          days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart
          className="aspect-video h-56 min-h-[224px] sm:h-72 sm:min-h-[288px]"
          data={salesData}
          dataKey="day"
          xAxisProps={{ interval: 0 }}
          config={{
            suv: { label: "SUV" },
            sedan: { label: "Sedan" },
            truck: { label: "Truck" },
          }}
        />
      </CardContent>
    </Card>
  )
}
