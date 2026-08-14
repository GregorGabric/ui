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

type ExperimentalChartType = "default" | "stacked" | "percent"
type ExperimentalChartColor = (typeof EXPERIMENTAL_CHART_COLORS)[number]
type ExperimentalChartColorPalette = readonly [
  ExperimentalChartColor,
  ...ExperimentalChartColor[],
]
type ExperimentalChartDatum = Record<string, unknown>
type ExperimentalChartCurveType =
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

type ExperimentalChartConfig = Record<
  string,
  {
    color?: ExperimentalChartColor
    icon?: ComponentType<{ "data-slot"?: string }>
    label?: ReactNode
  }
>

type ExperimentalChartAxisProps<TValue extends ChartValue = ChartValue> = {
  label?: string
  minTickGap?: number
  tickFormatter?: (value: TValue) => string
  tickMargin?: number
  ticks?: readonly TValue[]
  tickStrategy?: "all" | "auto" | "edges"
}

type ExperimentalChartNumericAxisProps = ExperimentalChartAxisProps<number> & {
  domain?: readonly [number, number]
}

type ExperimentalChartTooltipProps = Pick<
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

type ExperimentalChartLegendProps = Omit<
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

type ExperimentalChartSizeProps = Pick<
  TanStackChartProps,
  "aspectRatio" | "height" | "initialWidth"
>

type ExperimentalTooltipDatum = {
  category: ChartValue
  series: string
  source: unknown
  value: number | null
}

type ExperimentalChartTooltipContentProps<
  TDatum extends ExperimentalTooltipDatum = ExperimentalTooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = {
  config: ExperimentalChartConfig
  points: readonly import("@tanstack/charts").ChartPoint<
    TDatum,
    TXValue,
    TYValue
  >[]
  tooltipProps?: ExperimentalChartTooltipProps
  valueFormatter: (value: number) => string
}

type ExperimentalChartTooltipRenderer<
  TDatum extends ExperimentalTooltipDatum = ExperimentalTooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = (
  props: ExperimentalChartTooltipContentProps<TDatum, TXValue, TYValue>
) => ReactNode

interface ExperimentalBaseChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  ariaLabel?: string
  children?: never
  colors?: ExperimentalChartColorPalette
  config: ExperimentalChartConfig
  data: ExperimentalChartDatum[]
  dataKey: string
  legend?: ReactNode | false
  size?: ExperimentalChartSizeProps
  tooltip?: ExperimentalChartTooltipRenderer | false
  tooltipProps?: ExperimentalChartTooltipProps
  valueFormatter?: (value: number) => string
}

type ExperimentalChartPlotProps<TProps extends ExperimentalBaseChartProps> =
  Omit<TProps, keyof HTMLAttributes<HTMLDivElement> | "legend">

type ExperimentalCartesianChartProps = ExperimentalBaseChartProps & {
  grid?: "hidden" | "visible"
  xAxis?: ExperimentalChartAxisProps | false
  yAxis?: ExperimentalChartNumericAxisProps | false
}

type ExperimentalSeriesDatum = ExperimentalTooltipDatum & {
  index: number
  source: ExperimentalChartDatum
}

type ExperimentalNamedSeriesDatum = Omit<ExperimentalTooltipDatum, "value"> & {
  color: string
  index: number
  source: ExperimentalChartDatum
  value: number
}

const EXPERIMENTAL_CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

function experimentalValueToPercent(value: number) {
  return `${(value * 100).toFixed(0)}%`
}

function experimentalDefaultValueFormatter(value: number) {
  return String(value)
}

function getExperimentalChartSize(
  size: ExperimentalChartSizeProps | undefined,
  defaultHeight: number
): ExperimentalChartSizeProps {
  if (size?.height !== undefined || size?.aspectRatio !== undefined) {
    return size
  }

  return { ...size, height: defaultHeight }
}

function getExperimentalSelectedSeriesColor({
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

function getExperimentalPositiveMaximum(
  values: readonly number[],
  maximum?: number
) {
  const resolvedMaximum = maximum ?? Math.max(...values, 1)
  return Number.isFinite(resolvedMaximum) && resolvedMaximum > 0
    ? resolvedMaximum
    : 1
}

function constructExperimentalCategoryColors(
  categories: string[],
  colors: ExperimentalChartColorPalette
) {
  return new Map(
    categories.map((category, index) => [
      category,
      colors[index % colors.length] ?? colors[0],
    ])
  )
}

function getExperimentalChartColors(
  config: ExperimentalChartConfig,
  colors: ExperimentalChartColorPalette = EXPERIMENTAL_CHART_COLORS
) {
  const categoryColors = constructExperimentalCategoryColors(
    Object.keys(config),
    colors
  )

  return Object.fromEntries(
    Object.entries(config).map(([series, item]) => {
      const color = item.color ?? categoryColors.get(series) ?? colors[0]
      return [series, color]
    })
  )
}

function getExperimentalSeriesChartOptions(
  config: ExperimentalChartConfig,
  colors?: ExperimentalChartColorPalette
) {
  const chartColors = getExperimentalChartColors(config, colors)
  const seriesNames = Object.keys(config)

  return {
    chartColors,
    options: {
      color: {
        domain: seriesNames,
        range: seriesNames.map((series) => chartColors[series] ?? ""),
      },
      svgAnimation: true,
      theme: getExperimentalChartTheme(
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

function toExperimentalSeriesData({
  config,
  connectNulls = false,
  data,
  dataKey,
}: {
  config: ExperimentalChartConfig
  connectNulls?: boolean
  data: ExperimentalChartDatum[]
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
        } satisfies ExperimentalSeriesDatum,
      ]
    })
  })
}

function toExperimentalNamedSeriesData({
  colors,
  config,
  data,
  nameKey,
  selectedSeries,
  selectedOpacity,
  valueKey,
}: {
  colors?: ExperimentalChartColorPalette
  config: ExperimentalChartConfig
  data: ExperimentalChartDatum[]
  nameKey: string
  selectedSeries: string | null
  selectedOpacity: number
  valueKey: string
}) {
  const chartColors = getExperimentalChartColors(config, colors)
  const fallbackColors = colors ?? EXPERIMENTAL_CHART_COLORS

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
        color: getExperimentalSelectedSeriesColor({
          color,
          opacity: selectedOpacity,
          selectedSeries,
          series,
        }),
        index,
        series,
        source,
        value: rawValue,
      } satisfies ExperimentalNamedSeriesDatum,
    ]
  })
}

