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
import { twMerge } from "cn"

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

function getBarLayout(type: ChartType, barGap: number, singleGroup: boolean) {
  // A single series uses the full band instead of padding for side-by-side bars.
  if (singleGroup) {
    return group({ padding: 0 })
  }
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
  const singleGroup = type === "default" && Object.keys(config).length < 2
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
  const defaultRadius = singleGroup ? 8 : 4
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
    layout: getBarLayout(type, barGap, singleGroup),
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

  const chartOptions = {
    ...getChartOptions(chartColors),
    // Focus the whole category anywhere in the plot; the band replaces the focus ring.
    focusRing: false,
    margin: scales.margin,
    maxFocusDistance: Number.POSITIVE_INFINITY,
  }

  const definition =
    layout === "horizontal"
      ? defineChart({
          ...chartOptions,
          focus: "group-x",
          marks: [
            categoryHighlight,
            barY(rows, { ...barOptions, x: "category", y: "value" }),
          ],
          scales: { x: scales.category, y: scales.value },
        })
      : defineChart({
          ...chartOptions,
          focus: "group-y",
          marks: [
            categoryHighlight,
            barX(rows, { ...barOptions, x: "value", y: "category" }),
          ],
          scales: { x: scales.value, y: scales.category },
        })

  return (
    <ChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={singleGroup ? (legend ?? false) : legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <Chart
        ariaLabel={ariaLabel}
        className={twMerge(
          "w-full",
          onBarClick && "[&_svg.ts-chart]:cursor-pointer"
        )}
        config={config}
        definition={definition}
        onSelect={
          // A clickable chart navigates; series selection belongs to the legend there.
          onBarClick
            ? (point) => {
                if (point) {
                  onBarClick(point.datum.source)
                }
              }
            : (point) => {
                selectSeries(point?.datum.series ?? null)
              }
        }
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
