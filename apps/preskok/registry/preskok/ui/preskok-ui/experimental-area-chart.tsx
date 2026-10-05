"use client"

import { defineChart } from "@tanstack/charts"
import { areaY, type AreaYOptions } from "@tanstack/charts/area"
import { scalePoint } from "@tanstack/charts/scales/point"
import { stack } from "@tanstack/charts/stack"

import {
  ExperimentalChart,
  ExperimentalChartFrame,
  dimExperimentalColor,
  experimentalDefaultValueFormatter,
  experimentalValueToPercent,
  getExperimentalCartesianScales,
  getExperimentalChartColors,
  getExperimentalChartCurve,
  getExperimentalChartOptions,
  getExperimentalCrosshair,
  getExperimentalFocusStates,
  toExperimentalSeriesData,
  useExperimentalSeriesSelection,
  type ExperimentalCartesianChartProps,
  type ExperimentalChartCurveType,
  type ExperimentalChartType,
  type ExperimentalSeriesDatum,
} from "./experimental-chart"

type ExperimentalAreaChartProps = ExperimentalCartesianChartProps & {
  areaProps?: Pick<
    AreaYOptions<ExperimentalSeriesDatum>,
    "fillOpacity" | "strokeWidth"
  >
  connectNulls?: boolean
  fillType?: "gradient" | "solid" | "none"
  lineType?: ExperimentalChartCurveType
  type?: ExperimentalChartType
}

function ExperimentalAreaChart({
  areaProps,
  ariaLabel = "Area chart",
  colors,
  config,
  connectNulls = false,
  data,
  dataKey,
  fillType = "gradient",
  grid = "visible",
  legend,
  lineType = "linear",
  size,
  tooltip,
  tooltipProps,
  type = "default",
  valueFormatter = experimentalDefaultValueFormatter,
  xAxis,
  yAxis,
  ...frameProps
}: ExperimentalAreaChartProps) {
  const [selectedSeries, selectSeries] = useExperimentalSeriesSelection()
  const rows = toExperimentalSeriesData({ config, connectNulls, data, dataKey })
  const chartColors = getExperimentalChartColors(config, colors)
  const seriesNames = Object.keys(config)
  const gradientId = (series: string) =>
    `preskok-area-${seriesNames.indexOf(series)}`
  const isDimmed = (series: string) =>
    selectedSeries !== null && selectedSeries !== series
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

  const fill = (row: ExperimentalSeriesDatum) => {
    if (fillType === "none") {
      return "transparent"
    }
    if (fillType === "gradient") {
      return `url(#${gradientId(row.series)})`
    }

    const color = chartColors[row.series] ?? "var(--chart-1)"
    return isDimmed(row.series) ? dimExperimentalColor(color, 10) : color
  }

  const sharedOptions = {
    color: "series",
    curve: getExperimentalChartCurve(lineType),
    fill,
    fillOpacity: fillType === "solid" ? 0.28 : 1,
    key: (row: ExperimentalSeriesDatum) => `${row.series}-${row.index}`,
    states: getExperimentalFocusStates<ExperimentalSeriesDatum>("series"),
    stroke: (row: ExperimentalSeriesDatum) => {
      const color = chartColors[row.series] ?? "var(--chart-1)"
      return isDimmed(row.series) ? dimExperimentalColor(color, 10) : color
    },
    strokeWidth: 2.25,
    x: "category",
    z: "series",
    ...areaProps,
  } as const

  const definition = defineChart({
    ...getExperimentalChartOptions(chartColors),
    focus: "group-x",
    gradients:
      fillType === "gradient"
        ? seriesNames.map((series) => {
            const color = chartColors[series] ?? "var(--chart-1)"
            return {
              id: gradientId(series),
              stops: [
                { color, offset: 0, opacity: 0.03 },
                { color, offset: 1, opacity: isDimmed(series) ? 0.04 : 0.38 },
              ],
              y1: 1,
              y2: 0,
            }
          })
        : undefined,
    marks: [
      getExperimentalCrosshair(),
      type === "default"
        ? areaY(rows, { ...sharedOptions, y1: 0, y2: "value" })
        : areaY(rows, {
            ...sharedOptions,
            layout: stack({
              offset: type === "percent" ? "normalize" : "diverging",
            }),
            y: "value",
          }),
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

export { ExperimentalAreaChart }
export type { ExperimentalAreaChartProps }
