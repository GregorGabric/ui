"use client"

import { defineChart, type ChartLinearGradient } from "@tanstack/charts"
import { areaY, type AreaYOptions } from "@tanstack/charts/area"
import { crosshair } from "@tanstack/charts/crosshair"
import { scalePoint } from "@tanstack/charts/scales/point"
import { stack } from "@tanstack/charts/stack"

import {
  Chart,
  ChartFrame,
  createTooltipRenderer,
  getCategoryAxis,
  getChartCurve,
  getNumericAxis,
  getNumericScale,
  getSeriesChartOptions,
  getTooltipOptions,
  toSeriesData,
  useChartFrame,
  valueToPercent,
  type CartesianChartProps,
  type ChartCurveType,
  type ChartSizeProps,
  type ChartType,
  type SeriesDatum,
} from "./chart"

type AreaChartProps = CartesianChartProps & {
  areaProps?: Pick<AreaYOptions<SeriesDatum>, "fillOpacity" | "strokeWidth">
  chartProps?: ChartSizeProps
  connectNulls?: boolean
  fillType?: "gradient" | "solid" | "none"
  lineType?: ChartCurveType
  type?: ChartType
}

type AreaChartPlotProps = Pick<
  AreaChartProps,
  | "areaProps"
  | "ariaLabel"
  | "chartProps"
  | "colors"
  | "config"
  | "connectNulls"
  | "data"
  | "dataKey"
  | "fillType"
  | "grid"
  | "lineType"
  | "tooltip"
  | "tooltipProps"
  | "type"
  | "valueFormatter"
  | "xAxis"
  | "yAxis"
>

const defaultValueFormatter = (value: number) => value.toString()

function getGradientId(series: string) {
  return `area-${series.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`
}

function getAreaPaint({
  color,
  dimmed,
  fillType,
  gradientId,
}: {
  color: string
  dimmed: boolean
  fillType: AreaChartProps["fillType"]
  gradientId: string
}) {
  if (fillType === "none") {
    return "transparent"
  }

  if (fillType === "gradient") {
    return `url(#${gradientId})`
  }

  return dimmed ? `color-mix(in srgb, ${color} 10%, transparent)` : color
}

function AreaChartPlot({
  areaProps,
  ariaLabel = "Area chart",
  chartProps,
  colors,
  config,
  connectNulls = false,
  data = [],
  dataKey,
  fillType = "gradient",
  grid = "visible",
  lineType = "linear",
  tooltip,
  tooltipProps,
  type = "default",
  valueFormatter = defaultValueFormatter,
  xAxis,
  yAxis,
}: AreaChartPlotProps) {
  const {
    state: { selectedSeries },
  } = useChartFrame()
  const rows = toSeriesData({ config, connectNulls, data, dataKey })
  const { chartColors, options, seriesNames } = getSeriesChartOptions(
    config,
    colors
  )
  const gradientIds = new Map(
    seriesNames.map((series, index) => [series, `preskok-area-${index}`])
  )
  const tooltipValueFormatter =
    type === "percent" ? valueToPercent : valueFormatter
  const gradients: ChartLinearGradient[] = seriesNames.map((series) => {
    const dimmed = Boolean(selectedSeries && selectedSeries !== series)
    return {
      id: gradientIds.get(series) ?? getGradientId(series),
      stops: [
        {
          color: chartColors[series] ?? "var(--chart-1)",
          offset: 0,
          opacity: 0.03,
        },
        {
          color: chartColors[series] ?? "var(--chart-1)",
          offset: 1,
          opacity: dimmed ? 0.04 : 0.38,
        },
      ],
      y1: 1,
      y2: 0,
    }
  })
  const sharedOptions = {
    color: "series" as const,
    curve: getChartCurve(lineType),
    fill: (row: SeriesDatum) =>
      getAreaPaint({
        color: chartColors[row.series] ?? "var(--chart-1)",
        dimmed: Boolean(selectedSeries && selectedSeries !== row.series),
        fillType,
        gradientId: gradientIds.get(row.series) ?? getGradientId(row.series),
      }),
    fillOpacity: fillType === "solid" ? 0.28 : 1,
    id: "preskok-area",
    key: (row: SeriesDatum) => `${row.series}-${row.index}`,
    stroke: (row: SeriesDatum) => {
      const color = chartColors[row.series] ?? "var(--chart-1)"
      return selectedSeries && selectedSeries !== row.series
        ? `color-mix(in srgb, ${color} 10%, transparent)`
        : color
    },
    strokeWidth: 2.25,
    x: "category" as const,
    z: "series" as const,
    ...areaProps,
  }
  let mark
  if (type === "default") {
    mark = areaY(rows, {
      ...sharedOptions,
      y1: 0,
      y2: "value",
    })
  } else {
    const layout = type === "percent" ? stack({ offset: "normalize" }) : stack()
    mark = areaY(rows, {
      ...sharedOptions,
      layout,
      y: "value",
    })
  }

  const baseDefinition = defineChart({
    ...options,
    focus: "group-x",
    gradients: fillType === "gradient" ? gradients : undefined,
    marks: [
      crosshair({
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
      }),
      mark,
    ],
    x: {
      axis: getCategoryAxis({ data, dataKey, props: xAxis }),
      scale: () => scalePoint().padding(0.25),
    },
    y: {
      axis: getNumericAxis({
        props: yAxis,
        valueFormatter: tooltipValueFormatter,
      }),
      grid: grid === "visible",
      nice: true,
      scale: getNumericScale(yAxis),
    },
  })
  const definition =
    tooltip === false
      ? baseDefinition
      : defineChart(baseDefinition, getTooltipOptions(tooltipProps))

  return (
    <Chart
      ariaLabel={ariaLabel}
      className="w-full [&_g:has(>path[data-ts-key^=preskok-area]:hover)>path[data-ts-key^=preskok-area]:not(:hover)]:opacity-60 [&_path[data-ts-key^=preskok-area]]:cursor-pointer [&_path[data-ts-key^=preskok-area]]:transition-[filter,opacity] [&_path[data-ts-key^=preskok-area]]:duration-150 [&_path[data-ts-key^=preskok-area]]:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:[&_path[data-ts-key^=preskok-area]]:transition-none [&_path[data-ts-key^=preskok-area]:hover]:brightness-110"
      definition={definition}
      renderTooltipBody={
        tooltip === false
          ? undefined
          : createTooltipRenderer({
              config,
              tooltip,
              tooltipProps,
              valueFormatter: tooltipValueFormatter,
            })
      }
      size={chartProps}
    />
  )
}

function AreaChart({
  areaProps,
  ariaLabel,
  chartProps,
  className,
  colors,
  config,
  connectNulls,
  data,
  dataKey,
  fillType,
  grid,
  legend,
  legendProps,
  lineType,
  tooltip,
  tooltipProps,
  type,
  valueFormatter,
  xAxis,
  yAxis,
  ...frameProps
}: AreaChartProps) {
  return (
    <ChartFrame
      {...frameProps}
      className={className}
      colors={colors}
      config={config}
      legend={legend}
      legendProps={legendProps}
    >
      <AreaChartPlot
        areaProps={areaProps}
        ariaLabel={ariaLabel}
        chartProps={chartProps}
        colors={colors}
        config={config}
        connectNulls={connectNulls}
        data={data}
        dataKey={dataKey}
        fillType={fillType}
        grid={grid}
        lineType={lineType}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        type={type}
        valueFormatter={valueFormatter}
        xAxis={xAxis}
        yAxis={yAxis}
      />
    </ChartFrame>
  )
}

export { AreaChart }
export type { AreaChartProps }
