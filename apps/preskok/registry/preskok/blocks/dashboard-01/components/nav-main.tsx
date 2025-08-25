"use client"

import { LucideIcon, PlusIcon } from "lucide-react"

import {
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  return (
    <SidebarSectionGroup>
      <SidebarSection className="flex flex-col gap-2">
        <SidebarItem>
          <PlusIcon className="size-4" />
          <SidebarLabel>Quick Create</SidebarLabel>
        </SidebarItem>
        {items.map((item) => (
          <SidebarItem key={item.title}>
            <SidebarLink>
              {item.icon && <item.icon className="size-4" />}
              <SidebarLabel>{item.title}</SidebarLabel>
            </SidebarLink>
          </SidebarItem>
        ))}
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
