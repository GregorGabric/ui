import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ExperimentalRadialChart,
} from "preskok"

const attainmentData = [
  { name: "Onboarding", value: 86 },
  { name: "Activation", value: 74 },
  { name: "Retention", value: 92 },
]

const config = {
  Onboarding: { label: "Onboarding", color: "var(--chart-1)" },
  Activation: { label: "Activation", color: "var(--chart-2)" },
  Retention: { label: "Retention", color: "var(--chart-3)" },
}

export function Rings() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>Customer journey health</CardTitle>
        <CardDescription>Quarterly target attainment</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadialChart
          centerLabel="Average"
          className="mx-auto max-w-xs"
          config={config}
          data={attainmentData}
          dataKey="value"
          maxValue={100}
          nameKey="name"
          size={{ height: 220 }}
          tooltipProps={{ hideLabel: true }}
          valueFormatter={(value) => `${Math.round(value)}%`}
        />
      </CardContent>
    </Card>
  )
}

const slaData = [
  { name: "Onboarding", value: 96 },
  { name: "Activation", value: 68 },
]

export function SingleGoal() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>Support SLA attainment</CardTitle>
        <CardDescription>Two stages against a 100% target</CardDescription>
      </CardHeader>
      <CardContent>
        <ExperimentalRadialChart
          centerLabel="Attainment"
          className="mx-auto max-w-xs"
          config={{
            Onboarding: { label: "Onboarding", color: "var(--chart-1)" },
            Activation: { label: "Activation", color: "var(--chart-4)" },
          }}
          data={slaData}
          dataKey="value"
          maxValue={100}
          nameKey="name"
          size={{ height: 220 }}
          tooltipProps={{ hideLabel: true }}
          valueFormatter={(value) => `${Math.round(value)}%`}
        />
      </CardContent>
    </Card>
  )
}
