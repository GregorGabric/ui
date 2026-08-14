"use client"

import { defineChart } from "@tanstack/charts"
import { crosshair } from "@tanstack/charts/crosshair"
import { lineY, type LineYOptions } from "@tanstack/charts/line"
import { scalePoint } from "@tanstack/charts/scales/point"

import {
  Chart,
  ChartFrame,
  createTooltipRenderer,
  getCategoryAxis,
  getChartCurve,
  getNumericAxis,
  getNumericScale,
  getSeriesChartOptions,
  getTooltipOptions,
  toSeriesData,
  useChartFrame,
  valueToPercent,
  type CartesianChartProps,
  type ChartCurveType,
  type ChartSizeProps,
  type SeriesDatum,
} from "./chart"

type LineChartProps = CartesianChartProps & {
  chartProps?: ChartSizeProps
  connectNulls?: boolean
  lineProps?: Pick<
    LineYOptions<SeriesDatum>,
    "points" | "strokeDasharray" | "strokeWidth"
  >
  lineType?: ChartCurveType
  type?: "default" | "percent"
}

type LineChartPlotProps = Pick<
  LineChartProps,
  | "ariaLabel"
  | "chartProps"
  | "colors"
  | "config"
  | "connectNulls"
  | "data"
  | "dataKey"
  | "grid"
  | "lineProps"
  | "lineType"
  | "tooltip"
  | "tooltipProps"
  | "type"
  | "valueFormatter"
  | "xAxis"
  | "yAxis"
>

const defaultValueFormatter = (value: number) => value.toString()

function normalizePercent(rows: SeriesDatum[]) {
  const totals = new Map<SeriesDatum["category"], number>()

  rows.forEach((row) => {
    if (row.value === null) {
      return
    }

    totals.set(
      row.category,
      (totals.get(row.category) ?? 0) + Math.abs(row.value)
    )
  })

  return rows.map((row) => {
    if (row.value === null) {
      return row
    }

    const total = totals.get(row.category) ?? 0
    return { ...row, value: total === 0 ? 0 : row.value / total }
  })
}

function LineChartPlot({
  ariaLabel = "Line chart",
  chartProps,
  colors,
  config,
  connectNulls = false,
  data = [],
  dataKey,
  grid = "visible",
  lineProps,
  lineType = "linear",
  tooltip,
  tooltipProps,
  type = "default",
  valueFormatter = defaultValueFormatter,
  xAxis,
  yAxis,
}: LineChartPlotProps) {
  const {
    state: { selectedSeries },
  } = useChartFrame()
  const sourceRows = toSeriesData({ config, connectNulls, data, dataKey })
  const rows = type === "percent" ? normalizePercent(sourceRows) : sourceRows
  const { chartColors, options, seriesNames } = getSeriesChartOptions(
    config,
    colors
  )
  const tooltipValueFormatter =
    type === "percent" ? valueToPercent : valueFormatter
  const marks = seriesNames.map((series) =>
    lineY(
      rows.filter((row) => row.series === series),
      {
        color: "series",
        curve: getChartCurve(lineType),
        id: `line-${series}`,
        key: (row) => `${row.series}-${row.index}`,
        points: false,
        stroke: chartColors[series],
        strokeOpacity: selectedSeries && selectedSeries !== series ? 0.12 : 1,
        strokeWidth: 2.25,
        x: "category",
        y: "value",
        ...lineProps,
      }
    )
  )
  const baseDefinition = defineChart({
    ...options,
    focus: "group-x",
    marks: [
      crosshair({
        marker: {
          fill: "var(--background)",
          radius: 4,
          stroke: "var(--foreground)",
          strokeOpacity: 0.7,
          strokeWidth: 2,
        },
        x: {
          stroke: "var(--muted-foreground)",
          strokeDasharray: "3 4",
          strokeOpacity: 0.3,
        },
        y: false,
      }),
      ...marks,
    ],
    x: {
      axis: getCategoryAxis({ data, dataKey, props: xAxis }),
      scale: () => scalePoint().padding(0.25),
    },
    y: {
      axis: getNumericAxis({
        props: yAxis,
        valueFormatter: tooltipValueFormatter,
      }),
      grid: grid === "visible",
      nice: true,
      scale: getNumericScale(yAxis),
    },
  })
  const definition =
    tooltip === false
      ? baseDefinition
      : defineChart(baseDefinition, getTooltipOptions(tooltipProps))

  return (
    <Chart
      ariaLabel={ariaLabel}
      className="w-full"
      definition={definition}
      renderTooltipBody={
        tooltip === false
          ? undefined
          : createTooltipRenderer({
              config,
              tooltip,
              tooltipProps,
              valueFormatter: tooltipValueFormatter,
            })
      }
      size={chartProps}
    />
  )
}

function LineChart({
  ariaLabel,
  chartProps,
  className,
  colors,
  config,
  connectNulls,
  data,
  dataKey,
  grid,
  legend,
  legendProps,
  lineProps,
  lineType,
  tooltip,
  tooltipProps,
  type,
  valueFormatter,
  xAxis,
  yAxis,
  ...frameProps
}: LineChartProps) {
  return (
    <ChartFrame
      {...frameProps}
      className={className}
      colors={colors}
      config={config}
      legend={legend}
      legendProps={legendProps}
    >
      <LineChartPlot
        ariaLabel={ariaLabel}
        chartProps={chartProps}
        colors={colors}
        config={config}
        connectNulls={connectNulls}
        data={data}
        dataKey={dataKey}
        grid={grid}
        lineProps={lineProps}
        lineType={lineType}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        type={type}
        valueFormatter={valueFormatter}
        xAxis={xAxis}
        yAxis={yAxis}
      />
    </ChartFrame>
  )
}

export { LineChart }
export type { LineChartProps }
