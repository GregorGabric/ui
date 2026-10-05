"use client"

import { defineChart } from "@tanstack/charts"
import { lineY, type LineYOptions } from "@tanstack/charts/line"
import { scalePoint } from "@tanstack/charts/scales/point"

import {
  ExperimentalChart,
  ExperimentalChartFrame,
  experimentalDefaultValueFormatter,
  experimentalValueToPercent,
  getExperimentalCartesianScales,
  getExperimentalChartColors,
  getExperimentalChartCurve,
  getExperimentalChartOptions,
  getExperimentalCrosshair,
  toExperimentalSeriesData,
  useExperimentalSeriesSelection,
  type ExperimentalCartesianChartProps,
  type ExperimentalChartCurveType,
  type ExperimentalSeriesDatum,
} from "./experimental-chart"

type ExperimentalLineChartProps = ExperimentalCartesianChartProps & {
  connectNulls?: boolean
  lineProps?: Pick<
    LineYOptions<ExperimentalSeriesDatum>,
    "points" | "strokeDasharray" | "strokeWidth"
  >
  lineType?: ExperimentalChartCurveType
  type?: "default" | "percent"
}

function normalizePercent(rows: ExperimentalSeriesDatum[]) {
  const totals = new Map<ExperimentalSeriesDatum["category"], number>()

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

function ExperimentalLineChart({
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
  valueFormatter = experimentalDefaultValueFormatter,
  xAxis,
  yAxis,
  ...frameProps
}: ExperimentalLineChartProps) {
  const [selectedSeries, selectSeries] = useExperimentalSeriesSelection()
  const sourceRows = toExperimentalSeriesData({
    config,
    connectNulls,
    data,
    dataKey,
  })
  const rows = type === "percent" ? normalizePercent(sourceRows) : sourceRows
  const chartColors = getExperimentalChartColors(config, colors)
  const formatValue =
    type === "percent" ? experimentalValueToPercent : valueFormatter
  const scales = getExperimentalCartesianScales({
    categoryAxis: xAxis,
    categoryScale: () => scalePoint().padding(0.25),
    data,
    dataKey,
    grid,
    valueAxis: yAxis,
    valueFormatter: formatValue,
  })

  const definition = defineChart({
    ...getExperimentalChartOptions(chartColors),
    focus: "group-x",
    marks: [
      getExperimentalCrosshair(),
      ...Object.keys(config).map((series) =>
        lineY(
          rows.filter((row) => row.series === series),
          {
            color: "series",
            curve: getExperimentalChartCurve(lineType),
            id: `line-${series}`,
            key: (row) => `${row.series}-${row.index}`,
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
    scales: { x: scales.category, y: scales.value },
  })

  return (
    <ExperimentalChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <ExperimentalChart
        ariaLabel={ariaLabel}
        className="w-full"
        config={config}
        definition={definition}
        size={size}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        valueFormatter={formatValue}
      />
    </ExperimentalChartFrame>
  )
}

export { ExperimentalLineChart }
export type { ExperimentalLineChartProps }
