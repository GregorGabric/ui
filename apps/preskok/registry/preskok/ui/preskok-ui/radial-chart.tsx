"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import {
  Chart,
  ChartFrame,
  defaultValueFormatter,
  getChartSize,
  getChartTooltip,
  getChartTheme,
  getPositiveMaximum,
  getTextLabel,
  toNamedSeriesData,
  useChartFrame,
  type BaseChartProps,
  type ChartPlotProps,
  type NamedSeriesDatum,
} from "./chart"

type RadialChartProps = BaseChartProps & {
  centerLabel?: string
  centerValue?: string
  endAngle?: number
  maxValue?: number
  nameKey?: string
  radiusRatio?: number
  startAngle?: number
  track?: "hidden" | "visible"
}

type RadialChartPlotProps = ChartPlotProps<RadialChartProps>

type RadialDatum = NamedSeriesDatum

function clampValue(value: number, maximum: number) {
  return Math.min(Math.max(value, 0), maximum)
}

function getAverageValue(rows: RadialDatum[]) {
  if (rows.length === 0) {
    return 0
  }

  const total = rows.reduce((sum, row) => sum + row.value, 0)
  return total / rows.length
}

function RadialChartPlot({
  ariaLabel = "Radial chart",
  centerLabel,
  centerValue,
  colors,
  config,
  data,
  dataKey,
  endAngle = Math.PI * 2,
  maxValue,
  nameKey = "name",
  radiusRatio = 0.84,
  size,
  startAngle = 0,
  tooltip,
  tooltipProps,
  track = "visible",
  valueFormatter = defaultValueFormatter,
}: RadialChartPlotProps) {
  const {
    actions: { selectSeries },
    state: { selectedSeries },
  } = useChartFrame()
  const rows = toNamedSeriesData({
    colors,
    config,
    data,
    nameKey,
    selectedOpacity: 20,
    selectedSeries,
    valueKey: dataKey,
  })
  const resolvedMaximum = getPositiveMaximum(
    rows.map((row) => row.value),
    maxValue
  )

  const marks = []
  if (track === "visible") {
    marks.push(
      radialBarAngle(rows, {
        angle: () => resolvedMaximum,
        cornerRadius: "full",
        fill: "color-mix(in srgb, var(--muted-foreground) 13%, transparent)",
        id: "preskok-radial-track",
        key: "series",
        radius: "category",
      })
    )
  }
  marks.push(
    radialBarAngle(rows, {
      angle: (row) => clampValue(row.value, resolvedMaximum),
      color: "series",
      cornerRadius: "full",
      fill: (row) => row.color,
      id: "preskok-radial-value",
      key: "series",
      radius: "category",
      z: "series",
    })
  )

  const baseDefinition = defineChart({
    color: {
      domain: rows.map((row) => row.series),
      range: rows.map((row) => row.color),
    },
    focusRing: false,
    guides: false,
    marks: [
      polar({
        angle: {
          scale: scaleLinear().domain([0, resolvedMaximum]),
        },
        endAngle,
        marks,
        radius: {
          range: [({ radius }) => radius * 0.34, ({ radius }) => radius],
          scale: () => scaleBand().padding(0.18),
        },
        radiusRatio,
        startAngle,
      }),
    ],
    svgAnimation: true,
    theme: getChartTheme(rows.map((row) => row.color)),
    x: null,
    y: null,
  })
  const { definition, renderTooltipBody } = getChartTooltip({
    config,
    definition: baseDefinition,
    tooltip,
    tooltipProps,
    valueFormatter,
  })
  const selectedRow = rows.find((row) => row.series === selectedSeries)
  const displayedValue = selectedRow
    ? valueFormatter(selectedRow.value)
    : (centerValue ?? valueFormatter(getAverageValue(rows)))
  const displayedLabel = selectedRow
    ? getTextLabel(config, selectedRow.series)
    : centerLabel
  const chartSize = getChartSize(size, 260)

  return (
    <div className="relative">
      <Chart
        ariaLabel={ariaLabel}
        className="w-full [&_g:has(>path[data-ts-key*=preskok-radial-value]:hover)>path[data-ts-key*=preskok-radial-value]:not(:hover)]:opacity-55 [&_path[data-ts-key*=preskok-radial-value]]:cursor-pointer [&_path[data-ts-key*=preskok-radial-value]]:transition-[filter,opacity] [&_path[data-ts-key*=preskok-radial-value]]:duration-150 [&_path[data-ts-key*=preskok-radial-value]]:ease-out motion-reduce:[&_path[data-ts-key*=preskok-radial-value]]:transition-none [&_path[data-ts-key*=preskok-radial-value]:hover]:brightness-110"
        definition={definition}
        onSelect={(point) => {
          selectSeries(point?.datum.series ?? null)
        }}
        renderTooltipBody={renderTooltipBody}
        size={chartSize}
      />
      {centerLabel !== undefined ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-semibold tracking-tight text-foreground tabular-nums">
            {displayedValue}
          </span>
          <span className="max-w-24 text-xs text-muted-foreground">
            {displayedLabel}
          </span>
        </div>
      ) : null}
    </div>
  )
}

function RadialChart({
  ariaLabel,
  centerLabel,
  centerValue,
  className,
  colors,
  config,
  data,
  dataKey,
  endAngle,
  legend,
  maxValue,
  nameKey,
  radiusRatio,
  size,
  startAngle,
  tooltip,
  tooltipProps,
  track,
  valueFormatter,
  ...frameProps
}: RadialChartProps) {
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
    >
      <RadialChartPlot
        ariaLabel={ariaLabel}
        centerLabel={centerLabel}
        centerValue={centerValue}
        colors={colors}
        config={config}
        data={data}
        dataKey={dataKey}
        endAngle={endAngle}
        maxValue={maxValue}
        nameKey={nameKey}
        radiusRatio={radiusRatio}
        size={size}
        startAngle={startAngle}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        track={track}
        valueFormatter={valueFormatter}
      />
    </ChartFrame>
  )
}

export { RadialChart }
export type { RadialChartProps }
