import { CheckCircleIcon, ClockIcon, ShieldAlertIcon } from "lucide-react"

import { Badge } from "preskok"

const intents = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "outline",
] as const

export function Intents() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {intents.map((intent) => (
        <Badge key={intent} intent={intent}>
          {intent[0].toUpperCase() + intent.slice(1)}
        </Badge>
      ))}
    </div>
  )
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge intent="success">
        <CheckCircleIcon data-slot="icon" />
        Approved
      </Badge>
      <Badge intent="warning" isCircle={false}>
        <ClockIcon data-slot="icon" />
        Pending review
      </Badge>
      <Badge intent="danger" isCircle={false}>
        <ShieldAlertIcon data-slot="icon" />
        Needs owner
      </Badge>
    </div>
  )
}
