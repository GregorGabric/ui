"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { PieChart } from "@/registry/preskok/ui/preskok-ui/pie-chart"

export default function PieChartPreskokDemo() {
  const data = [
    { name: "Product", amount: 420 },
    { name: "Sales", amount: 580 },
    { name: "Support", amount: 260 },
    { name: "Success", amount: 180 },
  ]

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Weekly request mix</CardTitle>
        <CardDescription>
          Inbound requests grouped by owning team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart
          className="mx-auto h-56"
          data={data}
          dataKey="amount"
          nameKey="name"
          variant="donut"
          showLabel
          valueFormatter={(value) => value.toLocaleString()}
          pieProps={{ paddingAngle: 3, cornerRadius: 4 }}
          config={{
            Product: { label: "Product", color: "var(--chart-1)" },
            Sales: { label: "Sales", color: "var(--chart-2)" },
            Support: { label: "Support", color: "var(--chart-3)" },
            Success: { label: "Success", color: "var(--chart-4)" },
          }}
        />
      </CardContent>
    </Card>
  )
}
