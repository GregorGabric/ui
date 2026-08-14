"use client"

import { defineChart } from "@tanstack/charts"
import {
  angleGrid,
  focusGroupAngle,
  polar,
  radialArea,
  radialDot,
  radialGrid,
  type RadialAreaOptions,
  type RadialDotOptions,
} from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { curveLinearClosed } from "d3-shape"

import {
  Chart,
  ChartFrame,
  createTooltipRenderer,
  getChartSize,
  getSeriesChartOptions,
  getTooltipOptions,
  toSeriesData,
  useChartFrame,
  type BaseChartProps,
  type ChartAxisProps,
  type ChartNumericAxisProps,
  type ChartSizeProps,
  type SeriesDatum,
} from "./chart"

type RadarAreaProps = Pick<
  RadialAreaOptions<SeriesDatum>,
  "fillOpacity" | "strokeOpacity" | "strokeWidth"
>

type RadarDotProps = Pick<
  RadialDotOptions<SeriesDatum>,
  "fillOpacity" | "r" | "strokeOpacity" | "strokeWidth"
>

type RadarGridProps = {
  shape?: "circle" | "polygon"
  ticks?: number
  valueLabels?: "hidden" | "visible"
}

type RadarCategoryAxisProps = Pick<ChartAxisProps, "tickFormatter" | "ticks">

type RadarValueAxisProps = Pick<
  ChartNumericAxisProps,
  "domain" | "tickFormatter" | "ticks"
>

type RadarChartProps = BaseChartProps & {
  categoryAxis?: RadarCategoryAxisProps | false
  chartProps?: ChartSizeProps
  dots?: RadarDotProps | false
  grid?: RadarGridProps | false
  radarAreaProps?: RadarAreaProps
  radiusRatio?: number
  valueAxis?: RadarValueAxisProps | false
}

type RadarChartPlotProps = Pick<
  RadarChartProps,
  | "ariaLabel"
  | "categoryAxis"
  | "chartProps"
  | "colors"
  | "config"
  | "data"
  | "dataKey"
  | "dots"
  | "grid"
  | "radarAreaProps"
  | "radiusRatio"
  | "tooltip"
  | "tooltipProps"
  | "valueAxis"
  | "valueFormatter"
>

const defaultValueFormatter = (value: number) => value.toString()

function uniqueSeriesPoints<TPoint extends { datum: { series: string } }>(
  points: readonly TPoint[]
) {
  const series = new Set<string>()
  return points.filter((point) => {
    if (series.has(point.datum.series)) {
      return false
    }
    series.add(point.datum.series)
    return true
  })
}

