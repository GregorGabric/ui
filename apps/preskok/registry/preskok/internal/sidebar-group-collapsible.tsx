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
                <SidebarDisclosureTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-md p-2 text-left text-sm font-medium">
                  Help
                </SidebarDisclosureTrigger>
                <SidebarDisclosurePanel>
                  <div className="border-sidebar-border mt-2 ml-4 space-y-1 border-l pl-2">
                    <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2">
                      <LifeBuoyIcon />
                      Support
                    </div>
                    <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2">
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
