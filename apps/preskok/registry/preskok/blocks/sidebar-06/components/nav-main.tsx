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
  useSidebar,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarSectionGroup>
      <SidebarSection>
        <SidebarDisclosureGroup>
          {items.map((item) => (
            <SidebarDisclosure key={item.title} defaultExpanded={item.isActive}>
              <SidebarDisclosureTrigger>
                <SidebarLabel>{item.title}</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                {item.items?.map((sub) => (
                  <SidebarItem key={sub.title}>
                    <SidebarLink href={sub.url}>{sub.title}</SidebarLink>
                  </SidebarItem>
                ))}
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
          ))}
        </SidebarDisclosureGroup>
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
