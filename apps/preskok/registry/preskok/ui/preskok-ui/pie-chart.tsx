"use client"

import { defineChart } from "@tanstack/charts"
import {
  pie,
  polar,
  radialArc,
  type RadialArcOptions,
} from "@tanstack/charts/polar"

import {
  Chart,
  ChartCenterLabel,
  ChartFrame,
  defaultValueFormatter,
  getChartOptions,
  getFocusStates,
  getNamedSeriesColors,
  getTextLabel,
  toNamedSeriesData,
  useSeriesSelection,
  type BaseChartProps,
  type NamedSeriesDatum,
} from "./chart"

type PieSliceDatum = ReturnType<typeof pie<NamedSeriesDatum>>[number]

type PieChartProps = BaseChartProps & {
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

function PieChart({
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
  valueFormatter = defaultValueFormatter,
  variant = "pie",
  ...frameProps
}: PieChartProps) {
  const [selectedSeries, selectSeries] = useSeriesSelection()
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
  const selectedRow = rows.find((row) => row.series === selectedSeries)
  const total = rows.reduce((sum, row) => sum + row.value, 0)

  const definition = defineChart({
    ...getChartOptions(getNamedSeriesColors(rows)),
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
              states: getFocusStates<PieSliceDatum>("primary"),
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
    <ChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <div className="relative">
        <Chart
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
          <ChartCenterLabel
            label={
              selectedRow
                ? getTextLabel(config, selectedRow.series)
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
    </ChartFrame>
  )
}

export { PieChart }
export type { PieChartProps }
