import { AreaChart } from "@/registry/preskok/ui/preskok-ui/area-chart"
import { BarChart } from "@/registry/preskok/ui/preskok-ui/bar-chart"
import { ChartLegend } from "@/registry/preskok/ui/preskok-ui/chart"
import { LineChart } from "@/registry/preskok/ui/preskok-ui/line-chart"
import { PieChart } from "@/registry/preskok/ui/preskok-ui/pie-chart"
import { RadarChart } from "@/registry/preskok/ui/preskok-ui/radar-chart"
import { RadialChart } from "@/registry/preskok/ui/preskok-ui/radial-chart"

const data = [
  { month: "Jan", revenue: 42, sales: 28 },
  { month: "Feb", revenue: 64, sales: 39 },
]
const config = {
  revenue: { label: "Revenue", color: "chart-1" },
  sales: { label: "Sales", color: "chart-2" },
} as const
const cartesianProps = { config, data, dataKey: "month" }

const composableLineChart = (
  <LineChart
    {...cartesianProps}
    aria-describedby="chart-summary"
    chartProps={{ initialWidth: 640 }}
    grid="hidden"
    legend={<ChartLegend align="left" />}
    style={{ minHeight: 240 }}
    xAxis={{ tickStrategy: "edges" }}
    yAxis={{ domain: [0, 100], tickFormatter: String }}
  />
)

const configuredAreaChart = (
  <AreaChart
    {...cartesianProps}
    legend={false}
    tooltip={false}
    xAxis={false}
    yAxis={false}
  />
)

const orientedBarChart = (
  <BarChart
    {...cartesianProps}
    categoryAxis={{ tickFormatter: String }}
    grid="visible"
    layout="vertical"
    valueAxis={{ domain: [0, 100] }}
  />
)

const polarData = [
  { name: "Product", amount: 42 },
  { name: "Sales", amount: 58 },
]
const polarProps = {
  config: {
    Product: { color: "chart-1", label: "Product" },
    Sales: { color: "chart-2", label: "Sales" },
  },
  data: polarData,
  dataKey: "amount",
  nameKey: "name",
} as const

const composedPolarCharts = (
  <>
    <PieChart
      {...polarProps}
      centerLabel="Total"
      centerValue="100"
      variant="donut"
    />
    <RadialChart {...polarProps} centerLabel="Average" track="hidden" />
    <RadarChart
      {...cartesianProps}
      categoryAxis={{ tickFormatter: String }}
      dots={{ r: 4 }}
      grid={{ shape: "circle", ticks: 5, valueLabels: "visible" }}
      valueAxis={{ domain: [0, 100] }}
    />
  </>
)

const removedIntervalType = (
  // @ts-expect-error intervalType was never implemented and is no longer exposed.
  <LineChart {...cartesianProps} intervalType="preserveStart" />
)

// @ts-expect-error chart variants own plot content; compose surrounding UI through legend and HTML props.
const removedChildren = <LineChart {...cartesianProps}>content</LineChart>

// @ts-expect-error use the explicit grid option instead of competing hide booleans.
const removedGridBoolean = <AreaChart {...cartesianProps} hideGridLines />

// @ts-expect-error a center label now directly opts into the radial center annotation.
const removedShowLabel = <RadialChart {...polarProps} showLabel />

// @ts-expect-error line charts support independent or percent-normalized series, not stacking.
const removedStackedLine = <LineChart {...cartesianProps} type="stacked" />

// @ts-expect-error configure the Radar value scale through valueAxis.domain.
const removedRadarMaxValue = <RadarChart {...cartesianProps} maxValue={100} />

export {
  composedPolarCharts,
  composableLineChart,
  configuredAreaChart,
  orientedBarChart,
  removedChildren,
  removedGridBoolean,
  removedIntervalType,
  removedRadarMaxValue,
  removedShowLabel,
  removedStackedLine,
}
