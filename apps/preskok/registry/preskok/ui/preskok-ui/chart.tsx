"use client"

import {
  createContext,
  startTransition,
  use,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import type {
  ChartPoint,
  ChartValue,
  DomChartDefinition,
} from "@tanstack/charts"
import {
  Chart as ChartPrimitive,
  type ChartTooltipBodyRenderContext,
} from "@tanstack/charts/react/tooltip"
import {
  ToggleButton,
  ToggleButtonGroup,
} from "react-aria-components/ToggleButtonGroup"
import { twMerge } from "tailwind-merge"

import {
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
  type BaseChartProps,
  type CartesianChartProps,
  type ChartAxisProps,
  type ChartColorKeys,
  type ChartConfig,
  type ChartCurveType,
  type ChartDatum,
  type ChartLegendProps,
  type ChartNumericAxisProps,
  type ChartSizeProps,
  type ChartTooltipContentProps,
  type ChartTooltipProps,
  type ChartTooltipRenderer,
  type ChartType,
  type NamedSeriesDatum,
  type SeriesDatum,
  type TooltipDatum,
} from "./chart-core"

type ChartFrameContextValue = {
  actions: {
    selectSeries: (series: string | null) => void
  }
  meta: {
    colors?: readonly ChartColorKeys[]
    config: ChartConfig
  }
  state: {
    selectedSeries: string | null
  }
}

const ChartFrameContext = createContext<ChartFrameContextValue | null>(null)

function useChartFrame() {
  const context = use(ChartFrameContext)
  if (!context) {
    throw new Error("Chart components must be rendered inside <ChartFrame>")
  }
  return context
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

type ChartProps<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = {
  ariaLabel: string
  className?: string
  definition: DomChartDefinition<TDatum, TXValue, TYValue>
  onSelect?: (point: ChartPoint<TDatum, TXValue, TYValue> | null) => void
  renderTooltipBody?: (
    context: ChartTooltipBodyRenderContext<TDatum, TXValue, TYValue>
  ) => ReactNode
  size?: ChartSizeProps
  style?: CSSProperties
}

function Chart<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  ariaLabel,
  className,
  definition,
  onSelect,
  renderTooltipBody,
  size,
  style,
}: ChartProps<TDatum, TXValue, TYValue>) {
  const [ready, setReady] = useState(false)
  let height = size?.height
  if (height === undefined && size?.aspectRatio === undefined) {
    height = 288
  }

  return (
    <ChartPrimitive
      ariaLabel={ariaLabel}
      aspectRatio={size?.aspectRatio}
      className={twMerge(
        "min-w-0 text-xs text-muted-foreground [&_svg.ts-chart]:outline-none",
        ready ? "opacity-100" : "opacity-0",
        className
      )}
      definition={definition}
      height={height}
      initialWidth={size?.initialWidth ?? 720}
      onRender={(context) => {
        if (ready) {
          return
        }

        const measuredWidth = context.container.getBoundingClientRect().width
        const widthMatches = Math.abs(context.scene.width - measuredWidth) < 1
        if (measuredWidth > 0 && widthMatches) {
          setReady(true)
        }
      }}
      onSelect={onSelect}
      renderTooltipBody={renderTooltipBody}
      style={style}
    />
  )
}

type ChartFrameProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode
  colors?: readonly ChartColorKeys[]
  config: ChartConfig
  legend?: ReactNode | false
  legendProps?: ChartLegendProps
}

function ChartFrame({
  children,
  className,
  colors,
  config,
  legend,
  legendProps,
  ...props
}: ChartFrameProps) {
  const chartId = useId().replaceAll(":", "")
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)

  const selectSeries = (series: string | null) => {
    startTransition(() => {
      setSelectedSeries(series)
    })
  }

  let legendContent = legend
  if (legend === undefined) {
    legendContent = <ChartLegend {...legendProps} />
  }

  const context = {
    actions: { selectSeries },
    meta: { colors, config },
    state: { selectedSeries },
  }

  return (
    <ChartFrameContext value={context}>
      <div
        {...props}
        className={twMerge("z-20 flex w-full min-w-0 flex-col", className)}
        data-chart={chartId}
      >
        <ChartStyle config={config} id={chartId} />
        {children}
        {legendContent}
      </div>
    </ChartFrameContext>
  )
}

function ChartLegendContent({
  align = "center",
  className,
  hideIcon = false,
  verticalAlign = "bottom",
  ...props
}: ChartLegendProps) {
  const {
    actions: { selectSeries },
    meta: { colors, config },
    state: { selectedSeries },
  } = useChartFrame()
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
        selectSeries(key)
      }}
      selectedKeys={selectedSeries ? [selectedSeries] : []}
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

function ChartLegend(props: ChartLegendProps) {
  return <ChartLegendContent {...props} />
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
  const labelContent = hideLabel ? null : (
    <span className="font-semibold text-foreground">{label}</span>
  )
  const separator =
    hideLabel || !labelSeparator ? null : (
      <span
        aria-hidden
        className="mt-2 mb-2.5 block h-px w-full bg-border/70"
      />
    )

  return (
    <div
      className={twMerge(
        "grid min-w-36 items-start text-xs text-current",
        className
      )}
    >
      {labelContent}
      {separator}
      <div className="grid gap-2.5">
        {points.map((point) => {
          const { series, value } = point.datum
          if (value === null) {
            return null
          }

          let indicatorStyle = { backgroundColor: point.color }
          if (indicator === "dashed") {
            indicatorStyle = { backgroundColor: "transparent" }
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
                  style={{
                    ...indicatorStyle,
                    borderColor: point.color,
                  }}
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
  tooltip?: ChartTooltipRenderer<TDatum> | false
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

const chartTooltipStyle = {
  "--ts-chart-tooltip-background": "transparent",
  "--ts-chart-tooltip-border": "0",
  "--ts-chart-tooltip-padding": "0",
  "--ts-chart-tooltip-shadow": "none",
} as CSSProperties

export type {
  BaseChartProps,
  CartesianChartProps,
  ChartAxisProps,
  ChartColorKeys,
  ChartConfig,
  ChartCurveType,
  ChartDatum,
  ChartFrameContextValue,
  ChartFrameProps,
  ChartLegendProps,
  ChartNumericAxisProps,
  ChartProps,
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
  Chart,
  ChartFrame,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltipContent,
  CHART_COLORS,
  DEFAULT_COLORS,
  chartTooltipStyle,
  constructCategoryColors,
  createTooltipRenderer,
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
  useChartFrame,
  valueToPercent,
}
