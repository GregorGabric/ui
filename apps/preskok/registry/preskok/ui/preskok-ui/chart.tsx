"use client"

import {
  createContext,
  startTransition,
  use,
  useEffect,
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
import { motion } from "@tanstack/charts/motion"
import {
  RendererChart as ChartPrimitive,
  type ChartProps as TanStackChartProps,
} from "@tanstack/charts/react/tooltip"
import { svgChartRenderer } from "@tanstack/charts/svg/renderer"
import { tooltip as tooltipExtension } from "@tanstack/charts/tooltip"
import { twMerge } from "cn"
import {
  ToggleButton,
  ToggleButtonGroup,
} from "react-aria-components/ToggleButtonGroup"

import {
  CHART_HIT_MARK_ID,
  defaultValueFormatter,
  getChartColors,
  getLabel,
  getTextLabel,
  type ChartColorPalette,
  type ChartConfig,
  type ChartLegendProps,
  type ChartSizeProps,
  type ChartTooltipContentProps,
  type ChartTooltipProps,
  type ChartTooltipRenderer,
  type TooltipDatum,
} from "./chart-core"

const ENTRANCE_DURATION = 900

// Marks grow from their baseline on mount. The entrance also replays over
// server-rendered SVG, which is hidden until the chart has measured its container.
const entranceRenderer = motion({
  initial: "always",
  transition: {
    type: "tween",
    duration: ENTRANCE_DURATION,
    easing: "ease-out",
  },
})

type ChartFrameContextValue = {
  colors?: ChartColorPalette
  config: ChartConfig
  selectedSeries: string | null
  selectSeries: (series: string | null) => void
}

const ChartFrameContext = createContext<ChartFrameContextValue | null>(null)

function useChartFrame() {
  const context = use(ChartFrameContext)
  if (!context) {
    throw new Error("Chart components must be rendered inside <ChartFrame>")
  }
  return context
}

/** Series highlighted from the legend or by selecting a mark. */
function useSeriesSelection() {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)

  const selectSeries = (series: string | null) => {
    startTransition(() => {
      setSelectedSeries(series)
    })
  }

  return [selectedSeries, selectSeries] as const
}

type ChartProps<
  TDatum extends TooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = Pick<
  TanStackChartProps<TDatum, TXValue, TYValue>,
  "className" | "style"
> & {
  ariaLabel: string
  config: ChartConfig
  /** Height used when `size` sets neither `height` nor `aspectRatio`. */
  defaultHeight?: number
  definition: StaticChartDefinition<TDatum, TXValue, TYValue, "dom">
  /**
   * How marks appear on mount: `grow` from their baseline, or `reveal` left to
   * right. Marks that reveal should opt out of `grow` with
   * `motion: revealEntranceMotion`.
   */
  entrance?: "grow" | "reveal"
  onSelect?: (point: ChartPoint<TDatum, TXValue, TYValue> | null) => void
  size?: ChartSizeProps
  tooltip?: ChartTooltipRenderer<TDatum, TXValue, TYValue> | false
  tooltipProps?: ChartTooltipProps
  valueFormatter?: (value: number) => string
}

function Chart<
  TDatum extends TooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  ariaLabel,
  className,
  config,
  defaultHeight = 288,
  definition,
  entrance = "grow",
  onSelect,
  size,
  style,
  tooltip,
  tooltipProps,
  valueFormatter = defaultValueFormatter,
}: ChartProps<TDatum, TXValue, TYValue>) {
  // Hide the first paint until the chart matches its container width, so the
  // server-rendered `initialWidth` layout never flashes.
  const [ready, setReady] = useState(false)
  // After the entrance, paint with the plain SVG renderer. The motion renderer turns every hover state change
  // into a scene animation that the next pointer move cancels before its first frame, so hover highlights
  // only appeared once the pointer stopped.
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (!ready) {
      return
    }
    const timeout = window.setTimeout(
      () => setEntered(true),
      ENTRANCE_DURATION + 100
    )
    return () => window.clearTimeout(timeout)
  }, [ready])
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
        // Frosted tooltip: translucent overlay over a blur, with a hairline border.
        "[--ts-chart-tooltip-background:color-mix(in_oklab,var(--overlay)_70%,transparent)] [--ts-chart-tooltip-color:var(--overlay-foreground)]",
        "[--ts-chart-tooltip-border:0.5px_solid_color-mix(in_oklab,var(--overlay-foreground)_16%,transparent)]",
        "[--ts-chart-tooltip-border-radius:0.5rem] [--ts-chart-tooltip-padding:0.5rem_0.75rem] [&_.ts-chart-tooltip]:backdrop-blur-lg",
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
                // Follow the pointer immediately; the renderer's tween made the tooltip trail and wobble between points.
                motion: false,
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
          if (entrance === "reveal") {
            revealMarks(context.container)
          }
          setReady(true)
        }
      }}
      onSelect={onSelect}
      renderer={entered ? svgChartRenderer : entranceRenderer}
      renderTooltipBody={
        hasTooltip
          ? ({ points, primaryPoint }) => {
              const contentProps = {
                activeSeries: primaryPoint?.datum.series,
                config,
                points: uniqueSeriesPoints(points),
                tooltipProps,
                valueFormatter,
              }

              return tooltip ? (
                tooltip(contentProps)
              ) : (
                <ChartTooltipContent {...contentProps} />
              )
            }
          : undefined
      }
      style={style}
    />
  )
}

