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
import { RadialChart } from "@/registry/preskok/ui/preskok-ui/radial-chart"

const attainmentData = [
  { name: "Onboarding", value: 86 },
  { name: "Activation", value: 74 },
  { name: "Retention", value: 92 },
]

export default function RadialChartPreskokDemo() {
  return (
    <Card className="w-lg max-w-full">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Customer journey health</CardTitle>
        <CardDescription>Quarterly target attainment</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <RadialChart
          centerLabel="Average"
          className="mx-auto max-w-sm"
          data={attainmentData}
          dataKey="value"
          maxValue={100}
          nameKey="name"
          tooltipProps={{ hideLabel: true }}
          valueFormatter={(value) => `${Math.round(value)}%`}
          config={{
            Onboarding: { label: "Onboarding", color: "var(--chart-1)" },
            Activation: { label: "Activation", color: "var(--chart-2)" },
            Retention: { label: "Retention", color: "var(--chart-3)" },
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Retention is 7% above target
          <TrendingUp aria-hidden className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Select a ring or legend item to inspect a stage
        </div>
      </CardFooter>
    </Card>
  )
}
