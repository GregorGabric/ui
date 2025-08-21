"use client"

import * as React from "react"
import {
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PieChartIcon,
  SendIcon,
} from "lucide-react"

import { Button } from "@/registry/preskok/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

// Note: legacy import retained intentionally for internal examples that include their own provider

const projects = [
  {
    name: "Design Engineering",
    url: "#",
    icon: FrameIcon,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChartIcon,
  },
  {
    name: "Travel",
    url: "#",
    icon: MapIcon,
  },
  {
    name: "Support",
    url: "#",
    icon: LifeBuoyIcon,
  },
  {
    name: "Feedback",
    url: "#",
    icon: SendIcon,
  },
]

export default function AppSidebar() {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar>
        <SidebarContent>
          <SidebarSectionGroup>
            <SidebarSection>
              {projects.map((project) => (
                <SidebarItem key={project.name} href={project.url}>
                  <project.icon />
                  <span>{project.name}</span>
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between px-4">
          <Button
            onClick={() => setOpen((open) => !open)}
            size="sm"
            variant="ghost"
          >
            {open ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
            <span>{open ? "Close" : "Open"} Sidebar</span>
          </Button>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
