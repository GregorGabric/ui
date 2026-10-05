"use client"

import {
  createContext,
  startTransition,
  use,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import {
  defineChart,
  type ChartPoint,
  type ChartValue,
  type StaticChartDefinition,
} from "@tanstack/charts"
import {
  Chart as ChartPrimitive,
  type ChartProps as TanStackChartProps,
} from "@tanstack/charts/react/tooltip"
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip"
import { twMerge } from "cn"
import {
  ToggleButton,
  ToggleButtonGroup,
} from "react-aria-components/ToggleButtonGroup"

import {
  experimentalDefaultValueFormatter,
  getExperimentalChartColors,
  getExperimentalLabel,
  getExperimentalTextLabel,
  type ExperimentalChartColorPalette,
  type ExperimentalChartConfig,
  type ExperimentalChartLegendProps,
  type ExperimentalChartSizeProps,
  type ExperimentalChartTooltipContentProps,
  type ExperimentalChartTooltipProps,
  type ExperimentalChartTooltipRenderer,
  type ExperimentalTooltipDatum,
} from "./experimental-chart-core"

type ExperimentalChartFrameContextValue = {
  colors?: ExperimentalChartColorPalette
  config: ExperimentalChartConfig
  selectedSeries: string | null
  selectSeries: (series: string | null) => void
}

const ExperimentalChartFrameContext =
  createContext<ExperimentalChartFrameContextValue | null>(null)

function useExperimentalChartFrame() {
  const context = use(ExperimentalChartFrameContext)
  if (!context) {
    throw new Error(
      "Chart components must be rendered inside <ExperimentalChartFrame>"
    )
  }
  return context
}

/** Series highlighted from the legend or by selecting a mark. */
function useExperimentalSeriesSelection() {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)

  const selectSeries = (series: string | null) => {
    startTransition(() => {
      setSelectedSeries(series)
    })
  }

  return [selectedSeries, selectSeries] as const
}

type ExperimentalChartProps<
  TDatum extends ExperimentalTooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = Pick<
  TanStackChartProps<TDatum, TXValue, TYValue>,
  "className" | "style"
> & {
  ariaLabel: string
  config: ExperimentalChartConfig
  /** Height used when `size` sets neither `height` nor `aspectRatio`. */
  defaultHeight?: number
  definition: StaticChartDefinition<TDatum, TXValue, TYValue, "dom">
  onSelect?: (point: ChartPoint<TDatum, TXValue, TYValue> | null) => void
  size?: ExperimentalChartSizeProps
  tooltip?: ExperimentalChartTooltipRenderer<TDatum, TXValue, TYValue> | false
  tooltipProps?: ExperimentalChartTooltipProps
  valueFormatter?: (value: number) => string
}

function ExperimentalChart<
  TDatum extends ExperimentalTooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  ariaLabel,
  className,
  config,
  defaultHeight = 288,
  definition,
  onSelect,
  size,
  style,
  tooltip,
  tooltipProps,
  valueFormatter = experimentalDefaultValueFormatter,
}: ExperimentalChartProps<TDatum, TXValue, TYValue>) {
  // Hide the first paint until the chart matches its container width, so the
  // server-rendered `initialWidth` layout never flashes.
  const [ready, setReady] = useState(false)
  const hasTooltip = tooltip !== false
  let height = size?.height
  if (height === undefined && size?.aspectRatio === undefined) {
    height = defaultHeight
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
      definition={
        hasTooltip
          ? defineChart(definition, {
              tooltip: {
                anchor: tooltipProps?.anchor,
                offset: tooltipProps?.offset,
                placement: tooltipProps?.placement,
                // A click already selects a series, so it should not also pin.
                sticky: onSelect === undefined,
                use: tooltipExtension,
              },
            })
          : definition
      }
      height={height}
      initialWidth={size?.initialWidth ?? 720}
      onRender={(context) => {
        if (ready) {
          return
        }

        const measuredWidth = context.container.getBoundingClientRect().width
        if (
          measuredWidth > 0 &&
          Math.abs(context.scene.width - measuredWidth) < 1
        ) {
          setReady(true)
        }
      }}
      onSelect={onSelect}
      renderTooltipBody={
        hasTooltip
          ? ({ points }) => {
              const contentProps = {
                config,
                points: uniqueSeriesPoints(points),
                tooltipProps,
                valueFormatter,
              }

              return tooltip ? (
                tooltip(contentProps)
              ) : (
                <ExperimentalChartTooltipContent {...contentProps} />
              )
            }
          : undefined
      }
      style={style}
    />
  )
}

