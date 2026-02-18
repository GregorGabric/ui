"use client"

import { useCallback } from "react"
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
  const normalizedPathname = normalizePath(pathname)
  const currentItemRef = useCallback((node: HTMLAnchorElement | null) => {
    if (!node) {
      return
    }

    node.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "nearest",
    })
  }, [])

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] border-r-0 bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <div className="via-border absolute top-12 right-2 bottom-0 hidden h-full w-px bg-gradient-to-b from-transparent to-transparent lg:flex" />
      <SidebarContent className="no-scrollbar px-2 pb-20">
        <div className="h-(--top-spacing) shrink-0" />
        <SidebarSectionGroup>
          {tree.children.map((group) => {
            const label = typeof group.name === "string" ? group.name : ""
            return (
              <SidebarSection key={group.$id} label={label}>
                {group.type === "folder" &&
                  group.children.map((page) => {
                    if (page.type !== "page") {
                      return null
                    }

                    const isCurrent =
                      normalizePath(page.url) === normalizedPathname

                    return (
                      <SidebarItem
                        key={page.url}
                        href={page.url}
                        isCurrent={isCurrent}
                        ref={isCurrent ? currentItemRef : undefined}
                        className="relative h-[30px] w-fit scroll-mb-16 text-[0.8rem] font-medium"
                      >
                        <SidebarLabel>{page.name}</SidebarLabel>
                      </SidebarItem>
                    )
                  })}
              </SidebarSection>
            )
          })}
        </SidebarSectionGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function normalizePath(path: string) {
  if (path === "/") {
    return path
  }

  return path.replace(/\/+$/, "")
}
