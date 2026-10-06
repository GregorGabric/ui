"use client"

import { defineChart } from "@tanstack/charts"
import {
  barX,
  barY,
  type BarXOptions,
  type BarYOptions,
} from "@tanstack/charts/bar"
import { crosshair } from "@tanstack/charts/crosshair"
import { group } from "@tanstack/charts/group"
import { scaleBand } from "@tanstack/charts/scales/band"
import { stack } from "@tanstack/charts/stack"

import {
  Chart,
  ChartFrame,
  defaultValueFormatter,
  valueToPercent,
  getCartesianScales,
  getChartColors,
  getChartOptions,
  getSelectedSeriesColor,
  toSeriesData,
  useSeriesSelection,
  type BaseChartProps,
  type ChartAxisProps,
  type ChartDatum,
  type ChartNumericAxisProps,
  type ChartType,
  type SeriesDatum,
} from "./chart"

type BarOptions = Pick<
  BarXOptions<SeriesDatum> & BarYOptions<SeriesDatum>,
  "fillOpacity" | "inset" | "maxThickness" | "radius"
>

type BarChartProps = BaseChartProps & {
  barCategoryGap?: number
  barGap?: number
  barProps?: BarOptions
  barRadius?: number
  barSize?: number
  categoryAxis?: ChartAxisProps | false
  grid?: "hidden" | "visible"
  layout?: "horizontal" | "vertical"
  /** Called with the source row of a clicked bar. */
  onBarClick?: (datum: ChartDatum) => void
  type?: ChartType
  valueAxis?: ChartNumericAxisProps | false
}

function getBarLayout(type: ChartType, barGap: number) {
  if (type === "stacked") {
    return stack()
  }
  if (type === "percent") {
    return stack({ offset: "normalize" })
  }
  return group({ padding: Math.min(barGap / 20, 0.8) })
}

function BarChart({
  ariaLabel = "Bar chart",
  barCategoryGap = 5,
  barGap = 4,
  barProps,
  barRadius,
  barSize = 48,
  categoryAxis,
  colors,
  config,
  data,
  dataKey,
  grid = "visible",
  layout = "horizontal",
  legend,
  onBarClick,
  size,
  tooltip,
  tooltipProps,
  type = "default",
  valueAxis,
  valueFormatter = defaultValueFormatter,
  ...frameProps
}: BarChartProps) {
  const [selectedSeries, selectSeries] = useSeriesSelection()
  const rows = toSeriesData({ config, data, dataKey })
  const chartColors = getChartColors(config, colors)
  const singleSeries = Object.keys(config).length < 2
  const formatValue = type === "percent" ? valueToPercent : valueFormatter
  const scales = getCartesianScales({
    categoryAxis,
    categoryScale: () => scaleBand().padding(0.12),
    data,
    dataKey,
    grid,
    valueAxis,
    valueFormatter: formatValue,
  })

  // Stacks round only their exposed end; grouped bars round each bar end.
  const defaultRadius = type === "default" && singleSeries ? 8 : 4
  const barOptions = {
    color: "series",
    fill: (row: SeriesDatum) =>
      getSelectedSeriesColor({
        color: chartColors[row.series] ?? "var(--chart-1)",
        opacity: 12,
        selectedSeries,
        series: row.series,
      }),
    inset: barCategoryGap / 2,
    key: (row: SeriesDatum) => `${row.series}-${row.index}`,
    // Grouping pads each category for side-by-side series; a single series uses the full band.
    layout:
      type === "default" && singleSeries
        ? group({ padding: 0 })
        : getBarLayout(type, barGap),
    maxThickness: barSize,
    radius: { end: barRadius ?? defaultRadius },
    z: "series",
    ...barProps,
  } as const

  // A native focus band spans the plot without adding synthetic tooltip points.
  const categoryGuide = {
    band: { fill: "var(--muted-foreground)", fillOpacity: 0.1, radius: 6 },
  }

  const categoryHighlight = crosshair({
    motion: false,
    x: layout === "horizontal" ? categoryGuide : false,
    y: layout === "vertical" ? categoryGuide : false,
  })

  const definition =
    layout === "horizontal"
      ? defineChart({
          ...getChartOptions(chartColors),
          focus: "group-x",
          maxFocusDistance: Number.POSITIVE_INFINITY,
          focusRing: false,
          marks: [
            categoryHighlight,
            barY(rows, { ...barOptions, x: "category", y: "value" }),
          ],
          margin: scales.margin,
          scales: { x: scales.category, y: scales.value },
        })
      : defineChart({
          ...getChartOptions(chartColors),
          focus: "group-y",
          maxFocusDistance: Number.POSITIVE_INFINITY,
          focusRing: false,
          marks: [
            categoryHighlight,
            barX(rows, { ...barOptions, x: "value", y: "category" }),
          ],
          margin: scales.margin,
          scales: { x: scales.value, y: scales.category },
        })

  return (
    <ChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={type === "default" && singleSeries ? (legend ?? false) : legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <Chart
        ariaLabel={ariaLabel}
        className={
          onBarClick ? "w-full [&_svg.ts-chart]:cursor-pointer" : "w-full"
        }
        config={config}
        definition={definition}
        onSelect={(point) => {
          // A clickable chart navigates; series selection belongs to the legend there.
          if (onBarClick) {
            if (point) {
              onBarClick(point.datum.source)
            }
            return
          }

          selectSeries(point?.datum.series ?? null)
        }}
        size={size}
        tooltip={tooltip}
        tooltipProps={{
          anchor: "pointer",
          offset: 24,
          placement: "auto",
          ...tooltipProps,
        }}
        valueFormatter={formatValue}
      />
    </ChartFrame>
  )
}

export { BarChart }
export type { BarChartProps }
