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
  MenuHeader,
  MenuItem,
  MenuLabel,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import {
  SidebarNav,
  SidebarTrigger,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export default function AppSidebarNav() {
  return (
    <SidebarNav>
      <span className="flex items-center gap-x-4">
        <SidebarTrigger className="-ml-2" />
        <Breadcrumbs className="hidden md:flex">
          <BreadcrumbsItem href="/blocks/sidebar/sidebar-01">
            Dashboard
          </BreadcrumbsItem>
          <BreadcrumbsItem>Newsletter</BreadcrumbsItem>
        </Breadcrumbs>
      </span>
      <UserMenu />
    </SidebarNav>
  )
}

function UserMenu() {
  return (
    <Menu>
      <MenuTrigger className="ml-auto md:hidden" aria-label="Open Menu">
        <Avatar
          isSquare
          alt="kurt cobain"
          src="https://intentui.com/images/avatar/cobain.jpg"
        />
      </MenuTrigger>
      <MenuContent popover={{ placement: "bottom end" }} className="min-w-64">
        <MenuSection>
          <MenuHeader separator>
            <span className="block">Kurt Cobain</span>
            <span className="text-muted-foreground font-normal">@cobain</span>
          </MenuHeader>
        </MenuSection>
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
        <MenuItem href="#contact-s">
          <MenuLabel>Contact Support</MenuLabel>
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
