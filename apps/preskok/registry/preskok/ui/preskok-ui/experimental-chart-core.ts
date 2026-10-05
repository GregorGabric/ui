import type { ComponentType, HTMLAttributes, ReactNode } from "react"
import type {
  ChartAxisPresentationOptions,
  ChartCurve,
  ChartFocusMatch,
  ChartMarkState,
  ChartPoint,
  ChartTooltipOptions,
  ChartValue,
} from "@tanstack/charts"
import { crosshair } from "@tanstack/charts/crosshair"
import { d3Curve } from "@tanstack/charts/d3/shape"
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

type ExperimentalChartType = "default" | "stacked" | "percent"
type ExperimentalChartColor = (typeof EXPERIMENTAL_CHART_COLORS)[number]
type ExperimentalChartColorPalette = readonly [
  ExperimentalChartColor,
  ...ExperimentalChartColor[],
]
type ExperimentalChartDatum = Record<string, unknown>
type ExperimentalChartCurveType = keyof typeof CURVES | ChartCurve

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
  points: readonly ChartPoint<TDatum, TXValue, TYValue>[]
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

function experimentalValueToPercent(value: number) {
  return `${(value * 100).toFixed(0)}%`
}

function experimentalDefaultValueFormatter(value: number) {
  return String(value)
}

function isChartValue(value: unknown): value is ChartValue {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    value instanceof Date
  )
}

function dimExperimentalColor(color: string, opacity: number) {
  return `color-mix(in srgb, ${color} ${opacity}%, transparent)`
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

  return dimExperimentalColor(color, opacity)
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

function getExperimentalChartColors(
  config: ExperimentalChartConfig,
  colors: ExperimentalChartColorPalette = EXPERIMENTAL_CHART_COLORS
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(config).map(([series, item], index) => [
      series,
      item.color ?? colors[index % colors.length] ?? colors[0],
    ])
  )
}

/** Color scale, theme, and animation shared by every experimental chart. */
function getExperimentalChartOptions(colorsBySeries: Record<string, string>) {
  const domain = Object.keys(colorsBySeries)
  const range = Object.values(colorsBySeries)

  return {
    color: { domain, range },
    svgAnimation: true,
    theme: {
      background: "transparent",
      foreground: "var(--muted-foreground)",
      grid: "color-mix(in srgb, var(--muted-foreground) 14%, transparent)",
      muted: "color-mix(in srgb, var(--muted-foreground) 78%, transparent)",
      palette: range,
    },
  }
}

/** Fades every mark that does not match the current focus. */
function getExperimentalFocusStates<TDatum>(
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

function getExperimentalCrosshair() {
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
  colors = EXPERIMENTAL_CHART_COLORS,
  config,
  data,
  nameKey,
  selectedOpacity,
  selectedSeries,
  valueKey,
}: {
  colors?: ExperimentalChartColorPalette
  config: ExperimentalChartConfig
  data: ExperimentalChartDatum[]
  nameKey: string
  selectedOpacity: number
  selectedSeries: string | null
  valueKey: string
}) {
  const chartColors = getExperimentalChartColors(config, colors)

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

/** Maps each named row to its (possibly dimmed) color for the chart color scale. */
function getExperimentalNamedSeriesColors(
  rows: readonly ExperimentalNamedSeriesDatum[]
) {
  return Object.fromEntries(rows.map((row) => [row.series, row.color]))
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

function getExperimentalChartCurve(
  lineType: ExperimentalChartCurveType = "linear"
) {
  return typeof lineType === "string" ? d3Curve(CURVES[lineType]) : lineType
}

function getExperimentalAxis<TValue extends ChartValue>({
  edgeValues,
  format,
  props,
}: {
  edgeValues?: readonly TValue[]
  format?: (value: TValue) => string
  props?: ExperimentalChartAxisProps<TValue> | false
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

function getExperimentalEdgeValues(
  data: ExperimentalChartDatum[],
  dataKey: string
) {
  const first = data.at(0)?.[dataKey]
  const last = data.at(-1)?.[dataKey]

  return isChartValue(first) && isChartValue(last) ? [first, last] : undefined
}

/** Scale entries for a category axis paired with a numeric value axis. */
function getExperimentalCartesianScales({
  categoryAxis,
  categoryScale,
  data,
  dataKey,
  grid,
  valueAxis,
  valueFormatter,
}: {
  categoryAxis?: ExperimentalChartAxisProps | false
  categoryScale: () => unknown
  data: ExperimentalChartDatum[]
  dataKey: string
  grid: "hidden" | "visible"
  valueAxis?: ExperimentalChartNumericAxisProps | false
  valueFormatter: (value: number) => string
}) {
  const domain = valueAxis ? valueAxis.domain : undefined

  return {
    category: {
      axis: getExperimentalAxis({
        edgeValues: getExperimentalEdgeValues(data, dataKey),
        props: categoryAxis,
      }),
      scale: categoryScale,
    },
    value: {
      axis: getExperimentalAxis({ format: valueFormatter, props: valueAxis }),
      grid: grid === "visible",
      nice: true,
      scale: domain ? () => scaleLinear().domain(domain) : scaleLinear,
    },
  } as const
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
  dimExperimentalColor,
  experimentalDefaultValueFormatter,
  experimentalValueToPercent,
  getExperimentalCartesianScales,
  getExperimentalChartColors,
  getExperimentalChartCurve,
  getExperimentalChartOptions,
  getExperimentalCrosshair,
  getExperimentalFocusStates,
  getExperimentalLabel,
  getExperimentalNamedSeriesColors,
  getExperimentalPositiveMaximum,
  getExperimentalSelectedSeriesColor,
  getExperimentalTextLabel,
  toExperimentalNamedSeriesData,
  toExperimentalSeriesData,
}
