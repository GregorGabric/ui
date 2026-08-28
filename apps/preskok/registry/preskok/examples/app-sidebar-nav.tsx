"use client"

import {
  Command,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react"

import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import {
  Breadcrumbs,
  BreadcrumbsItem,
} from "@/registry/preskok/ui/preskok-ui/breadcrumbs"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import { SidebarTrigger } from "@/registry/preskok/ui/preskok-ui/sidebar"

export default function AppSidebarNav() {
  return (
    <nav className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl">
      <SidebarTrigger className="-ml-1" />
      <Breadcrumbs className="hidden md:flex">
        <BreadcrumbsItem href="/navigation/sidebar">Dashboard</BreadcrumbsItem>
        <BreadcrumbsItem>Newsletter</BreadcrumbsItem>
      </Breadcrumbs>
      <UserMenu />
    </nav>
  )
}

function UserMenu() {
  return (
    <Menu>
      <MenuTrigger className="ml-auto" aria-label="Open profile menu">
        <Avatar isSquare initials="MC" alt="Maya Chen" />
      </MenuTrigger>
      <MenuContent popover={{ placement: "bottom end" }} className="min-w-64">
        <MenuItem href="#dashboard">
          <LayoutDashboardIcon data-slot="icon" />
          <MenuLabel>Dashboard</MenuLabel>
        </MenuItem>
        <MenuItem href="#settings">
          <SettingsIcon data-slot="icon" />
          <MenuLabel>Settings</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem>
          <Command data-slot="icon" />
          <MenuLabel>Command Menu</MenuLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem href="#logout">
          <LogOutIcon data-slot="icon" />
          <MenuLabel>Log out</MenuLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
