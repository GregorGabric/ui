"use client"

import {
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PieChartIcon,
  SendIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

const projects = [
  {
    name: "Design Engineering",
    url: "#",
    icon: FrameIcon,
    badge: "24",
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChartIcon,
    badge: "12",
  },
  {
    name: "Travel",
    url: "#",
    icon: MapIcon,
    badge: "3",
  },
  {
    name: "Support",
    url: "#",
    icon: LifeBuoyIcon,
    badge: "21",
  },
  {
    name: "Feedback",
    url: "#",
    icon: SendIcon,
    badge: "8",
  },
]

export default function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarSectionGroup>
            <SidebarSection>
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="group/menu-item hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative flex items-center gap-2 rounded-md p-2"
                >
                  <a
                    href={project.url}
                    className="flex flex-1 items-center gap-2"
                  >
                    <project.icon />
                    <span>{project.name}</span>
                  </a>
                  <span className="bg-primary/10 text-primary flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums">
                    {project.badge}
                  </span>
                </div>
              ))}
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
