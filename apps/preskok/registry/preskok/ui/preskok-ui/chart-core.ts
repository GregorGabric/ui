import type { ComponentType, HTMLAttributes, ReactNode } from "react"
import type {
  ChartAxisTickLabelOptions,
  ChartAxisTickOptions,
  ChartCurve,
  ChartTooltipAnchor,
  ChartTooltipPlacement,
  ChartValue,
} from "@tanstack/charts"
import { d3Curve } from "@tanstack/charts/d3/shape"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip"
import {
  curveBasis,
  curveBumpX,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from "d3-shape"

type ChartType = "default" | "stacked" | "percent"
type ChartColorKeys = keyof typeof CHART_COLORS | (string & {})
type ChartDatum = Record<string, unknown>
type ChartCurveType =
  | "basis"
  | "bump"
  | "linear"
  | "monotone"
  | "monotoneX"
  | "natural"
  | "step"
  | "stepAfter"
  | "stepBefore"
  | ChartCurve

type ChartConfig = Record<
  string,
  {
    label?: ReactNode
    icon?: ComponentType<{ "data-slot"?: string }>
  } & (
    | { color?: ChartColorKeys; theme?: never }
    | { color?: never; theme: { light: string; dark: string } }
  )
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

type ChartTooltipProps = {
  anchor?: ChartTooltipAnchor
  className?: string
  hideIndicator?: boolean
  hideLabel?: boolean
  indicator?: "line" | "dot" | "dashed"
  labelFormatter?: (label: ReactNode) => ReactNode
  labelSeparator?: boolean
  offset?: number
  placement?: "auto" | ChartTooltipPlacement | readonly ChartTooltipPlacement[]
}

type ChartLegendProps = HTMLAttributes<HTMLDivElement> & {
  align?: "left" | "center" | "right"
  hideIcon?: boolean
  verticalAlign?: "top" | "bottom"
}

type ChartSizeProps = {
  aspectRatio?: number
  height?: number
  initialWidth?: number
}

type TooltipDatum = {
  category: ChartValue
  series: string
  source: unknown
  value: number | null
}

type ChartTooltipContentProps<TDatum extends TooltipDatum = TooltipDatum> = {
  config: ChartConfig
  points: readonly import("@tanstack/charts").ChartPoint<TDatum>[]
  tooltipProps?: ChartTooltipProps
  valueFormatter: (value: number) => string
}

type ChartTooltipRenderer<TDatum extends TooltipDatum = TooltipDatum> = (
  props: ChartTooltipContentProps<TDatum>
) => ReactNode

interface BaseChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  ariaLabel?: string
  children?: never
  colors?: readonly ChartColorKeys[]
  config: ChartConfig
  data: ChartDatum[]
  dataKey: string
  legend?: ReactNode | false
  legendProps?: ChartLegendProps
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

type NamedSeriesDatum = TooltipDatum & {
  color: string
  index: number
  source: ChartDatum
}

const CHART_COLORS = {
  "chart-1": "var(--chart-1)",
  "chart-2": "var(--chart-2)",
  "chart-3": "var(--chart-3)",
  "chart-4": "var(--chart-4)",
  "chart-5": "var(--chart-5)",
} as const

const DEFAULT_COLORS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const

function valueToPercent(value: number) {
  return `${(value * 100).toFixed(0)}%`
}

function getChartSize(
  size: ChartSizeProps | undefined,
  defaultHeight: number
): ChartSizeProps {
  if (size?.height !== undefined || size?.aspectRatio !== undefined) {
    return size
  }

  return { ...size, height: defaultHeight }
}

function getColorValue(color?: string) {
  if (!color) {
    return "var(--chart-1)"
  }

  return CHART_COLORS[color as keyof typeof CHART_COLORS] ?? color
}

function constructCategoryColors(
  categories: string[],
  colors: readonly ChartColorKeys[]
) {
  return new Map(
    categories.map((category, index) => [
      category,
      colors[index % colors.length] ?? "chart-1",
    ])
  )
}

function getChartColors(
  config: ChartConfig,
  colors: readonly ChartColorKeys[] = DEFAULT_COLORS
) {
  const categoryColors = constructCategoryColors(Object.keys(config), colors)

  return Object.fromEntries(
    Object.entries(config).map(([series, item]) => [
      series,
      item.theme
        ? `var(--color-${series})`
        : getColorValue(item.color ?? categoryColors.get(series)),
    ])
  )
}

function getSeriesChartOptions(
  config: ChartConfig,
  colors?: readonly ChartColorKeys[]
) {
  const chartColors = getChartColors(config, colors)
  const seriesNames = Object.keys(config)

  return {
    chartColors,
    options: {
      color: {
        domain: seriesNames,
        range: seriesNames.map((series) => chartColors[series] ?? ""),
      },
      svgAnimation: true,
      theme: getChartTheme(
        seriesNames.map((series) => chartColors[series] ?? "")
      ),
    },
    seriesNames,
  }
}

function isChartValue(value: unknown): value is ChartValue {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    value instanceof Date
  )
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

      return [{ category, index, series, source, value } satisfies SeriesDatum]
    })
  })
}

