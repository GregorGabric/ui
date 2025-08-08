"use client"

import { useMemo } from "react"
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
  Desktop: number
  Mobile: number
}

export default function ChartPreskokDemo() {
  const data: Array<DataPoint> = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        day: `Day ${i + 1}`,
        Desktop: Math.floor(100 + Math.random() * 300),
        Mobile: Math.floor(50 + Math.random() * 200),
      })),
    []
  )

  const config = {
    Desktop: { label: "Desktop", color: "#2563eb" },
    Mobile: { label: "Mobile", color: "#60a5fa" },
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
            dataKey="Desktop"
            stroke="var(--color-Desktop)"
            fill="var(--color-Desktop)"
            fillOpacity={0.3}
            isAnimationActive
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="Mobile"
            stroke="var(--color-Mobile)"
            fill="var(--color-Mobile)"
            fillOpacity={0.3}
            isAnimationActive
            dot={false}
          />
        </AreaChartPrimitive>
      )}
    </Chart>
  )
}
