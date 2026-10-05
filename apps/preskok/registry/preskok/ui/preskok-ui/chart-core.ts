import type { ComponentType, HTMLAttributes, ReactNode } from "react"
import type {
  ChartAxisPresentationOptions,
  ChartCurve,
  ChartFocusMatch,
  ChartMarkState,
  ChartMotionContext,
  ChartPoint,
  ChartTooltipOptions,
  ChartValue,
} from "@tanstack/charts"
import { crosshair } from "@tanstack/charts/crosshair"
import { d3Curve } from "@tanstack/charts/d3/shape"
import { focusGroupX } from "@tanstack/charts/focus"
import type { ChartProps as TanStackChartProps } from "@tanstack/charts/react/tooltip"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import {
  curveBasis,
  curveBumpX,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  type CurveFactory,
} from "d3-shape"
import type { ToggleButtonGroupProps } from "react-aria-components/ToggleButtonGroup"

type ChartType = "default" | "stacked" | "percent"
type ChartColor = (typeof CHART_COLORS)[number]
type ChartColorPalette = readonly [ChartColor, ...ChartColor[]]
type ChartDatum = Record<string, unknown>
type ChartCurveType = keyof typeof CURVES | ChartCurve

type ChartConfig = Record<
  string,
  {
    color?: ChartColor
    icon?: ComponentType<{ "data-slot"?: string }>
    label?: ReactNode
  }
>

type ChartAxisProps<TValue extends ChartValue = ChartValue> = {
  label?: string
  minTickGap?: number
  tickFormatter?: (value: TValue) => string
  tickMargin?: number
  ticks?: readonly TValue[]
  tickStrategy?: "all" | "auto" | "edges"
}

type ChartNumericAxisProps = ChartAxisProps<number> & {
  domain?: readonly [number, number]
}

type ChartTooltipProps = Pick<
  ChartTooltipOptions,
  "anchor" | "offset" | "placement"
> & {
  className?: string
  hideIndicator?: boolean
  hideLabel?: boolean
  indicator?: "line" | "dot" | "dashed"
  labelFormatter?: (label: ReactNode) => ReactNode
  labelSeparator?: boolean
}

type ChartLegendProps = Omit<
  ToggleButtonGroupProps,
  | "children"
  | "className"
  | "onSelectionChange"
  | "selectedKeys"
  | "selectionMode"
> & {
  align?: "left" | "center" | "right"
  className?: string
  hideIcon?: boolean
  verticalAlign?: "top" | "bottom"
}

type ChartSizeProps = Pick<
  TanStackChartProps,
  "aspectRatio" | "height" | "initialWidth"
>

type TooltipDatum = {
  category: ChartValue
  series: string
  source: unknown
  value: number | null
}

type ChartTooltipContentProps<
  TDatum extends TooltipDatum = TooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = {
  config: ChartConfig
  points: readonly ChartPoint<TDatum, TXValue, TYValue>[]
  tooltipProps?: ChartTooltipProps
  valueFormatter: (value: number) => string
}

type ChartTooltipRenderer<
  TDatum extends TooltipDatum = TooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = (props: ChartTooltipContentProps<TDatum, TXValue, TYValue>) => ReactNode

interface BaseChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  ariaLabel?: string
  children?: never
  colors?: ChartColorPalette
  config: ChartConfig
  data: ChartDatum[]
  dataKey: string
  legend?: ReactNode | false
  size?: ChartSizeProps
  tooltip?: ChartTooltipRenderer | false
  tooltipProps?: ChartTooltipProps
  valueFormatter?: (value: number) => string
}

type CartesianChartProps = BaseChartProps & {
  grid?: "hidden" | "visible"
  xAxis?: ChartAxisProps | false
  yAxis?: ChartNumericAxisProps | false
}

type SeriesDatum = TooltipDatum & {
  index: number
  source: ChartDatum
}

