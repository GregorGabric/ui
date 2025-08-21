"use client"

import { ChevronDownIcon, LifeBuoyIcon, SendIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/preskok/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
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
              <Collapsible defaultOpen className="group/collapsible">
                <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-md p-2 text-left text-sm font-medium">
                  Help
                  <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
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
                </CollapsibleContent>
              </Collapsible>
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
