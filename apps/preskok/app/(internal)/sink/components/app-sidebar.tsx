"use client"

import * as React from "react"
import Link from "next/link"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronRightIcon,
  Command,
  GalleryVerticalEnd,
  Search,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { Index } from "@/registry/__index__"
import { NavUser } from "@/registry/preskok/blocks/sidebar-07/components/nav-user"
import { TeamSwitcher } from "@/registry/preskok/blocks/sidebar-07/components/team-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/preskok/ui/collapsible"
import { Label } from "@/registry/preskok/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  components: Object.values(Index)
    .filter((item) => item.type === "registry:ui")
    .concat([
      {
        name: "combobox",
      },
    ])
    .sort((a, b) => a.name.localeCompare(b.name)),
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="dock" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <div className="hidden group-data-[sidebar-collapsible=dock]/sidebar-container:block">
          <form className="relative">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <input
              id="search"
              placeholder="Search the docs..."
              className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-8 w-full rounded-md px-3 py-2 pl-8 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          </form>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSectionGroup>
          <SidebarSection>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-md p-2">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-sidebar-border ml-4 border-l pl-2">
                    {item.items?.map((subItem) => (
                      <a
                        key={subItem.title}
                        href={subItem.url}
                        className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2 text-sm"
                      >
                        <span>{subItem.title}</span>
                      </a>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </SidebarSection>
        </SidebarSectionGroup>
        <SidebarSectionGroup>
          <SidebarSection>
            <div className="hidden group-data-[sidebar-collapsible=dock]/sidebar-container:block">
              {data.components.map((item) => (
                <Link
                  key={item.name}
                  href={`/sink#${item.name}`}
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md p-2"
                >
                  <span>{getComponentName(item.name)}</span>
                </Link>
              ))}
            </div>
          </SidebarSection>
        </SidebarSectionGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function getComponentName(name: string) {
  // convert kebab-case to title case
  return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}
