"use client"

import { ChevronUpIcon } from "lucide-react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export default function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter>
          <Menu>
            <MenuTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-open/menu:bg-sidebar-accent group-open/menu:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm font-medium">
              Username
              <ChevronUpIcon className="ml-auto" />
            </MenuTrigger>
            <MenuContent placement="top" className="min-w-(--trigger-width)">
              <MenuItem id="account">
                <span>Account</span>
              </MenuItem>
              <MenuItem id="billing">
                <span>Billing</span>
              </MenuItem>
              <MenuItem id="sign-out">
                <span>Sign out</span>
              </MenuItem>
            </MenuContent>
          </Menu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between px-4">
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
