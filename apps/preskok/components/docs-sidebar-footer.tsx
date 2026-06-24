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
    <div className="border-fd-border/70 mt-3 border-t pt-3">
      <div className="border-fd-border bg-fd-secondary/40 space-y-2 rounded-lg border p-2.5">
        <div className="text-fd-muted-foreground flex items-center gap-2">
          <PackageIcon className="size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-xs font-medium">
            {siteConfig.package.name}
          </span>
          <span className="bg-fd-muted text-fd-muted-foreground rounded-md px-1.5 py-0.5 text-[0.6875rem] font-medium tabular-nums">
            v{siteConfig.package.version}
          </span>
        </div>
        <button
          type="button"
          className={cn(
            "border-fd-border bg-fd-background flex w-full min-w-0 items-center gap-2 rounded-md border px-2 py-1.5 text-start",
            "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground text-xs"
          )}
          onClick={() => {
            void navigator.clipboard.writeText(
              siteConfig.package.installCommand
            )
            setHasCopied(true)
          }}
        >
          <TerminalIcon className="size-3.5 shrink-0" />
          <code className="min-w-0 flex-1 truncate font-mono">
            {siteConfig.package.installCommand}
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
