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
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleBand } from "@tanstack/charts/scales/band"
import { stack } from "@tanstack/charts/stack"
import { text } from "@tanstack/charts/text"

import {
  ExperimentalChart,
  ExperimentalChartFrame,
  experimentalDefaultValueFormatter,
  getExperimentalCategoryAxis,
  getExperimentalChartTooltip,
  getExperimentalDefaultTooltipCategory,
  getExperimentalNumericAxis,
  getExperimentalNumericScale,
  getExperimentalSelectedSeriesColor,
  getExperimentalSeriesChartOptions,
  toExperimentalSeriesData,
  useExperimentalChartFrame,
  experimentalValueToPercent,
  type ExperimentalBaseChartProps,
  type ExperimentalChartAxisProps,
  type ExperimentalChartNumericAxisProps,
  type ExperimentalChartPlotProps,
  type ExperimentalChartType,
  type ExperimentalSeriesDatum,
} from "./experimental-chart"

type BarOptions = Pick<
  BarXOptions<ExperimentalSeriesDatum> & BarYOptions<ExperimentalSeriesDatum>,
  | "fill"
  | "fillOpacity"
  | "inset"
  | "maxThickness"
  | "radius"
  | "stroke"
  | "strokeDasharray"
  | "strokeOpacity"
  | "strokeWidth"
>

type ExperimentalBarChartProps = ExperimentalBaseChartProps & {
  barCategoryGap?: number
  barGap?: number
  barProps?: BarOptions
  barRadius?: number
  barSize?: number
  categoryAxis?: ExperimentalChartAxisProps | false
  grid?: "hidden" | "visible"
  layout?: "horizontal" | "vertical"
  label?: "category" | "value" | "both"
  type?: ExperimentalChartType
  valueAxis?: ExperimentalChartNumericAxisProps | false
}

type ExperimentalBarChartPlotProps =
  ExperimentalChartPlotProps<ExperimentalBarChartProps>

function getBarDirection(value: number | null) {
  return value !== null && value < 0 ? "negative" : "positive"
}

function getTerminalSeries(rows: ExperimentalSeriesDatum[]) {
  const terminalSeries = new Map<string, string>()

  for (const row of rows) {
    if (row.value === null || row.value === 0) {
      continue
    }

    terminalSeries.set(`${row.index}-${getBarDirection(row.value)}`, row.series)
  }

  return terminalSeries
}

