import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ExperimentalRadarChart,
} from "preskok"

const readinessData = [
  { metric: "Reliability", current: 88, previous: 75 },
  { metric: "Security", current: 82, previous: 78 },
  { metric: "Performance", current: 74, previous: 68 },
  { metric: "Accessibility", current: 91, previous: 80 },
  { metric: "Coverage", current: 69, previous: 64 },
  { metric: "Observability", current: 84, previous: 72 },
]

export function Comparison() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>Release readiness</CardTitle>
        <CardDescription>Current release compared with v2.8</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadarChart
          className="mx-auto max-w-sm"
          config={{
            current: { label: "Current", color: "var(--chart-1)" },
            previous: { label: "Previous", color: "var(--chart-2)" },
          }}
          data={readinessData}
          dataKey="metric"
          size={{ height: 260 }}
          tooltipProps={{ hideLabel: false }}
          valueAxis={{ domain: [0, 100] }}
          valueFormatter={(value) => `${value}%`}
        />
      </CardContent>
    </Card>
  )
}

const vitalsData = [
  { metric: "LCP", desktop: 92, mobile: 71 },
  { metric: "INP", desktop: 88, mobile: 66 },
  { metric: "CLS", desktop: 95, mobile: 84 },
  { metric: "TTFB", desktop: 79, mobile: 62 },
]

export function CompactAxes() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>Core web vitals</CardTitle>
        <CardDescription>Desktop vs mobile field scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadarChart
          className="mx-auto max-w-sm"
          config={{
            desktop: { label: "Desktop", color: "var(--chart-1)" },
            mobile: { label: "Mobile", color: "var(--chart-4)" },
          }}
          data={vitalsData}
          dataKey="metric"
          size={{ height: 260 }}
          valueAxis={{ domain: [0, 100] }}
          valueFormatter={(value) => `${value}%`}
        />
      </CardContent>
    </Card>
  )
}
