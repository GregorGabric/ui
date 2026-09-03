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
import { ExperimentalPieChart } from "@/registry/preskok/ui/preskok-ui/experimental-pie-chart"

const chartData = [
  { month: "january", desktop: 186, mobile: 80 },
  { month: "february", desktop: 305, mobile: 200 },
  { month: "march", desktop: 237, mobile: 120 },
  { month: "april", desktop: 173, mobile: 190 },
  { month: "may", desktop: 209, mobile: 130 },
]

export default function ExperimentalPieChartStackedPreskokDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Pie Chart - Stacked</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalPieChart
          ariaLabel="Pie Chart - Stacked"
          className="mx-auto"
          data={chartData}
          dataKey="desktop"
          nameKey="month"
          rings={[
            { dataKey: "desktop", outerRadius: 60 },
            { dataKey: "mobile", innerRadius: 70, outerRadius: 90 },
          ]}
          size={{ height: 250 }}
          variant="donut"
          pieProps={{ stroke: "var(--background)", strokeWidth: 2 }}
          legend={false}
          config={{
            january: { label: "January", color: "var(--chart-1)" },
            february: { label: "February", color: "var(--chart-2)" },
            march: { label: "March", color: "var(--chart-3)" },
            april: { label: "April", color: "var(--chart-4)" },
            may: { label: "May", color: "var(--chart-5)" },
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
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
