"use client"

import { CheckCircleIcon, ClockIcon, ShieldAlertIcon } from "lucide-react"

import { Badge, badgeStyles } from "@/registry/preskok/ui/preskok-ui/badge"

function toTitleCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function BadgePreskokDemo() {
  const intents = Object.keys(badgeStyles.variants.intent) as Array<
    keyof typeof badgeStyles.variants.intent
  >

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {intents.map((intent) => (
          <Badge key={intent} intent={intent}>
            {toTitleCase(intent)}
          </Badge>
        ))}
      </div>
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
    </div>
  )
}
