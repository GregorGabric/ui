"use client"

import { Badge, badgeStyles } from "@/registry/preskok/ui/preskok-ui/badge"

function toTitleCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function BadgePreskokDemo() {
  const intents = Object.keys(badgeStyles.variants.intent) as Array<
    keyof typeof badgeStyles.variants.intent
  >

  return (
    <div className="flex flex-wrap items-center gap-2">
      {intents.map((intent) => (
        <Badge key={intent} intent={intent}>
          {toTitleCase(intent)}
        </Badge>
      ))}
    </div>
  )
}
