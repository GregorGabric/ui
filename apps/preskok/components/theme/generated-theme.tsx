import { CheckCircle2Icon, CircleAlertIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

import {
  THEME_PRIMITIVE_STEPS,
  type ThemeContrastCheck,
  type ResolvedTheme,
} from "./themes"

export function GeneratedTheme({
  theme,
  checks,
  className,
}: {
  theme: ResolvedTheme
  checks: ThemeContrastCheck[]
  className?: string
}) {
  const passingChecks = checks.filter((check) => check.passes).length

  return (
    <div
      className={twMerge(
        "bg-fd-background/70 max-h-[32rem] overflow-y-auto rounded-lg border",
        className
      )}
    >
      <div className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium">Generated scales</h3>
            <p className="text-xs/5 text-muted-foreground">
              Steps follow Radix usage roles from canvas through text.
            </p>
          </div>
          <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs tabular-nums">
            2 × 12 steps
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <PalettePreview
            label="Light"
            background={theme.primitives.light.background}
            foreground={theme.colors.light.foreground}
            accent={theme.primitives.light.accent}
            gray={theme.primitives.light.gray}
            panel={theme.colors.light.panel}
            surface={theme.colors.light.surface}
          />
          <PalettePreview
            label="Dark"
            background={theme.primitives.dark.background}
            foreground={theme.colors.dark.foreground}
            accent={theme.primitives.dark.accent}
            gray={theme.primitives.dark.gray}
            panel={theme.colors.dark.panel}
            surface={theme.colors.dark.surface}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium">Text contrast</h3>
              <p className="text-xs/5 text-muted-foreground">
                WCAG ratios are gated at 4.5:1; APCA is reported as additional
                guidance.
              </p>
            </div>
            <span
              className={twMerge(
                "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                passingChecks === checks.length
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-warning/30 bg-warning/10 text-warning-foreground"
              )}
            >
              {passingChecks === checks.length ? (
                <CheckCircle2Icon className="size-3.5" />
              ) : (
                <CircleAlertIcon className="size-3.5" />
              )}
              {passingChecks}/{checks.length} pass
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {checks.map((check) => (
              <ContrastRow key={`${check.mode}-${check.label}`} check={check} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PalettePreview({
  label,
  background,
  foreground,
  accent,
  gray,
  panel,
  surface,
}: {
  label: string
  background: string
  foreground: string
  accent: readonly string[]
  gray: readonly string[]
  panel: string
  surface: string
}) {
  return (
    <div
      className="grid gap-3 rounded-lg border p-3"
      style={{ background, color: foreground }}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-medium">
        <span>{label}</span>
        <span className="font-mono font-normal opacity-60">{background}</span>
      </div>
      <ScalePreview label="Accent" colors={accent} />
      <ScalePreview label="Gray" colors={gray} />
      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
        <SurfacePreview label="Canvas" color={background} />
        <SurfacePreview label="Panel" color={panel} />
        <SurfacePreview label="Control" color={surface} />
      </div>
    </div>
  )
}

function ScalePreview({
  label,
  colors,
}: {
  label: string
  colors: readonly string[]
}) {
  return (
    <div className="grid gap-1">
      <span className="text-[10px] font-medium opacity-70">{label}</span>
      <div className="grid grid-cols-12 overflow-hidden rounded-sm border border-black/10">
        {colors.map((color, index) => (
          <span
            key={`${color}-${index}`}
            className="aspect-square min-w-0"
            title={`${label} ${THEME_PRIMITIVE_STEPS[index]} · ${color}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 text-[9px] opacity-55">
        <span>Canvas</span>
        <span className="text-center">UI</span>
        <span className="text-right">Text</span>
      </div>
    </div>
  )
}

function SurfacePreview({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="rounded-md border border-black/10 px-1 py-2"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}

function ContrastRow({ check }: { check: ThemeContrastCheck }) {
  return (
    <div className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs">
      <span
        className={twMerge(
          "size-2 shrink-0 rounded-full",
          check.passes ? "bg-success" : "bg-warning"
        )}
      />
      <span className="min-w-0 flex-1 truncate">
        <span className="capitalize">{check.mode}</span> · {check.label}
      </span>
      <span className="shrink-0 text-muted-foreground tabular-nums">
        {check.wcag}:1 · Lc {check.apca}
      </span>
    </div>
  )
}
