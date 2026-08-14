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
    <Card className="w-xl max-w-full">
      <CardHeader className="text-center">
        <CardTitle>Weekly request mix</CardTitle>
        <CardDescription>
          Inbound requests grouped by owning team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart
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
              label: "Product",
              theme: {
                light: "oklch(0.55 0.22 264)",
                dark: "oklch(0.68 0.2 258)",
              },
            },
            Sales: {
              label: "Sales",
              theme: {
                light: "oklch(0.62 0.17 220)",
                dark: "oklch(0.72 0.15 220)",
              },
            },
            Support: {
              label: "Support",
              theme: {
                light: "oklch(0.62 0.14 165)",
                dark: "oklch(0.73 0.14 165)",
              },
            },
            Success: {
              label: "Success",
              theme: {
                light: "oklch(0.72 0.16 78)",
                dark: "oklch(0.8 0.15 82)",
              },
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
