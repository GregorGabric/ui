"use client"

import {
  createContext,
  startTransition,
  use,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import type { ChartValue, DomChartDefinition } from "@tanstack/charts"
import {
  Chart as ChartPrimitive,
  type ChartProps as TanStackChartProps,
  type ChartTooltipBodyRenderContext,
} from "@tanstack/charts/react/tooltip"
import { twMerge } from "cn"
import {
  ToggleButton,
  ToggleButtonGroup,
} from "react-aria-components/ToggleButtonGroup"

import {
  getExperimentalChartColors,
  getExperimentalLabel,
  getExperimentalTextLabel,
  getExperimentalTooltipOptions,
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
  actions: {
    selectSeries: (series: string | null) => void
  }
  meta: {
    colors?: ExperimentalChartColorPalette
    config: ExperimentalChartConfig
  }
  state: {
    selectedSeries: string | null
  }
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

type ExperimentalChartProps<
  TDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> = Pick<
  TanStackChartProps<TDatum, TXValue, TYValue>,
  | "ariaLabel"
  | "className"
  | "definition"
  | "onSelect"
  | "renderTooltipBody"
  | "style"
> & {
  size?: ExperimentalChartSizeProps
}

function ExperimentalChart<
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
}: ExperimentalChartProps<TDatum, TXValue, TYValue>) {
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

type ExperimentalChartFrameProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode
  colors?: ExperimentalChartColorPalette
  config: ExperimentalChartConfig
  legend?: ReactNode | false
}

function ExperimentalChartFrame({
  children,
  className,
  colors,
  config,
  legend,
  ...props
}: ExperimentalChartFrameProps) {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)

  const selectSeries = (series: string | null) => {
    startTransition(() => {
      setSelectedSeries(series)
    })
  }

  let legendContent = legend
  if (legend === undefined) {
    legendContent = <ExperimentalChartLegend />
  }

  const context = {
    actions: { selectSeries },
    meta: { colors, config },
    state: { selectedSeries },
  }

  return (
    <ExperimentalChartFrameContext value={context}>
      <div
        {...props}
        className={twMerge("z-20 flex w-full min-w-0 flex-col", className)}
      >
        {children}
        {legendContent}
      </div>
    </ExperimentalChartFrameContext>
  )
}

function ExperimentalChartLegendContent({
  align = "center",
  className,
  hideIcon = false,
  verticalAlign = "bottom",
  ...props
}: ExperimentalChartLegendProps) {
  const {
    actions: { selectSeries },
    meta: { colors, config },
    state: { selectedSeries },
  } = useExperimentalChartFrame()
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

function ExperimentalChartLegend(props: ExperimentalChartLegendProps) {
  return <ExperimentalChartLegendContent {...props} />
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

function createExperimentalTooltipRenderer<
  TDatum extends ExperimentalTooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  config,
  tooltip,
  tooltipProps,
  valueFormatter,
}: {
  config: ExperimentalChartConfig
  tooltip?: ExperimentalChartTooltipRenderer<TDatum, TXValue, TYValue> | false
  tooltipProps?: ExperimentalChartTooltipProps
  valueFormatter: (value: number) => string
}) {
  return (context: ChartTooltipBodyRenderContext<TDatum, TXValue, TYValue>) => {
    const contentProps = {
      config,
      points: context.points,
      tooltipProps,
      valueFormatter,
    }

    if (typeof tooltip === "function") {
      return tooltip(contentProps)
    }

    return <ExperimentalChartTooltipContent {...contentProps} />
  }
}

function getExperimentalChartTooltip<
  TDatum extends ExperimentalTooltipDatum,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  config,
  definition,
  tooltip,
  tooltipProps,
  valueFormatter,
}: {
  config: ExperimentalChartConfig
  definition: DomChartDefinition<TDatum, TXValue, TYValue>
  tooltip?: ExperimentalChartTooltipRenderer<TDatum, TXValue, TYValue> | false
  tooltipProps?: ExperimentalChartTooltipProps
  valueFormatter: (value: number) => string
}) {
  if (tooltip === false) {
    return { definition, renderTooltipBody: undefined }
  }

  return {
    definition: {
      ...definition,
      ...getExperimentalTooltipOptions(tooltipProps),
    },
    renderTooltipBody: createExperimentalTooltipRenderer({
      config,
      tooltip,
      tooltipProps,
      valueFormatter,
    }),
  }
}

const experimentalChartTooltipStyle = {
  "--ts-chart-tooltip-background": "transparent",
  "--ts-chart-tooltip-border": "0",
  "--ts-chart-tooltip-padding": "0",
  "--ts-chart-tooltip-shadow": "none",
} as CSSProperties

export type {
  ExperimentalChartFrameContextValue,
  ExperimentalChartFrameProps,
  ExperimentalChartProps,
}

export {
  ExperimentalChart,
  ExperimentalChartFrame,
  ExperimentalChartLegend,
  ExperimentalChartLegendContent,
  ExperimentalChartTooltipContent,
  experimentalChartTooltipStyle,
  createExperimentalTooltipRenderer,
  getExperimentalChartTooltip,
  useExperimentalChartFrame,
}

export * from "./experimental-chart-core"
