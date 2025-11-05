"use client"

import {
  CommandIcon,
  HeadphonesIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldIcon,
} from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"

export function UserMenu() {
  return (
    <Menu>
      <MenuTrigger aria-label="Open Menu">
        <Avatar
          alt="cobain"
          size="md"
          isSquare
          src="https://intentui.com/images/avatar/cobain.jpg"
        />
      </MenuTrigger>
      <MenuContent placement="bottom right" className="min-w-60 sm:min-w-56">
        <MenuSection>
          <MenuHeader separator>
            <span className="block">Kurt Cobain</span>
            <span className="text-muted-foreground font-normal">@cobain</span>
          </MenuHeader>
        </MenuSection>

        <MenuItem href="#dashboard">
          <LayoutDashboardIcon data-slot="icon" />
          Dashboard
        </MenuItem>
        <MenuItem href="#settings">
          <SettingsIcon data-slot="icon" />
          Settings
        </MenuItem>
        <MenuItem href="#security">
          <ShieldIcon data-slot="icon" />
          Security
        </MenuItem>
        <MenuSeparator />
        <MenuItem>
          <CommandIcon data-slot="icon" />
          Command Menu
        </MenuItem>

        <MenuItem href="#contact">
          <HeadphonesIcon data-slot="icon" />
          Customer Support
        </MenuItem>
        <MenuSeparator />
        <MenuItem href="#logout">
          <LogOutIcon data-slot="icon" />
          Log out
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
