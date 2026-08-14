import type { ComponentType, HTMLAttributes, ReactNode } from "react"
import type {
  ChartAxisTickLabelOptions,
  ChartAxisTickOptions,
  ChartCurve,
  ChartTooltipOptions,
  ChartValue,
} from "@tanstack/charts"
import { d3Curve } from "@tanstack/charts/d3/shape"
import type { ChartProps as TanStackChartProps } from "@tanstack/charts/react/tooltip"
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
import type { ToggleButtonGroupProps } from "react-aria-components/ToggleButtonGroup"

type ChartType = "default" | "stacked" | "percent"
type ChartColor = (typeof CHART_COLORS)[number]
type ChartColorPalette = readonly [ChartColor, ...ChartColor[]]
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
  points: readonly import("@tanstack/charts").ChartPoint<
    TDatum,
    TXValue,
    TYValue
  >[]
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

type ChartPlotProps<TProps extends BaseChartProps> = Omit<
  TProps,
  keyof HTMLAttributes<HTMLDivElement> | "legend"
>

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

function valueToPercent(value: number) {
  return `${(value * 100).toFixed(0)}%`
}

function defaultValueFormatter(value: number) {
  return String(value)
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

  return `color-mix(in srgb, ${color} ${opacity}%, transparent)`
}

function getPositiveMaximum(values: readonly number[], maximum?: number) {
  const resolvedMaximum = maximum ?? Math.max(...values, 1)
  return Number.isFinite(resolvedMaximum) && resolvedMaximum > 0
    ? resolvedMaximum
    : 1
}

function constructCategoryColors(
  categories: string[],
  colors: ChartColorPalette
) {
  return new Map(
    categories.map((category, index) => [
      category,
      colors[index % colors.length] ?? colors[0],
    ])
  )
}

function getChartColors(
  config: ChartConfig,
  colors: ChartColorPalette = CHART_COLORS
) {
  const categoryColors = constructCategoryColors(Object.keys(config), colors)

  return Object.fromEntries(
    Object.entries(config).map(([series, item]) => {
      const color = item.color ?? categoryColors.get(series) ?? colors[0]
      return [series, color]
    })
  )
}

function getSeriesChartOptions(
  config: ChartConfig,
  colors?: ChartColorPalette
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
  colors?: ChartColorPalette
  config: ChartConfig
  data: ChartDatum[]
  nameKey: string
  selectedSeries: string | null
  selectedOpacity: number
  valueKey: string
}) {
  const chartColors = getChartColors(config, colors)
  const fallbackColors = colors ?? CHART_COLORS

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
    const fallback =
      fallbackColors[index % fallbackColors.length] ?? fallbackColors[0]
    const color = chartColors[series] ?? fallback

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
  ChartColor,
  ChartColorPalette,
  ChartConfig,
  ChartCurveType,
  ChartDatum,
  ChartLegendProps,
  ChartNumericAxisProps,
  ChartPlotProps,
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
  constructCategoryColors,
  getAxisTickLabelOptions,
  getAxisTickOptions,
  getCategoryAxis,
  getChartColors,
  getChartSize,
  getChartCurve,
  getChartTheme,
  getEdgeValues,
  getLabel,
  getNumericAxis,
  getNumericScale,
  getPositiveMaximum,
  getSelectedSeriesColor,
  getSeriesChartOptions,
  getTextLabel,
  getTooltipOptions,
  toNamedSeriesData,
  toSeriesData,
  defaultValueFormatter,
  valueToPercent,
}
