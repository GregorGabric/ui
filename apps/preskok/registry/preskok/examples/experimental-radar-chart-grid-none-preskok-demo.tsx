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
import { ExperimentalRadarChart } from "@/registry/preskok/ui/preskok-ui/experimental-radar-chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

export default function ExperimentalRadarChartGridNonePreskokDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Radar Chart - Grid None</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadarChart
          ariaLabel="Radar Chart - Grid None"
          className="mx-auto"
          data={chartData}
          dataKey="month"
          size={{ height: 250 }}
          grid={false}
          legend={false}
          config={{
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
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
