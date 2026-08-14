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
import { RadarChart } from "@/registry/preskok/ui/preskok-ui/radar-chart"

const readinessData = [
  { metric: "Reliability", current: 88, previous: 75 },
  { metric: "Security", current: 82, previous: 78 },
  { metric: "Performance", current: 74, previous: 68 },
  { metric: "Accessibility", current: 91, previous: 80 },
  { metric: "Coverage", current: 69, previous: 64 },
  { metric: "Observability", current: 84, previous: 72 },
]

export default function RadarChartPreskokDemo() {
  return (
    <Card className="w-xl max-w-full">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Release readiness</CardTitle>
        <CardDescription>Current release compared with v2.8</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <RadarChart
          chartProps={{ height: 330 }}
          className="mx-auto max-w-lg"
          data={readinessData}
          dataKey="metric"
          maxValue={100}
          tooltipProps={{ hideLabel: false }}
          valueFormatter={(value) => `${value}%`}
          config={{
            current: { label: "Current", color: "var(--chart-1)" },
            previous: { label: "Previous", color: "var(--chart-2)" },
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Readiness improved across all six dimensions
          <TrendingUp aria-hidden className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Values are normalized to a shared 0–100 scale
        </div>
      </CardFooter>
    </Card>
  )
}
