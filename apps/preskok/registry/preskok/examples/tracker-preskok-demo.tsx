import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Tracker } from "@/registry/preskok/ui/preskok-ui/tracker"

const deliveryStatus = {
  "on-time": { color: "var(--chart-1)", label: "On time" },
  issue: { color: "var(--chart-2)", label: "Issue" },
  delayed: { color: "var(--chart-3)", label: "Delayed" },
} as const

const deliveries = [
  { status: "on-time", time: "2025-06-24T00:00:00Z" },
  { status: "on-time", time: "2025-06-24T01:00:00Z" },
  { status: "on-time", time: "2025-06-24T02:00:00Z" },
  { status: "issue", time: "2025-06-24T03:00:00Z" },
  { status: "on-time", time: "2025-06-24T04:00:00Z" },
  { status: "delayed", time: "2025-06-24T05:00:00Z" },
  { status: "on-time", time: "2025-06-24T06:00:00Z" },
  { status: "on-time", time: "2025-06-24T07:00:00Z" },
  { status: "issue", time: "2025-06-24T08:00:00Z" },
  { status: "on-time", time: "2025-06-24T09:00:00Z" },
  { status: "on-time", time: "2025-06-24T10:00:00Z" },
  { status: "on-time", time: "2025-06-24T11:00:00Z" },
  { status: "on-time", time: "2025-06-24T12:00:00Z" },
  { status: "on-time", time: "2025-06-24T13:00:00Z" },
  { status: "on-time", time: "2025-06-24T14:00:00Z" },
  { status: "on-time", time: "2025-06-24T15:00:00Z" },
  { status: "on-time", time: "2025-06-24T16:00:00Z" },
  { status: "on-time", time: "2025-06-24T17:00:00Z" },
  { status: "on-time", time: "2025-06-24T18:00:00Z" },
  { status: "on-time", time: "2025-06-24T19:00:00Z" },
  { status: "on-time", time: "2025-06-24T20:00:00Z" },
  { status: "on-time", time: "2025-06-24T21:00:00Z" },
  { status: "delayed", time: "2025-06-24T22:00:00Z" },
  { status: "on-time", time: "2025-06-24T23:00:00Z" },
  { status: "on-time", time: "2025-06-25T00:00:00Z" },
  { status: "on-time", time: "2025-06-25T01:00:00Z" },
  { status: "on-time", time: "2025-06-25T02:00:00Z" },
  { status: "on-time", time: "2025-06-25T03:00:00Z" },
  { status: "issue", time: "2025-06-25T04:00:00Z" },
  { status: "on-time", time: "2025-06-25T05:00:00Z" },
  { status: "on-time", time: "2025-06-25T06:00:00Z" },
  { status: "on-time", time: "2025-06-25T07:00:00Z" },
  { status: "on-time", time: "2025-06-25T08:00:00Z" },
  { status: "on-time", time: "2025-06-25T09:00:00Z" },
  { status: "on-time", time: "2025-06-25T10:00:00Z" },
  { status: "on-time", time: "2025-06-25T11:00:00Z" },
  { status: "on-time", time: "2025-06-25T12:00:00Z" },
  { status: "on-time", time: "2025-06-25T13:00:00Z" },
  { status: "on-time", time: "2025-06-25T14:00:00Z" },
  { status: "on-time", time: "2025-06-25T15:00:00Z" },
  { status: "on-time", time: "2025-06-25T16:00:00Z" },
  { status: "on-time", time: "2025-06-25T17:00:00Z" },
  { status: "on-time", time: "2025-06-25T18:00:00Z" },
  { status: "on-time", time: "2025-06-25T19:00:00Z" },
  { status: "on-time", time: "2025-06-25T20:00:00Z" },
  { status: "on-time", time: "2025-06-25T21:00:00Z" },
  { status: "on-time", time: "2025-06-25T22:00:00Z" },
  { status: "on-time", time: "2025-06-25T23:00:00Z" },
] satisfies Array<{
  status: keyof typeof deliveryStatus
  time: string
}>

const data = deliveries.map(({ status, time }) => ({
  id: time,
  color: deliveryStatus[status].color,
  label: `${deliveryStatus[status].label} at ${new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
}))

export function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent deliveries</CardTitle>
        <CardDescription>
          Visual timeline of vehicle delivery outcomes by hour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tracker aria-label="Delivery status by hour" data={data} />
      </CardContent>
    </Card>
  )
}
