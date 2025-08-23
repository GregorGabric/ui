"use client"

import { TrendingUp } from "lucide-react"
import { LineChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import type { ChartConfig } from "@/registry/preskok/ui/preskok-ui/chart-helpers"

// import { LineChart } from "@/registry/preskok/ui/preskok-ui/chart-helpers"

export const description = "A linear line chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLineLinear() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Linear</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          data={chartData}
          dataKey="month"
          config={chartConfig}
          type="default"
          lineType="linear"
          tooltip={true}
          tooltipProps={{
            cursor: false,
            hideLabel: true,
          }}
          hideGridLines={false}
          cartesianGridProps={{ vertical: false }}
          xAxisProps={{
            tickLine: false,
            axisLine: false,
            tickMargin: 8,
            tickFormatter: (value) => value.slice(0, 3),
          }}
          lineProps={{
            strokeWidth: 2,
            dot: false,
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
