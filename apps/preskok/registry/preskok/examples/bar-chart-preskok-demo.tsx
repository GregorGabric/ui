"use client"

import { TrendingUp } from "lucide-react"

import { BarChart } from "@/registry/preskok/ui/preskok-ui/bar-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"

type SupportPoint = {
  api: number
  billing: number
  day: string
}

const supportData: Array<SupportPoint> = [
  { api: 42, billing: 31, day: "Day 1" },
  { api: 55, billing: 39, day: "Day 2" },
  { api: 48, billing: 34, day: "Day 3" },
  { api: 68, billing: 46, day: "Day 4" },
  { api: 61, billing: 41, day: "Day 5" },
  { api: 74, billing: 52, day: "Day 6" },
]

export default function BarChartPreskokDemo() {
  return (
    <Card className="w-lg max-w-full">
      <CardHeader>
        <CardTitle>Support workload</CardTitle>
        <CardDescription>Last 6 days</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <BarChart
          data={supportData}
          dataKey="day"
          type="stacked"
          size={{ height: 240 }}
          valueFormatter={(value) => `${value} tickets`}
          tooltipProps={{ hideLabel: true }}
          config={{
            api: { label: "API", color: "var(--chart-1)" },
            billing: { label: "Billing", color: "var(--chart-2)" },
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Workload up 9.4% this week
          <TrendingUp aria-hidden className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Open tickets across API and billing queues
        </div>
      </CardFooter>
    </Card>
  )
}
