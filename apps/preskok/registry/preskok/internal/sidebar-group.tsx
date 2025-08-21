"use client"

import { LifeBuoyIcon, SendIcon } from "lucide-react"

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
              <div className="flex items-center gap-2 rounded-md p-2">
                <LifeBuoyIcon />
                Support
              </div>
              <div className="flex items-center gap-2 rounded-md p-2">
                <SendIcon />
                Feedback
              </div>
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
