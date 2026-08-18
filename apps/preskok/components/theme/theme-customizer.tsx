"use client"

import type React from "react"
import type { Key } from "react-aria-components/Select"
import { twMerge } from "tailwind-merge"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"

import { neutralColors } from "./colors"
import colors from "./colors.json"
import { THEME_RADIUS_OPTIONS, type ThemeSelection } from "./themes"

interface ColorSelectProps extends React.ComponentProps<typeof Select> {
  selectedKey: string
  onSelectionChange: (key: Key | Key[] | null) => void
  label: string
  className?: string
  placeholder: string
  filterKeys?: Array<string>
}

const ColorSelect = ({
  className,
  selectedKey,
  onSelectionChange,
  filterKeys,
  label,
  ...props
}: ColorSelectProps) => {
  const filteredKeys = filterKeys
    ? Object.keys(colors).filter((key) => filterKeys.includes(key))
    : Object.keys(colors)

  return (
    <Select
      {...props}
      aria-label={label}
      value={selectedKey}
      onChange={onSelectionChange}
    >
      <SelectTrigger className="capitalize" />
      <SelectContent>
        {filteredKeys.map((key) => (
          <SelectItem
            className="capitalize hover:**:data-[slot=icon]:inset-ring-foreground/30"
            textValue={key}
            key={key}
            id={key}
          >
            <div
              data-slot="icon"
              className={twMerge(
                "size-4 rounded-sm bg-(--swatch-color) inset-ring inset-ring-(--inset-ring-color)/15 dark:bg-(--swatch-color-dark) dark:inset-ring-(--inset-ring-color)/5",
                className
              )}
              aria-hidden
              style={
                {
                  "--inset-ring-color":
                    colors[key as keyof typeof colors]["200"],
                  "--swatch-color": neutralColors.includes(key)
                    ? colors[key as keyof typeof colors]["700"]
                    : colors[key as keyof typeof colors]["500"],
                  "--swatch-color-dark": neutralColors.includes(key)
                    ? colors[key as keyof typeof colors]["900"]
                    : colors[key as keyof typeof colors]["500"],
                } as React.CSSProperties
              }
            />
            <SelectLabel>{key}</SelectLabel>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type ThemeCustomizerProps = {
  selectedColors: ThemeSelection
  setSelectedColors: React.Dispatch<React.SetStateAction<ThemeSelection>>
}

export function ThemeCustomizer({
  selectedColors,
  setSelectedColors,
}: ThemeCustomizerProps) {
  const handleSelectionChange =
    (type: keyof typeof selectedColors) => (key: Key | null) => {
      if (!key) {
        return
      }

      const value = key.toString()

      if (type === "radius") {
        const radius = THEME_RADIUS_OPTIONS.find((option) => option === value)
        if (radius) {
          setSelectedColors((previous) => ({ ...previous, radius }))
        }
        return
      }

      if (type === "primary") {
        setSelectedColors((previous) => ({
          ...previous,
          primary: value,
          accent: value,
        }))
        return
      }

      setSelectedColors((previous) => ({ ...previous, [type]: value }))
    }

  const getFilteredColors = (excludedGray: string) => {
    return Object.keys(colors).filter(
      (color) => !neutralColors.includes(color) || color === excludedGray
    )
  }

  const filteredPrimaryColors = getFilteredColors(selectedColors.gray)
  const filteredAccentColors = getFilteredColors(selectedColors.gray)
  return (
    <div className="grid max-w-xl gap-4">
      <div className="grid grid-cols-2 gap-x-3 gap-y-6">
        <ColorSelect
          selectedKey={selectedColors.gray}
          onSelectionChange={(key) => handleSelectionChange("gray")(key as Key)}
          label="Gray Color"
          placeholder="Select gray color"
          filterKeys={neutralColors}
        />
        <ColorSelect
          selectedKey={selectedColors.primary}
          onSelectionChange={(key) =>
            handleSelectionChange("primary")(key as Key)
          }
          label="Primary Color"
          placeholder="Select primary color"
          filterKeys={filteredPrimaryColors}
        />
        <ColorSelect
          selectedKey={selectedColors.accent}
          onSelectionChange={(key) =>
            handleSelectionChange("accent")(key as Key)
          }
          label="Accent Color"
          placeholder="Select accent color"
          filterKeys={filteredAccentColors}
        />
        <Select
          aria-label="Corner radius"
          value={selectedColors.radius}
          onChange={handleSelectionChange("radius")}
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
  )
}
