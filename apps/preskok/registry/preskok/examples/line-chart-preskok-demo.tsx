"use client"

import { useMemo } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { LineChart } from "@/registry/preskok/ui/preskok-ui/line-chart"

export default function LineChartPreskokDemo() {
  const data = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        month: `M${i + 1}`,
        sales: Math.floor(20 + Math.random() * 80),
        leads: Math.floor(10 + Math.random() * 50),
      })),
    []
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dealership performance</CardTitle>
        <CardDescription>Sales vs Leads per month</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          className="aspect-video h-56 min-h-[224px] sm:h-72 sm:min-h-[288px]"
          data={data}
          dataKey="month"
          config={{ sales: { label: "Sales" }, leads: { label: "Leads" } }}
        />
      </CardContent>
    </Card>
  )
}
