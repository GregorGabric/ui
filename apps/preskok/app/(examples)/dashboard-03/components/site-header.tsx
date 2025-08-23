"use client"

import { Fragment, useMemo } from "react"
import { usePathname } from "next/navigation"
import { SidebarIcon } from "lucide-react"

import { ThemeSelector } from "@/components/theme-selector"
import { SearchForm } from "@/registry/preskok/blocks/sidebar-16/components/search-form"
import {
  Breadcrumbs,
  BreadcrumbsItem,
} from "@/registry/preskok/ui/preskok-ui/breadcrumbs"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"
import { useSidebar } from "@/registry/preskok/ui/sidebar"
import { ModeToggle } from "@/app/(examples)/dashboard-03/components/mode-toggle"
import { NavUser } from "@/app/(examples)/dashboard-03/components/nav-user"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()

  // Faux breadcrumbs for demo.
  const breadcrumbs = useMemo(() => {
    return pathname
      .split("/")
      .filter((path) => path !== "")
      .map((path, index, array) => ({
        label: path,
        href: `/${array.slice(0, index + 1).join("/")}`,
      }))
  }, [pathname])

  return (
    <header
      data-slot="site-header"
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b"
    >
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2 pr-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="gap-2.5 has-[>svg]:px-2"
        >
          <SidebarIcon />
          <span className="truncate font-medium">Acme Inc</span>
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumbs className="hidden sm:block">
          <BreadcrumbsItem href="/" className="capitalize">
            Home
          </BreadcrumbsItem>
          {breadcrumbs.map((breadcrumb, index) => (
            <BreadcrumbsItem
              key={index}
              href={index === breadcrumbs.length - 1 ? undefined : breadcrumb.href}
              className="capitalize"
            >
              {breadcrumb.label}
            </BreadcrumbsItem>
          ))}
        </Breadcrumbs>
        <div className="ml-auto flex items-center gap-2">
          <SearchForm className="w-fullsm:w-auto" />
          <ThemeSelector />
          <ModeToggle />
          <NavUser
            user={{
              name: "shadcn",
              email: "m@example.com",
              avatar: "/avatars/shadcn.jpg",
            }}
          />
        </div>
      </div>
    </header>
  )
}
