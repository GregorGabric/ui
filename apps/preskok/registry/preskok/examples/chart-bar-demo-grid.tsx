"use client"

import { Bar, BarChart, CartesianGrid } from "recharts"

import { ChartConfig, ChartContainer } from "@/registry/preskok/ui/chart"

const chartData = [
  { month: "January", suv: 186, sedan: 80 },
  { month: "February", suv: 305, sedan: 200 },
  { month: "March", suv: 237, sedan: 120 },
  { month: "April", suv: 73, sedan: 190 },
  { month: "May", suv: 209, sedan: 130 },
  { month: "June", suv: 214, sedan: 140 },
]

const chartConfig = {
  suv: {
    label: "SUV",
    color: "#2563eb",
  },
  sedan: {
    label: "Sedan",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <Bar dataKey="suv" fill="var(--color-suv)" radius={4} />
        <Bar dataKey="sedan" fill="var(--color-sedan)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
