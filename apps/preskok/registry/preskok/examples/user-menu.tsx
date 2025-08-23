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
import { Menu } from "@/registry/preskok/ui/preskok-ui/menu"

export function UserMenu() {
  return (
    <Menu>
      <Menu.Trigger aria-label="Open Menu">
        <Avatar
          alt="cobain"
          size="md"
          isSquare
          src="https://intentui.com/images/avatar/cobain.jpg"
        />
      </Menu.Trigger>
      <Menu.Content placement="bottom right" className="min-w-60 sm:min-w-56">
        <Menu.Section>
          <Menu.Header separator>
            <span className="block">Kurt Cobain</span>
            <span className="text-muted-fg font-normal">@cobain</span>
          </Menu.Header>
        </Menu.Section>

        <Menu.Item href="#dashboard">
          <LayoutDashboardIcon />
          Dashboard
        </Menu.Item>
        <Menu.Item href="#settings">
          <SettingsIcon />
          Settings
        </Menu.Item>
        <Menu.Item href="#security">
          <ShieldIcon />
          Security
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item>
          <CommandIcon />
          Command Menu
        </Menu.Item>

        <Menu.Item href="#contact">
          <HeadphonesIcon />
          Customer Support
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item href="#logout">
          <LogOutIcon />
          Log out
        </Menu.Item>
      </Menu.Content>
    </Menu>
  )
}
