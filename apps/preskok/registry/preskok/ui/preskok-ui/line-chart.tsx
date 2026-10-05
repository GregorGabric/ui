"use client"

import { defineChart } from "@tanstack/charts"
import { lineY, type LineYOptions } from "@tanstack/charts/line"
import { scalePoint } from "@tanstack/charts/scales/point"

import {
  Chart,
  ChartFrame,
  defaultValueFormatter,
  valueToPercent,
  getCartesianScales,
  getChartColors,
  getChartCurve,
  getChartOptions,
  GROUP_X_TOOLTIP,
  getCrosshair,
  revealEntranceMotion,
  toSeriesData,
  useSeriesSelection,
  type CartesianChartProps,
  type ChartCurveType,
  type SeriesDatum,
} from "./chart"

type LineChartProps = CartesianChartProps & {
  connectNulls?: boolean
  lineProps?: Pick<
    LineYOptions<SeriesDatum>,
    "points" | "strokeDasharray" | "strokeWidth"
  >
  lineType?: ChartCurveType
  type?: "default" | "percent"
}

function normalizePercent(rows: SeriesDatum[]) {
  const totals = new Map<SeriesDatum["category"], number>()

  for (const row of rows) {
    if (row.value !== null) {
      totals.set(
        row.category,
        (totals.get(row.category) ?? 0) + Math.abs(row.value)
      )
    }
  }

  return rows.map((row) => {
    if (row.value === null) {
      return row
    }

    const total = totals.get(row.category) ?? 0
    return { ...row, value: total === 0 ? 0 : row.value / total }
  })
}

function LineChart({
  ariaLabel = "Line chart",
  colors,
  config,
  connectNulls = false,
  data,
  dataKey,
  grid = "visible",
  legend,
  lineProps,
  lineType = "linear",
  size,
  tooltip,
  tooltipProps,
  type = "default",
  valueFormatter = defaultValueFormatter,
  xAxis,
  yAxis,
  ...frameProps
}: LineChartProps) {
  const [selectedSeries, selectSeries] = useSeriesSelection()
  const sourceRows = toSeriesData({
    config,
    connectNulls,
    data,
    dataKey,
  })
  const rows = type === "percent" ? normalizePercent(sourceRows) : sourceRows
  const chartColors = getChartColors(config, colors)
  const formatValue = type === "percent" ? valueToPercent : valueFormatter
  const scales = getCartesianScales({
    categoryAxis: xAxis,
    categoryScale: scalePoint,
    data,
    dataKey,
    grid,
    valueAxis: yAxis,
    valueFormatter: formatValue,
  })

  const definition = defineChart({
    ...getChartOptions(chartColors),
    focus: "group-x",
    marks: [
      getCrosshair(),
      ...Object.keys(config).map((series) =>
        lineY(
          rows.filter((row) => row.series === series),
          {
            color: "series",
            curve: getChartCurve(lineType),
            id: `line-${series}`,
            key: (row) => `${row.series}-${row.index}`,
            motion: revealEntranceMotion,
            stroke: chartColors[series],
            strokeOpacity:
              selectedSeries && selectedSeries !== series ? 0.12 : 1,
            x: "category",
            y: "value",
            ...lineProps,
          }
        )
      ),
    ],
    margin: scales.margin,
    scales: { x: scales.category, y: scales.value },
  })

  return (
    <ChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <Chart
        ariaLabel={ariaLabel}
        className="w-full"
        config={config}
        definition={definition}
        entrance="reveal"
        size={size}
        tooltip={tooltip}
        tooltipProps={{ ...GROUP_X_TOOLTIP, ...tooltipProps }}
        valueFormatter={formatValue}
      />
    </ChartFrame>
  )
}

export { LineChart }
export type { LineChartProps }
