"use client"

import { AreaChart } from "@/registry/preskok/ui/preskok-ui/area-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { ExperimentalAreaChart } from "@/registry/preskok/ui/preskok-ui/experimental-area-chart"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/registry/preskok/ui/preskok-ui/tabs"

const data = [
  { month: "Jan", revenue: 42, sales: 28 },
  { month: "Feb", revenue: 64, sales: 39 },
  { month: "Mar", revenue: 51, sales: 35 },
  { month: "Apr", revenue: 78, sales: 46 },
  { month: "May", revenue: 69, sales: 43 },
  { month: "Jun", revenue: 91, sales: 57 },
]

const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  sales: { label: "Sales", color: "var(--chart-2)" },
} as const

export default function ExperimentalChartsTogglePreskokDemo() {
  return (
    <Card className="w-3xl max-w-full">
      <CardHeader>
        <CardTitle>Compare chart implementations</CardTitle>
        <CardDescription>
          Switch between the stable Recharts component and the experimental
          TanStack implementation using the same data and configuration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs aria-label="Chart implementation" defaultSelectedKey="stable">
          <TabList>
            <Tab id="stable">Recharts · Stable</Tab>
            <Tab id="experimental">TanStack · Experimental</Tab>
          </TabList>
          <TabPanel id="stable">
            <AreaChart
              className="h-64 min-h-64"
              config={config}
              data={data}
              dataKey="month"
              fillType="gradient"
              lineType="monotone"
              valueFormatter={(value) => `$${value}k`}
            />
          </TabPanel>
          <TabPanel id="experimental">
            <ExperimentalAreaChart
              config={config}
              data={data}
              dataKey="month"
              fillType="gradient"
              lineType="monotone"
              size={{ height: 256 }}
              valueFormatter={(value) => `$${value}k`}
            />
          </TabPanel>
        </Tabs>
      </CardContent>
    </Card>
  )
}
