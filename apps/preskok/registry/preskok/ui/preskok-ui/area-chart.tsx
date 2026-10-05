"use client"

import { defineChart } from "@tanstack/charts"
import { areaY, type AreaYOptions } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { scalePoint } from "@tanstack/charts/scales/point"
import { stack } from "@tanstack/charts/stack"

import {
  Chart,
  ChartFrame,
  dimColor,
  defaultValueFormatter,
  valueToPercent,
  getCartesianScales,
  getChartColors,
  getChartCurve,
  getChartOptions,
  getCrosshair,
  getFocusStates,
  toSeriesData,
  useSeriesSelection,
  type CartesianChartProps,
  type ChartCurveType,
  type ChartType,
  type SeriesDatum,
} from "./chart"

type AreaChartProps = CartesianChartProps & {
  areaProps?: Pick<AreaYOptions<SeriesDatum>, "fillOpacity"> & {
    strokeWidth?: number
  }
  connectNulls?: boolean
  fillType?: "gradient" | "solid" | "none"
  lineType?: ChartCurveType
  type?: ChartType
}

function AreaChart({
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
  valueFormatter = defaultValueFormatter,
  xAxis,
  yAxis,
  ...frameProps
}: AreaChartProps) {
  const [selectedSeries, selectSeries] = useSeriesSelection()
  const rows = toSeriesData({ config, connectNulls, data, dataKey })
  const chartColors = getChartColors(config, colors)
  const seriesNames = Object.keys(config)
  const gradientId = (series: string) =>
    `preskok-area-${seriesNames.indexOf(series)}`
  const isDimmed = (series: string) =>
    selectedSeries !== null && selectedSeries !== series
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

  const fill = (row: SeriesDatum) => {
    if (fillType === "none") {
      return "transparent"
    }
    if (fillType === "gradient") {
      return `url(#${gradientId(row.series)})`
    }

    const color = chartColors[row.series] ?? "var(--chart-1)"
    return isDimmed(row.series) ? dimColor(color, 10) : color
  }

  const { strokeWidth = 2, ...areaOptions } = areaProps ?? {}
  const stroke = (row: SeriesDatum) => {
    const color = chartColors[row.series] ?? "var(--chart-1)"
    return isDimmed(row.series) ? dimColor(color, 10) : color
  }
  const sharedOptions = {
    color: "series",
    curve: getChartCurve(lineType),
    key: (row: SeriesDatum) => `${row.series}-${row.index}`,
    states: getFocusStates<SeriesDatum>("series"),
    x: "category",
    z: "series",
  } as const
  const areaFill = {
    ...sharedOptions,
    fill,
    fillOpacity: fillType === "solid" ? 0.28 : 1,
    ...areaOptions,
  }

  const definition = defineChart({
    ...getChartOptions(chartColors),
    focus: "group-x",
    gradients:
      fillType === "gradient"
        ? seriesNames.map((series) => {
            const color = chartColors[series] ?? "var(--chart-1)"
            return {
              id: gradientId(series),
              stops: [
                { color, offset: 0.05, opacity: isDimmed(series) ? 0.1 : 0.5 },
                { color, offset: 0.95, opacity: 0 },
              ],
              y1: 0,
              y2: 1,
            }
          })
        : undefined,
    marks: [
      getCrosshair(),
      type === "default"
        ? areaY(rows, { ...areaFill, y1: 0, y2: "value" })
        : areaY(rows, {
            ...areaFill,
            layout: stack({
              offset: type === "percent" ? "normalize" : "diverging",
            }),
            y: "value",
          }),
      // The area has no outline; this traces only its top edge.
      lineY(toStackedTops(rows, type), {
        ...sharedOptions,
        stroke,
        strokeWidth,
        y: "top",
      }),
    ],
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
        size={size}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        valueFormatter={formatValue}
      />
    </ChartFrame>
  )
}

/**
 * Adds each row's upper edge: its value, or the running total of same-sign
 * values (as a share of the category total for `percent`) when stacked.
 */
function toStackedTops(rows: readonly SeriesDatum[], type: ChartType) {
  if (type === "default") {
    return rows.map((row) => ({ ...row, top: row.value }))
  }

  const totals = new Map<number, number>()
  if (type === "percent") {
    for (const row of rows) {
      totals.set(
        row.index,
        (totals.get(row.index) ?? 0) + Math.abs(row.value ?? 0)
      )
    }
  }

  const positive = new Map<number, number>()
  const negative = new Map<number, number>()
  return rows.map((row) => {
    if (row.value === null) {
      return { ...row, top: null }
    }

    const running = row.value < 0 ? negative : positive
    const top = (running.get(row.index) ?? 0) + row.value
    running.set(row.index, top)
    const total = totals.get(row.index)
    return { ...row, top: total ? top / total : top }
  })
}

export { AreaChart }
export type { AreaChartProps }
