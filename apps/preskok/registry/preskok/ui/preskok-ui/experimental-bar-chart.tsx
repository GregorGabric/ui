"use client"

import { defineChart } from "@tanstack/charts"
import {
  barX,
  barY,
  type BarXOptions,
  type BarYOptions,
} from "@tanstack/charts/bar"
import { group } from "@tanstack/charts/group"
import { scaleBand } from "@tanstack/charts/scales/band"
import { stack } from "@tanstack/charts/stack"

import {
  ExperimentalChart,
  ExperimentalChartFrame,
  experimentalDefaultValueFormatter,
  experimentalValueToPercent,
  getExperimentalCartesianScales,
  getExperimentalChartColors,
  getExperimentalChartOptions,
  getExperimentalFocusStates,
  getExperimentalSelectedSeriesColor,
  toExperimentalSeriesData,
  useExperimentalSeriesSelection,
  type ExperimentalBaseChartProps,
  type ExperimentalChartAxisProps,
  type ExperimentalChartNumericAxisProps,
  type ExperimentalChartType,
  type ExperimentalSeriesDatum,
} from "./experimental-chart"

type BarOptions = Pick<
  BarXOptions<ExperimentalSeriesDatum> & BarYOptions<ExperimentalSeriesDatum>,
  "fillOpacity" | "inset" | "maxThickness" | "radius"
>

type ExperimentalBarChartProps = ExperimentalBaseChartProps & {
  barCategoryGap?: number
  barGap?: number
  barProps?: BarOptions
  barRadius?: number
  barSize?: number
  categoryAxis?: ExperimentalChartAxisProps | false
  grid?: "hidden" | "visible"
  layout?: "horizontal" | "vertical"
  type?: ExperimentalChartType
  valueAxis?: ExperimentalChartNumericAxisProps | false
}

function getBarLayout(type: ExperimentalChartType, barGap: number) {
  if (type === "stacked") {
    return stack()
  }
  if (type === "percent") {
    return stack({ offset: "normalize" })
  }
  return group({ padding: Math.min(barGap / 20, 0.8) })
}

function ExperimentalBarChart({
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
  size,
  tooltip,
  tooltipProps,
  type = "default",
  valueAxis,
  valueFormatter = experimentalDefaultValueFormatter,
  ...frameProps
}: ExperimentalBarChartProps) {
  const [selectedSeries, selectSeries] = useExperimentalSeriesSelection()
  const rows = toExperimentalSeriesData({ config, data, dataKey })
  const chartColors = getExperimentalChartColors(config, colors)
  const singleSeries = Object.keys(config).length < 2
  const formatValue =
    type === "percent" ? experimentalValueToPercent : valueFormatter
  const scales = getExperimentalCartesianScales({
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
    fill: (row: ExperimentalSeriesDatum) =>
      getExperimentalSelectedSeriesColor({
        color: chartColors[row.series] ?? "var(--chart-1)",
        opacity: 12,
        selectedSeries,
        series: row.series,
      }),
    inset: barCategoryGap / 2,
    key: (row: ExperimentalSeriesDatum) => `${row.series}-${row.index}`,
    layout: getBarLayout(type, barGap),
    maxThickness: barSize,
    radius: { end: barRadius ?? defaultRadius },
    states: getExperimentalFocusStates<ExperimentalSeriesDatum>("primary"),
    z: "series",
    ...barProps,
  } as const

  const definition =
    layout === "horizontal"
      ? defineChart({
          ...getExperimentalChartOptions(chartColors),
          focus: "group-x",
          marks: [barY(rows, { ...barOptions, x: "category", y: "value" })],
          scales: { x: scales.category, y: scales.value },
        })
      : defineChart({
          ...getExperimentalChartOptions(chartColors),
          focus: "group-y",
          marks: [barX(rows, { ...barOptions, x: "value", y: "category" })],
          scales: { x: scales.value, y: scales.category },
        })

  return (
    <ExperimentalChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={type === "default" && singleSeries ? (legend ?? false) : legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <ExperimentalChart
        ariaLabel={ariaLabel}
        className="w-full"
        config={config}
        definition={definition}
        onSelect={(point) => {
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
    </ExperimentalChartFrame>
  )
}

export { ExperimentalBarChart }
export type { ExperimentalBarChartProps }
