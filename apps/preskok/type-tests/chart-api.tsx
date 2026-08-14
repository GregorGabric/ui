import { ExperimentalAreaChart } from "@/registry/preskok/ui/preskok-ui/experimental-area-chart"
import { ExperimentalBarChart } from "@/registry/preskok/ui/preskok-ui/experimental-bar-chart"
import { ExperimentalChartLegend } from "@/registry/preskok/ui/preskok-ui/experimental-chart"
import { ExperimentalLineChart } from "@/registry/preskok/ui/preskok-ui/experimental-line-chart"
import { ExperimentalPieChart } from "@/registry/preskok/ui/preskok-ui/experimental-pie-chart"
import { ExperimentalRadarChart } from "@/registry/preskok/ui/preskok-ui/experimental-radar-chart"
import { ExperimentalRadialChart } from "@/registry/preskok/ui/preskok-ui/experimental-radial-chart"

const data = [
  { month: "Jan", revenue: 42, sales: 28 },
  { month: "Feb", revenue: 64, sales: 39 },
]
const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  sales: { label: "Sales", color: "var(--chart-2)" },
} as const
const cartesianProps = { config, data, dataKey: "month" }
const Area = ExperimentalAreaChart
const Line = ExperimentalLineChart
const Radar = ExperimentalRadarChart
const Radial = ExperimentalRadialChart

const composableLineChart = (
  <ExperimentalLineChart
    {...cartesianProps}
    aria-describedby="chart-summary"
    size={{ initialWidth: 640 }}
    grid="hidden"
    legend={<ExperimentalChartLegend align="left" />}
    style={{ minHeight: 240 }}
    xAxis={{ tickStrategy: "edges" }}
    yAxis={{ domain: [0, 100], tickFormatter: String }}
  />
)

const configuredAreaChart = (
  <ExperimentalAreaChart
    {...cartesianProps}
    legend={false}
    tooltip={false}
    xAxis={false}
    yAxis={false}
  />
)

const orientedBarChart = (
  <ExperimentalBarChart
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
    Product: { color: "var(--chart-1)", label: "Product" },
    Sales: { color: "var(--chart-2)", label: "Sales" },
  },
  data: polarData,
  dataKey: "amount",
  nameKey: "name",
} as const

const composedPolarCharts = (
  <>
    <ExperimentalPieChart
      {...polarProps}
      centerLabel="Total"
      centerValue="100"
      variant="donut"
    />
    <ExperimentalRadialChart
      {...polarProps}
      centerLabel="Average"
      track="hidden"
    />
    <ExperimentalRadarChart
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
  <ExperimentalLineChart {...cartesianProps} intervalType="preserveStart" />
)

const removedChartProps = (
  // @ts-expect-error size is the single sizing API shared by every chart variant.
  <Line {...cartesianProps} chartProps={{ initialWidth: 640 }} />
)

const removedLegendProps = (
  // @ts-expect-error compose legend options through the legend element.
  <ExperimentalLineChart {...cartesianProps} legendProps={{ align: "left" }} />
)

const removedEmptyColorPalette = (
  // @ts-expect-error a custom palette must contain at least one defined chart color.
  <ExperimentalLineChart {...cartesianProps} colors={[]} />
)

const removedRawPaletteColor = (
  // @ts-expect-error palette overrides can only reorder defined chart colors.
  <ExperimentalLineChart {...cartesianProps} colors={["#2563eb"]} />
)

const removedRawSeriesColor = (
  <ExperimentalLineChart
    {...cartesianProps}
    config={{
      // @ts-expect-error series colors must reference the shared chart palette.
      revenue: { color: "#2563eb", label: "Revenue" },
    }}
  />
)

const removedSeriesTheme = (
  <ExperimentalLineChart
    {...cartesianProps}
    config={{
      // @ts-expect-error light and dark series colors come from globals.css.
      revenue: { label: "Revenue", theme: { light: "red", dark: "blue" } },
    }}
  />
)

// @ts-expect-error chart variants own plot content; compose surrounding UI through legend and HTML props.
const removedChildren = <Line {...cartesianProps}>content</Line>

// @ts-expect-error use the explicit grid option instead of competing hide booleans.
const removedGridBoolean = <Area {...cartesianProps} hideGridLines />

// @ts-expect-error a center label now directly opts into the radial center annotation.
const removedShowLabel = <Radial {...polarProps} showLabel />

// @ts-expect-error line charts support independent or percent-normalized series, not stacking.
const removedStackedLine = <Line {...cartesianProps} type="stacked" />

// @ts-expect-error configure the Radar value scale through valueAxis.domain.
const removedRadarMaxValue = <Radar {...cartesianProps} maxValue={100} />

export {
  composedPolarCharts,
  composableLineChart,
  configuredAreaChart,
  orientedBarChart,
  removedChartProps,
  removedChildren,
  removedEmptyColorPalette,
  removedGridBoolean,
  removedIntervalType,
  removedLegendProps,
  removedRawPaletteColor,
  removedRawSeriesColor,
  removedRadarMaxValue,
  removedSeriesTheme,
  removedShowLabel,
  removedStackedLine,
}
