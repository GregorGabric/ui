"use client"

import { useState } from "react"
import type React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import type { Key } from "react-aria-components/Select"
import { parseColor } from "react-stately/Color"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { ColorPicker } from "@/registry/preskok/ui/preskok-ui/color-picker"
import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
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
  type ThemeRadius,
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
    <div className="grid gap-6">
      <section className="grid gap-4" aria-labelledby="appearance-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 id="appearance-heading" className="text-sm font-medium">
              Appearance
            </h3>
            <p className="text-sm text-muted-foreground">
              Set the source colors for each mode.
            </p>
          </div>
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
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <ThemeColorControl
            label="Brand"
            description="Anchors solid actions and the accent scale."
            value={values.accent}
            onChange={(value) => updateAppearanceColor("accent", value)}
          />
          <ThemeColorControl
            label="Gray"
            description="Tints text, borders, controls, and panels."
            value={values.gray}
            isDisabled={selectedColors.grayMode === "auto"}
            onChange={(value) => updateAppearanceColor("gray", value)}
          />
          <ThemeColorControl
            label="Canvas"
            description="The page background for this appearance."
            value={values.background}
            onChange={(value) => updateAppearanceColor("background", value)}
          />
        </div>

        <Switch
          isSelected={selectedColors.grayMode === "auto"}
          onChange={setGrayMode}
        >
          <Label>Tint gray from the brand color</Label>
          <Description>
            Keeps neutral ramps coordinated. Turn off to choose gray manually.
          </Description>
        </Switch>
      </section>

      <div className="grid gap-5 border-t pt-5 sm:grid-cols-2">
        <div className="grid content-start gap-1.5">
          <Label elementType="span">Panel background</Label>
          <ToggleGroup
            aria-label="Panel background"
            size="sm"
            selectedKeys={new Set([selectedColors.panelBackground])}
            onSelectionChange={(keys) => {
              const key = [...keys][0]
              if (key === "solid" || key === "translucent") {
                setSelectedColors((previous) => ({
                  ...previous,
                  panelBackground: key,
                }))
              }
            }}
          >
            <ToggleGroupItem id="solid">Solid</ToggleGroupItem>
            <ToggleGroupItem id="translucent">Translucent</ToggleGroupItem>
          </ToggleGroup>
          <p className="text-sm text-muted-foreground">
            Controls cards, navigation, and raised surfaces.
          </p>
        </div>

        <div className="grid content-start gap-1.5">
          <Label elementType="span">Corner radius</Label>
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
          <p className="text-sm text-muted-foreground">
            Generates the full radius scale in code and Figma.
          </p>
        </div>
      </div>
    </div>
  )
}

function ThemeColorControl({
  label,
  description,
  value,
  isDisabled,
  onChange,
}: {
  label: string
  description: string
  value: string
  isDisabled?: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="grid content-start gap-1.5 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <code className="text-xs text-muted-foreground">{value}</code>
      </div>
      <ColorPicker
        aria-label={`${label} color`}
        className="w-full [&_button]:w-full [&_button]:justify-start [&>div]:w-full"
        label={`Change ${label.toLowerCase()}`}
        value={parseColor(value)}
        isDisabled={isDisabled}
        eyeDropper
        onChange={(color) => onChange(color.toString("hex"))}
      />
      <p className="text-xs/5 text-muted-foreground">{description}</p>
    </div>
  )
}
