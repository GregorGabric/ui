import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ExperimentalAreaChart,
  ExperimentalBarChart,
} from "preskok"

type DataPoint = {
  day: string
  SUV: number
  Sedan: number
}

const data: Array<DataPoint> = [
  { day: "Day 1", SUV: 220, Sedan: 130 },
  { day: "Day 2", SUV: 280, Sedan: 160 },
  { day: "Day 3", SUV: 240, Sedan: 140 },
  { day: "Day 4", SUV: 340, Sedan: 210 },
  { day: "Day 5", SUV: 310, Sedan: 190 },
]

const config = {
  SUV: { label: "SUV", color: "var(--chart-1)" },
  Sedan: { label: "Sedan", color: "var(--chart-2)" },
}

export function ChartFrame() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Vehicle sales</CardTitle>
        <CardDescription>
          Shared chart frame: tooltip, legend and theming.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalAreaChart
          ariaLabel="SUV and sedan sales over five days"
          config={config}
          data={data}
          dataKey="day"
          fillType="gradient"
          lineType="monotone"
          size={{ height: 200 }}
          type="stacked"
          valueFormatter={(value) => `${value} units`}
        />
      </CardContent>
    </Card>
  )
}

export function SharedPrimitives() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Same frame, different mark</CardTitle>
        <CardDescription>
          The chart primitive drives every experimental chart.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalBarChart
          ariaLabel="SUV and sedan sales over five days"
          config={config}
          data={data}
          dataKey="day"
          size={{ height: 200 }}
          type="stacked"
          valueFormatter={(value) => `${value} units`}
        />
      </CardContent>
    </Card>
  )
}
