import {
  BarChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "preskok"

type TicketPoint = {
  day: string
  api: number
  billing: number
  access: number
}

const ticketData: Array<TicketPoint> = [
  { day: "Day 1", api: 42, billing: 31, access: 18 },
  { day: "Day 2", api: 55, billing: 39, access: 24 },
  { day: "Day 3", api: 48, billing: 34, access: 21 },
  { day: "Day 4", api: 68, billing: 46, access: 32 },
  { day: "Day 5", api: 61, billing: 41, access: 28 },
]

export function Basic() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Support workload last 5d</CardTitle>
        <CardDescription>
          Open tickets by queue, stacked by day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          className="h-56 w-full"
          data={ticketData}
          dataKey="day"
          type="stacked"
          barRadius={6}
          valueFormatter={(value) => `${value} tickets`}
          xAxisProps={{ interval: 0 }}
          tooltipProps={{ indicator: "dashed" }}
          config={{
            api: { label: "API", color: "var(--chart-1)" },
            billing: { label: "Billing", color: "var(--chart-2)" },
            access: { label: "Access", color: "var(--chart-4)" },
          }}
        />
      </CardContent>
    </Card>
  )
}
