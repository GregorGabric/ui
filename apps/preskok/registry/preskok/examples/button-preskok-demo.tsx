"use client"

import { Button, buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function ButtonPreskokDemo() {
  const allIntents = Object.keys(buttonStyles.variants.intent) as Array<
    keyof typeof buttonStyles.variants.intent
  >

  return (
    <div className="flex flex-wrap items-center gap-2">
      {allIntents.map((intent) => (
        <Button key={intent} intent={intent}>
          {toTitleCase(intent)}
        </Button>
      ))}
    </div>
  )
}
