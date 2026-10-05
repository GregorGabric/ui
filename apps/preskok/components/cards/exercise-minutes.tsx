"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import type { ChartConfig } from "@/registry/preskok/ui/preskok-ui/chart"
import { LineChart } from "@/registry/preskok/ui/preskok-ui/line-chart"

const data = [
  {
    average: 400,
    today: 240,
    day: "Monday",
  },
  {
    average: 300,
    today: 139,
    day: "Tuesday",
  },
  {
    average: 200,
    today: 980,
    day: "Wednesday",
  },
  {
    average: 278,
    today: 390,
    day: "Thursday",
  },
  {
    average: 189,
    today: 480,
    day: "Friday",
  },
  {
    average: 239,
    today: 380,
    day: "Saturday",
  },
  {
    average: 349,
    today: 430,
    day: "Sunday",
  },
]

const chartConfig = {
  today: {
    label: "Today",
    color: "var(--chart-1)",
  },
  average: {
    label: "Average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function CardsExerciseMinutes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transit Time Trends</CardTitle>
        <CardDescription>
          Your average vehicle transit times are improving week over week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          data={data}
          dataKey="day"
          config={chartConfig}
          xAxis={{
            tickFormatter: (value) => String(value).slice(0, 3),
            tickMargin: 8,
          }}
        />
      </CardContent>
    </Card>
  )
}
