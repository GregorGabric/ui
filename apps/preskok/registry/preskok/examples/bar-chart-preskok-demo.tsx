"use client"

import { BarChart } from "@/registry/preskok/ui/preskok-ui/bar-chart"
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

const salesData: Array<SalesPoint> = [
  { day: "Day 1", suv: 42, sedan: 31, truck: 18 },
  { day: "Day 2", suv: 55, sedan: 39, truck: 24 },
  { day: "Day 3", suv: 48, sedan: 34, truck: 21 },
  { day: "Day 4", suv: 68, sedan: 46, truck: 32 },
  { day: "Day 5", suv: 61, sedan: 41, truck: 28 },
  { day: "Day 6", suv: 74, sedan: 52, truck: 36 },
  { day: "Day 7", suv: 70, sedan: 49, truck: 33 },
]

export default function BarChartPreskokDemo() {
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
        <BarChart
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
