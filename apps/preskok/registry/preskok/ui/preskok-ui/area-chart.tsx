"use client"

import { defineChart, type ChartLinearGradient } from "@tanstack/charts"
import { areaY, type AreaYOptions } from "@tanstack/charts/area"
import { crosshair } from "@tanstack/charts/crosshair"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { stack } from "@tanstack/charts/stack"
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

type AreaChartProps = BaseChartProps & {
  areaProps?: Pick<AreaYOptions<SeriesDatum>, "fillOpacity" | "strokeWidth">
  chartProps?: {
    aspectRatio?: number
    height?: number
    initialWidth?: number
  }
  connectNulls?: boolean
  fillType?: "gradient" | "solid" | "none"
  lineType?: ChartCurveType
}

const defaultValueFormatter = (value: number) => value.toString()

function getGradientId(series: string) {
  return `area-${series.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`
}

function getAreaPaint({
  color,
  dimmed,
  fillType,
  series,
}: {
  color: string
  dimmed: boolean
  fillType: AreaChartProps["fillType"]
  series: string
}) {
  if (fillType === "none") {
    return "transparent"
  }

  if (fillType === "gradient") {
    return `url(#${getGradientId(series)})`
  }

  return dimmed ? `color-mix(in srgb, ${color} 10%, transparent)` : color
}

function AreaChart({
  areaProps,
  ariaLabel = "Area chart",
  chartProps,
  className,
  colors,
  config,
  connectNulls = false,
  data = [],
  dataKey,
  displayEdgeLabelsOnly = false,
  fillType = "gradient",
  hideGridLines = false,
  hideXAxis = false,
  hideYAxis = false,
  legend = true,
  legendProps,
  lineType = "linear",
  tooltip = true,
  tooltipProps,
  type = "default",
  valueFormatter = defaultValueFormatter,
  xAxisProps,
  yAxisProps,
  ...props
}: AreaChartProps) {
  const chartColors = getChartColors(config, colors)
  const xAxisHidden = hideXAxis || xAxisProps?.hide
  const yAxisHidden = hideYAxis || yAxisProps?.hide
  const rows = toSeriesData({ config, connectNulls, data, dataKey })
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
        const gradients: ChartLinearGradient[] = seriesNames.map((series) => {
          const dimmed = Boolean(selectedLegend && selectedLegend !== series)
          return {
            id: getGradientId(series),
            stops: [
              {
                color: chartColors[series] ?? "var(--chart-1)",
                offset: 0,
                opacity: 0.03,
              },
              {
                color: chartColors[series] ?? "var(--chart-1)",
                offset: 1,
                opacity: dimmed ? 0.04 : 0.38,
              },
            ],
            y1: 1,
            y2: 0,
          }
        })
        const sharedOptions = {
          color: "series" as const,
          curve: getChartCurve(lineType),
          fill: (row: SeriesDatum) =>
            getAreaPaint({
              color: chartColors[row.series] ?? "var(--chart-1)",
              dimmed: Boolean(selectedLegend && selectedLegend !== row.series),
              fillType,
              series: row.series,
            }),
          fillOpacity: fillType === "solid" ? 0.28 : 1,
          id: "preskok-area",
          key: (row: SeriesDatum) => `${row.series}-${row.index}`,
          stroke: (row: SeriesDatum) => {
            const color = chartColors[row.series] ?? "var(--chart-1)"
            return selectedLegend && selectedLegend !== row.series
              ? `color-mix(in srgb, ${color} 10%, transparent)`
              : color
          },
          strokeWidth: 2.25,
          x: "category" as const,
          z: "series" as const,
          ...areaProps,
        }
        let mark
        if (type === "default") {
          mark = areaY(rows, {
            ...sharedOptions,
            y1: 0,
            y2: "value",
          })
        } else {
          mark = areaY(rows, {
            ...sharedOptions,
            layout:
              type === "percent" ? stack({ offset: "normalize" }) : stack(),
            y: "value",
          })
        }

        const baseDefinition = defineChart({
          color: {
            domain: seriesNames,
            range: seriesNames.map((series) => chartColors[series] ?? ""),
          },
          focus: "group-x",
          gradients: fillType === "gradient" ? gradients : undefined,
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
            mark,
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
                anchor: tooltipProps?.anchor,
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

export { AreaChart }
export type { AreaChartProps }