function RadarChartPlot({
  ariaLabel = "Radar chart",
  categoryAxis,
  chartProps,
  colors,
  config,
  data = [],
  dataKey,
  dots,
  grid,
  radarAreaProps,
  radiusRatio = 0.72,
  tooltip,
  tooltipProps,
  valueAxis,
  valueFormatter = defaultValueFormatter,
}: RadarChartPlotProps) {
  const {
    actions: { selectSeries },
    state: { selectedSeries },
  } = useChartFrame()
  const rows = toSeriesData({ config, data, dataKey })
  const { chartColors, options } = getSeriesChartOptions(config, colors)
  let resolvedMaximum = Math.max(...rows.map((row) => row.value ?? 0), 1)
  if (!Number.isFinite(resolvedMaximum) || resolvedMaximum <= 0) {
    resolvedMaximum = 1
  }
  let radiusScale = scaleLinear().domain([0, resolvedMaximum]).nice(4)
  if (valueAxis && valueAxis.domain) {
    radiusScale = scaleLinear().domain(valueAxis.domain)
  }

  const colorForSeries = (series: string) => {
    const color = chartColors[series] ?? "var(--chart-1)"
    return selectedSeries && selectedSeries !== series
      ? `color-mix(in srgb, ${color} 16%, transparent)`
      : color
  }
  const guides = []
  const gridProps = grid === false ? undefined : grid
  const showGrid = grid !== false
  const showValueLabels =
    valueAxis !== false && gridProps?.valueLabels === "visible"
  if (showGrid || showValueLabels) {
    guides.push(
      radialGrid({
        format: (value) => {
          if (valueAxis && valueAxis.tickFormatter) {
            return valueAxis.tickFormatter(Number(value))
          }
          return valueFormatter(Number(value))
        },
        labelFill: "var(--muted-foreground)",
        labelFontSize: 10,
        labels: showValueLabels,
        shape: gridProps?.shape ?? "polygon",
        stroke: "var(--muted-foreground)",
        strokeOpacity: showGrid ? 0.16 : 0,
        ticks: gridProps?.ticks ?? 4,
        values: valueAxis === false ? undefined : valueAxis?.ticks,
      })
    )
  }
  if (categoryAxis !== false || showGrid) {
    guides.push(
      angleGrid({
        format: (value) => {
          if (categoryAxis && categoryAxis.tickFormatter) {
            return categoryAxis.tickFormatter(value)
          }
          return String(value)
        },
        labelAnchor: ({ x }) => {
          if (x < -1) {
            return "end"
          }
          if (x > 1) {
            return "start"
          }
          return "middle"
        },
        labelDx: ({ x }) => {
          if (x < -1) {
            return -4
          }
          if (x > 1) {
            return 4
          }
          return 0
        },
        labelDy: ({ y }) => {
          if (y < -1) {
            return -3
          }
          if (y > 1) {
            return 3
          }
          return 0
        },
        labelFill: "var(--muted-foreground)",
        labelFontSize: 11,
        labelOffset: 10,
        labels: categoryAxis !== false,
        stroke: "var(--muted-foreground)",
        strokeOpacity: showGrid ? 0.16 : 0,
        values: categoryAxis === false ? undefined : categoryAxis?.ticks,
      })
    )
  }

  const marks = [
    radialArea(rows, {
      angle: "category",
      color: "series",
      curve: curveLinearClosed,
      fill: (row) => colorForSeries(row.series),
      fillOpacity: 0.16,
      id: "preskok-radar-area",
      key: (row) => `${row.series}-${row.index}`,
      radius: "value",
      stroke: (row) => colorForSeries(row.series),
      strokeWidth: 2,
      z: "series",
      ...radarAreaProps,
    }),
  ]
  if (dots !== false) {
    marks.push(
      radialDot(rows, {
        angle: "category",
        color: "series",
        fill: (row) => colorForSeries(row.series),
        id: "preskok-radar-dot",
        key: (row) => `${row.series}-${row.index}`,
        r: 3.5,
        radius: "value",
        stroke: "var(--background)",
        strokeWidth: 2,
        z: "series",
        ...dots,
      })
    )
  }

  const baseDefinition = defineChart({
    ...options,
    focus: focusGroupAngle,
    guides: false,
    marks: [
      polar({
        angle: { scale: scaleBand },
        guides,
        marks,
        radius: {
          scale: radiusScale,
        },
        radiusRatio,
      }),
    ],
    x: null,
    y: null,
  })
  const definition =
    tooltip === false
      ? baseDefinition
      : defineChart(
          baseDefinition,
          getTooltipOptions({
            anchor: "pointer",
            offset: 20,
            placement: "auto",
            ...tooltipProps,
          })
        )
  const renderTooltip =
    tooltip === false
      ? undefined
      : createTooltipRenderer<SeriesDatum>({
          config,
          tooltip,
          tooltipProps,
          valueFormatter,
        })
  const size = getChartSize(chartProps, 320)

  return (
    <Chart
      ariaLabel={ariaLabel}
      className="w-full [&_path[data-ts-key*=preskok-radar-area]]:cursor-pointer [&_path[data-ts-key*=preskok-radar-area]]:transition-[filter,opacity] [&_path[data-ts-key*=preskok-radar-area]]:duration-150 [&_path[data-ts-key*=preskok-radar-area]]:ease-out motion-reduce:[&_path[data-ts-key*=preskok-radar-area]]:transition-none [&_path[data-ts-key*=preskok-radar-area]:hover]:brightness-110"
      definition={definition}
      onSelect={(point) => {
        selectSeries(point?.datum.series ?? null)
      }}
      renderTooltipBody={
        renderTooltip
          ? (context) =>
              renderTooltip({
                ...context,
                points: uniqueSeriesPoints(context.points),
              })
          : undefined
      }
      size={size}
    />
  )
}

function RadarChart({
  ariaLabel,
  categoryAxis,
  chartProps,
  className,
  colors,
  config,
  data,
  dataKey,
  dots,
  grid,
  legend,
  legendProps,
  radarAreaProps,
  radiusRatio,
  tooltip,
  tooltipProps,
  valueAxis,
  valueFormatter,
  ...frameProps
}: RadarChartProps) {
  let resolvedLegend = legend
  if (legend === undefined && Object.keys(config).length < 2) {
    resolvedLegend = false
  }

  return (
    <ChartFrame
      {...frameProps}
      className={className}
      colors={colors}
      config={config}
      legend={resolvedLegend}
      legendProps={legendProps}
    >
      <RadarChartPlot
        ariaLabel={ariaLabel}
        categoryAxis={categoryAxis}
        chartProps={chartProps}
        colors={colors}
        config={config}
        data={data}
        dataKey={dataKey}
        dots={dots}
        grid={grid}
        radarAreaProps={radarAreaProps}
        radiusRatio={radiusRatio}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        valueAxis={valueAxis}
        valueFormatter={valueFormatter}
      />
    </ChartFrame>
  )
}

export { RadarChart }
export type { RadarChartProps }
