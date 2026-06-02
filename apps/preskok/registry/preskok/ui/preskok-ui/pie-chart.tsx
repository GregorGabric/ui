"use client"

import { type ComponentProps } from "react"
import { Cell, Pie, PieChart as PieChartPrimitive } from "recharts"
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
import { twMerge } from "tailwind-merge"

import {
  Chart,
  ChartTooltip,
  ChartTooltipContent,
  DEFAULT_COLORS,
  getColorValue,
  type BaseChartProps,
  type ChartDatum,
} from "./chart"

const sumNumericArray = (arr: number[]): number =>
  arr.reduce((sum, num) => sum + num, 0)

const calculateDefaultLabel = (data: ChartDatum[], valueKey: string): number =>
  sumNumericArray(data.map((dataPoint) => Number(dataPoint[valueKey]) || 0))

const parseLabelInput = (
  labelInput: string | undefined,
  valueFormatter: (value: number) => string,
  data: ChartDatum[],
  valueKey: string
): string => labelInput || valueFormatter(calculateDefaultLabel(data, valueKey))

interface PieChartProps<
  TValue extends ValueType,
  TName extends NameType,
> extends Omit<
  BaseChartProps<TValue, TName>,
  | "hideGridLines"
  | "hideXAxis"
  | "hideYAxis"
  | "xAxisProps"
  | "yAxisProps"
  | "displayEdgeLabelsOnly"
  | "legend"
  | "legendProps"
> {
  variant?: "pie" | "donut"
  nameKey?: string

  chartProps?: Omit<
    ComponentProps<typeof PieChartPrimitive>,
    "data" | "stackOffset"
  >

  label?: string
  showLabel?: boolean
  pieProps?: Omit<ComponentProps<typeof Pie>, "data" | "dataKey" | "name">
}

const PieChart = <TValue extends ValueType, TName extends NameType>({
  data = [],
  dataKey,
  colors = DEFAULT_COLORS,
  className,
  config,
  children,
  label,
  showLabel,

  // Components
  tooltip = true,
  tooltipProps,

  variant = "pie",
  nameKey,

  chartProps,

  valueFormatter = (value: number) => value.toString(),
  pieProps,
  ...props
}: PieChartProps<TValue, TName>) => {
  const parsedLabelInput = parseLabelInput(label, valueFormatter, data, dataKey)

  return (
    <Chart
      className={twMerge("aspect-square", className)}
      config={config}
      data={data}
      layout="radial"
      dataKey={dataKey}
      {...props}
    >
      {({ onLegendSelect }) => (
        <PieChartPrimitive
          data={data}
          onClick={() => {
            onLegendSelect(null)
          }}
          margin={{
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          }}
          {...chartProps}
        >
          {showLabel && variant === "donut" && (
            <text
              className="fill-foreground font-medium"
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {parsedLabelInput}
            </text>
          )}
          <Pie
            name={nameKey}
            dataKey={dataKey}
            data={data}
            cx={pieProps?.cx ?? "50%"}
            cy={pieProps?.cy ?? "50%"}
            startAngle={pieProps?.startAngle ?? 90}
            endAngle={pieProps?.endAngle ?? -270}
            strokeLinejoin="round"
            innerRadius={variant === "donut" ? "50%" : "0%"}
            isAnimationActive
            {...pieProps}
          >
            {data.map((dataPoint, index) => {
              let colorKey: string | undefined
              if (typeof dataPoint.code === "string") {
                colorKey = dataPoint.code
              } else if (typeof dataPoint.name === "string") {
                colorKey = dataPoint.name
              }
              const color = colorKey ? config?.[colorKey]?.color : undefined
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={getColorValue(color ?? colors[index % colors.length])}
                />
              )
            })}
          </Pie>

          {tooltip && (
            <ChartTooltip
              content={
                typeof tooltip === "boolean" ? (
                  <ChartTooltipContent
                    labelSeparator={false}
                    accessibilityLayer
                  />
                ) : (
                  tooltip
                )
              }
              {...tooltipProps}
            />
          )}

          {children}
        </PieChartPrimitive>
      )}
    </Chart>
  )
}

export { PieChart }
export type { PieChartProps }
