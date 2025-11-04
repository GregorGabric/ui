"use client"

import type React from "react"
import type { Key } from "react-aria-components"
import { twMerge } from "tailwind-merge"

import { useTheme } from "@/components/theme-provider"
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
  ...props
}: ColorSelectProps) => {
  const filteredKeys = filterKeys
    ? Object.keys(colors).filter((key) => filterKeys.includes(key))
    : Object.keys(colors)
  const { theme } = useTheme()
  return (
    <Select {...props} value={selectedKey} onChange={onSelectionChange}>
      <SelectTrigger className="capitalize" />
      <SelectContent>
        {filteredKeys.map((key) => (
          <SelectItem
            className="hover:**:data-[slot=icon]:inset-ring-foreground/30 capitalize"
            textValue={key}
            key={key}
            id={key}
          >
            <div
              data-slot="icon"
              className={twMerge(
                "size-4 rounded-sm inset-ring inset-ring-(--inset-ring-color)/15 dark:inset-ring-(--inset-ring-color)/5",
                className
              )}
              aria-hidden
              style={
                {
                  "--inset-ring-color":
                    colors[key as keyof typeof colors]["200"],
                  backgroundColor: neutralColors.includes(key)
                    ? colors[key as keyof typeof colors][
                        theme === "dark" ? "900" : "700"
                      ]
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

type SelectedColors = {
  primary: string
  gray: string
  accent: string
  radius: string
}

type ThemeCustomizerProps = {
  selectedColors: SelectedColors
  setSelectedColors: React.Dispatch<React.SetStateAction<SelectedColors>>
}

export function ThemeCustomizer({
  selectedColors,
  setSelectedColors,
}: ThemeCustomizerProps) {
  const handleSelectionChange =
    (type: keyof typeof selectedColors) => (key: Key | null) => {
      if (type === "primary") {
        if (key) {
          setSelectedColors((prev) => ({ ...prev, accent: key.toString() }))
        }
      }
      setSelectedColors((prev) => ({ ...prev, [type]: key?.toString() }))
    }

  const getFilteredColors = (excludedGray: string) => {
    return Object.keys(colors).filter(
      (color) => !neutralColors.includes(color) || color === excludedGray
    )
  }

  const filteredPrimaryColors = getFilteredColors(selectedColors.gray)
  const filteredAccentColors = getFilteredColors(selectedColors.gray)
  const filteredRadius = [
    "0rem",
    "0.125rem",
    "0.25rem",
    "0.375rem",
    "0.5rem",
    "0.6rem",
    "0.75rem",
    "1rem",
    "1.5rem",
  ]
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
          value={selectedColors.radius}
          onChange={handleSelectionChange("radius")}
        >
          <SelectTrigger className="capitalize" />
          <SelectContent>
            {filteredRadius.map((radius) => (
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
