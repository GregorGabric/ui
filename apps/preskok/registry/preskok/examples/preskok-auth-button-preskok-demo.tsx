"use client"

import { useState } from "react"

import { PreskokAuthButton } from "@/registry/preskok/ui/preskok-ui/preskok-auth-button"

export default function PreskokAuthButtonPreskokDemo() {
  const [status, setStatus] = useState("Ready")

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <PreskokAuthButton />
        <PreskokAuthButton intent="primary" />
        <PreskokAuthButton intent="secondary" />
        <PreskokAuthButton label="Sign in with Preskok" />
        <PreskokAuthButton
          label="Connect workspace"
          onPress={() => setStatus("Redirecting to Preskok...")}
        />
      </div>
      <p className="text-sm text-muted-foreground">{status}</p>
    </div>
  )
}
