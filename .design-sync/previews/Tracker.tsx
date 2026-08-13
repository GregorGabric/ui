import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tracker,
} from "preskok"

const statuses = [
  "on-time",
  "on-time",
  "on-time",
  "issue",
  "on-time",
  "delayed",
  "on-time",
  "on-time",
  "issue",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "on-time",
  "delayed",
  "on-time",
] as const

const times = Array.from(
  { length: statuses.length },
  (_, hour) => `${hour.toString().padStart(2, "0")}:00`
)

const data = statuses.map((status, index) => ({
  color:
    status === "on-time"
      ? "bg-success"
      : status === "issue"
        ? "bg-destructive"
        : "bg-warning",
  tooltip: `${status} @ ${times[index]}`,
}))

export function Basic() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Recent deliveries</CardTitle>
        <CardDescription>
          Visual timeline of vehicle delivery outcomes by hour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tracker data={data} disabledTooltip />
      </CardContent>
    </Card>
  )
}
