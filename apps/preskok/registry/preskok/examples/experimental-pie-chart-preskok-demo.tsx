"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { ExperimentalPieChart } from "@/registry/preskok/ui/preskok-ui/experimental-pie-chart"

export default function ExperimentalPieChartPreskokDemo() {
  const data = [
    { name: "Product", amount: 420 },
    { name: "Sales", amount: 580 },
    { name: "Support", amount: 260 },
    { name: "Success", amount: 180 },
  ]

  return (
    <Card className="w-xl max-w-full">
      <CardHeader className="text-center">
        <CardTitle>Weekly request mix</CardTitle>
        <CardDescription>
          Inbound requests grouped by owning team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalPieChart
          centerLabel="Total requests"
          className="mx-auto max-w-md"
          data={data}
          dataKey="amount"
          nameKey="name"
          variant="donut"
          valueFormatter={(value) => value.toLocaleString()}
          pieProps={{ paddingAngle: 2, cornerRadius: 3 }}
          config={{
            Product: {
              color: "var(--chart-1)",
              label: "Product",
            },
            Sales: {
              color: "var(--chart-2)",
              label: "Sales",
            },
            Support: {
              color: "var(--chart-3)",
              label: "Support",
            },
            Success: {
              color: "var(--chart-4)",
              label: "Success",
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
