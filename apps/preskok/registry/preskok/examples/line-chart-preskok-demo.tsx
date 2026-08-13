"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { LineChart } from "@/registry/preskok/ui/preskok-ui/line-chart"

const data = [
  { month: "M1", sales: 44, leads: 24 },
  { month: "M2", sales: 51, leads: 28 },
  { month: "M3", sales: 48, leads: 26 },
  { month: "M4", sales: 63, leads: 34 },
  { month: "M5", sales: 58, leads: 31 },
  { month: "M6", sales: 72, leads: 39 },
  { month: "M7", sales: 69, leads: 36 },
  { month: "M8", sales: 76, leads: 42 },
  { month: "M9", sales: 71, leads: 38 },
  { month: "M10", sales: 84, leads: 45 },
  { month: "M11", sales: 79, leads: 43 },
  { month: "M12", sales: 91, leads: 49 },
]

export default function LineChartPreskokDemo() {
  return (
    <Card className="w-3xl max-w-full">
      <CardHeader>
        <CardTitle>Dealership performance</CardTitle>
        <CardDescription>Sales vs Leads per month</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          data={data}
          dataKey="month"
          lineType="monotone"
          config={{ sales: { label: "Sales" }, leads: { label: "Leads" } }}
        />
      </CardContent>
    </Card>
  )
}
