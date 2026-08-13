"use client"

import { defineChart } from "@tanstack/charts"
import { crosshair } from "@tanstack/charts/crosshair"
import { lineY, type LineYOptions } from "@tanstack/charts/line"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip"

import {
  Chart,
  ChartFrame,
  createTooltipRenderer,
  getAxisTickLabelOptions,
  getAxisTickOptions,
  getChartColors,
  getChartCurve,
  getChartTheme,
  getEdgeValues,
  getNumericAxisTickOptions,
  toSeriesData,
  valueToPercent,
  type BaseChartProps,
  type ChartCurveType,
  type SeriesDatum,
} from "./chart"

type LineChartProps = BaseChartProps & {
  chartProps?: {
    aspectRatio?: number
    height?: number
    initialWidth?: number
  }
  connectNulls?: boolean
  lineProps?: Pick<
    LineYOptions<SeriesDatum>,
    "points" | "strokeDasharray" | "strokeWidth"
  >
  lineType?: ChartCurveType
}

const defaultValueFormatter = (value: number) => value.toString()

function normalizePercent(rows: SeriesDatum[]) {
  const totals = new Map<string, number>()

  rows.forEach((row) => {
    if (row.value === null) {
      return
    }

    const category = String(row.category)
    totals.set(category, (totals.get(category) ?? 0) + Math.abs(row.value))
  })

  return rows.map((row) => {
    if (row.value === null) {
      return row
    }

    const total = totals.get(String(row.category)) ?? 0
    return { ...row, value: total === 0 ? 0 : row.value / total }
  })
}

function LineChart({
  ariaLabel = "Line chart",
  chartProps,
  className,
  colors,
  config,
  connectNulls = false,
  data = [],
  dataKey,
  displayEdgeLabelsOnly = false,
  hideGridLines = false,
  hideXAxis = false,
  hideYAxis = false,
  legend = true,
  legendProps,
  lineProps,
  lineType = "linear",
  tooltip = true,
  tooltipProps,
  type = "default",
  valueFormatter = defaultValueFormatter,
  xAxisProps,
  yAxisProps,
  ...props
}: LineChartProps) {
  const chartColors = getChartColors(config, colors)
  const xAxisHidden = hideXAxis || xAxisProps?.hide
  const yAxisHidden = hideYAxis || yAxisProps?.hide
  const sourceRows = toSeriesData({ config, connectNulls, data, dataKey })
  const rows = type === "percent" ? normalizePercent(sourceRows) : sourceRows
  const seriesNames = Object.keys(config)
  const tooltipValueFormatter =
    type === "percent" ? valueToPercent : valueFormatter

  return (
    <ChartFrame
      className={className}
      colors={colors}
      config={config}
      legend={legend}
      legendProps={legendProps}
      {...props}
    >
      {({ selectedLegend }) => {
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
              strokeOpacity:
                selectedLegend && selectedLegend !== series ? 0.12 : 1,
              strokeWidth: 2.25,
              x: "category",
              y: "value",
              ...lineProps,
            }
          )
        )
        const baseDefinition = defineChart({
          color: {
            domain: seriesNames,
            range: seriesNames.map((series) => chartColors[series] ?? ""),
          },
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
          svgAnimation: true,
          theme: getChartTheme(
            seriesNames.map((series) => chartColors[series] ?? "")
          ),
          x: {
            axis: xAxisHidden
              ? false
              : {
                  line: false,
                  label: xAxisProps?.label,
                  tickLabels: getAxisTickLabelOptions(xAxisProps),
                  ticks: getAxisTickOptions({
                    displayEdgeLabelsOnly,
                    edgeValues: getEdgeValues(data, dataKey),
                    props: xAxisProps,
                  }),
                },
            scale: () => scalePoint().padding(0.25),
          },
          y: {
            axis: yAxisHidden
              ? false
              : {
                  line: false,
                  label: yAxisProps?.label,
                  tickLabels: getAxisTickLabelOptions(yAxisProps),
                  ticks: getNumericAxisTickOptions({
                    props: yAxisProps,
                    valueFormatter: (value) =>
                      tooltipValueFormatter(Number(value)),
                  }),
                },
            grid: !hideGridLines,
            nice: true,
            scale: scaleLinear,
          },
        })
        const definition = tooltip
          ? defineChart(baseDefinition, {
              tooltip: {
                offset: tooltipProps?.offset,
                placement: tooltipProps?.placement,
                use: tooltipExtension,
              },
            })
          : baseDefinition

        return (
          <Chart
            ariaLabel={ariaLabel}
            aspectRatio={chartProps?.aspectRatio}
            className="w-full"
            definition={definition}
            height={
              chartProps?.aspectRatio
                ? chartProps.height
                : (chartProps?.height ?? 288)
            }
            initialWidth={chartProps?.initialWidth}
            renderTooltipBody={
              tooltip
                ? createTooltipRenderer({
                    config,
                    tooltip,
                    tooltipProps,
                    valueFormatter: tooltipValueFormatter,
                  })
                : undefined
            }
          />
        )
      }}
    </ChartFrame>
  )
}

export { LineChart }
export type { LineChartProps }
