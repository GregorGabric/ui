"use client"

import { useMemo } from "react"

import { Card } from "@/registry/preskok/ui/preskok-ui/card"
import { LineChart } from "@/registry/preskok/ui/preskok-ui/line-chart"

export default function LineChartPreskokDemo() {
  const data = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        month: `M${i + 1}`,
        sales: Math.floor(200 + Math.random() * 400),
        profit: Math.floor(50 + Math.random() * 150),
      })),
    []
  )

  return (
    <Card>
      <Card.Header>
        <Card.Title>Performance</Card.Title>
        <Card.Description>Sales vs Profit per month</Card.Description>
      </Card.Header>
      <Card.Content>
        <LineChart
          className="aspect-video h-56 min-h-[224px] sm:h-72 sm:min-h-[288px]"
          data={data}
          dataKey="month"
          config={{ sales: { label: "Sales" }, profit: { label: "Profit" } }}
        />
      </Card.Content>
    </Card>
  )
}
