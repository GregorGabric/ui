import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ExperimentalBarChart,
} from "preskok"

type SupportPoint = {
  api: number
  billing: number
  day: string
}

const supportData: Array<SupportPoint> = [
  { api: 42, billing: 31, day: "Day 1" },
  { api: 55, billing: 39, day: "Day 2" },
  { api: 48, billing: 34, day: "Day 3" },
  { api: 68, billing: 46, day: "Day 4" },
  { api: 61, billing: 41, day: "Day 5" },
]

const config = {
  api: { label: "API", color: "var(--chart-1)" },
  billing: { label: "Billing", color: "var(--chart-2)" },
}

export function Stacked() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Support workload</CardTitle>
        <CardDescription>Open tickets, last 5 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalBarChart
          config={config}
          data={supportData}
          dataKey="day"
          size={{ height: 200 }}
          tooltipProps={{ hideLabel: true }}
          type="stacked"
          valueFormatter={(value) => `${value} tickets`}
        />
      </CardContent>
    </Card>
  )
}

export function Grouped() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Queue comparison</CardTitle>
        <CardDescription>Grouped bars per queue</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalBarChart
          barRadius={4}
          config={config}
          data={supportData}
          dataKey="day"
          size={{ height: 200 }}
          type="default"
          valueFormatter={(value) => `${value} tickets`}
        />
      </CardContent>
    </Card>
  )
}
