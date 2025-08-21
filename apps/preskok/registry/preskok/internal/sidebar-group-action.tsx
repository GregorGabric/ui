"use client"

import { FrameIcon, MapIcon, PieChartIcon, PlusIcon } from "lucide-react"
import { toast, Toaster } from "sonner"

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
      <Toaster
        position="bottom-left"
        toastOptions={{
          className: "ml-[160px]",
        }}
      />
      <Sidebar>
        <SidebarContent>
          <SidebarSectionGroup>
            <SidebarSection>
              <button
                title="Add Project"
                onClick={() => toast("You clicked the group action!")}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2"
              >
                <PlusIcon /> <span className="sr-only">Add Project</span>
              </button>
              <a
                href="#"
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2"
              >
                <FrameIcon />
                <span>Design Engineering</span>
              </a>
              <a
                href="#"
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2"
              >
                <PieChartIcon />
                <span>Sales & Marketing</span>
              </a>
              <a
                href="#"
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2"
              >
                <MapIcon />
                <span>Travel</span>
              </a>
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
