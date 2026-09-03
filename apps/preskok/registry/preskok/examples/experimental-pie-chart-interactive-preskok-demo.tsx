"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { ExperimentalPieChart } from "@/registry/preskok/ui/preskok-ui/experimental-pie-chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"

const chartData = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const chartConfig = {
  chrome: { label: "Chrome", color: "var(--chart-1)" as const },
  safari: { label: "Safari", color: "var(--chart-2)" as const },
  firefox: { label: "Firefox", color: "var(--chart-3)" as const },
  edge: { label: "Edge", color: "var(--chart-4)" as const },
  other: { label: "Other", color: "var(--chart-5)" as const },
}

export default function ExperimentalPieChartInteractivePreskokDemo() {
  const [activeBrowser, setActiveBrowser] = useState("safari")
  const activeSlice = chartData.find((item) => item.browser === activeBrowser)
  const activeLabel =
    chartConfig[activeBrowser as keyof typeof chartConfig]?.label ??
    activeBrowser

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Pie Chart - Interactive</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
        <CardAction>
          <Select
            aria-label="Browser"
            className="w-36"
            value={activeBrowser}
            onChange={(key) => {
              if (typeof key === "string") {
                setActiveBrowser(key)
              }
            }}
          >
            <SelectTrigger />
            <SelectContent>
              <SelectSection>
                {chartData.map((item) => (
                  <SelectItem id={item.browser} key={item.browser}>
                    {
                      chartConfig[item.browser as keyof typeof chartConfig]
                        .label
                    }
                  </SelectItem>
                ))}
              </SelectSection>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ExperimentalPieChart
          activeSeries={activeBrowser}
          activeShape="expanded-ring"
          ariaLabel="Pie Chart - Interactive"
          centerLabel={activeLabel}
          centerValue={activeSlice?.visitors.toLocaleString()}
          className="mx-auto"
          config={chartConfig}
          data={chartData}
          dataKey="visitors"
          legend={false}
          nameKey="browser"
          pieProps={{ stroke: "var(--background)", strokeWidth: 2 }}
          size={{ height: 250 }}
          variant="donut"
        />
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
          <TrendingUp aria-hidden className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