function toNamedSeriesData({
  colors,
  config,
  data,
  nameKey,
  selectedSeries,
  selectedOpacity,
  valueKey,
}: {
  colors?: readonly ChartColorKeys[]
  config: ChartConfig
  data: ChartDatum[]
  nameKey: string
  selectedSeries: string | null
  selectedOpacity: number
  valueKey: string
}) {
  const chartColors = getChartColors(config, colors)
  const fallbackColors = colors ?? DEFAULT_COLORS

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
    const fallback = fallbackColors[index % fallbackColors.length]
    const color = chartColors[series] ?? getColorValue(fallback)
    const dimmed = selectedSeries && selectedSeries !== series

    return [
      {
        category: series,
        color: dimmed
          ? `color-mix(in srgb, ${color} ${selectedOpacity}%, transparent)`
          : color,
        index,
        series,
        source,
        value: rawValue,
      } satisfies NamedSeriesDatum,
    ]
  })
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

function getChartTheme(colors: readonly string[]) {
  return {
    background: "transparent",
    foreground: "var(--muted-foreground)",
    grid: "color-mix(in srgb, var(--muted-foreground) 14%, transparent)",
    muted: "color-mix(in srgb, var(--muted-foreground) 78%, transparent)",
    palette: colors,
  }
}

function getChartCurve(lineType: ChartCurveType = "linear") {
  if (typeof lineType !== "string") {
    return lineType
  }

  switch (lineType) {
    case "basis":
      return d3Curve(curveBasis)
    case "bump":
      return d3Curve(curveBumpX)
    case "monotone":
    case "monotoneX":
      return d3Curve(curveMonotoneX)
    case "natural":
      return d3Curve(curveNatural)
    case "step":
      return d3Curve(curveStep)
    case "stepAfter":
      return d3Curve(curveStepAfter)
    case "stepBefore":
      return d3Curve(curveStepBefore)
    default:
      return d3Curve(curveLinear)
  }
}

function getAxisTickOptions<TValue extends ChartValue>({
  edgeValues,
  props,
}: {
  edgeValues?: readonly TValue[]
  props?: ChartAxisProps<TValue>
}): ChartAxisTickOptions<TValue> {
  let values = props?.ticks
  if (props?.tickStrategy === "edges") {
    values = edgeValues
  }

  return {
    format: props?.tickFormatter,
    padding: props?.tickMargin ?? 9,
    size: 0,
    values,
  }
}

function getAxisTickLabelOptions<TValue extends ChartValue>(
  props?: ChartAxisProps<TValue>
): ChartAxisTickLabelOptions<TValue> {
  if (props?.tickStrategy === "all") {
    return { fontSize: 11, fontWeight: 450, opacity: 0.78, thin: false }
  }

  return {
    fontSize: 11,
    fontWeight: 450,
    opacity: 0.78,
    thin: {
      minGap: props?.minTickGap ?? 8,
      priority: "ends",
    },
  }
}

function getCategoryAxis({
  data,
  dataKey,
  props,
}: {
  data: ChartDatum[]
  dataKey: string
  props?: ChartAxisProps | false
}) {
  if (props === false) {
    return false
  }

  return {
    line: false,
    label: props?.label,
    tickLabels: getAxisTickLabelOptions(props),
    ticks: getAxisTickOptions({
      edgeValues: getEdgeValues(data, dataKey),
      props,
    }),
  }
}

function getNumericAxis({
  props,
  valueFormatter,
}: {
  props?: ChartNumericAxisProps | false
  valueFormatter: (value: number) => string
}) {
  if (props === false) {
    return false
  }

  return {
    line: false,
    label: props?.label,
    tickLabels: getAxisTickLabelOptions(props),
    ticks: {
      ...getAxisTickOptions({ props }),
      format: props?.tickFormatter ?? valueFormatter,
    },
  }
}

function getNumericScale(props?: ChartNumericAxisProps | false) {
  if (!props || !props.domain) {
    return scaleLinear
  }

  const domain = props.domain
  return () => scaleLinear().domain(domain)
}

function getTooltipOptions(tooltipProps?: ChartTooltipProps) {
  return {
    tooltip: {
      anchor: tooltipProps?.anchor,
      offset: tooltipProps?.offset,
      placement: tooltipProps?.placement,
      use: tooltipExtension,
    },
  } as const
}

function getEdgeValues(data: ChartDatum[], dataKey: string) {
  const first = data.at(0)?.[dataKey]
  const last = data.at(-1)?.[dataKey]

  return isChartValue(first) && isChartValue(last) ? [first, last] : undefined
}

export type {
  BaseChartProps,
  CartesianChartProps,
  ChartAxisProps,
  ChartColorKeys,
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
  DEFAULT_COLORS,
  constructCategoryColors,
  getAxisTickLabelOptions,
  getAxisTickOptions,
  getCategoryAxis,
  getChartColors,
  getChartSize,
  getChartCurve,
  getChartTheme,
  getColorValue,
  getEdgeValues,
  getLabel,
  getNumericAxis,
  getNumericScale,
  getSeriesChartOptions,
  getTextLabel,
  getTooltipOptions,
  toNamedSeriesData,
  toSeriesData,
  valueToPercent,
}
