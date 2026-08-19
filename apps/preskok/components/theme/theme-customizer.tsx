"use client"

import type React from "react"
import { ChevronDownIcon, MoonIcon, SunIcon } from "lucide-react"
import type { Key } from "react-aria-components/Select"
import { parseColor } from "react-stately/Color"
import { twMerge } from "tailwind-merge"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { ColorPicker } from "@/registry/preskok/ui/preskok-ui/color-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/registry/preskok/ui/preskok-ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"
import { Toggle } from "@/registry/preskok/ui/preskok-ui/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/preskok/ui/preskok-ui/toggle-group"

import { deriveGraySource, generatePalette } from "./palette"
import {
  resolveThemeBackground,
  THEME_RADIUS_OPTIONS,
  type ThemeAppearanceSelection,
  type ThemeBackgroundMode,
  type ThemeSelection,
} from "./themes"

type ThemeCustomizerProps = {
  actions?: React.ReactNode
  appearance: ThemeAppearance
  selectedColors: ThemeSelection
  setAppearance: React.Dispatch<React.SetStateAction<ThemeAppearance>>
  setSelectedColors: React.Dispatch<React.SetStateAction<ThemeSelection>>
}

type EditableColor = "accent" | "gray" | "customBackground"
export type ThemeAppearance = "light" | "dark"

const BACKGROUND_OPTIONS = [
  { id: "neutral", label: "Neutral" },
  { id: "pure", label: "Pure" },
  { id: "accent", label: "Brand tint" },
  { id: "custom", label: "Custom" },
] as const satisfies readonly {
  id: ThemeBackgroundMode
  label: string
}[]

