"use client"

import { defineChart } from "@tanstack/charts"
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
  CHART_HIT_MARK_ID,
  Chart,
  ChartFrame,
  defaultValueFormatter,
  valueToPercent,
  getCartesianScales,
  getChartColors,
  getChartOptions,
  getSelectedSeriesColor,
  toSeriesData,
  useSeriesSelection,
  type BaseChartProps,
  type ChartAxisProps,
  type ChartDatum,
  type ChartNumericAxisProps,
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
  /** Called with the source row of a clicked bar. */
  onBarClick?: (datum: ChartDatum) => void
  type?: ChartType
  valueAxis?: ChartNumericAxisProps | false
}

/** Top of the value axis the hit bars reach: the fixed domain end, or the tallest bar or stack. */
function getHitTop({
  domain,
  rows,
  stacked,
}: {
  domain?: readonly [number, number]
  rows: SeriesDatum[]
  stacked: boolean
}) {
  if (domain) {
    return domain[1]
  }
  const totals = new Map<SeriesDatum["category"], number>()
  for (const row of rows) {
    const value = Math.max(row.value ?? 0, 0)
    totals.set(
      row.category,
      stacked
        ? (totals.get(row.category) ?? 0) + value
        : Math.max(totals.get(row.category) ?? 0, value)
    )
  }
  return Math.max(0, ...totals.values())
}

function getBarLayout(type: ChartType, barGap: number) {
  if (type === "stacked") {
    return stack()
  }
  if (type === "percent") {
    return stack({ offset: "normalize" })
  }
  return group({ padding: Math.min(barGap / 20, 0.8) })
}

function BarChart({
  ariaLabel = "Bar chart",
  barCategoryGap = 5,
  barGap = 4,
  barProps,
  barRadius,
  barSize = 48,
  categoryAxis,
  colors,
  config,
  data,
  dataKey,
  grid = "visible",
  layout = "horizontal",
  legend,
  onBarClick,
  size,
  tooltip,
  tooltipProps,
  type = "default",
  valueAxis,
  valueFormatter = defaultValueFormatter,
  ...frameProps
}: BarChartProps) {
  const [selectedSeries, selectSeries] = useSeriesSelection()
  const rows = toSeriesData({ config, data, dataKey })
  const chartColors = getChartColors(config, colors)
  const singleSeries = Object.keys(config).length < 2
  const formatValue = type === "percent" ? valueToPercent : valueFormatter
  const scales = getCartesianScales({
    categoryAxis,
    categoryScale: () => scaleBand().padding(0.12),
    data,
    dataKey,
    grid,
    valueAxis,
    valueFormatter: formatValue,
  })

  // Stacks round only their exposed end; grouped bars round each bar end.
  const defaultRadius = type === "default" && singleSeries ? 8 : 4
  const barOptions = {
    color: "series",
    fill: (row: SeriesDatum) =>
      getSelectedSeriesColor({
        color: chartColors[row.series] ?? "var(--chart-1)",
        opacity: 12,
        selectedSeries,
        series: row.series,
      }),
    inset: barCategoryGap / 2,
    key: (row: SeriesDatum) => `${row.series}-${row.index}`,
    // Grouping pads each category for side-by-side series; a single series uses the full band.
    layout:
      type === "default" && singleSeries
        ? group({ padding: 0 })
        : getBarLayout(type, barGap),
    maxThickness: barSize,
    radius: { end: barRadius ?? defaultRadius },
    z: "series",
    ...barProps,
  } as const

  // One transparent full-height bar per category behind the real bars: it highlights the hovered category
  // and makes the whole column a hover and click target, so short bars are as easy to hit as tall ones.
  // Its datum keeps the real value, so the tooltip still reports it.
  const firstSeries = Object.keys(config)[0]
  const hitRows = rows.filter((row) => row.series === firstSeries)
  const hitTop =
    type === "percent"
      ? 1
      : getHitTop({
          domain: valueAxis ? valueAxis.domain : undefined,
          rows,
          stacked: type === "stacked",
        })
  const hitBarOptions = {
    color: "series",
    fill: "color-mix(in srgb, var(--muted-foreground) 10%, transparent)",
    fillOpacity: 0,
    id: CHART_HIT_MARK_ID,
    key: (row: SeriesDatum) => `hit-${row.index}`,
    layout: group({ padding: 0 }),
    radius: 6,
    states: [
      {
        when: ({ matches }: { matches: (match: "x" | "y") => boolean }) =>
          matches(layout === "horizontal" ? "x" : "y"),
        style: { fillOpacity: 1 },
        // Instant, so the highlight keeps up with the tooltip while the pointer is moving; a fade restarted on
        // every column and only finished once the pointer stopped.
        transition: { type: "tween", duration: 0 },
      },
    ],
    // Never animated by the motion renderer, including on mount and data changes.
    motion: false,
  } as const

  const definition =
    layout === "horizontal"
      ? defineChart({
          ...getChartOptions(chartColors),
          focus: "group-x",
          maxFocusDistance: Number.POSITIVE_INFINITY,
          focusRing: false,
          marks: [
            barY(hitRows, { ...hitBarOptions, x: "category", y: () => hitTop }),
            barY(rows, { ...barOptions, x: "category", y: "value" }),
          ],
          margin: scales.margin,
          scales: { x: scales.category, y: scales.value },
        })
      : defineChart({
          ...getChartOptions(chartColors),
          focus: "group-y",
          maxFocusDistance: Number.POSITIVE_INFINITY,
          focusRing: false,
          marks: [
            barX(hitRows, { ...hitBarOptions, x: () => hitTop, y: "category" }),
            barX(rows, { ...barOptions, x: "value", y: "category" }),
          ],
          margin: scales.margin,
          scales: { x: scales.value, y: scales.category },
        })

  return (
    <ChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={type === "default" && singleSeries ? (legend ?? false) : legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <Chart
        ariaLabel={ariaLabel}
        className={
          onBarClick
            ? "w-full [&_.ts-chart\\_\\_marks]:cursor-pointer"
            : "w-full"
        }
        config={config}
        definition={definition}
        onSelect={(point) => {
          // A clickable chart navigates; series selection belongs to the legend there.
          if (onBarClick) {
            if (point) {
              onBarClick(point.datum.source)
            }
            return
          }
          if (point?.markId !== CHART_HIT_MARK_ID) {
            selectSeries(point?.datum.series ?? null)
          }
        }}
        size={size}
        tooltip={tooltip}
        tooltipProps={{
          anchor: "pointer",
          offset: 24,
          placement: "auto",
          ...tooltipProps,
        }}
        valueFormatter={formatValue}
      />
    </ChartFrame>
  )
}

export { BarChart }
export type { BarChartProps }
