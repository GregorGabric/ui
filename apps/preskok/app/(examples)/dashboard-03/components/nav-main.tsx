"use client"

import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import {
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
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
    disabled?: boolean
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarSection label="Dashboard">
      <SidebarDisclosureGroup>
        {items.map((item) =>
          item.items?.length ? (
            <SidebarDisclosure key={item.title} defaultExpanded={item.isActive}>
              <SidebarDisclosureTrigger>
                <item.icon />
                <SidebarLabel>{item.title}</SidebarLabel>
              </SidebarDisclosureTrigger>
              <SidebarDisclosurePanel>
                {item.items?.map((subItem) => (
                  <SidebarItem key={subItem.title} href={subItem.url}>
                    <SidebarLabel>{subItem.title}</SidebarLabel>
                  </SidebarItem>
                ))}
              </SidebarDisclosurePanel>
            </SidebarDisclosure>
          ) : (
            <SidebarItem
              key={item.title}
              href={item.disabled ? undefined : item.url}
              isCurrent={pathname === item.url}
              tooltip={item.title}
            >
              <item.icon />
              <SidebarLabel>{item.title}</SidebarLabel>
            </SidebarItem>
          )
        )}
      </SidebarDisclosureGroup>
    </SidebarSection>
  )
}
