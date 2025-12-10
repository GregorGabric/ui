"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { Tabs } from "@/registry/preskok/ui/preskok-ui/tabs"

export function CodeTabs({ children }: React.ComponentProps<typeof Tabs>) {
  const [config, setConfig] = useConfig()

  const installationType = React.useMemo(() => {
    return config.installationType || "cli"
  }, [config])

  return (
    <Tabs
      selectedKey={installationType}
      onSelectionChange={(key) => {
        setConfig({ ...config, installationType: key as "cli" | "manual" })
      }}
      className="relative mt-6 w-full **:[&[data-slot=tab]]:px-2.5"
    >
      {children}
    </Tabs>
  )
}
