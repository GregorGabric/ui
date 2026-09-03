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

const chartData = [{ browser: "safari", visitors: 1260 }]

export default function ExperimentalRadialChartShapePreskokDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Radial Chart - Shape</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadialChart
          ariaLabel="Radial Chart - Shape"
          className="mx-auto"
          data={chartData}
          dataKey="visitors"
          nameKey="browser"
          size={{ height: 250 }}
          endAngle={-Math.PI / 18}
          maxValue={1260}
          startAngle={Math.PI / 2}
          centerLabel="Visitors"
          centerValue="1,260"
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
