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
  { browser: "chrome", visitors: 187 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 275 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const browserColors: Record<string, string> = {
  chrome: "var(--chart-1)",
  safari: "var(--chart-2)",
  firefox: "var(--chart-3)",
  edge: "var(--chart-4)",
  other: "var(--chart-5)",
}

export default function ExperimentalBarChartActivePreskokDemo() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Bar Chart - Active</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalBarChart
          ariaLabel="Bar Chart - Active"
          barProps={{
            fill: (row) => {
              const color = browserColors[String(row.category)]
              return row.category === "firefox"
                ? `color-mix(in srgb, ${color} 80%, transparent)`
                : color
            },
            stroke: (row) =>
              row.category === "firefox" ? "var(--chart-3)" : "none",
            strokeDasharray: (row) =>
              row.category === "firefox" ? "4 4" : "none",
            strokeWidth: 2,
          }}
          data={chartData}
          dataKey="browser"
          size={{ height: 250 }}
          categoryAxis={{
            tickFormatter: (value) => String(value).slice(0, 3),
          }}
          valueAxis={false}
          legend={false}
          config={{
            visitors: { label: "Visitors", color: "var(--chart-1)" },
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
