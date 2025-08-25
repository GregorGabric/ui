"use client"

import { LucideIcon, MailIcon, PlusIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
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
        <SidebarItem className={"grid grid-cols-[auto_1fr_auto] gap-3 p-2"}>
          <PlusIcon />
          <SidebarLabel>Quick Create</SidebarLabel>
          <Button size="sq-sm" intent="plain">
            <MailIcon />
            <span className="sr-only">Inbox</span>
          </Button>
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
