"use client"

import { AreaChart } from "@/registry/preskok/ui/preskok-ui/area-chart"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { LineChart } from "@/registry/preskok/ui/preskok-ui/line-chart"

const data = [
  {
    revenue: 10400,
    subscription: 40,
  },
  {
    revenue: 14405,
    subscription: 90,
  },
  {
    revenue: 9400,
    subscription: 200,
  },
  {
    revenue: 8200,
    subscription: 278,
  },
  {
    revenue: 7000,
    subscription: 89,
  },
  {
    revenue: 9600,
    subscription: 239,
  },
  {
    revenue: 11244,
    subscription: 78,
  },
  {
    revenue: 26475,
    subscription: 89,
  },
]

export function CardsStats() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <Card>
        <CardHeader className="grid-cols-[1fr_auto] items-end gap-x-4">
          <div className="grid gap-1">
            <CardDescription>Freight revenue</CardDescription>
            <CardTitle className="text-3xl tabular-nums">$15,231.89</CardTitle>
          </div>
          <CardAction className="pb-1">
            <span className="text-sm font-medium text-success tabular-nums">
              +20.1%
            </span>
            <span className="sr-only"> from last month</span>
          </CardAction>
        </CardHeader>
        <CardContent className="pb-0">
          <LineChart
            ariaLabel="Freight revenue over eight periods"
            chartProps={{ height: 96 }}
            config={{
              revenue: { label: "Freight Revenue", color: "var(--primary)" },
            }}
            data={data.map((d, i) => ({ name: i, revenue: d.revenue }))}
            dataKey="name"
            legend={false}
            lineProps={{ strokeWidth: 2.5 }}
            lineType="monotone"
            tooltip={false}
            hideGridLines
            hideXAxis
            hideYAxis
          />
        </CardContent>
      </Card>
      <Card className="pb-0 lg:hidden xl:flex">
        <CardHeader>
          <p className="text-sm">Completed Trips</p>
          <CardTitle>
            <p className="text-3xl">2,350</p>
            <p className="row-start-2 text-sm text-pretty text-muted-foreground">
              +180.1% trips from last month
            </p>
          </CardTitle>

          <CardAction>
            <Button intent="plain" size="sm">
              View Dispatch
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto max-h-[124px] flex-1 p-0">
          <AreaChart
            ariaLabel="Completed trips over eight periods"
            chartProps={{ height: 124 }}
            config={{
              subscription: {
                label: "Completed Trips",
                color: "var(--primary)",
              },
            }}
            data={data.map((d, i) => ({
              name: i,
              subscription: d.subscription,
            }))}
            dataKey="name"
            fillType="gradient"
            legend={false}
            lineType="monotone"
            tooltip={false}
            hideGridLines
            hideXAxis
            hideYAxis
          />
        </CardContent>
      </Card>
    </div>
  )
}
