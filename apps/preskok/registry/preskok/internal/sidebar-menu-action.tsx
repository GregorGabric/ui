"use client"

import {
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  SendIcon,
} from "lucide-react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
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
                  <Menu>
                    <MenuTrigger className="hover:bg-sidebar-accent flex h-5 w-5 items-center justify-center rounded-md">
                      <MoreHorizontalIcon />
                      <span className="sr-only">More</span>
                    </MenuTrigger>
                    <MenuContent placement="right">
                      <MenuItem id="edit-project">
                        <span>Edit Project</span>
                      </MenuItem>
                      <MenuItem id="delete-project">
                        <span>Delete Project</span>
                      </MenuItem>
                    </MenuContent>
                  </Menu>
                </div>
              ))}
            </SidebarSection>
          </SidebarSectionGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
