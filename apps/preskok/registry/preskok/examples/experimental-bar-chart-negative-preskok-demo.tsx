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
import { ExperimentalBarChart } from "@/registry/preskok/ui/preskok-ui/experimental-bar-chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 205 },
  { month: "March", desktop: -207 },
  { month: "April", desktop: 173 },
  { month: "May", desktop: -209 },
  { month: "June", desktop: 214 },
]

export default function ExperimentalBarChartNegativePreskokDemo() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Bar Chart - Negative</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalBarChart
          ariaLabel="Bar Chart - Negative"
          barProps={{
            fill: (row) =>
              Number(row.value) < 0 ? "var(--chart-2)" : "var(--chart-1)",
          }}
          barRadius={0}
          data={chartData}
          dataKey="month"
          label="category"
          size={{ height: 250 }}

          valueAxis={false}
          legend={false}
          categoryAxis={false}
          config={{
            desktop: { label: "Desktop", color: "var(--chart-1)" },
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
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
