"use client"

import { defineChart } from "@tanstack/charts"
import {
  pie,
  polar,
  radialArc,
  type RadialArcOptions,
} from "@tanstack/charts/polar"

import {
  ExperimentalChart,
  ExperimentalChartCenterLabel,
  ExperimentalChartFrame,
  experimentalDefaultValueFormatter,
  getExperimentalChartOptions,
  getExperimentalFocusStates,
  getExperimentalNamedSeriesColors,
  getExperimentalTextLabel,
  toExperimentalNamedSeriesData,
  useExperimentalSeriesSelection,
  type ExperimentalBaseChartProps,
  type ExperimentalNamedSeriesDatum,
} from "./experimental-chart"

type PieSliceDatum = ReturnType<
  typeof pie<ExperimentalNamedSeriesDatum>
>[number]

type ExperimentalPieChartProps = ExperimentalBaseChartProps & {
  centerLabel?: string
  centerValue?: string
  nameKey?: string
  pieProps?: Pick<
    RadialArcOptions<PieSliceDatum>,
    "cornerRadius" | "fillOpacity" | "stroke" | "strokeWidth"
  > & {
    paddingAngle?: number
  }
  variant?: "pie" | "donut"
}

function ExperimentalPieChart({
  ariaLabel = "Pie chart",
  centerLabel,
  centerValue,
  colors,
  config,
  data,
  dataKey,
  legend,
  nameKey = "name",
  pieProps,
  size,
  tooltip,
  tooltipProps,
  valueFormatter = experimentalDefaultValueFormatter,
  variant = "pie",
  ...frameProps
}: ExperimentalPieChartProps) {
  const [selectedSeries, selectSeries] = useExperimentalSeriesSelection()
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
  const selectedRow = rows.find((row) => row.series === selectedSeries)
  const total = rows.reduce((sum, row) => sum + row.value, 0)

  const definition = defineChart({
    ...getExperimentalChartOptions(getExperimentalNamedSeriesColors(rows)),
    focusRing: false,
    marks: [
      polar({
        inset: 10,
        marks: [
          radialArc(
            pie(rows, {
              gapAngle: (paddingAngle * Math.PI) / 180,
              value: "value",
            }),
            {
              color: "series",
              fill: (row) => row.color,
              innerRadius:
                variant === "donut" ? ({ radius }) => radius * 0.58 : undefined,
              key: "series",
              states: getExperimentalFocusStates<PieSliceDatum>("primary"),
              ...arcProps,
            }
          ),
        ],
        radiusRatio: 0.84,
        scales: { angle: null, radius: null },
      }),
    ],
    scales: { x: null, y: null },
  })

  return (
    <ExperimentalChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <div className="relative">
        <ExperimentalChart
          ariaLabel={ariaLabel}
          className="w-full"
          config={config}
          defaultHeight={240}
          definition={definition}
          onSelect={(point) => {
            selectSeries(point?.datum.series ?? null)
          }}
          size={size}
          tooltip={tooltip}
          tooltipProps={tooltipProps}
          valueFormatter={valueFormatter}
        />
        {variant === "donut" && centerLabel !== undefined ? (
          <ExperimentalChartCenterLabel
            label={
              selectedRow
                ? getExperimentalTextLabel(config, selectedRow.series)
                : centerLabel
            }
            value={
              selectedRow
                ? valueFormatter(selectedRow.value)
                : (centerValue ?? valueFormatter(total))
            }
          />
        ) : null}
      </div>
    </ExperimentalChartFrame>
  )
}

export { ExperimentalPieChart }
export type { ExperimentalPieChartProps }
