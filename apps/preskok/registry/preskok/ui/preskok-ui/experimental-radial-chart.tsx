"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import {
  ExperimentalChart,
  ExperimentalChartCenterLabel,
  ExperimentalChartFrame,
  experimentalDefaultValueFormatter,
  getExperimentalChartOptions,
  getExperimentalFocusStates,
  getExperimentalNamedSeriesColors,
  getExperimentalPositiveMaximum,
  getExperimentalTextLabel,
  toExperimentalNamedSeriesData,
  useExperimentalSeriesSelection,
  type ExperimentalBaseChartProps,
  type ExperimentalNamedSeriesDatum,
} from "./experimental-chart"

type ExperimentalRadialChartProps = ExperimentalBaseChartProps & {
  centerLabel?: string
  centerValue?: string
  endAngle?: number
  maxValue?: number
  nameKey?: string
  radiusRatio?: number
  startAngle?: number
  track?: "hidden" | "visible"
}

function ExperimentalRadialChart({
  ariaLabel = "Radial chart",
  centerLabel,
  centerValue,
  colors,
  config,
  data,
  dataKey,
  endAngle = Math.PI * 2,
  legend,
  maxValue,
  nameKey = "name",
  radiusRatio = 0.84,
  size,
  startAngle = 0,
  tooltip,
  tooltipProps,
  track = "visible",
  valueFormatter = experimentalDefaultValueFormatter,
  ...frameProps
}: ExperimentalRadialChartProps) {
  const [selectedSeries, selectSeries] = useExperimentalSeriesSelection()
  const rows = toExperimentalNamedSeriesData({
    colors,
    config,
    data,
    nameKey,
    selectedOpacity: 20,
    selectedSeries,
    valueKey: dataKey,
  })
  const maximum = getExperimentalPositiveMaximum(
    rows.map((row) => row.value),
    maxValue
  )
  const selectedRow = rows.find((row) => row.series === selectedSeries)
  const average =
    rows.length === 0
      ? 0
      : rows.reduce((sum, row) => sum + row.value, 0) / rows.length

  const valueBars = radialBarAngle(rows, {
    angle: (row) => Math.min(Math.max(row.value, 0), maximum),
    color: "series",
    cornerRadius: "full",
    fill: (row) => row.color,
    id: "preskok-radial-value",
    key: "series",
    radius: "category",
    states: getExperimentalFocusStates<ExperimentalNamedSeriesDatum>(
      "primary",
      0.55
    ),
    z: "series",
  })

  const definition = defineChart({
    ...getExperimentalChartOptions(getExperimentalNamedSeriesColors(rows)),
    focusRing: false,
    marks: [
      polar({
        endAngle,
        marks:
          track === "visible"
            ? [
                radialBarAngle(rows, {
                  angle: () => maximum,
                  cornerRadius: "full",
                  fill: "color-mix(in srgb, var(--muted-foreground) 13%, transparent)",
                  id: "preskok-radial-track",
                  key: "series",
                  radius: "category",
                }),
                valueBars,
              ]
            : [valueBars],
        radiusRatio,
        scales: {
          angle: { scale: scaleLinear().domain([0, maximum]) },
          radius: {
            range: [({ radius }) => radius * 0.34, ({ radius }) => radius],
            scale: () => scaleBand().padding(0.18),
          },
        },
        startAngle,
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
      <div className="relative">
        <ExperimentalChart
          ariaLabel={ariaLabel}
          className="w-full"
          config={config}
          defaultHeight={260}
          definition={definition}
          onSelect={(point) => {
            selectSeries(point?.datum.series ?? null)
          }}
          size={size}
          tooltip={tooltip}
          tooltipProps={tooltipProps}
          valueFormatter={valueFormatter}
        />
        {centerLabel !== undefined ? (
          <ExperimentalChartCenterLabel
            label={
              selectedRow
                ? getExperimentalTextLabel(config, selectedRow.series)
                : centerLabel
            }
            value={
              selectedRow
                ? valueFormatter(selectedRow.value)
                : (centerValue ?? valueFormatter(average))
            }
          />
        ) : null}
      </div>
    </ExperimentalChartFrame>
  )
}

export { ExperimentalRadialChart }
export type { ExperimentalRadialChartProps }
