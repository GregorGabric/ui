import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarSection>) {
  return (
    <SidebarSection {...props}>
      {items.map((item) => (
        <SidebarItem key={item.title} href={item.url}>
          <item.icon />
          <SidebarLabel>{item.title}</SidebarLabel>
        </SidebarItem>
      ))}
    </SidebarSection>
  )
}
