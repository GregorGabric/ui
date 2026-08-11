"use client"

import { ChevronDownIcon } from "lucide-react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export default function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Menu>
            <MenuTrigger className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm font-medium group-open/menu:bg-sidebar-accent group-open/menu:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              Select Workspace
              <ChevronDownIcon className="ml-auto" />
            </MenuTrigger>
            <MenuContent className="min-w-(--trigger-width)">
              <MenuItem id="acme-inc">
                <span>Acme Inc</span>
              </MenuItem>
              <MenuItem id="acme-corp">
                <span>Acme Corp.</span>
              </MenuItem>
            </MenuContent>
          </Menu>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between px-4">
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
