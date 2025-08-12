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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-3xl">$15,231.89</CardTitle>
          <CardDescription>+20.1% from last month</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <LineChart
            config={{ revenue: { label: "Revenue", color: "var(--primary)" } }}
            data={data.map((d, i) => ({ name: i, revenue: d.revenue }))}
            dataKey="name"
            className="h-[80px] w-full"
            legend={false}
            tooltip={false}
            hideGridLines
            hideYAxis
            xAxisProps={{ hide: true }}
            yAxisProps={{ hide: true }}
          />
        </CardContent>
      </Card>
      <Card className="pb-0 lg:hidden xl:flex">
        <CardHeader>
          <CardDescription>Subscriptions</CardDescription>
          <CardTitle className="text-3xl">+2,350</CardTitle>
          <CardDescription>+180.1% from last month</CardDescription>
          <CardAction>
            <Button intent="plain" size="sm">
              View More
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto max-h-[124px] flex-1 p-0">
          <AreaChart
            config={{
              subscription: { label: "Subscriptions", color: "var(--primary)" },
            }}
            data={data.map((d, i) => ({
              name: i,
              subscription: d.subscription,
            }))}
            dataKey="name"
            className="size-full"
            legend={false}
            tooltip={false}
            hideGridLines
            hideYAxis
            xAxisProps={{ hide: true }}
            yAxisProps={{ hide: true }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
