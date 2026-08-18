"use client"

import type React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import type { Key } from "react-aria-components/Select"
import { parseColor } from "react-stately/Color"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { ColorPicker } from "@/registry/preskok/ui/preskok-ui/color-picker"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
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

import { deriveGraySource } from "./palette"
import {
  THEME_RADIUS_OPTIONS,
  type ThemeAppearanceSelection,
  type ThemeSelection,
} from "./themes"

type ThemeCustomizerProps = {
  actions?: React.ReactNode
  appearance: ThemeAppearance
  selectedColors: ThemeSelection
  setAppearance: React.Dispatch<React.SetStateAction<ThemeAppearance>>
  setSelectedColors: React.Dispatch<React.SetStateAction<ThemeSelection>>
}

type EditableColor = keyof ThemeAppearanceSelection
export type ThemeAppearance = "light" | "dark"

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
          className="bg-background/70 shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06)] backdrop-blur-sm dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]"
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
        <ThemeColorControl
          label="Background"
          value={values.background}
          onChange={(value) => updateAppearanceColor("background", value)}
        />

        <div className="grid gap-1.5">
          <Label elementType="span">Radius</Label>
          <Select
            aria-label="Corner radius"
            value={selectedColors.radius}
            onChange={setRadius}
          >
            <SelectTrigger className="bg-background/80 capitalize shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06)] backdrop-blur-sm dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]" />
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
        className="min-w-0 [&_button]:w-full [&_button]:justify-start [&_button]:bg-background/80 [&_button]:font-mono [&_button]:font-normal [&_button]:uppercase [&_button]:shadow-[0_0_0_1px_oklch(0_0_0/0.06),0_1px_2px_-1px_oklch(0_0_0/0.06)] [&_button]:backdrop-blur-sm dark:[&_button]:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]"
        label={value.replace("#", "")}
        value={parseColor(value)}
        eyeDropper
        onChange={(color) => onChange(color.toString("hex"))}
      />
    </div>
  )
}
