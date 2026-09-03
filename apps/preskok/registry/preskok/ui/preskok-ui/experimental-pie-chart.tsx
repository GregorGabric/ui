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
  ExperimentalChart,
  ExperimentalChartFrame,
  experimentalDefaultValueFormatter,
  getExperimentalChartSize,
  getExperimentalChartTooltip,
  getExperimentalChartTheme,
  getExperimentalTextLabel,
  toExperimentalNamedSeriesData,
  useExperimentalChartFrame,
  type ExperimentalBaseChartProps,
  type ExperimentalChartPlotProps,
  type ExperimentalNamedSeriesDatum,
} from "./experimental-chart"

type PieSourceDatum = ExperimentalNamedSeriesDatum
type PieSliceDatum = ReturnType<typeof pie<PieSourceDatum>>[number]

type ExperimentalPieChartProps = ExperimentalBaseChartProps & {
  activeSeries?: string
  activeShape?: "expanded" | "expanded-ring"
  centerLabel?: string
  centerValue?: string
  nameKey?: string
  pieProps?: Pick<
    RadialArcOptions<PieSliceDatum>,
    "cornerRadius" | "fillOpacity" | "stroke" | "strokeWidth"
  > & {
    paddingAngle?: number
  }
  rings?: readonly {
    dataKey: string
    innerRadius?: number
    outerRadius: number
  }[]
  variant?: "pie" | "donut"
}

type ExperimentalPieChartPlotProps =
  ExperimentalChartPlotProps<ExperimentalPieChartProps>

function calculateTotal(rows: PieSourceDatum[]) {
  return rows.reduce((total, row) => total + row.value, 0)
}

