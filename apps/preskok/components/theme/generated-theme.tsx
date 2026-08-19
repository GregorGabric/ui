import { twMerge } from "tailwind-merge"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/registry/preskok/ui/preskok-ui/popover"

import type { ThemeAppearance } from "./theme-customizer"
import {
  THEME_PRIMITIVE_STEPS,
  type ThemeContrastCheck,
  type ResolvedTheme,
} from "./themes"

const USAGE_RANGES = [
  { label: "Backgrounds", className: "col-span-2" },
  { label: "Interactive components", className: "col-span-3" },
  { label: "Borders and separators", className: "col-span-3" },
  { label: "Solid colors", className: "col-span-2" },
  { label: "Accessible text", className: "col-span-2" },
] as const

export function GeneratedTheme({
  theme,
  checks,
  appearance,
  className,
}: {
  theme: ResolvedTheme
  checks: ThemeContrastCheck[]
  appearance: ThemeAppearance
  className?: string
}) {
  return (
    <div className={twMerge("grid gap-5", className)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium">Palette</h3>
        <ContrastSummary checks={checks} />
      </div>

      <div className="grid gap-2">
        <div className="hidden grid-cols-12 gap-1 sm:grid">
          {USAGE_RANGES.map((range) => (
            <span
              className={twMerge(
                "border-b border-foreground/10 pb-2 text-center text-xs text-muted-foreground",
                range.className
              )}
              key={range.label}
            >
              {range.label}
            </span>
          ))}
        </div>

        <div className="hidden grid-cols-12 gap-1 sm:grid">
          {THEME_PRIMITIVE_STEPS.map((step) => (
            <span
              className="text-center text-xs text-muted-foreground tabular-nums"
              key={step}
            >
              {step}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          <ScalePreview
            label="Accent"
            colors={theme.primitives[appearance].accent}
          />
          <ScalePreview
            label="Neutral"
            colors={theme.primitives[appearance].gray}
          />
        </div>
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
    <div className="grid gap-2">
      <span className="text-xs font-medium sm:sr-only">{label}</span>
      <div className="grid grid-rows-12 gap-px overflow-hidden rounded-xl bg-foreground/10 p-px sm:grid-cols-12 sm:grid-rows-1">
        {colors.map((color, index) => (
          <span
            aria-label={`${label} ${THEME_PRIMITIVE_STEPS[index]}: ${color}`}
            className="min-h-8 sm:min-h-16"
            key={`${color}-${index}`}
            role="img"
            title={`${label} ${THEME_PRIMITIVE_STEPS[index]} · ${color}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}

function ContrastSummary({ checks }: { checks: ThemeContrastCheck[] }) {
  const passingChecks = checks.filter((check) => check.passes).length

  return (
    <Popover>
      <Button
        className="-mr-2 gap-1.5 px-2 font-normal text-muted-foreground hover:text-foreground"
        intent="plain"
        size="xs"
      >
        <span>Contrast</span>
        <span className="font-medium text-foreground tabular-nums">
          {passingChecks}/{checks.length}
        </span>
        <span className="sr-only">pairs pass</span>
      </Button>
      <PopoverContent className="max-w-md" placement="bottom end">
        <PopoverHeader>
          <PopoverTitle>Text contrast</PopoverTitle>
          <PopoverDescription>
            WCAG 2.x uses a 4.5:1 threshold. APCA is shown as additional
            guidance.
          </PopoverDescription>
        </PopoverHeader>
        <PopoverBody className="max-h-80 overflow-y-auto">
          <div className="grid gap-2 sm:grid-cols-2">
            {checks.map((check) => (
              <ContrastRow key={`${check.mode}-${check.label}`} check={check} />
            ))}
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

function ContrastRow({ check }: { check: ThemeContrastCheck }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-surface px-2.5 py-2 text-xs text-surface-foreground">
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
