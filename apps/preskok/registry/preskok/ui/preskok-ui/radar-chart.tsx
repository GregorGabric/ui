"use client"

import { defineChart } from "@tanstack/charts"
import {
  angleGrid,
  focusGroupAngle,
  polar,
  radialArea,
  radialDot,
  radialGrid,
  type RadialAreaOptions,
  type RadialDotOptions,
} from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip"
import { curveLinearClosed } from "d3-shape"

import {
  Chart,
  ChartFrame,
  createTooltipRenderer,
  getChartColors,
  getChartTheme,
  toSeriesData,
  type BaseChartProps,
  type SeriesDatum,
} from "./chart"

type RadarAreaProps = Pick<
  RadialAreaOptions<SeriesDatum>,
  "fillOpacity" | "strokeOpacity" | "strokeWidth"
>

type RadarDotProps = Pick<
  RadialDotOptions<SeriesDatum>,
  "fillOpacity" | "r" | "strokeOpacity" | "strokeWidth"
>

type RadarChartProps = Omit<
  BaseChartProps,
  "displayEdgeLabelsOnly" | "intervalType" | "layout" | "type"
> & {
  chartProps?: {
    aspectRatio?: number
    height?: number
    initialWidth?: number
  }
  gridShape?: "circle" | "polygon"
  gridTicks?: number
  maxValue?: number
  radarAreaProps?: RadarAreaProps
  radarDotProps?: RadarDotProps
  radiusRatio?: number
  showDots?: boolean
  showGridLabels?: boolean
}

const defaultValueFormatter = (value: number) => value.toString()

