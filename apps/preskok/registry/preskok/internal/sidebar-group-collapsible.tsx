"use client"

import { LifeBuoyIcon, SendIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarDisclosure,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarProvider,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export default function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarSectionGroup>
            <SidebarSection>
              <SidebarDisclosure defaultExpanded>
                <SidebarDisclosureTrigger className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  Help
                </SidebarDisclosureTrigger>
                <SidebarDisclosurePanel>
                  <div className="mt-2 ml-4 space-y-1 border-l border-sidebar-border pl-2">
                    <div className="flex items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      <LifeBuoyIcon />
                      Support
                    </div>
                    <div className="flex items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      <SendIcon />
                      Feedback
                    </div>
                  </div>
                </SidebarDisclosurePanel>
              </SidebarDisclosure>
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
