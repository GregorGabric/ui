"use client"

import { defineChart } from "@tanstack/charts"
import { crosshair } from "@tanstack/charts/crosshair"
import { dot } from "@tanstack/charts/dot"
import { lineY, type LineYOptions } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scalePoint } from "@tanstack/charts/scales/point"
import { text } from "@tanstack/charts/text"

import {
  ExperimentalChart,
  ExperimentalChartFrame,
  EXPERIMENTAL_CHART_COLORS,
  experimentalDefaultValueFormatter,
  getExperimentalCategoryAxis,
  getExperimentalChartTooltip,
  getExperimentalChartCurve,
  getExperimentalNumericAxis,
  getExperimentalNumericScale,
  getExperimentalSeriesChartOptions,
  toExperimentalSeriesData,
  useExperimentalChartFrame,
  experimentalValueToPercent,
  type ExperimentalCartesianChartProps,
  type ExperimentalChartCurveType,
  type ExperimentalChartPlotProps,
  type ExperimentalSeriesDatum,
} from "./experimental-chart"

type ExperimentalLineChartProps = ExperimentalCartesianChartProps & {
  connectNulls?: boolean
  lineProps?: Pick<
    LineYOptions<ExperimentalSeriesDatum>,
    "points" | "strokeDasharray" | "strokeWidth"
  >
  lineType?: ExperimentalChartCurveType
  label?: "category" | "value"
  pointStyle?: "colors" | "custom"
  type?: "default" | "percent"
}

type ExperimentalLineChartPlotProps =
  ExperimentalChartPlotProps<ExperimentalLineChartProps>

function normalizePercent(rows: ExperimentalSeriesDatum[]) {
  const totals = new Map<ExperimentalSeriesDatum["category"], number>()

  rows.forEach((row) => {
    if (row.value === null) {
      return
    }

    totals.set(
      row.category,
      (totals.get(row.category) ?? 0) + Math.abs(row.value)
    )
  })

  return rows.map((row) => {
    if (row.value === null) {
      return row
    }

    const total = totals.get(row.category) ?? 0
    return { ...row, value: total === 0 ? 0 : row.value / total }
  })
}

function ExperimentalLineChartPlot({
  ariaLabel = "Line chart",
  colors,
  config,
  connectNulls = false,
  data,
  dataKey,
  grid = "visible",
  lineProps,
  lineType = "linear",
  label,
  pointStyle,
  size,
  tooltip,
  tooltipProps,
  type = "default",
  valueFormatter = experimentalDefaultValueFormatter,
  xAxis,
  yAxis,
}: ExperimentalLineChartPlotProps) {
  const {
    state: { selectedSeries },
  } = useExperimentalChartFrame()
  const sourceRows = toExperimentalSeriesData({
    config,
    connectNulls,
    data,
    dataKey,
  })
  const rows = type === "percent" ? normalizePercent(sourceRows) : sourceRows
  const { chartColors, options, seriesNames } =
    getExperimentalSeriesChartOptions(config, colors)
  const tooltipValueFormatter =
    type === "percent" ? experimentalValueToPercent : valueFormatter
  const lineMarks = seriesNames.map((series) =>
    lineY(
      rows.filter((row) => row.series === series),
      {
        color: "series",
        curve: getExperimentalChartCurve(lineType),
        id: `line-${series}`,
        key: (row) => `${row.series}-${row.index}`,
        stroke: chartColors[series],
        strokeOpacity: selectedSeries && selectedSeries !== series ? 0.12 : 1,
        strokeWidth: 2.25,
        x: "category",
        y: "value",
        ...lineProps,
        points: pointStyle ? false : (lineProps?.points ?? false),
      }
    )
  )
  const palette = colors ?? EXPERIMENTAL_CHART_COLORS
  const visibleRows = rows.filter((row) => row.value !== null)
  const detailMarks = []

  if (pointStyle === "colors") {
    detailMarks.push(
      ...visibleRows.map((row) =>
        decorative(
          dot([row], {
            fill: palette[row.index % palette.length] ?? palette[0],
            id: `preskok-line-point-${row.index}`,
            key: (datum) => `${datum.series}-${datum.index}`,
            r: 5,
            x: "category",
            y: "value",
          })
        )
      )
    )
  } else if (pointStyle === "custom") {
    detailMarks.push(
      decorative(
        text(visibleRows, {
          fill: (row) => chartColors[row.series] ?? "var(--chart-1)",
          fontSize: 24,
          id: "preskok-line-point-stems",
          key: (row) => `${row.series}-${row.index}`,
          text: () => "│",
          x: "category",
          y: "value",
        })
      ),
      ...visibleRows.map((row) =>
        decorative(
          dot([row], {
            fill: "var(--background)",
            id: `preskok-line-point-${row.index}`,
            key: (datum) => `${datum.series}-${datum.index}`,
            r: 5,
            stroke: chartColors[row.series] ?? "var(--chart-1)",
            strokeWidth: 2,
            x: "category",
            y: "value",
          })
        )
      )
    )
  }

  if (label) {
    detailMarks.push(
      decorative(
        text(visibleRows, {
          dy: -12,
          fill: "var(--foreground)",
          fontSize: 12,
          id: "preskok-line-labels",
          key: (row) => `${row.series}-${row.index}`,
          text: (row) =>
            label === "category"
              ? String(row.category).replace(/^./, (letter) =>
                  letter.toUpperCase()
                )
              : valueFormatter(Number(row.value)),
          x: "category",
          y: "value",
        })
      )
    )
  }
  const baseDefinition = defineChart({
    ...options,
    focus: "group-x",
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
      ...lineMarks,
      ...detailMarks,
    ],
    scales: {
      x: {
        axis: getExperimentalCategoryAxis({ data, dataKey, props: xAxis }),
        scale: () => scalePoint().padding(0.25),
      },
      y: {
        axis: getExperimentalNumericAxis({
          props: yAxis,
          valueFormatter: tooltipValueFormatter,
        }),
        grid: grid === "visible",
        nice: true,
        scale: getExperimentalNumericScale(yAxis),
      },
    },
  })
  const { definition, renderTooltipBody } = getExperimentalChartTooltip({
    config,
    definition: baseDefinition,
    tooltip,
    tooltipProps,
    valueFormatter: tooltipValueFormatter,
  })

  return (
    <ExperimentalChart
      ariaLabel={ariaLabel}
      className="w-full"
      definition={definition}
      renderTooltipBody={renderTooltipBody}
      size={size}
    />
  )
}

function ExperimentalLineChart({
  ariaLabel,
  className,
  colors,
  config,
  connectNulls,
  data,
  dataKey,
  grid,
  legend,
  lineProps,
  lineType,
  label,
  pointStyle,
  size,
  tooltip,
  tooltipProps,
  type,
  valueFormatter,
  xAxis,
  yAxis,
  ...frameProps
}: ExperimentalLineChartProps) {
  return (
    <ExperimentalChartFrame
      {...frameProps}
      className={className}
      colors={colors}
      config={config}
      legend={legend}
    >
      <ExperimentalLineChartPlot
        ariaLabel={ariaLabel}
        colors={colors}
        config={config}
        connectNulls={connectNulls}
        data={data}
        dataKey={dataKey}
        grid={grid}
        lineProps={lineProps}
        lineType={lineType}
        label={label}
        pointStyle={pointStyle}
        size={size}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        type={type}
        valueFormatter={valueFormatter}
        xAxis={xAxis}
        yAxis={yAxis}
      />
    </ExperimentalChartFrame>
  )
}

export { ExperimentalLineChart }
export type { ExperimentalLineChartProps }
