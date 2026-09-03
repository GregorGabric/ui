"use client"

import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { ExperimentalBarChart } from "@/registry/preskok/ui/preskok-ui/experimental-bar-chart"
import { getExperimentalLabel } from "@/registry/preskok/ui/preskok-ui/experimental-chart"

const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
]

const chartConfig = {
  running: { label: "Running", color: "var(--chart-1)" as const },
  swimming: { label: "Swimming", color: "var(--chart-2)" as const },
}

export default function ExperimentalChartTooltipAdvancedPreskokDemo() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Tooltip - Advanced</CardTitle>
        <CardDescription>
          Tooltip with custom formatter and total.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalBarChart
          ariaLabel="Tooltip - Advanced"
          config={chartConfig}
          data={chartData}
          dataKey="date"
          legend={false}
          size={{ height: 250 }}
          type="stacked"
          categoryAxis={{
            tickFormatter: (value) =>
              new Date(String(value)).toLocaleDateString("en-US", {
                weekday: "short",
              }),
          }}
          valueAxis={false}
          tooltipProps={{ defaultIndex: 1 }}
          tooltip={({ config, points, valueFormatter }) => {
            const total = points.reduce((sum, point) => {
              if (point.datum.value === null) {
                return sum
              }
              return sum + point.datum.value
            }, 0)

            return (
              <div className="grid min-w-40 gap-2 rounded-lg bg-overlay/70 p-3 py-2 text-xs text-overlay-foreground ring ring-current/10 backdrop-blur-lg">
                <span className="font-semibold text-foreground">
                  {new Date(
                    String(points[0]?.datum.category)
                  ).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="block h-px w-full bg-border" />
                {points.map((point) => {
                  if (point.datum.value === null) {
                    return null
                  }

                  return (
                    <div className="flex items-center gap-2.5" key={point.key}>
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-xs"
                        style={{ backgroundColor: point.color }}
                      />
                      <span className="flex-1 text-muted-foreground">
                        {getExperimentalLabel(config, point.datum.series)}
                      </span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {valueFormatter(point.datum.value)}
                      </span>
                    </div>
                  )
                })}
                <div className="flex items-center justify-between border-t border-border pt-2 font-medium text-foreground">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">
                    {valueFormatter(total)}
                  </span>
                </div>
              </div>
            )
          }}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <TrendingUp aria-hidden className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Tooltip appearance for stacked activity totals.
        </div>
      </CardFooter>
    </Card>
  )
}