type NamedSeriesDatum = Omit<TooltipDatum, "value"> & {
  color: string
  index: number
  source: ChartDatum
  value: number
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const CURVES = {
  basis: curveBasis,
  bump: curveBumpX,
  linear: curveLinear,
  monotone: curveMonotoneX,
  monotoneX: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
  stepAfter: curveStepAfter,
  stepBefore: curveStepBefore,
} satisfies Record<string, CurveFactory>

/**
 * Group-x focus where the series closest to the pointer becomes the primary
 * point, so the crosshair marker lands on the line you point at.
 *
 * The built-in `"group-x"` preset first picks the painted mark that contains
 * the pointer, and a filled area contains everything below its line, so a
 * line could only win with the pointer exactly on its stroke. TanStack skips
 * that step for any strategy other than its own object. Area points also sit
 * mid-fill rather than on the edge, so `ignoreMarkId` drops them and focus
 * uses the line points along each top edge.
 */
function focusNearestSeries(ignoreMarkId?: string) {
  const keep = <TPoint extends { markId: string }>(
    points: readonly TPoint[]
  ) =>
    ignoreMarkId
      ? points.filter((point) => point.markId !== ignoreMarkId)
      : points

  const strategy: typeof focusGroupX = {
    group: (points, context) => focusGroupX.group(keep(points), context),
    navigation: (points) => focusGroupX.navigation(keep(points)),
    resolve: (points, context) => focusGroupX.resolve(keep(points), context),
  }
  return strategy
}

function valueToPercent(value: number) {
  return `${(value * 100).toFixed(0)}%`
}

function defaultValueFormatter(value: number) {
  return String(value)
}

function isChartValue(value: unknown): value is ChartValue {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    value instanceof Date
  )
}

function dimColor(color: string, opacity: number) {
  return `color-mix(in srgb, ${color} ${opacity}%, transparent)`
}

function getSelectedSeriesColor({
  color,
  opacity,
  selectedSeries,
  series,
}: {
  color: string
  opacity: number
  selectedSeries: string | null
  series: string
}) {
  if (selectedSeries === null || selectedSeries === series) {
    return color
  }

  return dimColor(color, opacity)
}

function getPositiveMaximum(values: readonly number[], maximum?: number) {
  const resolvedMaximum = maximum ?? Math.max(...values, 1)
  return Number.isFinite(resolvedMaximum) && resolvedMaximum > 0
    ? resolvedMaximum
    : 1
}

function getChartColors(
  config: ChartConfig,
  colors: ChartColorPalette = CHART_COLORS
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(config).map(([series, item], index) => [
      series,
      item.color ?? colors[index % colors.length] ?? colors[0],
    ])
  )
}

/** Color scale and theme shared by every chart. */
function getChartOptions(colorsBySeries: Record<string, string>) {
  const domain = Object.keys(colorsBySeries)
  const range = Object.values(colorsBySeries)

  return {
    color: { domain, range },
    theme: {
      background: "transparent",
      foreground: "var(--muted-foreground)",
      grid: "var(--muted)",
      muted: "color-mix(in srgb, var(--muted-foreground) 78%, transparent)",
      palette: range,
    },
  }
}

/**
 * Skips the renderer's grow-from-baseline entrance for a mark, so `Chart` can
 * reveal it left to right instead (`entrance="reveal"`). Updates still morph.
 */
function revealEntranceMotion(context: ChartMotionContext) {
  return context.phase === "enter" ? false : undefined
}

/** Fades every mark that does not match the current focus. */
function getFocusStates<TDatum>(
  match: ChartFocusMatch,
  opacity = 0.6
): ChartMarkState<TDatum>[] {
  return [
    {
      when: (context) => !context.matches(match),
      style: { opacity },
      transition: { type: "tween", duration: 150 },
    },
  ]
}

function getCrosshair() {
  return crosshair({
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
  })
}

function toSeriesData({
  config,
  connectNulls = false,
  data,
  dataKey,
}: {
  config: ChartConfig
  connectNulls?: boolean
  data: ChartDatum[]
  dataKey: string
}) {
  const seriesNames = Object.keys(config)

  return data.flatMap((source, index) => {
    const category = source[dataKey]
    if (!isChartValue(category)) {
      return []
    }

    return seriesNames.flatMap((series) => {
      const rawValue = source[series]
      const value =
        typeof rawValue === "number" && Number.isFinite(rawValue)
          ? rawValue
          : null

      if (connectNulls && value === null) {
        return []
      }

      return [
        {
          category,
          index,
          series,
          source,
          value,
        } satisfies SeriesDatum,
      ]
    })
  })
}

function toNamedSeriesData({
  colors = CHART_COLORS,
  config,
  data,
  nameKey,
  selectedOpacity,
  selectedSeries,
  valueKey,
}: {
  colors?: ChartColorPalette
  config: ChartConfig
  data: ChartDatum[]
  nameKey: string
  selectedOpacity: number
  selectedSeries: string | null
  valueKey: string
}) {
  const chartColors = getChartColors(config, colors)

  return data.flatMap((source, index) => {
    const rawName = source[nameKey]
    const rawValue = source[valueKey]
    if (
      (typeof rawName !== "string" && typeof rawName !== "number") ||
      typeof rawValue !== "number" ||
      !Number.isFinite(rawValue)
    ) {
      return []
    }

    const series = String(rawName)
    const color =
      chartColors[series] ?? colors[index % colors.length] ?? colors[0]

    return [
      {
        category: series,
        color: getSelectedSeriesColor({
          color,
          opacity: selectedOpacity,
          selectedSeries,
          series,
        }),
        index,
        series,
        source,
        value: rawValue,
      } satisfies NamedSeriesDatum,
    ]
  })
}

