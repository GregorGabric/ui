import type React from "react"
import { twMerge } from "tailwind-merge"

export function GeneratedTheme({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div>
      <div
        className={twMerge(
          "grid max-h-48 gap-4 overflow-y-auto lg:gap-6",
          className
        )}
        {...props}
      >
        <div className="from-background sticky inset-x-0 top-0 h-10 w-full bg-linear-to-b from-5% to-transparent" />
        <div className="-mt-12 -mb-12 flex flex-col gap-y-6">
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
            <ColorBoxItem variable="danger" />
            <ColorBoxItem variable="danger-foreground" />
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

        <div className="from-background sticky inset-x-0 bottom-0 h-10 w-full bg-linear-to-t from-5% to-transparent" />
      </div>
    </div>
  )
}

function ColorBox(props: React.ComponentProps<"div">) {
  return <div className="flex flex-col gap-4 rounded-md lg:gap-2" {...props} />
}

function ColorBoxItem({ variable }: { variable: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="inset-ring-foreground/15 size-5 shrink-0 rounded-sm inset-ring-1"
        style={{ backgroundColor: `var(--${variable})` }}
      />
      <small className="font-mono text-xs">--{variable}</small>
    </div>
  )
}
