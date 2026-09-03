import type React from "react"
import { twMerge } from "tailwind-merge"

import type { ThemeColorTokenName } from "./themes"

const TOKEN_GROUPS: Array<Array<ThemeColorTokenName>> = [
  ["background", "foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["accent", "accent-foreground"],
  ["muted", "muted-foreground"],
  ["overlay", "overlay-foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["success", "success-foreground"],
  ["warning", "warning-foreground"],
  ["danger", "danger-foreground"],
  ["destructive", "destructive-foreground"],
  ["border", "input", "ring"],
  ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  ["navbar", "navbar-foreground"],
  ["sidebar", "sidebar-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-accent", "sidebar-accent-foreground"],
  ["sidebar-border", "sidebar-ring"],
  ["surface", "surface-foreground"],
  ["code", "code-foreground", "code-highlight", "code-number"],
  ["selection", "selection-foreground"],
]

export function GeneratedTheme({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={twMerge(
        "bg-fd-background/70 max-h-80 overflow-y-auto rounded-lg border p-3",
        className
      )}
      {...props}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {TOKEN_GROUPS.map((variables) => (
          <ColorBox key={variables.join("-")}>
            {variables.map((variable) => (
              <ColorBoxItem key={variable} variable={variable} />
            ))}
          </ColorBox>
        ))}
      </div>
    </div>
  )
}

function ColorBox(props: React.ComponentProps<"div">) {
  return <div className="grid gap-1.5 rounded-md" {...props} />
}

function ColorBoxItem({ variable }: { variable: ThemeColorTokenName }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border bg-fd-card px-2.5 py-2 text-sm text-fd-card-foreground">
      <div
        className="size-4 shrink-0 rounded-sm inset-ring-1 inset-ring-foreground/15"
        style={{ backgroundColor: `var(--${variable})` }}
      />
      <small className="truncate font-mono text-xs">--{variable}</small>
    </div>
  )
}
