"use client"

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

const salesData: Array<SalesPoint> = [
  { day: "Day 1", suv: 42, sedan: 31, truck: 18 },
  { day: "Day 2", suv: 55, sedan: 39, truck: 24 },
  { day: "Day 3", suv: 48, sedan: 34, truck: 21 },
  { day: "Day 4", suv: 68, sedan: 46, truck: 32 },
  { day: "Day 5", suv: 61, sedan: 41, truck: 28 },
  { day: "Day 6", suv: 74, sedan: 52, truck: 36 },
  { day: "Day 7", suv: 70, sedan: 49, truck: 33 },
]

export default function AreaChartPreskokDemo() {
  return (
    <Card className="w-3xl max-w-full">
      <CardHeader>
        <CardTitle>Qualified pipeline last 7d</CardTitle>
        <CardDescription>
          Daily opportunity value grouped by segment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart
          data={salesData}
          dataKey="day"
          fillType="gradient"
          lineType="monotone"
          type="stacked"
          valueFormatter={(value) => `$${value}k`}
          tooltipProps={{ indicator: "line" }}
          config={{
            suv: { label: "Enterprise", color: "var(--chart-1)" },
            sedan: { label: "Mid-market", color: "var(--chart-2)" },
            truck: { label: "Startup", color: "var(--chart-3)" },
          }}
        />
      </CardContent>
    </Card>
  )
}
