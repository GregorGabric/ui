import type React from "react"
import { twMerge } from "cn"

export function GeneratedTheme({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={twMerge(
        "bg-fd-background/70 max-h-64 overflow-y-auto rounded-lg border p-3",
        className
      )}
      {...props}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <ColorBox>
          <ColorBoxItem variable="background" />
          <ColorBoxItem variable="foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="primary" />
          <ColorBoxItem variable="primary-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="secondary" />
          <ColorBoxItem variable="secondary-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="accent" />
          <ColorBoxItem variable="accent-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="muted" />
          <ColorBoxItem variable="muted-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="overlay" />
          <ColorBoxItem variable="overlay-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="success" />
          <ColorBoxItem variable="success-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="warning" />
          <ColorBoxItem variable="warning-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="destructive" />
          <ColorBoxItem variable="destructive-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="border" />
          <ColorBoxItem variable="input" />
          <ColorBoxItem variable="ring" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="chart-1" />
          <ColorBoxItem variable="chart-2" />
          <ColorBoxItem variable="chart-3" />
          <ColorBoxItem variable="chart-4" />
          <ColorBoxItem variable="chart-5" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="navbar" />
          <ColorBoxItem variable="navbar-foreground" />
        </ColorBox>
        <ColorBox>
          <ColorBoxItem variable="sidebar" />
          <ColorBoxItem variable="sidebar-foreground" />
        </ColorBox>
      </div>
    </div>
  )
}

function ColorBox(props: React.ComponentProps<"div">) {
  return <div className="grid gap-1.5 rounded-md" {...props} />
}

function ColorBoxItem({ variable }: { variable: string }) {
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
