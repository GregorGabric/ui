import React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    badge?: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarSectionGroup {...props}>
      <SidebarSection>
        {items.map((item) => (
          <SidebarItem key={item.title}>
            <SidebarLink href={item.url}>
              <item.icon />
              <SidebarLabel>{item.title}</SidebarLabel>
            </SidebarLink>
            {item.badge ? (
              <span className="text-muted-foreground ml-auto text-xs">
                {item.badge}
              </span>
            ) : null}
          </SidebarItem>
        ))}
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
