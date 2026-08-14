import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ExperimentalPieChart,
} from "preskok"

const data = [
  { name: "Product", amount: 420 },
  { name: "Sales", amount: 580 },
  { name: "Support", amount: 260 },
  { name: "Success", amount: 180 },
]

const config = {
  Product: { label: "Product", color: "var(--chart-1)" },
  Sales: { label: "Sales", color: "var(--chart-2)" },
  Support: { label: "Support", color: "var(--chart-3)" },
  Success: { label: "Success", color: "var(--chart-4)" },
}

export function Donut() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>Weekly request mix</CardTitle>
        <CardDescription>Inbound requests by owning team.</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalPieChart
          centerLabel="Total requests"
          className="mx-auto max-w-xs"
          config={config}
          data={data}
          dataKey="amount"
          nameKey="name"
          pieProps={{ paddingAngle: 2, cornerRadius: 3 }}
          size={{ height: 220 }}
          valueFormatter={(value) => value.toLocaleString()}
          variant="donut"
        />
      </CardContent>
    </Card>
  )
}

export function Pie() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>Request mix</CardTitle>
        <CardDescription>Full pie variant</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalPieChart
          className="mx-auto max-w-xs"
          config={config}
          data={data}
          dataKey="amount"
          nameKey="name"
          size={{ height: 220 }}
          valueFormatter={(value) => value.toLocaleString()}
          variant="pie"
        />
      </CardContent>
    </Card>
  )
}