function ExperimentalPieChartPlot({
  ariaLabel = "Pie chart",
  activeSeries,
  activeShape,
  centerLabel,
  centerValue,
  colors,
  config,
  data,
  dataKey,
  nameKey = "name",
  pieProps,
  rings,
  size,
  tooltip,
  tooltipProps,
  valueFormatter = experimentalDefaultValueFormatter,
  variant = "pie",
}: ExperimentalPieChartPlotProps) {
  const {
    actions: { selectSeries },
    state: { selectedSeries },
  } = useExperimentalChartFrame()
  const rows = toExperimentalNamedSeriesData({
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
    endAngle: (-Math.PI * 3) / 2,
    gapAngle: (paddingAngle * Math.PI) / 180,
    startAngle: Math.PI / 2,
    value: "value",
  })
  const focusedSeries = activeSeries ?? selectedSeries
  const selectedRow = rows.find((row) => row.series === focusedSeries)
  const displayedValue = selectedRow
    ? valueFormatter(selectedRow.value)
    : (centerValue ?? valueFormatter(calculateTotal(rows)))
  const displayedLabel = selectedRow
    ? getExperimentalTextLabel(config, selectedRow.series)
    : centerLabel
  const showCenterLabel = centerLabel !== undefined && variant === "donut"
  const arcMark = radialArc(slices, {
    color: "series",
    fill: (row) => row.color,
    innerRadius:
      variant === "donut" ? ({ radius }) => radius * 0.58 : undefined,
    key: "series",
    ...arcProps,
  })
  let arcMarks = [arcMark]

  if (rings && rings.length > 0) {
    arcMarks = rings.map((ring, ringIndex) => {
      const ringRows = toExperimentalNamedSeriesData({
        colors,
        config,
        data,
        nameKey,
        selectedOpacity: 26,
        selectedSeries,
        valueKey: ring.dataKey,
      })
      const ringSlices = pie(ringRows, {
        endAngle: (-Math.PI * 3) / 2,
        gapAngle: (paddingAngle * Math.PI) / 180,
        startAngle: Math.PI / 2,
        value: "value",
      })

      return radialArc(ringSlices, {
        color: "series",
        fill: (row) => row.color,
        id: `preskok-pie-ring-${ringIndex}`,
        innerRadius: ring.innerRadius,
        key: "series",
        outerRadius: ring.outerRadius,
        ...arcProps,
      })
    })
  } else if (activeShape && focusedSeries) {
    const activeSlices = slices.filter(
      (slice) => slice.series === focusedSeries
    )
    arcMarks.push(
      radialArc(activeSlices, {
        color: "series",
        fill: (row) => row.color,
        id: "preskok-pie-active",
        innerRadius:
          variant === "donut" ? ({ radius }) => radius * 0.58 : undefined,
        key: "series",
        outerRadius: ({ radius }) => radius + 10,
        stroke: "var(--background)",
        strokeWidth: 5,
      })
    )

    if (activeShape === "expanded-ring") {
      arcMarks.push(
        radialArc(activeSlices, {
          color: "series",
          fill: (row) => row.color,
          id: "preskok-pie-active-ring",
          innerRadius: ({ radius }) => radius + 12,
          key: "series",
          outerRadius: ({ radius }) => radius + 25,
          stroke: "var(--background)",
          strokeWidth: 3,
        })
      )
    }
  }
  const polarChart = showCenterLabel
    ? polar({
        inset: 10,
        marks: [
          ...arcMarks,
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
          }),
        ],
        radiusRatio: 0.84,
        scales: {
          angle: { scale: scaleLinear().domain([0, Math.PI * 2]) },
          radius: { scale: scaleLinear().domain([0, 1]) },
        },
      })
    : polar({
        inset: 10,
        marks: arcMarks,
        radiusRatio: 0.84,
        scales: {
          angle: null,
          radius: null,
        },
      })

  const baseDefinition = defineChart({
    color: {
      domain: rows.map((row) => row.series),
      range: rows.map((row) => row.color),
    },
    focusRing: false,
    marks: [polarChart],
    scales: {
      x: null,
      y: null,
    },
    svgAnimation: false,
    theme: getExperimentalChartTheme(rows.map((row) => row.color)),
  })
  const { definition, renderTooltipBody } = getExperimentalChartTooltip({
    config,
    definition: baseDefinition,
    tooltip,
    tooltipProps,
    valueFormatter,
  })
  const chartSize = getExperimentalChartSize(size, 240)

  return (
    <ExperimentalChart
      ariaLabel={ariaLabel}
      className="w-full [&_g:has(>path[data-ts-key*=arc-]:hover)>path[data-ts-key*=arc-]:not(:hover)]:opacity-60 [&_path[data-ts-key*=arc-]]:cursor-pointer [&_path[data-ts-key*=arc-]]:transition-[filter,opacity] [&_path[data-ts-key*=arc-]]:duration-150 [&_path[data-ts-key*=arc-]]:ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:[&_path[data-ts-key*=arc-]]:transition-none [&_path[data-ts-key*=arc-]:hover]:brightness-110"
      definition={definition}
      onSelect={(point) => {
        selectSeries(point?.datum.series ?? null)
      }}
      renderTooltipBody={renderTooltipBody}
      size={chartSize}
    />
  )
}

function ExperimentalPieChart({
  ariaLabel,
  activeSeries,
  activeShape,
  centerLabel,
  centerValue,
  className,
  colors,
  config,
  data,
  dataKey,
  legend,
  nameKey,
  pieProps,
  rings,
  size,
  tooltip,
  tooltipProps,
  valueFormatter,
  variant,
  ...frameProps
}: ExperimentalPieChartProps) {
  return (
    <ExperimentalChartFrame
      {...frameProps}
      className={className}
      colors={colors}
      config={config}
      legend={legend}
    >
      <ExperimentalPieChartPlot
        ariaLabel={ariaLabel}
        activeSeries={activeSeries}
        activeShape={activeShape}
        centerLabel={centerLabel}
        centerValue={centerValue}
        colors={colors}
        config={config}
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        pieProps={pieProps}
        rings={rings}
        size={size}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        valueFormatter={valueFormatter}
        variant={variant}
      />
    </ExperimentalChartFrame>
  )
}

export { ExperimentalPieChart }
export type { ExperimentalPieChartProps }
