import {
  AreaChart,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "preskok"

type SalesPoint = {
  day: string
  suv: number
  sedan: number
  truck: number
}

const salesData: Array<SalesPoint> = [
  { day: "Day 1", suv: 42, sedan: 31, truck: 18 },
  { day: "Day 2", suv: 55, sedan: 39, truck: 24 },
  { day: "Day 3", suv: 48, sedan: 34, truck: 21 },
  { day: "Day 4", suv: 68, sedan: 46, truck: 32 },
  { day: "Day 5", suv: 61, sedan: 41, truck: 28 },
]

export function Basic() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Qualified pipeline last 5d</CardTitle>
        <CardDescription>
          Daily opportunity value grouped by segment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart
          className="h-56 w-full"
          data={salesData}
          dataKey="day"
          lineType="monotone"
          fillType="solid"
          valueFormatter={(value) => `$${value}k`}
          xAxisProps={{ interval: 0 }}
          tooltipProps={{ indicator: "line" }}
          config={{
            suv: { label: "Enterprise", color: "var(--chart-1)" },
            sedan: { label: "Mid-market", color: "var(--chart-2)" },
            truck: { label: "Startup", color: "var(--chart-3)" },
          }}
        />
      </CardContent>
    </Card>
  )
}