/** Keeps one tooltip row per series when several marks share a datum. */
function uniqueSeriesPoints<TPoint extends { datum: { series: string } }>(
  points: readonly TPoint[]
) {
  const seen = new Set<string>()
  return points.filter((point) => {
    if (seen.has(point.datum.series)) {
      return false
    }
    seen.add(point.datum.series)
    return true
  })
}

type ExperimentalChartFrameProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode
  colors?: ExperimentalChartColorPalette
  config: ExperimentalChartConfig
  legend?: ReactNode | false
  onSelectedSeriesChange: (series: string | null) => void
  selectedSeries: string | null
}

function ExperimentalChartFrame({
  children,
  className,
  colors,
  config,
  legend = <ExperimentalChartLegend />,
  onSelectedSeriesChange,
  selectedSeries,
  ...props
}: ExperimentalChartFrameProps) {
  return (
    <ExperimentalChartFrameContext
      value={{
        colors,
        config,
        selectedSeries,
        selectSeries: onSelectedSeriesChange,
      }}
    >
      <div
        {...props}
        className={twMerge("z-20 flex w-full min-w-0 flex-col", className)}
      >
        {children}
        {legend}
      </div>
    </ExperimentalChartFrameContext>
  )
}

function ExperimentalChartLegend({
  align = "center",
  className,
  hideIcon = false,
  verticalAlign = "bottom",
  ...props
}: ExperimentalChartLegendProps) {
  const { colors, config, selectedSeries, selectSeries } =
    useExperimentalChartFrame()
  const chartColors = getExperimentalChartColors(config, colors)
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
        verticalAlign === "top" ? "order-first pb-2" : "order-last pt-2",
        justifyClass,
        className
      )}
      onSelectionChange={(keys) => {
        selectSeries([...keys][0]?.toString() ?? null)
      }}
      selectedKeys={selectedSeries ? [selectedSeries] : []}
      selectionMode="single"
      {...props}
    >
      {Object.entries(config).map(([series, item]) => {
        const Icon = item.icon
        return (
          <ToggleButton
            aria-label={`${getExperimentalTextLabel(config, series)} series`}
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

function ExperimentalChartTooltipContent<
  TDatum extends ExperimentalTooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  config,
  points,
  tooltipProps,
  valueFormatter,
}: ExperimentalChartTooltipContentProps<TDatum, TXValue, TYValue>) {
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

  return (
    <div
      className={twMerge(
        "grid min-w-36 items-start text-xs text-current",
        className
      )}
    >
      {hideLabel ? null : (
        <span className="font-semibold text-foreground">
          {labelFormatter ? labelFormatter(rawLabel) : rawLabel}
        </span>
      )}
      {hideLabel || !labelSeparator ? null : (
        <span
          aria-hidden
          className="mt-2 mb-2.5 block h-px w-full bg-border/70"
        />
      )}
      <div className="grid gap-2.5">
        {points.map((point) => {
          const { series, value } = point.datum
          if (value === null) {
            return null
          }

          return (
            <div className="flex items-center gap-2.5" key={point.key}>
              {hideIndicator ? null : (
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
                    backgroundColor:
                      indicator === "dashed" ? "transparent" : point.color,
                    borderColor: point.color,
                  }}
                />
              )}
              <span className="flex-1 text-muted-foreground">
                {getExperimentalLabel(config, series)}
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

/** Value and caption centered over a donut or radial chart. */
function ExperimentalChartCenterLabel({
  label,
  value,
}: {
  label?: ReactNode
  value: ReactNode
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
      <span className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </span>
      <span className="max-w-24 text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export type {
  ExperimentalChartFrameContextValue,
  ExperimentalChartFrameProps,
  ExperimentalChartProps,
}

export {
  ExperimentalChart,
  ExperimentalChartCenterLabel,
  ExperimentalChartFrame,
  ExperimentalChartLegend,
  ExperimentalChartTooltipContent,
  useExperimentalChartFrame,
  useExperimentalSeriesSelection,
}

export * from "./experimental-chart-core"
