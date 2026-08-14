"use client"

import type { CSSProperties } from "react"
import {
  defineChart,
  type GroupLayout,
  type StackLayout,
} from "@tanstack/charts"
import {
  barX,
  barY,
  type BarXOptions,
  type BarYOptions,
} from "@tanstack/charts/bar"
import { group } from "@tanstack/charts/group"
import { scaleBand } from "@tanstack/charts/scales/band"
import { stack } from "@tanstack/charts/stack"

import {
  Chart,
  ChartFrame,
  defaultValueFormatter,
  getCategoryAxis,
  getChartTooltip,
  getNumericAxis,
  getNumericScale,
  getSelectedSeriesColor,
  getSeriesChartOptions,
  toSeriesData,
  useChartFrame,
  valueToPercent,
  type BaseChartProps,
  type ChartAxisProps,
  type ChartNumericAxisProps,
  type ChartPlotProps,
  type ChartType,
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
  categoryAxis?: ChartAxisProps | false
  grid?: "hidden" | "visible"
  layout?: "horizontal" | "vertical"
  type?: ChartType
  valueAxis?: ChartNumericAxisProps | false
}

type BarChartPlotProps = ChartPlotProps<BarChartProps>

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

function BarChartPlot({
  ariaLabel = "Bar chart",
  barCategoryGap = 5,
  barGap = 4,
  barProps,
  barRadius,
  barSize,
  categoryAxis,
  colors,
  config,
  data,
  dataKey,
  grid = "visible",
  layout = "horizontal",
  size,
  tooltip,
  tooltipProps,
  type = "default",
  valueAxis,
  valueFormatter = defaultValueFormatter,
}: BarChartPlotProps) {
  const {
    actions: { selectSeries },
    state: { selectedSeries },
  } = useChartFrame()
  const rows = toSeriesData({ config, data, dataKey })
  const { chartColors, options, seriesNames } = getSeriesChartOptions(
    config,
    colors
  )
  const tooltipValueFormatter =
    type === "percent" ? valueToPercent : valueFormatter
  const vertical = layout === "horizontal"
  const stacked = type === "stacked" || type === "percent"
  let resolvedBarRadius = barRadius
  if (resolvedBarRadius === undefined) {
    resolvedBarRadius = type === "default" && seriesNames.length === 1 ? 8 : 4
  }

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
      getSelectedSeriesColor({
        color: chartColors[row.series] ?? "var(--chart-1)",
        opacity: 12,
        selectedSeries,
        series: row.series,
      }),
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
  const categoryAxisDefinition = getCategoryAxis({
    data,
    dataKey,
    props: categoryAxis,
  })
  const valueAxisDefinition = getNumericAxis({
    props: valueAxis,
    valueFormatter: tooltipValueFormatter,
  })
  const resolvedTooltipProps = {
    anchor: "pointer" as const,
    offset: 24,
    placement: "auto" as const,
    ...tooltipProps,
  }

  function createVerticalDefinition() {
    const baseDefinition = defineChart({
      ...options,
      focus: "group-x",
      marks: [
        barY(rows, {
          ...sharedOptions,
          x: "category",
          y: "value",
        }),
      ],
      x: {
        axis: categoryAxisDefinition,
        scale: () => scaleBand().padding(0.12),
      },
      y: {
        axis: valueAxisDefinition,
        grid: grid === "visible",
        nice: true,
        scale: getNumericScale(valueAxis),
      },
    })

    return baseDefinition
  }

  function createHorizontalDefinition() {
    const baseDefinition = defineChart({
      ...options,
      focus: "group-y",
      marks: [
        barX(rows, {
          ...sharedOptions,
          x: "value",
          y: "category",
        }),
      ],
      x: {
        axis: valueAxisDefinition,
        grid: grid === "visible",
        nice: true,
        scale: getNumericScale(valueAxis),
      },
      y: {
        axis: categoryAxisDefinition,
        scale: () => scaleBand().padding(0.12),
      },
    })

    return baseDefinition
  }

  const baseDefinition = vertical
    ? createVerticalDefinition()
    : createHorizontalDefinition()
  const { definition, renderTooltipBody } = getChartTooltip({
    config,
    definition: baseDefinition,
    tooltip,
    tooltipProps: resolvedTooltipProps,
    valueFormatter: tooltipValueFormatter,
  })
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
      className={`w-full ${roundedBarClass} [&_g:has(>rect[data-ts-key^=bar-]:hover)>rect[data-ts-key^=bar-]:not(:hover)]:opacity-60 [&_rect[data-ts-key^=bar-]]:cursor-pointer [&_rect[data-ts-key^=bar-]]:transition-[filter,opacity] [&_rect[data-ts-key^=bar-]]:duration-150 [&_rect[data-ts-key^=bar-]]:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:[&_rect[data-ts-key^=bar-]]:transition-none [&_rect[data-ts-key^=bar-]:hover]:brightness-110`}
      definition={definition}
      onSelect={(point) => {
        selectSeries(point?.datum.series ?? null)
      }}
      renderTooltipBody={renderTooltipBody}
      size={size}
      style={
        {
          "--bar-radius": `${resolvedBarRadius}px`,
        } as CSSProperties
      }
    />
  )
}

function BarChart({
  ariaLabel,
  barCategoryGap,
  barGap,
  barProps,
  barRadius,
  barSize,
  categoryAxis,
  className,
  colors,
  config,
  data,
  dataKey,
  grid,
  layout,
  legend,
  tooltip,
  tooltipProps,
  type = "default",
  size,
  valueAxis,
  valueFormatter,
  ...frameProps
}: BarChartProps) {
  let resolvedLegend = legend
  if (legend === undefined && type === "default") {
    resolvedLegend = false
  }

  return (
    <ChartFrame
      {...frameProps}
      className={className}
      colors={colors}
      config={config}
      legend={resolvedLegend}
    >
      <BarChartPlot
        ariaLabel={ariaLabel}
        barCategoryGap={barCategoryGap}
        barGap={barGap}
        barProps={barProps}
        barRadius={barRadius}
        barSize={barSize}
        categoryAxis={categoryAxis}
        colors={colors}
        config={config}
        data={data}
        dataKey={dataKey}
        grid={grid}
        layout={layout}
        size={size}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        type={type}
        valueAxis={valueAxis}
        valueFormatter={valueFormatter}
      />
    </ChartFrame>
  )
}

export { BarChart }
export type { BarChartProps }
