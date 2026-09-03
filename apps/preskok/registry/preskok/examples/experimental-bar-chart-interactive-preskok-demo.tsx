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
import { ExperimentalBarChart } from "@/registry/preskok/ui/preskok-ui/experimental-bar-chart"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/preskok/ui/preskok-ui/toggle-group"

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

export default function ExperimentalBarChartInteractivePreskokDemo() {
  const [activeSeries, setActiveSeries] = useState<"desktop" | "mobile">(
    "desktop"
  )
  const total = chartData.reduce((sum, item) => sum + item[activeSeries], 0)

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Bar Chart - Interactive</CardTitle>
        <CardDescription>
          Showing total visitors for the last 3 months
        </CardDescription>
        <CardAction>
          <ToggleGroup
            aria-label="Visitor series"
            selectedKeys={[activeSeries]}
            selectionMode="single"
            onSelectionChange={(keys) => {
              const key = [...keys][0]
              if (key === "desktop" || key === "mobile") {
                setActiveSeries(key)
              }
            }}
          >
            <ToggleGroupItem id="desktop">Desktop</ToggleGroupItem>
            <ToggleGroupItem id="mobile">Mobile</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-3xl font-semibold tracking-tight tabular-nums">
          {total.toLocaleString()}
        </div>
        <ExperimentalBarChart
          ariaLabel="Bar Chart - Interactive"
          categoryAxis={{
            minTickGap: 32,
            tickFormatter: (value) => formatDate(String(value)),
          }}
          config={{
            [activeSeries]: chartConfig[activeSeries],
          }}
          data={chartData}
          dataKey="date"
          legend={false}
          size={{ height: 250 }}
          tooltipProps={{
            hideLabel: false,
            labelFormatter: (label) => formatDate(String(label)),
          }}
          valueAxis={false}
        />
      </CardContent>
    </Card>
  )
}
