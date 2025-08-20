"use client"

import * as React from "react"
import { parseDate, type CalendarDate } from "@internationalized/date"
import { CalendarIcon } from "lucide-react"
import type { RangeValue } from "react-aria-components"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Button } from "@/registry/preskok/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/preskok/ui/chart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/preskok/ui/popover"
import { RangeCalendar } from "@/registry/preskok/ui/preskok-ui/range-calendar"

const chartData = [
  { date: "2025-06-01", visitors: 178 },
  { date: "2025-06-02", visitors: 470 },
  { date: "2025-06-03", visitors: 103 },
  { date: "2025-06-04", visitors: 439 },
  { date: "2025-06-05", visitors: 88 },
  { date: "2025-06-06", visitors: 294 },
  { date: "2025-06-07", visitors: 323 },
  { date: "2025-06-08", visitors: 385 },
  { date: "2025-06-09", visitors: 438 },
  { date: "2025-06-10", visitors: 155 },
  { date: "2025-06-11", visitors: 92 },
  { date: "2025-06-12", visitors: 492 },
  { date: "2025-06-13", visitors: 81 },
  { date: "2025-06-14", visitors: 426 },
  { date: "2025-06-15", visitors: 307 },
  { date: "2025-06-16", visitors: 371 },
  { date: "2025-06-17", visitors: 475 },
  { date: "2025-06-18", visitors: 107 },
  { date: "2025-06-19", visitors: 341 },
  { date: "2025-06-20", visitors: 408 },
  { date: "2025-06-21", visitors: 169 },
  { date: "2025-06-22", visitors: 317 },
  { date: "2025-06-23", visitors: 480 },
  { date: "2025-06-24", visitors: 132 },
  { date: "2025-06-25", visitors: 141 },
  { date: "2025-06-26", visitors: 434 },
  { date: "2025-06-27", visitors: 448 },
  { date: "2025-06-28", visitors: 149 },
  { date: "2025-06-29", visitors: 103 },
  { date: "2025-06-30", visitors: 446 },
]

const total = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

export default function Calendar27() {
  const [range, setRange] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate("2025-06-05"),
    end: parseDate("2025-06-20"),
  })
  const filteredData = React.useMemo(() => {
    if (!range?.start && !range?.end) {
      return chartData
    }

    return chartData.filter((item) => {
      const date = new Date(item.date)
      const start = range.start?.toDate("UTC")
      const end = range.end?.toDate("UTC")
      return (!start || date >= start) && (!end || date <= end)
    })
  }, [range])

  return (
    <Card className="@container/card w-full max-w-xl">
      <CardHeader className="flex flex-col border-b @md/card:grid">
        <CardTitle>Web Analytics</CardTitle>
        <CardDescription>
          Showing total visitors for this month.
        </CardDescription>
        <CardAction className="mt-2 @md/card:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon />
                {range?.start && range?.end
                  ? `${range.start.toDate("UTC").toLocaleDateString()} - ${range.end.toDate("UTC").toLocaleDateString()}`
                  : "June 2025"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <div className="inline-block rounded-lg border shadow-sm">
                <RangeCalendar
                  value={range}
                  onChange={setRange}
                  minValue={parseDate("2025-06-01")}
                  maxValue={parseDate("2025-06-30")}
                />
              </div>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="visitors"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey="visitors" fill={`var(--color-visitors)`} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="border-t">
        <div className="text-sm">
          You had{" "}
          <span className="font-semibold">{total.toLocaleString()}</span>{" "}
          visitors for the month of June.
        </div>
      </CardFooter>
    </Card>
  )
}
