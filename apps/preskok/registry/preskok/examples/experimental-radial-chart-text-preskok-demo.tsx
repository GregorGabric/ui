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

const chartData = [{ browser: "safari", visitors: 200 }]

export default function ExperimentalRadialChartTextPreskokDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Radial Chart - Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadialChart
          ariaLabel="Radial Chart - Text"
          className="mx-auto"
          data={chartData}
          dataKey="visitors"
          endAngle={(-Math.PI * 8) / 9}
          maxValue={200}
          nameKey="browser"
          size={{ height: 250 }}
          startAngle={Math.PI / 2}
          centerLabel="Visitors"
          centerValue="200"
          tooltipProps={{ hideLabel: true }}
          legend={false}
          config={{
            safari: { label: "Safari", color: "var(--chart-2)" },
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
