"use client"

import { AreaChart } from "@/registry/preskok/ui/preskok-ui/area-chart"

type DataPoint = {
  day: string
  SUV: number
  Sedan: number
}

const data: DataPoint[] = [
  { day: "Day 1", SUV: 220, Sedan: 130 },
  { day: "Day 2", SUV: 280, Sedan: 160 },
  { day: "Day 3", SUV: 240, Sedan: 140 },
  { day: "Day 4", SUV: 340, Sedan: 210 },
  { day: "Day 5", SUV: 310, Sedan: 190 },
  { day: "Day 6", SUV: 380, Sedan: 230 },
  { day: "Day 7", SUV: 360, Sedan: 220 },
]

export default function ChartPreskokDemo() {
  return (
    <div className="w-3xl max-w-full">
      <AreaChart
        ariaLabel="SUV and sedan sales over seven days"
        config={{
          SUV: { label: "SUV", color: "var(--chart-1)" },
          Sedan: { label: "Sedan", color: "var(--chart-2)" },
        }}
        data={data}
        dataKey="day"
        fillType="gradient"
        lineType="monotone"
        type="stacked"
      />
    </div>
  )
}
