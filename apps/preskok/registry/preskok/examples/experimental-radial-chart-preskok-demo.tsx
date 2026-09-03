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
import { ExperimentalRadialChart } from "@/registry/preskok/ui/preskok-ui/experimental-radial-chart"

const chartData = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

export default function ExperimentalRadialChartPreskokDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Radial Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadialChart
          ariaLabel="Radial Chart"
          className="mx-auto"
          data={chartData}
          dataKey="visitors"
          nameKey="browser"
          size={{ height: 250 }}
          tooltipProps={{ hideLabel: true }}
          config={{
            chrome: { label: "Chrome", color: "var(--chart-1)" },
            safari: { label: "Safari", color: "var(--chart-2)" },
            firefox: { label: "Firefox", color: "var(--chart-3)" },
            edge: { label: "Edge", color: "var(--chart-4)" },
            other: { label: "Other", color: "var(--chart-5)" },
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
