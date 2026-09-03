"use client"

import { Monitor, Smartphone, TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { ExperimentalAreaChart } from "@/registry/preskok/ui/preskok-ui/experimental-area-chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export default function ExperimentalAreaChartIconsPreskokDemo() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Area Chart - Icons</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalAreaChart
          ariaLabel="Area Chart - Icons"
          data={chartData}
          dataKey="month"
          size={{ height: 250 }}
          xAxis={{
            tickFormatter: (value) => String(value).slice(0, 3),
          }}
          fillType="gradient"
          lineType="natural"
          type="stacked"
          yAxis={false}
          config={{
            desktop: {
              label: "Desktop",
              color: "var(--chart-1)",
              icon: Monitor,
            },
            mobile: {
              label: "Mobile",
              color: "var(--chart-2)",
              icon: Smartphone,
            },
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <TrendingUp aria-hidden className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
