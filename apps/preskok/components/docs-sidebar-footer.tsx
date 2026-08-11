"use client"

import * as React from "react"
import {
  CheckIcon,
  ClipboardIcon,
  PackageIcon,
  TerminalIcon,
} from "lucide-react"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

export function DocsSidebarFooter() {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (!hasCopied) {
      return
    }

    const timeout = window.setTimeout(() => {
      setHasCopied(false)
    }, 2000)

    return () => window.clearTimeout(timeout)
  }, [hasCopied])

  return (
    <div className="mt-3 border-t border-fd-border/70 pt-3">
      <div className="space-y-2 rounded-lg border border-fd-border bg-fd-secondary/40 p-2.5">
        <div className="flex items-center gap-2 text-fd-muted-foreground">
          <PackageIcon className="size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-xs font-medium">
            {siteConfig.cli.name}
          </span>
        </div>
        <button
          type="button"
          className={cn(
            "flex w-full min-w-0 items-center gap-2 rounded-md border border-fd-border bg-fd-background px-2 py-1.5 text-start",
            "text-xs text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
          )}
          onClick={() => {
            void navigator.clipboard.writeText(siteConfig.cli.installCommand)
            setHasCopied(true)
          }}
        >
          <TerminalIcon className="size-3.5 shrink-0" />
          <code className="min-w-0 flex-1 truncate font-mono">
            {siteConfig.cli.installCommand}
          </code>
          {hasCopied ? (
            <CheckIcon className="size-3.5 shrink-0" />
          ) : (
            <ClipboardIcon className="size-3.5 shrink-0" />
          )}
        </button>
      </div>
    </div>
  )
}
