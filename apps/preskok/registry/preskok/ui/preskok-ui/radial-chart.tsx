"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
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
  type TooltipDatum,
} from "./chart"

type RadialChartProps = Omit<
  BaseChartProps,
  | "displayEdgeLabelsOnly"
  | "hideGridLines"
  | "hideXAxis"
  | "hideYAxis"
  | "intervalType"
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
  endAngle?: number
  label?: string
  maxValue?: number
  nameKey?: string
  radiusRatio?: number
  showLabel?: boolean
  showTrack?: boolean
  startAngle?: number
}

type RadialDatum = TooltipDatum & {
  color: string
  index: number
}

const defaultValueFormatter = (value: number) => value.toString()

function clampValue(value: number | null, maximum: number) {
  if (value === null) {
    return 0
  }

  return Math.min(Math.max(value, 0), maximum)
}

function getAverageValue(rows: RadialDatum[]) {
  if (rows.length === 0) {
    return 0
  }

  const total = rows.reduce((sum, row) => sum + (row.value ?? 0), 0)
  return total / rows.length
}

function RadialChart({
  ariaLabel = "Radial chart",
  chartProps,
  children,
  className,
  colors,
  config,
  data = [],
  dataKey,
  centerLabel = "Average",
  endAngle = Math.PI * 2,
  label,
  legend,
  legendProps,
  maxValue,
  nameKey = "name",
  radiusRatio = 0.84,
  showLabel = false,
  showTrack = true,
  startAngle = 0,
  tooltip = true,
  tooltipProps,
  valueFormatter = defaultValueFormatter,
  ...props
}: RadialChartProps) {
  const chartColors = getChartColors(config, colors)
  const fallbackColors = colors ?? Object.keys(config)
  const resolvedLegend = legend ?? Object.keys(config).length > 1

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
                  ? `color-mix(in srgb, ${color} 20%, transparent)`
                  : color,
              index,
              series,
              source,
              value: rawValue,
            } satisfies RadialDatum,
          ]
        })
        let resolvedMaximum = maxValue
        if (resolvedMaximum === undefined) {
          resolvedMaximum = Math.max(...rows.map((row) => row.value ?? 0), 1)
        }
        if (!Number.isFinite(resolvedMaximum) || resolvedMaximum <= 0) {
          resolvedMaximum = 1
        }

        const marks = []
        if (showTrack) {
          marks.push(
            radialBarAngle(rows, {
              angle: () => resolvedMaximum,
              cornerRadius: "full",
              fill: "color-mix(in srgb, var(--muted-foreground) 13%, transparent)",
              id: "preskok-radial-track",
              key: "series",
              radius: "category",
            })
          )
        }
        marks.push(
          radialBarAngle(rows, {
            angle: (row) => clampValue(row.value, resolvedMaximum),
            color: "series",
            cornerRadius: "full",
            fill: (row) => row.color,
            id: "preskok-radial-value",
            key: "series",
            radius: "category",
            z: "series",
          })
        )

        const baseDefinition = defineChart({
          color: {
            domain: rows.map((row) => row.series),
            range: rows.map((row) => row.color),
          },
          focusRing: false,
          guides: false,
          marks: [
            polar({
              angle: {
                scale: scaleLinear().domain([0, resolvedMaximum]),
              },
              endAngle,
              marks,
              radius: {
                range: [({ radius }) => radius * 0.34, ({ radius }) => radius],
                scale: () => scaleBand().padding(0.18),
              },
              radiusRatio,
              startAngle,
            }),
          ],
          svgAnimation: true,
          theme: getChartTheme(rows.map((row) => row.color)),
          x: null,
          y: null,
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
        const selectedRow = rows.find((row) => row.series === selectedLegend)
        const displayedValue = selectedRow?.value ?? getAverageValue(rows)
        const displayedLabel = selectedRow
          ? getTextLabel(config, selectedRow.series)
          : centerLabel

        return (
          <>
            <div className="relative">
              <Chart
                ariaLabel={ariaLabel}
                aspectRatio={chartProps?.aspectRatio}
                className="w-full [&_g:has(>path[data-ts-key*=preskok-radial-value]:hover)>path[data-ts-key*=preskok-radial-value]:not(:hover)]:opacity-55 [&_path[data-ts-key*=preskok-radial-value]]:cursor-pointer [&_path[data-ts-key*=preskok-radial-value]]:transition-[filter,opacity] [&_path[data-ts-key*=preskok-radial-value]]:duration-150 [&_path[data-ts-key*=preskok-radial-value]]:ease-out motion-reduce:[&_path[data-ts-key*=preskok-radial-value]]:transition-none [&_path[data-ts-key*=preskok-radial-value]:hover]:brightness-110"
                definition={definition}
                height={
                  chartProps?.aspectRatio
                    ? chartProps.height
                    : (chartProps?.height ?? 260)
                }
                initialWidth={chartProps?.initialWidth}
                onSelect={(point) => {
                  onLegendSelect(point?.datum.series ?? null)
                }}
                renderTooltipBody={
                  typeof tooltip === "function"
                    ? createTooltipRenderer<RadialDatum>({
                        config,
                        tooltip,
                        tooltipProps,
                        valueFormatter,
                      })
                    : undefined
                }
              />
              {showLabel ? (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
                    {label ?? valueFormatter(displayedValue)}
                  </span>
                  <span className="max-w-24 text-xs text-muted-foreground">
                    {displayedLabel}
                  </span>
                </div>
              ) : null}
            </div>
            {children}
          </>
        )
      }}
    </ChartFrame>
  )
}

export { RadialChart }
export type { RadialChartProps }
