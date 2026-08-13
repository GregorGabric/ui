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
    average: 8.6,
    today: 7.8,
    day: "Monday",
  },
  {
    average: 8.3,
    today: 7.2,
    day: "Tuesday",
  },
  {
    average: 8.1,
    today: 7.5,
    day: "Wednesday",
  },
  {
    average: 7.8,
    today: 6.8,
    day: "Thursday",
  },
  {
    average: 7.5,
    today: 6.4,
    day: "Friday",
  },
  {
    average: 7.2,
    today: 6.1,
    day: "Saturday",
  },
  {
    average: 6.9,
    today: 5.7,
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
    color: "var(--chart-3)",
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
          ariaLabel="Daily transit time compared with the weekly average"
          data={data}
          dataKey="day"
          config={chartConfig}
          className="w-full"
          lineType="monotone"
          valueFormatter={(value) => `${value.toFixed(1)} h`}
          xAxisProps={{
            tickMargin: 8,
            tickFormatter: (value: string) => value.slice(0, 3),
          }}
        />
      </CardContent>
    </Card>
  )
}
