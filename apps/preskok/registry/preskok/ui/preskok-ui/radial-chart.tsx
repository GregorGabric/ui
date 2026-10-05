"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import {
  Chart,
  ChartCenterLabel,
  ChartFrame,
  defaultValueFormatter,
  getChartOptions,
  getFocusStates,
  getNamedSeriesColors,
  getPositiveMaximum,
  getTextLabel,
  toNamedSeriesData,
  useSeriesSelection,
  type BaseChartProps,
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

function RadialChart({
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
  valueFormatter = defaultValueFormatter,
  ...frameProps
}: RadialChartProps) {
  const [selectedSeries, selectSeries] = useSeriesSelection()
  const rows = toNamedSeriesData({
    colors,
    config,
    data,
    nameKey,
    selectedOpacity: 20,
    selectedSeries,
    valueKey: dataKey,
  })
  const maximum = getPositiveMaximum(
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
    states: getFocusStates<NamedSeriesDatum>("primary", 0.55),
    z: "series",
  })

  const definition = defineChart({
    ...getChartOptions(getNamedSeriesColors(rows)),
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
    <ChartFrame
      {...frameProps}
      colors={colors}
      config={config}
      legend={Object.keys(config).length < 2 ? (legend ?? false) : legend}
      onSelectedSeriesChange={selectSeries}
      selectedSeries={selectedSeries}
    >
      <div className="relative">
        <Chart
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
          <ChartCenterLabel
            label={
              selectedRow
                ? getTextLabel(config, selectedRow.series)
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
    </ChartFrame>
  )
}

export { RadialChart }
export type { RadialChartProps }