function getExperimentalLabel(config: ExperimentalChartConfig, series: string) {
  return config[series]?.label ?? series
}

function getExperimentalTextLabel(
  config: ExperimentalChartConfig,
  series: string
) {
  const label = getExperimentalLabel(config, series)
  return typeof label === "string" || typeof label === "number"
    ? String(label)
    : series
}

function getExperimentalChartTheme(colors: readonly string[]) {
  return {
    background: "transparent",
    foreground: "var(--muted-foreground)",
    grid: "color-mix(in srgb, var(--muted-foreground) 14%, transparent)",
    muted: "color-mix(in srgb, var(--muted-foreground) 78%, transparent)",
    palette: colors,
  }
}

function getExperimentalChartCurve(
  lineType: ExperimentalChartCurveType = "linear"
) {
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

function getExperimentalAxisTickOptions<TValue extends ChartValue>({
  edgeValues,
  props,
}: {
  edgeValues?: readonly TValue[]
  props?: ExperimentalChartAxisProps<TValue>
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

function getExperimentalAxisTickLabelOptions<TValue extends ChartValue>(
  props?: ExperimentalChartAxisProps<TValue>
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

function getExperimentalCategoryAxis({
  data,
  dataKey,
  props,
}: {
  data: ExperimentalChartDatum[]
  dataKey: string
  props?: ExperimentalChartAxisProps | false
}) {
  if (props === false) {
    return false
  }

  return {
    line: false,
    label: props?.label,
    tickLabels: getExperimentalAxisTickLabelOptions(props),
    ticks: getExperimentalAxisTickOptions({
      edgeValues: getExperimentalEdgeValues(data, dataKey),
      props,
    }),
  }
}

function getExperimentalNumericAxis({
  props,
  valueFormatter,
}: {
  props?: ExperimentalChartNumericAxisProps | false
  valueFormatter: (value: number) => string
}) {
  if (props === false) {
    return false
  }

  return {
    line: false,
    label: props?.label,
    tickLabels: getExperimentalAxisTickLabelOptions(props),
    ticks: {
      ...getExperimentalAxisTickOptions({ props }),
      format: props?.tickFormatter ?? valueFormatter,
    },
  }
}

function getExperimentalNumericScale(
  props?: ExperimentalChartNumericAxisProps | false
) {
  if (!props || !props.domain) {
    return scaleLinear
  }

  const domain = props.domain
  return () => scaleLinear().domain(domain)
}

function getExperimentalTooltipOptions(
  tooltipProps?: ExperimentalChartTooltipProps
) {
  return {
    tooltip: {
      anchor: tooltipProps?.anchor,
      offset: tooltipProps?.offset,
      placement: tooltipProps?.placement,
      use: tooltipExtension,
    },
  } as const
}

function getExperimentalEdgeValues(
  data: ExperimentalChartDatum[],
  dataKey: string
) {
  const first = data.at(0)?.[dataKey]
  const last = data.at(-1)?.[dataKey]

  return isChartValue(first) && isChartValue(last) ? [first, last] : undefined
}

export type {
  ExperimentalBaseChartProps,
  ExperimentalCartesianChartProps,
  ExperimentalChartAxisProps,
  ExperimentalChartColor,
  ExperimentalChartColorPalette,
  ExperimentalChartConfig,
  ExperimentalChartCurveType,
  ExperimentalChartDatum,
  ExperimentalChartLegendProps,
  ExperimentalChartNumericAxisProps,
  ExperimentalChartPlotProps,
  ExperimentalChartSizeProps,
  ExperimentalChartTooltipContentProps,
  ExperimentalChartTooltipProps,
  ExperimentalChartTooltipRenderer,
  ExperimentalChartType,
  ExperimentalNamedSeriesDatum,
  ExperimentalSeriesDatum,
  ExperimentalTooltipDatum,
}

export {
  EXPERIMENTAL_CHART_COLORS,
  constructExperimentalCategoryColors,
  getExperimentalAxisTickLabelOptions,
  getExperimentalAxisTickOptions,
  getExperimentalCategoryAxis,
  getExperimentalChartColors,
  getExperimentalChartSize,
  getExperimentalChartCurve,
  getExperimentalChartTheme,
  getExperimentalEdgeValues,
  getExperimentalLabel,
  getExperimentalNumericAxis,
  getExperimentalNumericScale,
  getExperimentalPositiveMaximum,
  getExperimentalSelectedSeriesColor,
  getExperimentalSeriesChartOptions,
  getExperimentalTextLabel,
  getExperimentalTooltipOptions,
  toExperimentalNamedSeriesData,
  toExperimentalSeriesData,
  experimentalDefaultValueFormatter,
  experimentalValueToPercent,
}
