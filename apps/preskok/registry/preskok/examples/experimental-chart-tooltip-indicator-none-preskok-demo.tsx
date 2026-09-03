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
import { ExperimentalBarChart } from "@/registry/preskok/ui/preskok-ui/experimental-bar-chart"

const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
]

export default function ExperimentalChartTooltipIndicatorNonePreskokDemo() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Tooltip - No Indicator</CardTitle>
        <CardDescription>Tooltip with no indicator.</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalBarChart
          ariaLabel="Tooltip - No Indicator"
          data={chartData}
          dataKey="date"
          type="stacked"
          size={{ height: 250 }}
          categoryAxis={{
            tickFormatter: (value) =>
              new Date(String(value)).toLocaleDateString("en-US", {
                weekday: "short",
              }),
          }}
          valueAxis={false}
          legend={false}
          tooltipProps={{ defaultIndex: 1, hideIndicator: true }}
          config={{
            running: { label: "Running", color: "var(--chart-1)" },
            swimming: { label: "Swimming", color: "var(--chart-2)" },
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <TrendingUp aria-hidden className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Tooltip appearance for stacked activity totals.
        </div>
      </CardFooter>
    </Card>
  )
}
