import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LineChart,
} from "preskok"

const data = [
  { month: "M1", sales: 44, leads: 24 },
  { month: "M2", sales: 51, leads: 28 },
  { month: "M3", sales: 48, leads: 26 },
  { month: "M4", sales: 63, leads: 34 },
  { month: "M5", sales: 58, leads: 31 },
  { month: "M6", sales: 72, leads: 39 },
]

export function Basic() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Dealership performance</CardTitle>
        <CardDescription>Sales vs Leads per month</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          className="h-56 w-full"
          data={data}
          dataKey="month"
          config={{ sales: { label: "Sales" }, leads: { label: "Leads" } }}
        />
      </CardContent>
    </Card>
  )
}
