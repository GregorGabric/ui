"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
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
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarSectionGroup>
      <SidebarSection label="Platform">
        <SidebarDisclosureGroup>
          {items.map((item) => (
            <SidebarDisclosure key={item.title} defaultExpanded={item.isActive}>
              <SidebarDisclosureTrigger>
                <item.icon />
                <SidebarLabel>{item.title}</SidebarLabel>
              </SidebarDisclosureTrigger>
              {item.items?.length ? (
                <SidebarDisclosurePanel>
                  {item.items.map((sub) => (
                    <SidebarItem key={sub.title}>
                      <SidebarLink href={sub.url}>{sub.title}</SidebarLink>
                    </SidebarItem>
                  ))}
                </SidebarDisclosurePanel>
              ) : null}
            </SidebarDisclosure>
          ))}
        </SidebarDisclosureGroup>
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