export function ThemeCustomizer({
  actions,
  appearance,
  selectedColors,
  setAppearance,
  setSelectedColors,
}: ThemeCustomizerProps) {
  const values = selectedColors[appearance]

  function updateAppearanceColor(type: EditableColor, value: string) {
    setSelectedColors((previous) => {
      const next = {
        ...previous,
        [appearance]: {
          ...previous[appearance],
          [type]: value,
        },
      }

      if (type === "gray") {
        return { ...next, grayMode: "custom" as const }
      }

      if (type !== "accent" || previous.grayMode !== "auto") {
        return next
      }

      return {
        ...next,
        [appearance]: {
          ...next[appearance],
          gray: deriveGraySource(value),
        },
      }
    })
  }

  function setGrayMode(isAuto: boolean) {
    setSelectedColors((previous) => {
      if (!isAuto) {
        return { ...previous, grayMode: "custom" }
      }

      return {
        ...previous,
        grayMode: "auto",
        light: {
          ...previous.light,
          gray: deriveGraySource(previous.light.accent),
        },
        dark: {
          ...previous.dark,
          gray: deriveGraySource(previous.dark.accent),
        },
      }
    })
  }

  function setBackgroundMode(backgroundMode: ThemeBackgroundMode) {
    setSelectedColors((previous) => ({
      ...previous,
      [appearance]: {
        ...previous[appearance],
        backgroundMode,
      },
    }))
  }

  function setRadius(key: Key | Key[] | null) {
    if (!key || Array.isArray(key)) {
      return
    }

    const radius = THEME_RADIUS_OPTIONS.find(
      (option) => option === key.toString()
    )
    if (radius) {
      setSelectedColors((previous) => ({ ...previous, radius }))
    }
  }

  return (
    <section className="grid gap-8" aria-label="Theme colors">
      <div className="flex justify-center">
        <ToggleGroup
          aria-label="Theme appearance"
          className="bg-panel shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06)] dark:shadow-none"
          size="sm"
          selectedKeys={new Set([appearance])}
          onSelectionChange={(keys) => {
            const key = [...keys][0]
            if (key === "light" || key === "dark") {
              setAppearance(key)
            }
          }}
        >
          <ToggleGroupItem id="light">
            <SunIcon data-slot="icon" />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem id="dark">
            <MoonIcon data-slot="icon" />
            Dark
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        <ThemeColorControl
          label="Brand"
          value={values.accent}
          onChange={(value) => updateAppearanceColor("accent", value)}
        />
        <ThemeColorControl
          label="Neutral"
          value={values.gray}
          action={
            <Toggle
              aria-label="Generate neutral from brand"
              className="-my-1"
              size="xs"
              isSelected={selectedColors.grayMode === "auto"}
              onChange={setGrayMode}
            >
              Auto
            </Toggle>
          }
          onChange={(value) => updateAppearanceColor("gray", value)}
        />
        <BackgroundControl
          appearance={appearance}
          selection={values}
          onChange={(value) => updateAppearanceColor("customBackground", value)}
          onModeChange={setBackgroundMode}
        />

        <div className="grid gap-1.5">
          <Label elementType="span">Radius</Label>
          <Select
            aria-label="Corner radius"
            value={selectedColors.radius}
            onChange={setRadius}
          >
            <SelectTrigger className="bg-panel capitalize shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06)] dark:shadow-none" />
            <SelectContent>
              {THEME_RADIUS_OPTIONS.map((radius) => (
                <SelectItem
                  className="tracking-tight tabular-nums"
                  textValue={radius}
                  key={radius}
                  id={radius}
                >
                  <SelectLabel>
                    {radius.replace("rem", "")}
                    {radius === "0.5rem" && (
                      <Badge className="ml-2">Default</Badge>
                    )}
                  </SelectLabel>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {actions && (
          <div className="sm:col-span-2 lg:col-span-1">{actions}</div>
        )}
      </div>
    </section>
  )
}

function BackgroundControl({
  appearance,
  selection,
  onChange,
  onModeChange,
}: {
  appearance: ThemeAppearance
  selection: ThemeAppearanceSelection
  onChange: (value: string) => void
  onModeChange: (mode: ThemeBackgroundMode) => void
}) {
  const selectedOption = BACKGROUND_OPTIONS.find(
    (option) => option.id === selection.backgroundMode
  )
  const preview = createBackgroundPreview(
    appearance,
    selection,
    selection.backgroundMode
  )

  return (
    <div className="grid min-w-0 gap-1.5">
      <Label elementType="span">Page background</Label>
      <Popover>
        <Button
          className="min-w-0 justify-start bg-panel shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06)] dark:shadow-none"
          intent="outline"
        >
          <SurfacePreview {...preview} />
          <span className="min-w-0 flex-1 truncate text-left">
            {selectedOption?.label}
          </span>
          <ChevronDownIcon data-slot="icon" />
        </Button>
        <PopoverContent className="max-w-sm" placement="bottom">
          <PopoverHeader>
            <PopoverTitle>Page background</PopoverTitle>
            <PopoverDescription>
              Choose the surface treatment for this appearance.
            </PopoverDescription>
          </PopoverHeader>
          <PopoverBody className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              {BACKGROUND_OPTIONS.map((option) => {
                const isSelected = option.id === selection.backgroundMode
                const optionPreview = createBackgroundPreview(
                  appearance,
                  selection,
                  option.id
                )

                return (
                  <Button
                    aria-pressed={isSelected}
                    className={twMerge(
                      "relative h-auto justify-start gap-3 rounded-xl p-3 text-left hover:border-foreground/25 hover:bg-transparent",
                      isSelected &&
                        "border-foreground/25 bg-secondary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_25%,transparent)] hover:bg-secondary"
                    )}
                    intent="outline"
                    key={option.id}
                    onPress={() => onModeChange(option.id)}
                  >
                    <SurfacePreview {...optionPreview} size="lg" />
                    <span className="flex-1">{option.label}</span>
                  </Button>
                )
              })}
            </div>

            {selection.backgroundMode === "custom" && (
              <div className="grid gap-1.5 border-t pt-4">
                <Label elementType="span">Custom color</Label>
                <ColorPicker
                  aria-label="Custom page background color"
                  className="[&_button]:w-full [&_button]:justify-start [&_button]:font-mono [&_button]:font-normal [&_button]:uppercase"
                  eyeDropper
                  label={selection.customBackground.replace("#", "")}
                  value={parseColor(selection.customBackground)}
                  onChange={(color) => onChange(color.toString("hex"))}
                />
              </div>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function createBackgroundPreview(
  appearance: ThemeAppearance,
  selection: ThemeAppearanceSelection,
  backgroundMode: ThemeBackgroundMode
) {
  const background = resolveThemeBackground(appearance, {
    ...selection,
    backgroundMode,
  })
  const palette = generatePalette({
    appearance,
    accent: selection.accent,
    gray: selection.gray,
    background,
  })

  return {
    background,
    panel: palette.gray[1],
    control: palette.gray[3],
  }
}

function SurfacePreview({
  background,
  panel,
  control,
  size = "sm",
}: {
  background: string
  panel: string
  control: string
  size?: "sm" | "lg"
}) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        "relative inline-block shrink-0 overflow-hidden rounded-md border border-black/10",
        size === "sm" ? "size-5" : "size-9"
      )}
      style={{ backgroundColor: background }}
    >
      <span
        className="absolute inset-x-[18%] top-[18%] bottom-[12%] rounded-[3px] border border-black/5"
        style={{ backgroundColor: panel }}
      />
      <span
        className="absolute right-[28%] bottom-[25%] left-[28%] h-[18%] rounded-full"
        style={{ backgroundColor: control }}
      />
    </span>
  )
}

function ThemeColorControl({
  label,
  value,
  action,
  onChange,
}: {
  label: string
  value: string
  action?: React.ReactNode
  onChange: (value: string) => void
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <div className="flex min-h-5 items-center justify-between gap-2">
        <Label elementType="span">{label}</Label>
        {action}
      </div>
      <ColorPicker
        aria-label={`${label} color`}
        className="min-w-0 [&_button]:w-full [&_button]:justify-start [&_button]:bg-panel [&_button]:font-mono [&_button]:font-normal [&_button]:uppercase [&_button]:shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06)] dark:[&_button]:shadow-none"
        label={value.replace("#", "")}
        value={parseColor(value)}
        eyeDropper
        onChange={(color) => onChange(color.toString("hex"))}
      />
    </div>
  )
}
