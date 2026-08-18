"use client"

import { useState } from "react"
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
import { Switch } from "@/registry/preskok/ui/preskok-ui/switch"
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
  selectedColors: ThemeSelection
  setSelectedColors: React.Dispatch<React.SetStateAction<ThemeSelection>>
}

type EditableColor = keyof ThemeAppearanceSelection
type Appearance = "light" | "dark"

export function ThemeCustomizer({
  selectedColors,
  setSelectedColors,
}: ThemeCustomizerProps) {
  const [appearance, setAppearance] = useState<Appearance>("light")
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
    <div className="grid gap-5">
      <section className="grid gap-4" aria-label="Theme colors">
        <ToggleGroup
          aria-label="Theme appearance"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <ThemeColorControl
            label="Brand"
            value={values.accent}
            onChange={(value) => updateAppearanceColor("accent", value)}
          />
          <ThemeColorControl
            label="Background"
            value={values.background}
            onChange={(value) => updateAppearanceColor("background", value)}
          />
          {selectedColors.grayMode === "custom" && (
            <ThemeColorControl
              label="Neutral"
              value={values.gray}
              onChange={(value) => updateAppearanceColor("gray", value)}
            />
          )}
        </div>
      </section>

      <div className="grid items-start gap-4 border-t pt-4 sm:grid-cols-2">
        <Switch
          isSelected={selectedColors.grayMode === "auto"}
          onChange={setGrayMode}
        >
          <Label>Auto neutral</Label>
        </Switch>

        <div className="grid gap-1.5">
          <Label elementType="span">Radius</Label>
          <Select
            aria-label="Corner radius"
            value={selectedColors.radius}
            onChange={setRadius}
          >
            <SelectTrigger className="capitalize" />
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
      </div>
    </div>
  )
}

function ThemeColorControl({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2">
      <ColorPicker
        aria-label={`${label} color`}
        className="min-w-0 [&_button]:justify-start"
        label={label}
        value={parseColor(value)}
        eyeDropper
        onChange={(color) => onChange(color.toString("hex"))}
      />
      <code className="shrink-0 text-xs text-muted-foreground">{value}</code>
    </div>
  )
}
