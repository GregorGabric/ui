"use client"

import { Area, AreaChart as AreaChartPrimitive } from "recharts"

import {
  CartesianGrid,
  Chart,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/registry/preskok/ui/preskok-ui/chart"

type DataPoint = {
  day: string
  SUV: number
  Sedan: number
}

const data: Array<DataPoint> = [
  { day: "Day 1", SUV: 220, Sedan: 130 },
  { day: "Day 2", SUV: 280, Sedan: 160 },
  { day: "Day 3", SUV: 240, Sedan: 140 },
  { day: "Day 4", SUV: 340, Sedan: 210 },
  { day: "Day 5", SUV: 310, Sedan: 190 },
  { day: "Day 6", SUV: 380, Sedan: 230 },
  { day: "Day 7", SUV: 360, Sedan: 220 },
]

export default function ChartPreskokDemo() {
  const config = {
    SUV: { label: "SUV", color: "#2563eb" },
    Sedan: { label: "Sedan", color: "#60a5fa" },
  }

  return (
    <Chart className="h-56 w-full" data={data} dataKey="day" config={config}>
      {() => (
        <AreaChartPrimitive
          data={data}
          margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis />
          <ChartLegend content={<ChartLegendContent />} />
          <ChartTooltip content={<ChartTooltipContent accessibilityLayer />} />
          <Area
            type="monotone"
            dataKey="SUV"
            stroke="var(--color-SUV)"
            fill="var(--color-SUV)"
            fillOpacity={0.3}
            isAnimationActive
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="Sedan"
            stroke="var(--color-Sedan)"
            fill="var(--color-Sedan)"
            fillOpacity={0.3}
            isAnimationActive
            dot={false}
          />
        </AreaChartPrimitive>
      )}
    </Chart>
  )
}
