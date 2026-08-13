"use client"

import { defineChart } from "@tanstack/charts"
import type { GroupLayout, StackLayout } from "@tanstack/charts"
import {
  barX,
  barY,
  type BarXOptions,
  type BarYOptions,
} from "@tanstack/charts/bar"
import { crosshair } from "@tanstack/charts/crosshair"
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
  hideYAxis = false,
  layout = "horizontal",
  legend = true,
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

  return (
    <ChartFrame
      className={className}
      colors={colors}
      config={config}
      legend={legend}
      legendProps={legendProps}
      {...props}
    >
      {({ onLegendSelect, selectedLegend }) => {
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
          key: (row: SeriesDatum) => `${row.series}-${row.index}`,
          layout: barLayout,
          maxThickness: barSize,
          radius: barRadius ?? (type === "default" ? 4 : undefined),
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
          marks: [
            crosshair({
              x: vertical
                ? {
                    band: {
                      fill: "var(--muted-foreground)",
                      fillOpacity: 0.08,
                      inset: -2,
                      radius: 6,
                    },
                  }
                : false,
              y: vertical
                ? false
                : {
                    band: {
                      fill: "var(--muted-foreground)",
                      fillOpacity: 0.08,
                      inset: -2,
                      radius: 6,
                    },
                  },
            }),
            mark,
          ],
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
            className="w-full [&_g:has(>rect[data-ts-key^=bar-]:hover)>rect[data-ts-key^=bar-]:not(:hover)]:opacity-60 [&_rect[data-ts-key^=bar-]]:cursor-pointer [&_rect[data-ts-key^=bar-]]:transition-[filter,opacity] [&_rect[data-ts-key^=bar-]]:duration-150 [&_rect[data-ts-key^=bar-]]:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:[&_rect[data-ts-key^=bar-]]:transition-none [&_rect[data-ts-key^=bar-]:hover]:brightness-110"
            definition={definition}
            height={
              chartProps?.aspectRatio
                ? chartProps.height
                : (chartProps?.height ?? 288)
            }
            initialWidth={chartProps?.initialWidth}
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
