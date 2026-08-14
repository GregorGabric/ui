import { Chart } from "preskok"
import {
  Area,
  AreaChart as AreaChartPrimitive,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

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

export function Basic() {
  const config = {
    SUV: { label: "SUV", color: "var(--chart-1)" },
    Sedan: { label: "Sedan", color: "var(--chart-2)" },
  }

  return (
    <div className="w-full max-w-lg">
      <Chart className="h-56 w-full" data={data} dataKey="day" config={config}>
        <AreaChartPrimitive
          data={data}
          width={480}
          height={224}
          margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Legend />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="SUV"
            name="SUV"
            stroke="var(--color-SUV)"
            fill="var(--color-SUV)"
            fillOpacity={0.3}
            isAnimationActive={false}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="Sedan"
            name="Sedan"
            stroke="var(--color-Sedan)"
            fill="var(--color-Sedan)"
            fillOpacity={0.3}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChartPrimitive>
      </Chart>
    </div>
  )
}
