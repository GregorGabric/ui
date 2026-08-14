"use client"

import { defineChart } from "@tanstack/charts"
import {
  pie,
  polar,
  radialArc,
  radialText,
  type RadialArcOptions,
} from "@tanstack/charts/polar"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import {
  Chart,
  ChartFrame,
  createTooltipRenderer,
  getChartSize,
  getChartTheme,
  getTextLabel,
  getTooltipOptions,
  toNamedSeriesData,
  useChartFrame,
  type BaseChartProps,
  type ChartSizeProps,
  type NamedSeriesDatum,
} from "./chart"

type PieSourceDatum = NamedSeriesDatum
type PieSliceDatum = ReturnType<typeof pie<PieSourceDatum>>[number]

type PieChartProps = BaseChartProps & {
  centerLabel?: string
  centerValue?: string
  chartProps?: ChartSizeProps
  nameKey?: string
  pieProps?: Pick<
    RadialArcOptions<PieSliceDatum>,
    "cornerRadius" | "fillOpacity" | "stroke" | "strokeWidth"
  > & {
    paddingAngle?: number
  }
  variant?: "pie" | "donut"
}

type PieChartPlotProps = Pick<
  PieChartProps,
  | "ariaLabel"
  | "centerLabel"
  | "centerValue"
  | "chartProps"
  | "colors"
  | "config"
  | "data"
  | "dataKey"
  | "nameKey"
  | "pieProps"
  | "tooltip"
  | "tooltipProps"
  | "valueFormatter"
  | "variant"
>

const defaultValueFormatter = (value: number) => value.toString()

function calculateTotal(rows: PieSourceDatum[]) {
  return rows.reduce((total, row) => total + (row.value ?? 0), 0)
}

function PieChartPlot({
  ariaLabel = "Pie chart",
  centerLabel,
  centerValue,
  chartProps,
  colors,
  config,
  data = [],
  dataKey,
  nameKey = "name",
  pieProps,
  tooltip,
  tooltipProps,
  valueFormatter = defaultValueFormatter,
  variant = "pie",
}: PieChartPlotProps) {
  const {
    actions: { selectSeries },
    state: { selectedSeries },
  } = useChartFrame()
  const rows = toNamedSeriesData({
    colors,
    config,
    data,
    nameKey,
    selectedOpacity: 26,
    selectedSeries,
    valueKey: dataKey,
  })
  const { paddingAngle = 0, ...arcProps } = pieProps ?? {}
  const slices = pie(rows, {
    endAngle: Math.PI * 2,
    gapAngle: (paddingAngle * Math.PI) / 180,
    startAngle: 0,
    value: "value",
  })
  const selectedRow = rows.find((row) => row.series === selectedSeries)
  const displayedValue = selectedRow
    ? valueFormatter(selectedRow.value ?? 0)
    : (centerValue ?? valueFormatter(calculateTotal(rows)))
  const displayedLabel = selectedRow
    ? getTextLabel(config, selectedRow.series)
    : centerLabel
  const marks = [
    radialArc(slices, {
      color: "series",
      fill: (row) => row.color,
      innerRadius:
        variant === "donut" ? ({ radius }) => radius * 0.58 : undefined,
      key: "series",
      ...arcProps,
    }),
  ]

  if (centerLabel !== undefined && variant === "donut") {
    marks.push(
      radialText(slices.slice(0, 1), {
        angle: 0,
        dy: -5,
        fill: "var(--foreground)",
        fontSize: 20,
        fontWeight: 600,
        key: "series",
        radius: 0,
        text: () => displayedValue,
      }),
      radialText(slices.slice(0, 1), {
        angle: 0,
        dy: 14,
        fill: "var(--muted-foreground)",
        fontSize: 10,
        fontWeight: 500,
        key: "series",
        radius: 0,
        text: () => displayedLabel ?? "",
      })
    )
  }

  const baseDefinition = defineChart({
    color: {
      domain: rows.map((row) => row.series),
      range: rows.map((row) => row.color),
    },
    focusRing: false,
    marks: [
      polar({
        angle: { scale: scaleLinear().domain([0, Math.PI * 2]) },
        inset: 10,
        marks,
        radius: { scale: scaleLinear().domain([0, 1]) },
        radiusRatio: 0.84,
      }),
    ],
    svgAnimation: true,
    theme: getChartTheme(rows.map((row) => row.color)),
  })
  const definition =
    tooltip === false
      ? baseDefinition
      : defineChart(baseDefinition, getTooltipOptions(tooltipProps))
  const size = getChartSize(chartProps, 240)

  return (
    <Chart
      ariaLabel={ariaLabel}
      className="w-full [&_g:has(>path[data-ts-key*=arc-]:hover)>path[data-ts-key*=arc-]:not(:hover)]:opacity-60 [&_path[data-ts-key*=arc-]]:cursor-pointer [&_path[data-ts-key*=arc-]]:transition-[filter,opacity] [&_path[data-ts-key*=arc-]]:duration-150 [&_path[data-ts-key*=arc-]]:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:[&_path[data-ts-key*=arc-]]:transition-none [&_path[data-ts-key*=arc-]:hover]:brightness-110"
      definition={definition}
      onSelect={(point) => {
        selectSeries(point?.datum.series ?? null)
      }}
      renderTooltipBody={
        tooltip === false
          ? undefined
          : createTooltipRenderer<PieSliceDatum>({
              config,
              tooltip,
              tooltipProps,
              valueFormatter,
            })
      }
      size={size}
    />
  )
}

function PieChart({
  ariaLabel,
  centerLabel,
  centerValue,
  chartProps,
  className,
  colors,
  config,
  data,
  dataKey,
  legend,
  legendProps,
  nameKey,
  pieProps,
  tooltip,
  tooltipProps,
  valueFormatter,
  variant,
  ...frameProps
}: PieChartProps) {
  return (
    <ChartFrame
      {...frameProps}
      className={className}
      colors={colors}
      config={config}
      legend={legend}
      legendProps={legendProps}
    >
      <PieChartPlot
        ariaLabel={ariaLabel}
        centerLabel={centerLabel}
        centerValue={centerValue}
        chartProps={chartProps}
        colors={colors}
        config={config}
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        pieProps={pieProps}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        valueFormatter={valueFormatter}
        variant={variant}
      />
    </ChartFrame>
  )
}

export { PieChart }
export type { PieChartProps }
