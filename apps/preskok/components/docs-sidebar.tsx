"use client"

import { usePathname } from "next/navigation"

import type { source } from "@/lib/source"
import {
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSectionGroup,
} from "@/registry/preskok/ui/preskok-ui/sidebar"

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] border-r-0 bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <div className="via-border absolute top-12 right-2 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent to-transparent lg:flex" />
      <SidebarContent className="no-scrollbar px-2 pb-12">
        <div className="h-(--top-spacing) shrink-0" />
        <SidebarSectionGroup>
          {tree.children.map((group) => {
            const label = typeof group.name === "string" ? group.name : ""
            return (
              <SidebarSection key={group.$id} label={label}>
                {group.type === "folder" &&
                  group.children.map((page) =>
                    page.type === "page" ? (
                      <SidebarItem
                        key={page.url}
                        href={page.url}
                        isCurrent={page.url === pathname}
                        className="relative h-[30px] w-fit text-[0.8rem] font-medium"
                      >
                        <SidebarLabel>{page.name}</SidebarLabel>
                      </SidebarItem>
                    ) : null
                  )}
              </SidebarSection>
            )
          })}
        </SidebarSectionGroup>
      </SidebarContent>
    </Sidebar>
  )
}
