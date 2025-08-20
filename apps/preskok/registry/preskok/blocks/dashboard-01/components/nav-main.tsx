"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/registry/preskok/ui/button"
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
    icon?: Icon
  }[]
}) {
  return (
    <SidebarSectionGroup>
      <SidebarSection className="flex flex-col gap-2">
        <SidebarItem>
          <SidebarLink className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
            <IconCirclePlusFilled />
            <SidebarLabel>Quick Create</SidebarLabel>
          </SidebarLink>
          <Button
            size="icon"
            className="size-8 group-data-[collapsible=icon]:opacity-0"
            variant="outline"
          >
            <IconMail />
            <span className="sr-only">Inbox</span>
          </Button>
        </SidebarItem>
        {items.map((item) => (
          <SidebarItem key={item.title}>
            <SidebarLink>
              {item.icon && <item.icon />}
              <SidebarLabel>{item.title}</SidebarLabel>
            </SidebarLink>
          </SidebarItem>
        ))}
      </SidebarSection>
    </SidebarSectionGroup>
  )
}
