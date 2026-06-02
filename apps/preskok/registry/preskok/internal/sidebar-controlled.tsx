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

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

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
    <SidebarProvider isOpen={open} onOpenChange={setOpen}>
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
            onPress={() => setOpen((open) => !open)}
            size="sm"
            intent="plain"
          >
            {open ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
            <span>{open ? "Close" : "Open"} Sidebar</span>
          </Button>
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
