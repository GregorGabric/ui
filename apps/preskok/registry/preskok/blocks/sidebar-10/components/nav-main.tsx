"use client"

import { type LucideIcon } from "lucide-react"

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
    icon: LucideIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarSectionGroup>
      <SidebarSection>
        {items.map((item) => (
          <SidebarItem key={item.title} isCurrent={item.isActive}>
            <SidebarLink href={item.url}>
              <item.icon />
              <SidebarLabel>{item.title}</SidebarLabel>
            </SidebarLink>
          </SidebarItem>
        ))}
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
