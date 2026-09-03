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
import { ExperimentalLineChart } from "@/registry/preskok/ui/preskok-ui/experimental-line-chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

export default function ExperimentalLineChartLabelCustomPreskokDemo() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Line Chart - Custom Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalLineChart
          ariaLabel="Line Chart - Custom Label"
          data={chartData}
          dataKey="month"
          size={{ height: 250 }}
          xAxis={{
            tickFormatter: (value) => String(value).slice(0, 3),
          }}
          lineType="natural"
          label="category"
          yAxis={false}
          legend={false}
          config={{
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
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
