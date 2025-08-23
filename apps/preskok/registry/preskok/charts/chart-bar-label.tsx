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
import type { ChartConfig } from "@/registry/preskok/ui/preskok-ui/chart-helpers"
import { BarChart } from "@/registry/preskok/ui/preskok-ui/chart-helpers"

export const description = "A bar chart with a label"

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

export function ChartBarLabel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          data={chartData}
          dataKey="month"
          config={chartConfig}
          type="default"
          tooltip={true}
          tooltipProps={{
            cursor: false,
            hideLabel: true,
          }}
          hideGridLines={false}
          cartesianGridProps={{ vertical: false }}
          xAxisProps={{
            tickLine: false,
            tickMargin: 10,
            axisLine: false,
            tickFormatter: (value) => value.slice(0, 3),
          }}
          barRadius={8}
          showLabels={true}
          labelProps={{
            position: "top",
            offset: 12,
            className: "fill-foreground",
            fontSize: 12,
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
