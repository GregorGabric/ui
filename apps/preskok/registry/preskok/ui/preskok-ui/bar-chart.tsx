"use client"

import type { CSSProperties } from "react"
import { defineChart } from "@tanstack/charts"
import type { GroupLayout, StackLayout } from "@tanstack/charts"
import {
  barX,
  barY,
  type BarXOptions,
  type BarYOptions,
} from "@tanstack/charts/bar"
import { group } from "@tanstack/charts/group"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { stack } from "@tanstack/charts/stack"
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip"

import {
  Chart,
  ChartFrame,
  createTooltipRenderer,
  getAxisTickLabelOptions,
  getAxisTickOptions,
  getChartColors,
  getChartTheme,
  getEdgeValues,
  getNumericAxisTickOptions,
  toSeriesData,
  valueToPercent,
  type BaseChartProps,
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
  chartProps?: {
    aspectRatio?: number
    height?: number
    initialWidth?: number
  }
}

const defaultValueFormatter = (value: number) => value.toString()

function dimmedColor(color: string, dimmed: boolean) {
  return dimmed ? `color-mix(in srgb, ${color} 12%, transparent)` : color
}

function getBarDirection(value: number | null) {
  return value !== null && value < 0 ? "negative" : "positive"
}

function getTerminalSeries(rows: SeriesDatum[]) {
  const terminalSeries = new Map<string, string>()

  for (const row of rows) {
    if (row.value === null || row.value === 0) {
      continue
    }

    terminalSeries.set(`${row.index}-${getBarDirection(row.value)}`, row.series)
  }

  return terminalSeries
}

