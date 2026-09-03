"use client"

import { TrendingUp } from "lucide-react"

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
  { month: "January", other: 45, mobile: 80, desktop: 186 },
  { month: "February", other: 100, mobile: 200, desktop: 305 },
  { month: "March", other: 150, mobile: 120, desktop: 237 },
  { month: "April", other: 50, mobile: 190, desktop: 73 },
  { month: "May", other: 100, mobile: 130, desktop: 209 },
  { month: "June", other: 160, mobile: 140, desktop: 214 },
]

export default function ExperimentalAreaChartStackedExpandedPreskokDemo() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Area Chart - Stacked Expanded</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalAreaChart
          ariaLabel="Area Chart - Stacked Expanded"
          data={chartData}
          dataKey="month"
          size={{ height: 250 }}
          xAxis={{
            tickFormatter: (value) => String(value).slice(0, 3),
          }}
          fillType="gradient"
          lineType="natural"
          type="percent"
          yAxis={false}
          legend={false}
          config={{
            other: { label: "Other", color: "var(--chart-3)" },
            mobile: { label: "Mobile", color: "var(--chart-2)" },
            desktop: { label: "Desktop", color: "var(--chart-1)" },
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
