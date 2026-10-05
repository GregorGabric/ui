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
  ExperimentalChart,
  ExperimentalChartFrame,
  experimentalDefaultValueFormatter,
  getExperimentalChartColors,
  getExperimentalChartOptions,
  getExperimentalPositiveMaximum,
  getExperimentalSelectedSeriesColor,
  toExperimentalSeriesData,
  useExperimentalSeriesSelection,
  type ExperimentalBaseChartProps,
  type ExperimentalChartAxisProps,
  type ExperimentalChartNumericAxisProps,
  type ExperimentalSeriesDatum,
} from "./experimental-chart"

type RadarAreaProps = Pick<
  RadialAreaOptions<ExperimentalSeriesDatum>,
  "fillOpacity" | "strokeOpacity" | "strokeWidth"
>

type RadarDotProps = Pick<
  RadialDotOptions<ExperimentalSeriesDatum>,
  "fillOpacity" | "r" | "strokeOpacity" | "strokeWidth"
>

type RadarGridProps = {
  shape?: "circle" | "polygon"
  ticks?: number
  valueLabels?: "hidden" | "visible"
}

type RadarCategoryAxisProps = Pick<
  ExperimentalChartAxisProps,
  "tickFormatter" | "ticks"
>

type RadarValueAxisProps = Pick<
  ExperimentalChartNumericAxisProps,
  "domain" | "tickFormatter" | "ticks"
>

type ExperimentalRadarChartProps = ExperimentalBaseChartProps & {
  categoryAxis?: RadarCategoryAxisProps | false
  dots?: RadarDotProps | false
  grid?: RadarGridProps | false
  radarAreaProps?: RadarAreaProps
  radiusRatio?: number
  valueAxis?: RadarValueAxisProps | false
}

function ExperimentalRadarChart({
  ariaLabel = "Radar chart",
  categoryAxis,
  colors,
  config,
  data,
  dataKey,
  dots,
  grid,
  legend,
  radarAreaProps,
  radiusRatio = 0.72,
  size,
  tooltip,
  tooltipProps,
  valueAxis,
  valueFormatter = experimentalDefaultValueFormatter,
  ...frameProps
}: ExperimentalRadarChartProps) {
  const [selectedSeries, selectSeries] = useExperimentalSeriesSelection()
  const rows = toExperimentalSeriesData({ config, data, dataKey })
  const chartColors = getExperimentalChartColors(config, colors)
  const seriesColor = (row: ExperimentalSeriesDatum) =>
    getExperimentalSelectedSeriesColor({
      color: chartColors[row.series] ?? "var(--chart-1)",
      opacity: 16,
      selectedSeries,
      series: row.series,
    })

  const valueAxisProps = valueAxis === false ? undefined : valueAxis
  const categoryAxisProps = categoryAxis === false ? undefined : categoryAxis
  const radiusScale = valueAxisProps?.domain
    ? scaleLinear().domain(valueAxisProps.domain)
    : scaleLinear()
        .domain([
          0,
          getExperimentalPositiveMaximum(rows.map((row) => row.value ?? 0)),
        ])
        .nice(4)

  const showGrid = grid !== false
  const gridProps = grid === false ? undefined : grid
  const showValueLabels =
    valueAxis !== false && gridProps?.valueLabels === "visible"
  const guideStroke = {
    stroke: "var(--muted-foreground)",
    strokeOpacity: showGrid ? 0.16 : 0,
  }
  const guides = []
  if (showGrid || showValueLabels) {
    guides.push(
      radialGrid({
        ...guideStroke,
        format: (value) =>
          (valueAxisProps?.tickFormatter ?? valueFormatter)(Number(value)),
        labelFill: "var(--muted-foreground)",
        labelFontSize: 10,
        labels: showValueLabels,
        shape: gridProps?.shape ?? "polygon",
        ticks: gridProps?.ticks ?? 4,
        values: valueAxisProps?.ticks,
      })
    )
  }
  if (showGrid || categoryAxis !== false) {
    guides.push(
      angleGrid({
        ...guideStroke,
        format: categoryAxisProps?.tickFormatter ?? String,
        labelFill: "var(--muted-foreground)",
        labelFontSize: 11,
        labelOffset: 10,
        labels: categoryAxis !== false,
        values: categoryAxisProps?.ticks,
      })
    )
  }

  const area = radialArea(rows, {
    angle: "category",
    color: "series",
    curve: curveLinearClosed,
    fill: seriesColor,
    fillOpacity: 0.16,
    key: (row) => `${row.series}-${row.index}`,
    radius: "value",
    stroke: seriesColor,
    strokeWidth: 2,
    z: "series",
    ...radarAreaProps,
  })

  const definition = defineChart({
    ...getExperimentalChartOptions(chartColors),
    focus: focusGroupAngle,
    marks: [
      polar({
        guides,
        marks:
          dots === false
            ? [area]
            : [
                area,
                radialDot(rows, {
                  angle: "category",
                  color: "series",
                  fill: seriesColor,
                  key: (row) => `${row.series}-${row.index}`,
                  r: 3.5,
                  radius: "value",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                  z: "series",
                  ...dots,
                }),
              ],
        radiusRatio,
        scales: {
          angle: { scale: scaleBand },
          radius: { scale: radiusScale },
        },
      }),
    ],
    scales: { x: null, y: null },
  })

  return (
    <ExperimentalChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={Object.keys(config).length < 2 ? (legend ?? false) : legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <ExperimentalChart
        ariaLabel={ariaLabel}
        className="w-full"
        config={config}
        defaultHeight={320}
        definition={definition}
        onSelect={(point) => {
          selectSeries(point?.datum.series ?? null)
        }}
        size={size}
        tooltip={tooltip}
        tooltipProps={{
          anchor: "pointer",
          offset: 20,
          placement: "auto",
          ...tooltipProps,
        }}
        valueFormatter={valueFormatter}
      />
    </ExperimentalChartFrame>
  )
}

export { ExperimentalRadarChart }
export type { ExperimentalRadarChartProps }
