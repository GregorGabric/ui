"use client"

import { useMemo } from "react"

import { Card } from "@/registry/preskok/ui/preskok-ui/card"
import { PieChart } from "@/registry/preskok/ui/preskok-ui/pie-chart"

export function Component() {
  const data = useMemo(
    () => [
      { name: "Sedan", amount: 420 },
      { name: "SUV", amount: 580 },
      { name: "Truck", amount: 260 },
      { name: "EV", amount: 180 },
    ],
    []
  )

  return (
    <Card>
      <Card.Header className="text-center">
        <Card.Title>Vehicle category breakdown</Card.Title>
        <Card.Description>
          Share of inventory by vehicle category.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <PieChart
          className="mx-auto h-56"
          data={data}
          dataKey="amount"
          nameKey="name"
          config={{
            Sedan: { label: "Sedan" },
            SUV: { label: "SUV" },
            Truck: { label: "Truck" },
            EV: { label: "EV" },
          }}
        />
      </Card.Content>
    </Card>
  )
}
