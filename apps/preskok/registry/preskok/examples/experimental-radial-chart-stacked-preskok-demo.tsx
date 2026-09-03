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
  { browser: "mobile", visitors: 570 },
  { browser: "desktop", visitors: 1260 },
]

export default function ExperimentalRadialChartStackedPreskokDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Radial Chart - Stacked</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadialChart
          ariaLabel="Radial Chart - Stacked"
          className="mx-auto"
          data={chartData}
          dataKey="visitors"
          endAngle={-Math.PI / 2}
          layout="stacked"
          maxValue={1830}
          nameKey="browser"
          size={{ height: 250 }}
          startAngle={Math.PI / 2}
          track="hidden"
          centerLabel="Visitors"
          tooltipProps={{ hideLabel: true }}
          config={{
            mobile: { label: "Mobile", color: "var(--chart-2)" },
            desktop: { label: "Desktop", color: "var(--chart-1)" },
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
