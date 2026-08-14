import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ExperimentalLineChart,
} from "preskok"

const data = [
  { month: "M1", sales: 44, leads: 24 },
  { month: "M2", sales: 51, leads: 28 },
  { month: "M3", sales: 48, leads: 26 },
  { month: "M4", sales: 63, leads: 34 },
  { month: "M5", sales: 58, leads: 31 },
  { month: "M6", sales: 72, leads: 39 },
]

const config = {
  sales: { label: "Sales", color: "var(--chart-1)" },
  leads: { label: "Leads", color: "var(--chart-2)" },
}

export function Monotone() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Dealership performance</CardTitle>
        <CardDescription>Sales vs leads per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalLineChart
          config={config}
          data={data}
          dataKey="month"
          lineType="monotone"
          size={{ height: 200 }}
          valueFormatter={(value) => `${value}k`}
        />
      </CardContent>
    </Card>
  )
}

export function Stepped() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Stepped interpolation</CardTitle>
        <CardDescription>Same series, step curve</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalLineChart
          config={config}
          data={data}
          dataKey="month"
          lineType="step"
          size={{ height: 200 }}
          valueFormatter={(value) => `${value}k`}
        />
      </CardContent>
    </Card>
  )
}
