"use client"

import { PieChart } from "@/registry/preskok/ui/preskok-ui/pie-chart"

const data = [
  { name: "A", value: 30 },
  { name: "B", value: 50 },
  { name: "C", value: 20 },
]

export default function PieChartPreskokDemo() {
  return <PieChart data={data} labelKey="name" valueKey="value" />
}
