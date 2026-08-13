"use client"

import {
  startTransition,
  useId,
  useState,
  type ComponentType,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import type {
  ChartAxisTickLabelOptions,
  ChartAxisTickOptions,
  ChartCurve,
  ChartPoint,
  ChartTooltipAnchor,
  ChartTooltipPlacement,
  ChartValue,
  DomChartDefinition,
} from "@tanstack/charts"
import { d3Curve } from "@tanstack/charts/d3/shape"
import {
  Chart as ChartPrimitive,
  type ChartTooltipBodyRenderContext,
} from "@tanstack/charts/react/tooltip"
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
import {
  ToggleButton,
  ToggleButtonGroup,
} from "react-aria-components/ToggleButtonGroup"
import { twMerge } from "tailwind-merge"

type ChartType = "default" | "stacked" | "percent"
type ChartLayout = "horizontal" | "vertical" | "radial"
type IntervalType = "preserveStartEnd" | "equidistantPreserveStart"
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
    | { color?: ChartColorKeys | (string & {}); theme?: never }
    | { color?: never; theme: { light: string; dark: string } }
  )
>

type ChartAxisProps = {
  domain?: readonly [number | "auto", number | "auto"]
  hide?: boolean
  interval?: number | IntervalType
  label?: string
  minTickGap?: number
  tickMargin?: number
  tickFormatter?: (value: any, index?: number) => string
  ticks?: readonly ChartValue[]
  width?: number
}

type ChartTooltipProps = {
  anchor?: ChartTooltipAnchor
  className?: string
  hideIndicator?: boolean
  hideLabel?: boolean
  indicator?: "line" | "dot" | "dashed"
  labelFormatter?: (label: ReactNode) => ReactNode
  labelKey?: string
  labelSeparator?: boolean
  nameKey?: string
  offset?: number
  placement?: "auto" | ChartTooltipPlacement | readonly ChartTooltipPlacement[]
}

type ChartLegendProps = HTMLAttributes<HTMLDivElement> & {
  align?: "left" | "center" | "right"
  hideIcon?: boolean
  verticalAlign?: "top" | "bottom"
}

type ChartTooltipRenderer<TDatum extends TooltipDatum = TooltipDatum> = (
  props: ChartTooltipContentProps<TDatum>
) => ReactNode

interface BaseChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  ariaLabel?: string
  children?: ReactNode
  colors?: readonly ChartColorKeys[]
  config: ChartConfig
  data: ChartDatum[]
  dataKey: string
  displayEdgeLabelsOnly?: boolean
  hideGridLines?: boolean
  hideXAxis?: boolean
  hideYAxis?: boolean
  intervalType?: IntervalType
  layout?: ChartLayout
  legend?: ReactNode | boolean
  legendProps?: ChartLegendProps
  tooltip?: ChartTooltipRenderer | boolean
  tooltipProps?: ChartTooltipProps
  type?: ChartType
  valueFormatter?: (value: number) => string
  xAxisProps?: ChartAxisProps
  yAxisProps?: ChartAxisProps
}

type SeriesDatum = {
  category: ChartValue
  index: number
  series: string
  source: ChartDatum
  value: number | null
}

type TooltipDatum = {
  category: ChartValue
  series: string
  source: unknown
  value: number | null
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

const THEMES = { light: "", dark: ".dark" } as const

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item.theme || item.color
  )

  if (colorConfig.length === 0) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const variables = colorConfig
              .map(([key, item]) => {
                const color =
                  item.theme?.[theme as keyof typeof item.theme] ?? item.color
                return color ? `  --color-${key}: ${color};` : null
              })
              .filter(Boolean)
              .join("\n")

            return `${prefix} [data-chart=${id}] {\n${variables}\n}`
          })
          .join("\n"),
      }}
    />
  )
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

function getLabel(config: ChartConfig, series: string) {
  return config[series]?.label ?? series
}

function getTextLabel(config: ChartConfig, series: string) {
  const label = getLabel(config, series)
  return typeof label === "string" || typeof label === "number"
    ? String(label)
    : series
}

type ChartProps<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = {
  ariaLabel: string
  aspectRatio?: number
  className?: string
  definition: DomChartDefinition<TDatum, TXValue, TYValue>
  height?: number
  initialWidth?: number
  onSelect?: (point: ChartPoint<TDatum, TXValue, TYValue> | null) => void
  renderTooltipBody?: (
    context: ChartTooltipBodyRenderContext<TDatum, TXValue, TYValue>
  ) => ReactNode
  style?: CSSProperties
}