function BarChart({
  ariaLabel = "Bar chart",
  barCategoryGap = 5,
  barGap = 4,
  barProps,
  barRadius,
  barSize,
  chartProps,
  className,
  colors,
  config,
  data = [],
  dataKey,
  displayEdgeLabelsOnly = false,
  hideGridLines = false,
  hideXAxis = false,
  hideYAxis = true,
  layout = "horizontal",
  legend,
  legendProps,
  tooltip = true,
  tooltipProps,
  type = "default",
  valueFormatter = defaultValueFormatter,
  xAxisProps,
  yAxisProps,
  ...props
}: BarChartProps) {
  const chartColors = getChartColors(config, colors)
  const xAxisHidden = hideXAxis || xAxisProps?.hide
  const yAxisHidden = hideYAxis || yAxisProps?.hide
  const rows = toSeriesData({ config, data, dataKey })
  const seriesNames = Object.keys(config)
  const tooltipValueFormatter =
    type === "percent" ? valueToPercent : valueFormatter
  const vertical = layout !== "vertical"
  const resolvedLegend = legend ?? type !== "default"
  const stacked = type === "stacked" || type === "percent"
  let resolvedBarRadius = barRadius
  if (resolvedBarRadius === undefined) {
    resolvedBarRadius = type === "default" && seriesNames.length === 1 ? 8 : 4
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
        const terminalSeries = getTerminalSeries(rows)
        let barLayout: GroupLayout | StackLayout = group({
          padding: Math.min(barGap / 20, 0.8),
        })
        if (type === "stacked") {
          barLayout = stack()
        } else if (type === "percent") {
          barLayout = stack({ offset: "normalize" })
        }

        const sharedOptions = {
          color: "series" as const,
          fill: (row: SeriesDatum) =>
            dimmedColor(
              chartColors[row.series] ?? "var(--chart-1)",
              Boolean(selectedLegend && selectedLegend !== row.series)
            ),
          inset: barCategoryGap / 2,
          key: (row: SeriesDatum) => {
            const direction = getBarDirection(row.value)
            let position = "outer"
            if (
              stacked &&
              terminalSeries.get(`${row.index}-${direction}`) !== row.series
            ) {
              position = "inner"
            }

            return `${direction}-${position}-${row.series}-${row.index}`
          },
          layout: barLayout,
          maxThickness: barSize ?? 48,
          radius: 0,
          z: "series" as const,
          ...barProps,
        }
        const mark = vertical
          ? barY(rows, {
              ...sharedOptions,
              x: "category",
              y: "value",
            })
          : barX(rows, {
              ...sharedOptions,
              x: "value",
              y: "category",
            })

        const categoricalAxis = {
          line: false,
          label: vertical ? xAxisProps?.label : yAxisProps?.label,
          tickLabels: getAxisTickLabelOptions(
            vertical ? xAxisProps : yAxisProps
          ),
          ticks: getAxisTickOptions({
            displayEdgeLabelsOnly,
            edgeValues: getEdgeValues(data, dataKey),
            props: vertical ? xAxisProps : yAxisProps,
          }),
        }
        const numericAxis = {
          line: false,
          label: vertical ? yAxisProps?.label : xAxisProps?.label,
          tickLabels: getAxisTickLabelOptions(
            vertical ? yAxisProps : xAxisProps
          ),
          ticks: getNumericAxisTickOptions({
            props: vertical ? yAxisProps : xAxisProps,
            valueFormatter: (value: unknown) =>
              tooltipValueFormatter(Number(value)),
          }),
        }
        const baseDefinition = defineChart({
          color: {
            domain: seriesNames,
            range: seriesNames.map((series) => chartColors[series] ?? ""),
          },
          focus: vertical ? "group-x" : "group-y",
          marks: [mark],
          svgAnimation: true,
          theme: getChartTheme(
            seriesNames.map((series) => chartColors[series] ?? "")
          ),
          x: vertical
            ? {
                axis: xAxisHidden ? false : categoricalAxis,
                scale: () => scaleBand().padding(0.12),
              }
            : {
                axis: xAxisHidden ? false : numericAxis,
                grid: !hideGridLines,
                nice: true,
                scale: scaleLinear,
              },
          y: vertical
            ? {
                axis: yAxisHidden ? false : numericAxis,
                grid: !hideGridLines,
                nice: true,
                scale: scaleLinear,
              }
            : {
                axis: yAxisHidden ? false : categoricalAxis,
                scale: () => scaleBand().padding(0.12),
              },
        })
        const definition = tooltip
          ? defineChart(baseDefinition, {
              tooltip: {
                anchor: tooltipProps?.anchor ?? "pointer",
                offset: tooltipProps?.offset ?? 24,
                placement: tooltipProps?.placement ?? "auto",
                use: tooltipExtension,
              },
            })
          : baseDefinition
        let roundedBarClass =
          "[&_rect[data-ts-key*=positive-outer-]]:[clip-path:inset(0_round_var(--bar-radius)_var(--bar-radius)_0_0)] [&_rect[data-ts-key*=negative-outer-]]:[clip-path:inset(0_round_0_0_var(--bar-radius)_var(--bar-radius))]"
        if (!vertical) {
          roundedBarClass =
            "[&_rect[data-ts-key*=positive-outer-]]:[clip-path:inset(0_round_0_var(--bar-radius)_var(--bar-radius)_0)] [&_rect[data-ts-key*=negative-outer-]]:[clip-path:inset(0_round_var(--bar-radius)_0_0_var(--bar-radius))]"
        }
        if (barProps?.radius !== undefined) {
          roundedBarClass = ""
        }

        return (
          <Chart
            ariaLabel={ariaLabel}
            aspectRatio={chartProps?.aspectRatio}
            className={`w-full ${roundedBarClass} [&_g:has(>rect[data-ts-key^=bar-]:hover)>rect[data-ts-key^=bar-]:not(:hover)]:opacity-60 [&_rect[data-ts-key^=bar-]]:cursor-pointer [&_rect[data-ts-key^=bar-]]:transition-[filter,opacity] [&_rect[data-ts-key^=bar-]]:duration-150 [&_rect[data-ts-key^=bar-]]:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:[&_rect[data-ts-key^=bar-]]:transition-none [&_rect[data-ts-key^=bar-]:hover]:brightness-110`}
            definition={definition}
            height={
              chartProps?.aspectRatio
                ? chartProps.height
                : (chartProps?.height ?? 288)
            }
            initialWidth={chartProps?.initialWidth}
            style={
              {
                "--bar-radius": `${resolvedBarRadius}px`,
              } as CSSProperties
            }
            onSelect={(point) => {
              onLegendSelect(point?.datum.series ?? null)
            }}
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

export { BarChart }
export type { BarChartProps }
