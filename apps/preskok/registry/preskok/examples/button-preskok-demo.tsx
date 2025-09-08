"use client"

import { useState } from "react"

import { Button, buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function ButtonPreskokDemo() {
  const allIntents = Object.keys(buttonStyles.variants.intent) as Array<
    keyof typeof buttonStyles.variants.intent
  >

  const [isLoading, _setIsLoading] = useState(true)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button isPending={isLoading}>
        {isLoading ? "Creating..." : "Create"}
      </Button>
      {allIntents.map((intent) => (
        <Button key={intent} intent={intent}>
          {toTitleCase(intent)}
        </Button>
      ))}
    </div>
  )
}
