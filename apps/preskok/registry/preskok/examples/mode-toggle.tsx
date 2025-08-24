"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"

export default function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <Menu>
      <MenuTrigger>
        <Button intent="outline" size="sq-md" aria-label="Toggle theme">
          <SunIcon className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem onAction={() => setTheme("light")}>
          <SunIcon className="h-4 w-4" />
          Light
        </MenuItem>
        <MenuItem onAction={() => setTheme("dark")}>
          <MoonIcon className="h-4 w-4" />
          Dark
        </MenuItem>
        <MenuItem onAction={() => setTheme("system")}>
          <span className="flex h-4 w-4 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-current" />
          </span>
          System
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
