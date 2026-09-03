"use client"

import { useState } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { ExperimentalLineChart } from "@/registry/preskok/ui/preskok-ui/experimental-line-chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" as const },
  mobile: { label: "Mobile", color: "var(--chart-2)" as const },
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export default function ExperimentalLineChartInteractivePreskokDemo() {
  const [timeRange, setTimeRange] = useState("90d")
  let daysToSubtract = 90
  if (timeRange === "30d") {
    daysToSubtract = 30
  } else if (timeRange === "7d") {
    daysToSubtract = 7
  }

  const referenceDate = new Date("2024-06-30")
  const startDate = new Date(referenceDate)
  startDate.setDate(startDate.getDate() - daysToSubtract)
  const filteredData = chartData.filter(
    (item) => new Date(item.date) >= startDate
  )

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Line Chart - Interactive</CardTitle>
        <CardDescription>
          Showing total visitors for the last 3 months
        </CardDescription>
        <CardAction>
          <Select
            aria-label="Time range"
            className="w-40"
            value={timeRange}
            onChange={(key) => {
              if (typeof key === "string") {
                setTimeRange(key)
              }
            }}
          >
            <SelectTrigger />
            <SelectContent>
              <SelectSection>
                <SelectItem id="90d">Last 3 months</SelectItem>
                <SelectItem id="30d">Last 30 days</SelectItem>
                <SelectItem id="7d">Last 7 days</SelectItem>
              </SelectSection>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ExperimentalLineChart
          ariaLabel="Line Chart - Interactive"
          config={chartConfig}
          data={filteredData}
          dataKey="date"
          lineType="natural"
          size={{ height: 250 }}
          tooltipProps={{
            indicator: "line",
            labelFormatter: (label) => formatDate(String(label)),
          }}
          xAxis={{
            minTickGap: 32,
            tickFormatter: (value) => formatDate(String(value)),
          }}
          yAxis={false}
        />
      </CardContent>
    </Card>
  )
}
