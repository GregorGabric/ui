"use client"

import { defineChart } from "@tanstack/charts"
import {
  pie,
  polar,
  radialArc,
  radialText,
  type RadialArcOptions,
} from "@tanstack/charts/polar"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip"

import {
  Chart,
  ChartFrame,
  createTooltipRenderer,
  getChartColors,
  getChartTheme,
  getColorValue,
  getTextLabel,
  type BaseChartProps,
  type ChartDatum,
  type TooltipDatum,
} from "./chart"

type PieChartProps = Omit<
  BaseChartProps,
  | "displayEdgeLabelsOnly"
  | "hideGridLines"
  | "hideXAxis"
  | "hideYAxis"
  | "layout"
  | "type"
  | "xAxisProps"
  | "yAxisProps"
> & {
  chartProps?: {
    aspectRatio?: number
    height?: number
    initialWidth?: number
  }
  centerLabel?: string
  label?: string
  nameKey?: string
  pieProps?: Pick<
    RadialArcOptions<PieSliceDatum>,
    "cornerRadius" | "fillOpacity" | "stroke" | "strokeWidth"
  > & {
    paddingAngle?: number
  }
  showLabel?: boolean
  variant?: "pie" | "donut"
}

type PieSourceDatum = TooltipDatum & {
  color: string
  index: number
}

type PieSliceDatum = ReturnType<typeof pie<PieSourceDatum>>[number]

const defaultValueFormatter = (value: number) => value.toString()

function calculateDefaultLabel(data: ChartDatum[], valueKey: string) {
  return data.reduce((total, dataPoint) => {
    const value = dataPoint[valueKey]
    return total + (typeof value === "number" ? value : 0)
  }, 0)
}

function PieChart({
  ariaLabel = "Pie chart",
  centerLabel = "Total",
  chartProps,
  children,
  className,
  colors,
  config,
  data = [],
  dataKey,
  label,
  legend = true,
  legendProps,
  nameKey = "name",
  pieProps,
  showLabel = false,
  tooltip = true,
  tooltipProps,
  valueFormatter = defaultValueFormatter,
  variant = "pie",
  ...props
}: PieChartProps) {
  const chartColors = getChartColors(config, colors)
  const fallbackColors = colors ?? Object.keys(config)
  const parsedLabel =
    label ?? valueFormatter(calculateDefaultLabel(data, dataKey))

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
        const rows = data.flatMap((source, index) => {
          const rawName = source[nameKey]
          const rawValue = source[dataKey]
          if (
            (typeof rawName !== "string" && typeof rawName !== "number") ||
            typeof rawValue !== "number" ||
            !Number.isFinite(rawValue)
          ) {
            return []
          }

          const series = String(rawName)
          const fallback = fallbackColors[index % fallbackColors.length]
          const color = chartColors[series] ?? getColorValue(fallback)
          return [
            {
              category: series,
              color:
                selectedLegend && selectedLegend !== series
                  ? `color-mix(in srgb, ${color} 26%, transparent)`
                  : color,
              index,
              series,
              source,
              value: rawValue,
            } satisfies PieSourceDatum,
          ]
        })
        const slices = pie(rows, {
          endAngle: Math.PI * 2,
          gapAngle: ((pieProps?.paddingAngle ?? 0) * Math.PI) / 180,
          startAngle: 0,
          value: "value",
        })
        const selectedRow = rows.find((row) => row.series === selectedLegend)
        const displayedValue = selectedRow
          ? valueFormatter(selectedRow.value ?? 0)
          : parsedLabel
        const displayedLabel = selectedRow
          ? getTextLabel(config, selectedRow.series)
          : centerLabel
        const marks = [
          radialArc(slices, {
            color: "series",
            fill: (row) => row.color,
            innerRadius:
              variant === "donut" ? ({ radius }) => radius * 0.58 : undefined,
            key: "series",
            ...pieProps,
          }),
        ]

        if (showLabel && variant === "donut") {
          marks.push(
            radialText(slices.slice(0, 1), {
              angle: 0,
              dy: -5,
              fill: "var(--foreground)",
              fontSize: 20,
              fontWeight: 600,
              key: "series",
              radius: 0,
              text: () => displayedValue,
            }),
            radialText(slices.slice(0, 1), {
              angle: 0,
              dy: 14,
              fill: "var(--muted-foreground)",
              fontSize: 10,
              fontWeight: 500,
              key: "series",
              radius: 0,
              text: () => displayedLabel,
            })
          )
        }

        const baseDefinition = defineChart({
          color: {
            domain: rows.map((row) => row.series),
            range: rows.map((row) => row.color),
          },
          focusRing: false,
          marks: [
            polar({
              angle: { scale: scaleLinear().domain([0, Math.PI * 2]) },
              inset: 10,
              marks,
              radius: { scale: scaleLinear().domain([0, 1]) },
              radiusRatio: 0.84,
            }),
          ],
          svgAnimation: true,
          theme: getChartTheme(rows.map((row) => row.color)),
        })
        const definition = tooltip
          ? defineChart(baseDefinition, {
              tooltip: {
                anchor: tooltipProps?.anchor,
                className: tooltipProps?.className,
                format: ({ datum }) => {
                  const tooltipLabel = getTextLabel(config, datum.series)
                  const formattedLabel = tooltipProps?.labelFormatter
                    ? tooltipProps.labelFormatter(tooltipLabel)
                    : tooltipLabel
                  const formattedValue = valueFormatter(datum.value ?? 0)
                  return tooltipProps?.hideLabel
                    ? formattedValue
                    : `${formattedLabel} · ${formattedValue}`
                },
                offset: tooltipProps?.offset,
                placement: tooltipProps?.placement,
                use: tooltipExtension,
              },
            })
          : baseDefinition

        return (
          <>
            <Chart
              ariaLabel={ariaLabel}
              aspectRatio={chartProps?.aspectRatio}
              className="w-full [&_g:has(>path[data-ts-key*=arc-]:hover)>path[data-ts-key*=arc-]:not(:hover)]:opacity-60 [&_path[data-ts-key*=arc-]]:cursor-pointer [&_path[data-ts-key*=arc-]]:transition-[filter,opacity] [&_path[data-ts-key*=arc-]]:duration-150 [&_path[data-ts-key*=arc-]]:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:[&_path[data-ts-key*=arc-]]:transition-none [&_path[data-ts-key*=arc-]:hover]:brightness-110"
              definition={definition}
              height={
                chartProps?.aspectRatio
                  ? chartProps.height
                  : (chartProps?.height ?? 240)
              }
              initialWidth={chartProps?.initialWidth}
              onSelect={(point) => {
                onLegendSelect(point?.datum.series ?? null)
              }}
              renderTooltipBody={
                typeof tooltip === "function"
                  ? createTooltipRenderer<PieSliceDatum>({
                      config,
                      tooltip,
                      tooltipProps,
                      valueFormatter,
                    })
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

export { PieChart }
export type { PieChartProps }