function ExperimentalBarChartPlot({
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
  label,
  size,
  tooltip,
  tooltipProps,
  type = "default",
  valueAxis,
  valueFormatter = experimentalDefaultValueFormatter,
}: ExperimentalBarChartPlotProps) {
  const {
    actions: { selectSeries },
    state: { selectedSeries },
  } = useExperimentalChartFrame()
  const rows = toExperimentalSeriesData({ config, data, dataKey })
  const { chartColors, options, seriesNames } =
    getExperimentalSeriesChartOptions(config, colors)
  const tooltipValueFormatter =
    type === "percent" ? experimentalValueToPercent : valueFormatter
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
    fill: (row: ExperimentalSeriesDatum) =>
      getExperimentalSelectedSeriesColor({
        color: chartColors[row.series] ?? "var(--chart-1)",
        opacity: 12,
        selectedSeries,
        series: row.series,
      }),
    inset: barCategoryGap / 2,
    key: (row: ExperimentalSeriesDatum) => {
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
  const categoryAxisDefinition = getExperimentalCategoryAxis({
    data,
    dataKey,
    props: categoryAxis,
  })
  const valueAxisDefinition = getExperimentalNumericAxis({
    props: valueAxis,
    valueFormatter: tooltipValueFormatter,
  })
  const resolvedTooltipProps = {
    anchor: "pointer" as const,
    offset: 24,
    placement: "auto" as const,
    ...tooltipProps,
  }

  const labeledRows = rows.filter((row) => row.value !== null)

  function createVerticalLabelMarks() {
    const marks = []
    if (label === "category" || label === "both") {
      marks.push(
        decorative(
          text(labeledRows, {
            dy: (row) => (Number(row.value) < 0 ? 14 : -10),
            fill: (row) => chartColors[row.series] ?? "var(--foreground)",
            fontSize: 12,
            id: "preskok-bar-category-labels",
            key: (row) => `${row.series}-${row.index}`,
            text: (row) => String(row.category),
            x: "category",
            y: "value",
          })
        )
      )
    }
    if (label === "value" || label === "both") {
      marks.push(
        decorative(
          text(labeledRows, {
            dy: (row) => (Number(row.value) < 0 ? 14 : -12),
            fill: "var(--foreground)",
            fontSize: 12,
            id: "preskok-bar-value-labels",
            key: (row) => `${row.series}-${row.index}`,
            text: (row) => valueFormatter(Number(row.value)),
            x: "category",
            y: "value",
          })
        )
      )
    }
    return marks
  }

  function createHorizontalLabelMarks() {
    const marks = []
    if (label === "category" || label === "both") {
      marks.push(
        decorative(
          text(labeledRows, {
            anchor: "start",
            dx: 8,
            fill: "var(--background)",
            fontSize: 12,
            id: "preskok-bar-category-labels",
            key: (row) => `${row.series}-${row.index}`,
            text: (row) => String(row.category),
            x: () => 0,
            y: "category",
          })
        )
      )
    }
    if (label === "value" || label === "both") {
      marks.push(
        decorative(
          text(labeledRows, {
            anchor: "start",
            dx: 8,
            fill: "var(--foreground)",
            fontSize: 12,
            id: "preskok-bar-value-labels",
            key: (row) => `${row.series}-${row.index}`,
            text: (row) => valueFormatter(Number(row.value)),
            x: "value",
            y: "category",
          })
        )
      )
    }
    return marks
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
        ...createVerticalLabelMarks(),
      ],
      scales: {
        x: {
          axis: categoryAxisDefinition,
          scale: () => scaleBand().padding(0.12),
        },
        y: {
          axis: valueAxisDefinition,
          grid: grid === "visible",
          nice: true,
          scale: getExperimentalNumericScale(valueAxis),
        },
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
        ...createHorizontalLabelMarks(),
      ],
      scales: {
        x: {
          axis: valueAxisDefinition,
          grid: grid === "visible",
          nice: true,
          scale: getExperimentalNumericScale(valueAxis),
        },
        y: {
          axis: categoryAxisDefinition,
          scale: () => scaleBand().padding(0.12),
        },
      },
    })

    return baseDefinition
  }

  const baseDefinition = vertical
    ? createVerticalDefinition()
    : createHorizontalDefinition()
  const { definition, renderTooltipBody } = getExperimentalChartTooltip({
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
    <ExperimentalChart
      ariaLabel={ariaLabel}
      className={`w-full ${roundedBarClass} [&_g:has(>rect[data-ts-key^=bar-]:hover)>rect[data-ts-key^=bar-]:not(:hover)]:opacity-60 [&_rect[data-ts-key^=bar-]]:cursor-pointer [&_rect[data-ts-key^=bar-]]:transition-[filter,opacity] [&_rect[data-ts-key^=bar-]]:duration-150 [&_rect[data-ts-key^=bar-]]:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:[&_rect[data-ts-key^=bar-]]:transition-none [&_rect[data-ts-key^=bar-]:hover]:brightness-110`}
      defaultTooltipCategory={getExperimentalDefaultTooltipCategory(
        data,
        dataKey,
        tooltipProps?.defaultIndex
      )}
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

function ExperimentalBarChart({
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
  label,
  legend,
  tooltip,
  tooltipProps,
  type = "default",
  size,
  valueAxis,
  valueFormatter,
  ...frameProps
}: ExperimentalBarChartProps) {
  let resolvedLegend = legend
  if (
    legend === undefined &&
    type === "default" &&
    Object.keys(config).length < 2
  ) {
    resolvedLegend = false
  }

  return (
    <ExperimentalChartFrame
      {...frameProps}
      className={className}
      colors={colors}
      config={config}
      legend={resolvedLegend}
    >
      <ExperimentalBarChartPlot
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
        label={label}
        size={size}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        type={type}
        valueAxis={valueAxis}
        valueFormatter={valueFormatter}
      />
    </ExperimentalChartFrame>
  )
}

export { ExperimentalBarChart }
export type { ExperimentalBarChartProps }
