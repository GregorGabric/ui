"use client"

import { useThemeConfig } from "@/components/active-theme"
import { cn } from "@/lib/utils"
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSection,
  SelectSeparator,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"

const DEFAULT_THEMES = [
  {
    name: "Default",
    value: "default",
  },
  {
    name: "Scaled",
    value: "scaled",
  },
  {
    name: "Mono",
    value: "mono",
  },
]

const COLOR_THEMES = [
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
  {
    name: "Rose",
    value: "rose",
  },
  {
    name: "Purple",
    value: "purple",
  },
  {
    name: "Orange",
    value: "orange",
  },
  {
    name: "Teal",
    value: "teal",
  },
]

export function ThemeSelector({ className }: React.ComponentProps<"div">) {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select
        selectedKey={activeTheme}
        onSelectionChange={(key) => setActiveTheme(String(key))}
      >
        <SelectTrigger
          id="theme-selector"
          className="justify-start border-secondary bg-secondary text-secondary-foreground shadow-none *:data-[slot=select-value]:w-12"
          prefix={<span className="font-medium">Theme:</span>}
        />
        <SelectContent popover={{ placement: "bottom end" }}>
          <SelectSection>
            {DEFAULT_THEMES.map((theme) => (
              <SelectItem
                key={theme.name}
                id={theme.value}
                className="selected:opacity-50"
              >
                <SelectLabel>{theme.name}</SelectLabel>
              </SelectItem>
            ))}
          </SelectSection>
          <SelectSeparator />
          <SelectSection>
            <SelectLabel>Colors</SelectLabel>
            {COLOR_THEMES.map((theme) => (
              <SelectItem
                key={theme.name}
                id={theme.value}
                className="selected:opacity-50"
              >
                <SelectLabel>{theme.name}</SelectLabel>
              </SelectItem>
            ))}
          </SelectSection>
        </SelectContent>
      </Select>
    </div>
  )
}
