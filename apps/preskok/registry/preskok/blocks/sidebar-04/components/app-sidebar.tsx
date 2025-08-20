import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarHeader,
  SidebarItem,
  SidebarLink,
  SidebarSection,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar intent="float" {...props}>
      <SidebarHeader>
        <SidebarItem>
          <SidebarLink href="#">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">Documentation</span>
              <span>v1.0.0</span>
            </div>
          </SidebarLink>
        </SidebarItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSection>
          <SidebarDisclosureGroup>
            {data.navMain.map((section) => (
              <SidebarDisclosure key={section.title}>
                <SidebarDisclosureTrigger>
                  {section.title}
                </SidebarDisclosureTrigger>
                {section.items?.length ? (
                  <SidebarDisclosurePanel>
                    {section.items.map((link) => (
                      <SidebarItem key={link.title} isCurrent={!!link.isActive}>
                        <SidebarLink href={link.url}>{link.title}</SidebarLink>
                      </SidebarItem>
                    ))}
                  </SidebarDisclosurePanel>
                ) : null}
              </SidebarDisclosure>
            ))}
          </SidebarDisclosureGroup>
        </SidebarSection>
      </SidebarContent>
    </Sidebar>
  )
}