function RadarChart({
  ariaLabel = "Radar chart",
  chartProps,
  children,
  className,
  colors,
  config,
  data = [],
  dataKey,
  gridShape = "polygon",
  gridTicks = 4,
  hideGridLines = false,
  hideXAxis = false,
  hideYAxis = false,
  legend,
  legendProps,
  maxValue,
  radarAreaProps,
  radarDotProps,
  radiusRatio = 0.72,
  showDots = true,
  showGridLabels = false,
  tooltip = true,
  tooltipProps,
  valueFormatter = defaultValueFormatter,
  xAxisProps,
  yAxisProps,
  ...props
}: RadarChartProps) {
  const chartColors = getChartColors(config, colors)
  const xAxisHidden = hideXAxis || xAxisProps?.hide
  const yAxisHidden = hideYAxis || yAxisProps?.hide
  const rows = toSeriesData({ config, data, dataKey })
  const seriesNames = Object.keys(config)
  const resolvedLegend = legend ?? seriesNames.length > 1
  let resolvedMaximum = maxValue
  if (resolvedMaximum === undefined) {
    resolvedMaximum = Math.max(...rows.map((row) => row.value ?? 0), 1)
  }
  if (!Number.isFinite(resolvedMaximum) || resolvedMaximum <= 0) {
    resolvedMaximum = 1
  }

  return (
    <ChartFrame
      className={className}
      colors={colors}
      config={config}
      legend={resolvedLegend}
      legendProps={legendProps}
      {...props}
    >
      {({ onLegendSelect, selectedLegend }) => {
        const colorForSeries = (series: string) => {
          const color = chartColors[series] ?? "var(--chart-1)"
          return selectedLegend && selectedLegend !== series
            ? `color-mix(in srgb, ${color} 16%, transparent)`
            : color
        }
        const guides = []
        if (!hideGridLines || (showGridLabels && !yAxisHidden)) {
          guides.push(
            radialGrid({
              format: (value) => {
                if (yAxisProps?.tickFormatter) {
                  return yAxisProps.tickFormatter(value)
                }
                return valueFormatter(Number(value))
              },
              labelFill: "var(--muted-foreground)",
              labelFontSize: 10,
              labels: showGridLabels && !yAxisHidden,
              shape: gridShape,
              stroke: "var(--muted-foreground)",
              strokeOpacity: hideGridLines ? 0 : 0.16,
              ticks: gridTicks,
              values: yAxisProps?.ticks,
            })
          )
        }
        if (!xAxisHidden || !hideGridLines) {
          guides.push(
            angleGrid({
              format: (value) => {
                if (xAxisProps?.tickFormatter) {
                  return xAxisProps.tickFormatter(value)
                }
                return String(value)
              },
              labelAnchor: ({ x }) => {
                if (x < -1) {
                  return "end"
                }
                if (x > 1) {
                  return "start"
                }
                return "middle"
              },
              labelDx: ({ x }) => {
                if (x < -1) {
                  return -4
                }
                if (x > 1) {
                  return 4
                }
                return 0
              },
              labelDy: ({ y }) => {
                if (y < -1) {
                  return -3
                }
                if (y > 1) {
                  return 3
                }
                return 0
              },
              labelFill: "var(--muted-foreground)",
              labelFontSize: 11,
              labelOffset: 10,
              labels: !xAxisHidden,
              stroke: "var(--muted-foreground)",
              strokeOpacity: hideGridLines ? 0 : 0.16,
              values: xAxisProps?.ticks,
            })
          )
        }

        const marks = [
          radialArea(rows, {
            angle: "category",
            color: "series",
            curve: curveLinearClosed,
            fill: (row) => colorForSeries(row.series),
            fillOpacity: 0.16,
            id: "preskok-radar-area",
            key: (row) => `${row.series}-${row.index}`,
            radius: "value",
            stroke: (row) => colorForSeries(row.series),
            strokeWidth: 2,
            z: "series",
            ...radarAreaProps,
          }),
        ]
        if (showDots) {
          marks.push(
            radialDot(rows, {
              angle: "category",
              color: "series",
              fill: (row) => colorForSeries(row.series),
              id: "preskok-radar-dot",
              key: (row) => `${row.series}-${row.index}`,
              r: 3.5,
              radius: "value",
              stroke: "var(--background)",
              strokeWidth: 2,
              z: "series",
              ...radarDotProps,
            })
          )
        }

        const baseDefinition = defineChart({
          color: {
            domain: seriesNames,
            range: seriesNames.map((series) => chartColors[series] ?? ""),
          },
          focus: focusGroupAngle,
          guides: false,
          marks: [
            polar({
              angle: { scale: scaleBand },
              guides,
              marks,
              radius: {
                scale: scaleLinear().domain([0, resolvedMaximum]).nice(4),
              },
              radiusRatio,
            }),
          ],
          svgAnimation: true,
          theme: getChartTheme(
            seriesNames.map((series) => chartColors[series] ?? "")
          ),
          x: null,
          y: null,
        })
        const definition = tooltip
          ? defineChart(baseDefinition, {
              tooltip: {
                anchor: tooltipProps?.anchor ?? "pointer",
                offset: tooltipProps?.offset ?? 20,
                placement: tooltipProps?.placement ?? "auto",
                use: tooltipExtension,
              },
            })
          : baseDefinition
        const renderTooltip = tooltip
          ? createTooltipRenderer<SeriesDatum>({
              config,
              tooltip,
              tooltipProps,
              valueFormatter,
            })
          : undefined

        return (
          <>
            <Chart
              ariaLabel={ariaLabel}
              aspectRatio={chartProps?.aspectRatio}
              className="w-full [&_path[data-ts-key*=preskok-radar-area]]:cursor-pointer [&_path[data-ts-key*=preskok-radar-area]]:transition-[filter,opacity] [&_path[data-ts-key*=preskok-radar-area]]:duration-150 [&_path[data-ts-key*=preskok-radar-area]]:ease-out motion-reduce:[&_path[data-ts-key*=preskok-radar-area]]:transition-none [&_path[data-ts-key*=preskok-radar-area]:hover]:brightness-110"
              definition={definition}
              height={
                chartProps?.aspectRatio
                  ? chartProps.height
                  : (chartProps?.height ?? 320)
              }
              initialWidth={chartProps?.initialWidth}
              onSelect={(point) => {
                onLegendSelect(point?.datum.series ?? null)
              }}
              renderTooltipBody={
                renderTooltip
                  ? (context) => {
                      const points = context.points.filter(
                        (point, index, allPoints) =>
                          allPoints.findIndex(
                            (candidate) =>
                              candidate.datum.series === point.datum.series
                          ) === index
                      )
                      return renderTooltip({ ...context, points })
                    }
                  : undefined
              }
            />
            {children}
          </>
        )
      }}
    </ChartFrame>
  )
}

export { RadarChart }
export type { RadarChartProps }