/** Maps each named row to its (possibly dimmed) color for the chart color scale. */
function getNamedSeriesColors(rows: readonly NamedSeriesDatum[]) {
  return Object.fromEntries(rows.map((row) => [row.series, row.color]))
}

function getLabel(config: ChartConfig, series: string) {
  return config[series]?.label ?? series
}

function getTextLabel(config: ChartConfig, series: string) {
  const label = getLabel(config, series)
  return typeof label === "string" || typeof label === "number"
    ? String(label)
    : series
}

function getChartCurve(lineType: ChartCurveType = "linear") {
  return typeof lineType === "string" ? d3Curve(CURVES[lineType]) : lineType
}

function getAxis<TValue extends ChartValue>({
  edgeValues,
  format,
  props,
}: {
  edgeValues?: readonly TValue[]
  format?: (value: TValue) => string
  props?: ChartAxisProps<TValue> | false
}): ChartAxisPresentationOptions<TValue> | false {
  if (props === false) {
    return false
  }

  return {
    label: props?.label,
    line: false,
    tickLabels: {
      fontSize: 11,
      fontWeight: 450,
      opacity: 0.78,
      thin:
        props?.tickStrategy === "all"
          ? false
          : { minGap: props?.minTickGap ?? 8, priority: "ends" },
    },
    ticks: {
      format: props?.tickFormatter ?? format,
      padding: props?.tickMargin ?? 9,
      size: 0,
      values: props?.tickStrategy === "edges" ? edgeValues : props?.ticks,
    },
  }
}

function getEdgeValues(data: ChartDatum[], dataKey: string) {
  const first = data.at(0)?.[dataKey]
  const last = data.at(-1)?.[dataKey]

  return isChartValue(first) && isChartValue(last) ? [first, last] : undefined
}

/** Scales and margin for a category axis paired with a numeric value axis. */
function getCartesianScales({
  categoryAxis,
  categoryScale,
  data,
  dataKey,
  grid,
  valueAxis,
  valueFormatter,
}: {
  categoryAxis?: ChartAxisProps | false
  categoryScale: () => unknown
  data: ChartDatum[]
  dataKey: string
  grid: "hidden" | "visible"
  valueAxis?: ChartNumericAxisProps | false
  valueFormatter: (value: number) => string
}) {
  const domain = valueAxis ? valueAxis.domain : undefined

  return {
    category: {
      axis: getAxis({
        edgeValues: getEdgeValues(data, dataKey),
        props: categoryAxis,
      }),
      scale: categoryScale,
    },
    value: {
      axis: getAxis({ format: valueFormatter, props: valueAxis }),
      grid: grid === "visible" ? { strokeDasharray: "3 3" } : false,
      // Without tick labels, rounding the domain only adds empty space.
      nice: valueAxis !== false,
      scale: domain ? () => scaleLinear().domain(domain) : scaleLinear,
    },
    // With both axes hidden the chart is a sparkline: automatic margins would
    // still reserve guide space, so keep only room for strokes at the top and
    // bottom and let the plot run edge to edge.
    margin:
      categoryAxis === false && valueAxis === false
        ? { bottom: 3, left: 0, right: 0, top: 3 }
        : undefined,
  } as const
}

export type {
  BaseChartProps,
  CartesianChartProps,
  ChartAxisProps,
  ChartColor,
  ChartColorPalette,
  ChartConfig,
  ChartCurveType,
  ChartDatum,
  ChartLegendProps,
  ChartNumericAxisProps,
  ChartSizeProps,
  ChartTooltipContentProps,
  ChartTooltipProps,
  ChartTooltipRenderer,
  ChartType,
  NamedSeriesDatum,
  SeriesDatum,
  TooltipDatum,
}

export {
  CHART_COLORS,
  dimColor,
  defaultValueFormatter,
  valueToPercent,
  getCartesianScales,
  getChartColors,
  getChartCurve,
  getChartOptions,
  getCrosshair,
  focusNearestSeries,
  getFocusStates,
  getLabel,
  getNamedSeriesColors,
  getPositiveMaximum,
  getSelectedSeriesColor,
  getTextLabel,
  revealEntranceMotion,
  toNamedSeriesData,
  toSeriesData,
}