/** Wipes the marks layer in from the left, leaving axes and grid in place. */
function revealMarks(container: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return
  }

  // The negative insets keep strokes at the plot edges from being clipped.
  container
    .querySelector(".ts-chart__marks")
    ?.animate(
      [
        { clipPath: "inset(-8% 100% -8% -8%)" },
        { clipPath: "inset(-8% -8% -8% -8%)" },
      ],
      { duration: 900, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)" }
    )
}

/** Keeps one tooltip row per series when several marks share a datum. */
function uniqueSeriesPoints<
  TPoint extends { datum: { series: string }; markId: string },
>(points: readonly TPoint[]) {
  const seen = new Set<string>()
  // Hit-target marks share the datum but not the series color, so the visible mark's point wins.
  const ordered = [...points].sort(
    (a, b) =>
      Number(a.markId === CHART_HIT_MARK_ID) -
      Number(b.markId === CHART_HIT_MARK_ID)
  )
  return ordered.filter((point) => {
    if (seen.has(point.datum.series)) {
      return false
    }
    seen.add(point.datum.series)
    return true
  })
}

type ChartFrameProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode
  colors?: ChartColorPalette
  config: ChartConfig
  legend?: ReactNode | false
  onSelectedSeriesChange: (series: string | null) => void
  selectedSeries: string | null
}

function ChartFrame({
  children,
  className,
  colors,
  config,
  legend = <ChartLegend />,
  onSelectedSeriesChange,
  selectedSeries,
  ...props
}: ChartFrameProps) {
  return (
    <ChartFrameContext
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
    </ChartFrameContext>
  )
}

function ChartLegend({
  align = "center",
  className,
  hideIcon = false,
  verticalAlign = "bottom",
  ...props
}: ChartLegendProps) {
  const { colors, config, selectedSeries, selectSeries } = useChartFrame()
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

function ChartTooltipContent<
  TDatum extends TooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  config,
  points,
  tooltipProps,
  valueFormatter,
}: ChartTooltipContentProps<TDatum, TXValue, TYValue>) {
  const seriesColors = getChartColors(config)
  const seriesOrder = Object.keys(config)
  const {
    className,
    hideIndicator = false,
    hideLabel = false,
    hint,
    indicator = "dot",
    labelFormatter,
    labelSeparator = true,
  } = tooltipProps ?? {}
  const firstPoint = points[0]

  if (!firstPoint) {
    return null
  }

  const rawLabel = String(firstPoint.datum.category)
  const hintContent = hint?.(rawLabel)

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
        {[...points]
          // Same order as the legend.
          .sort(
            (a, b) =>
              seriesOrder.indexOf(a.datum.series) -
              seriesOrder.indexOf(b.datum.series)
          )
          .map((point) => {
            const { series, value } = point.datum
            if (value === null) {
              return null
            }
            // Every row shows its series color, matching the legend, whichever mark the pointer is over.
            const indicatorColor = seriesColors[series] ?? point.color

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
                        indicator === "dashed" ? "transparent" : indicatorColor,
                      borderColor: indicatorColor,
                    }}
                  />
                )}
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
      {hintContent ? (
        <span className="mt-2.5 flex items-center gap-1 border-t border-border/70 pt-2 text-muted-foreground">
          {hintContent}
        </span>
      ) : null}
    </div>
  )
}

/** Value and caption centered over a donut or radial chart. */
function ChartCenterLabel({
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

export type { ChartFrameContextValue, ChartFrameProps, ChartProps }

export {
  Chart,
  ChartCenterLabel,
  ChartFrame,
  ChartLegend,
  ChartTooltipContent,
  useChartFrame,
  useSeriesSelection,
}

export * from "./chart-core"
