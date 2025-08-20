"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2,
} from "lucide-react"

import { Button } from "@/registry/preskok/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/preskok/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

const data = [
  [
    {
      label: "Customize Page",
      icon: Settings2,
    },
    {
      label: "Turn into wiki",
      icon: FileText,
    },
  ],
  [
    {
      label: "Copy Link",
      icon: Link,
    },
    {
      label: "Duplicate",
      icon: Copy,
    },
    {
      label: "Move to",
      icon: CornerUpRight,
    },
    {
      label: "Move to Trash",
      icon: Trash2,
    },
  ],
  [
    {
      label: "Undo",
      icon: CornerUpLeft,
    },
    {
      label: "View analytics",
      icon: LineChart,
    },
    {
      label: "Version History",
      icon: GalleryVerticalEnd,
    },
    {
      label: "Show delete pages",
      icon: Trash,
    },
    {
      label: "Notifications",
      icon: Bell,
    },
  ],
  [
    {
      label: "Import",
      icon: ArrowUp,
    },
    {
      label: "Export",
      icon: ArrowDown,
    },
  ],
]

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-muted-foreground hidden font-medium md:inline-block">
        Edit Oct 08
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-accent h-7 w-7"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              <SidebarSectionGroup>
                {data.map((group, index) => (
                  <SidebarSection
                    key={index}
                    className="border-b last:border-none"
                  >
                    {group.map((item, i) => (
                      <SidebarItem key={i}>
                        <SidebarLink>
                          <item.icon />
                          <SidebarLabel>{item.label}</SidebarLabel>
                        </SidebarLink>
                      </SidebarItem>
                    ))}
                  </SidebarSection>
                ))}
              </SidebarSectionGroup>
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
