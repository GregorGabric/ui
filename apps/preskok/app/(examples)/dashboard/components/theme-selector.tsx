"use client"

import { useThemeConfig } from "@/components/active-theme"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Select } from "@/registry/preskok/ui/preskok-ui/select"

const DEFAULT_THEMES = [
  {
    name: "Default",
    value: "default",
  },
  {
    name: "Blue",
    value: "blue",
  },
  {
    name: "Green",
    value: "green",
  },
  {
    name: "Amber",
    value: "amber",
  },
]

const SCALED_THEMES = [
  {
    name: "Default",
    value: "default-scaled",
  },
  {
    name: "Blue",
    value: "blue-scaled",
  },
]

const MONO_THEMES = [
  {
    name: "Mono",
    value: "mono-scaled",
  },
]

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select
        selectedKey={activeTheme}
        onSelectionChange={(key) => {
          if (key && typeof key === "string") {
            setActiveTheme(key)
          }
        }}
      >
        <Select.Trigger
          id="theme-selector"
          className="justify-start *:data-[slot=select-value]:w-12"
        >
          <span className="text-muted-foreground hidden sm:block">
            Select a theme:
          </span>
          <span className="text-muted-foreground block sm:hidden">Theme</span>
        </Select.Trigger>
        <Select.List>
          <Select.Section>
            <Select.Label>Default</Select.Label>
            {DEFAULT_THEMES.map((theme) => (
              <Select.Option key={theme.name} id={theme.value}>
                {theme.name}
              </Select.Option>
            ))}
          </Select.Section>
          <Select.Separator />
          <Select.Section>
            <Select.Label>Scaled</Select.Label>
            {SCALED_THEMES.map((theme) => (
              <Select.Option key={theme.name} id={theme.value}>
                {theme.name}
              </Select.Option>
            ))}
          </Select.Section>
          <Select.Section>
            <Select.Label>Monospaced</Select.Label>
            {MONO_THEMES.map((theme) => (
              <Select.Option key={theme.name} id={theme.value}>
                {theme.name}
              </Select.Option>
            ))}
          </Select.Section>
        </Select.List>
      </Select>
    </div>
  )
}