function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  ariaLabel,
  aspectRatio,
  className,
  definition,
  height,
  initialWidth = 720,
  onSelect,
  renderTooltipBody,
  style,
}: ChartProps<TDatum, TXValue, TYValue>) {
  return (
    <ChartPrimitive
      ariaLabel={ariaLabel}
      aspectRatio={aspectRatio}
      className={twMerge(
        "min-w-0 text-xs text-muted-foreground [&_svg:focus-visible]:outline-none [&_svg:focus-visible]:ring-2 [&_svg:focus-visible]:ring-ring/40 [&_svg:focus-visible]:ring-offset-2 [&_svg:focus-visible]:ring-offset-background",
        className
      )}
      definition={definition}
      height={height}
      initialWidth={initialWidth}
      onSelect={onSelect}
      renderTooltipBody={renderTooltipBody}
      style={{ ...(renderTooltipBody ? chartTooltipStyle : {}), ...style }}
    />
  )
}

type ChartFrameProps = {
  children: (props: {
    onLegendSelect: (legendItem: string | null) => void
    selectedLegend: string | null
  }) => ReactNode
  className?: string
  colors?: readonly ChartColorKeys[]
  config: ChartConfig
  legend?: ReactNode | boolean
  legendProps?: ChartLegendProps
}

function ChartFrame({
  children,
  className,
  colors,
  config,
  legend = true,
  legendProps,
}: ChartFrameProps) {
  const chartId = useId().replaceAll(":", "")
  const [selectedLegend, setSelectedLegend] = useState<string | null>(null)

  const onLegendSelect = (legendItem: string | null) => {
    startTransition(() => {
      setSelectedLegend(legendItem)
    })
  }

  let legendContent: ReactNode = null
  if (legend === true) {
    legendContent = (
      <ChartLegendContent
        colors={colors}
        config={config}
        onLegendSelect={onLegendSelect}
        selectedLegend={selectedLegend}
        {...legendProps}
      />
    )
  } else if (legend) {
    legendContent = legend
  }

  return (
    <div
      className={twMerge("z-20 flex w-full min-w-0 flex-col", className)}
      data-chart={chartId}
    >
      <ChartStyle config={config} id={chartId} />
      {children({ onLegendSelect, selectedLegend })}
      {legendContent}
    </div>
  )
}

type ChartLegendContentProps = ChartLegendProps & {
  colors?: readonly ChartColorKeys[]
  config: ChartConfig
  onLegendSelect: (legendItem: string | null) => void
  selectedLegend: string | null
}

function ChartLegendContent({
  align = "center",
  className,
  colors,
  config,
  hideIcon = false,
  onLegendSelect,
  selectedLegend,
  verticalAlign = "bottom",
  ...props
}: ChartLegendContentProps) {
  const chartColors = getChartColors(config, colors)
  let justifyClass = "justify-center"
  if (align === "left") {
    justifyClass = "justify-start"
  } else if (align === "right") {
    justifyClass = "justify-end"
  }

  return (
    <ToggleButtonGroup
      aria-label="Chart series"
      className={twMerge(
        "flex flex-wrap items-center gap-1",
        verticalAlign === "top" ? "pb-2" : "pt-2",
        justifyClass,
        className
      )}
      onSelectionChange={(keys) => {
        const key = [...keys][0]?.toString() ?? null
        onLegendSelect(key)
      }}
      selectedKeys={selectedLegend ? [selectedLegend] : []}
      selectionMode="single"
      {...props}
    >
      {Object.entries(config).map(([series, item]) => {
        const Icon = item.icon
        return (
          <ToggleButton
            aria-label={`${getTextLabel(config, series)} series`}
            className={twMerge(
              "relative flex min-h-10 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground outline-none",
              "transition-[background-color,color,opacity,scale,box-shadow] duration-150 ease-out",
              "hover:bg-muted/70 hover:text-foreground selected:bg-muted selected:text-foreground selected:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--border)_80%,transparent)]",
              "focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.96]"
            )}
            id={series}
            key={series}
          >
            {Icon && !hideIcon ? (
              <Icon data-slot="icon" />
            ) : (
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full shadow-[0_0_0_1px_color-mix(in_srgb,currentColor_10%,transparent)]"
                style={{ backgroundColor: chartColors[series] }}
              />
            )}
            {item.label ?? series}
          </ToggleButton>
        )
      })}
    </ToggleButtonGroup>
  )
}

function ChartLegend(props: ChartLegendContentProps) {
  return <ChartLegendContent {...props} />
}

type ChartTooltipContentProps<TDatum extends TooltipDatum = TooltipDatum> = {
  config: ChartConfig
  points: readonly ChartPoint<TDatum>[]
  tooltipProps?: ChartTooltipProps
  valueFormatter: (value: number) => string
}

