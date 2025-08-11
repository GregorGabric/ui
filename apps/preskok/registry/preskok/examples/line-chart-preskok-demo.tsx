"use client"

import { useMemo } from "react"

import { Card } from "@/registry/preskok/ui/preskok-ui/card"
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
      <Card.Header>
        <Card.Title>Dealership performance</Card.Title>
        <Card.Description>Sales vs Leads per month</Card.Description>
      </Card.Header>
      <Card.Content>
        <LineChart
          className="aspect-video h-56 min-h-[224px] sm:h-72 sm:min-h-[288px]"
          data={data}
          dataKey="month"
          config={{ sales: { label: "Sales" }, leads: { label: "Leads" } }}
        />
      </Card.Content>
    </Card>
  )
}