function ChartTooltipContent<TDatum extends TooltipDatum>({
  config,
  points,
  tooltipProps,
  valueFormatter,
}: ChartTooltipContentProps<TDatum>) {
  const {
    className,
    hideIndicator = false,
    hideLabel = false,
    indicator = "dot",
    labelFormatter,
    labelSeparator = true,
  } = tooltipProps ?? {}
  const firstPoint = points[0]

  if (!firstPoint) {
    return null
  }

  const rawLabel = String(firstPoint.datum.category)
  const label = labelFormatter ? labelFormatter(rawLabel) : rawLabel

  return (
    <div
      className={twMerge(
        "grid min-w-44 items-start rounded-xl bg-popover/95 px-3.5 py-3 text-xs text-popover-foreground shadow-[0_12px_32px_-12px_rgb(0_0_0/0.3),0_2px_8px_-3px_rgb(0_0_0/0.12)] ring-1 ring-black/6 backdrop-blur-xl dark:ring-white/10",
        className
      )}
    >
      {!hideLabel ? (
        <span className="font-semibold text-foreground">{label}</span>
      ) : null}
      {!hideLabel && labelSeparator ? (
        <span
          aria-hidden
          className="mt-2 mb-2.5 block h-px w-full bg-border/70"
        />
      ) : null}
      <div className="grid gap-2.5">
        {points.map((point) => {
          const { series, value } = point.datum
          if (value === null) {
            return null
          }

          return (
            <div className="flex items-center gap-2.5" key={point.key}>
              {!hideIndicator ? (
                <span
                  aria-hidden
                  className={twMerge(
                    "shrink-0 border-current",
                    indicator === "dot" && "size-2.5 rounded-full",
                    indicator === "line" && "h-4 w-1 rounded-full",
                    indicator === "dashed" &&
                      "h-4 w-0 border-l-2 border-dashed bg-transparent"
                  )}
                  style={
                    indicator === "dashed"
                      ? { borderColor: point.color }
                      : { backgroundColor: point.color }
                  }
                />
              ) : null}
              <span className="flex-1 text-muted-foreground">
                {getLabel(config, series)}
              </span>
              <span className="font-mono font-medium text-foreground tabular-nums">
                {valueFormatter(value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function createTooltipRenderer<TDatum extends TooltipDatum>({
  config,
  tooltip,
  tooltipProps,
  valueFormatter,
}: {
  config: ChartConfig
  tooltip: ChartTooltipRenderer<TDatum> | boolean
  tooltipProps?: ChartTooltipProps
  valueFormatter: (value: number) => string
}) {
  return (context: ChartTooltipBodyRenderContext<TDatum>) => {
    const contentProps = {
      config,
      points: context.points,
      tooltipProps,
      valueFormatter,
    }

    if (typeof tooltip === "function") {
      return tooltip(contentProps)
    }

    return <ChartTooltipContent {...contentProps} />
  }
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

function getAxisTickOptions({
  displayEdgeLabelsOnly,
  edgeValues,
  props,
  valueFormatter,
}: {
  displayEdgeLabelsOnly?: boolean
  edgeValues?: readonly ChartValue[]
  props?: ChartAxisProps
  valueFormatter?: (value: any, index?: number) => string
}) {
  let values = props?.ticks
  if (displayEdgeLabelsOnly) {
    values = edgeValues
  }

  return {
    format: props?.tickFormatter ?? valueFormatter,
    padding: props?.tickMargin ?? 9,
    size: 0,
    values,
  }
}

function getAxisTickLabelOptions(
  props?: ChartAxisProps
): ChartAxisTickLabelOptions {
  if (props?.interval === 0) {
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

function getNumericAxisTickOptions({
  props,
  valueFormatter,
}: {
  props?: ChartAxisProps
  valueFormatter?: (value: number, index?: number) => string
}): ChartAxisTickOptions<number> {
  return {
    format: props?.tickFormatter ?? valueFormatter,
    padding: props?.tickMargin ?? 9,
    size: 0,
    values: props?.ticks?.filter(
      (value): value is number => typeof value === "number"
    ),
  }
}

function getEdgeValues(data: ChartDatum[], dataKey: string) {
  const first = data.at(0)?.[dataKey]
  const last = data.at(-1)?.[dataKey]

  return isChartValue(first) && isChartValue(last) ? [first, last] : undefined
}

const chartTooltipStyle = {
  "--ts-chart-tooltip-background": "transparent",
  "--ts-chart-tooltip-border": "0",
  "--ts-chart-tooltip-padding": "0",
  "--ts-chart-tooltip-shadow": "none",
} as CSSProperties

export type {
  BaseChartProps,
  ChartAxisProps,
  ChartColorKeys,
  ChartConfig,
  ChartCurveType,
  ChartDatum,
  ChartLayout,
  ChartLegendContentProps,
  ChartLegendProps,
  ChartProps,
  ChartTooltipContentProps,
  ChartTooltipProps,
  ChartTooltipRenderer,
  ChartType,
  IntervalType,
  SeriesDatum,
  TooltipDatum,
}

export {
  Chart,
  ChartFrame,
  ChartStyle,
  CHART_COLORS,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
  DEFAULT_COLORS,
  chartTooltipStyle,
  constructCategoryColors,
  createTooltipRenderer,
  getAxisTickOptions,
  getAxisTickLabelOptions,
  getChartColors,
  getChartCurve,
  getChartTheme,
  getColorValue,
  getEdgeValues,
  getNumericAxisTickOptions,
  getLabel,
  getTextLabel,
  toSeriesData,
  valueToPercent,
}
