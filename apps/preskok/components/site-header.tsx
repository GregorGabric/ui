import Link from "next/link"

import { CommandMenu } from "@/components/command-menu"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { siteConfig } from "@/lib/config"
import { source } from "@/lib/source"
import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"

export function SiteHeader() {
  const pageTree = source.pageTree

  return (
    <header className="sticky top-0 z-50 container w-full bg-background">
      <div className="3xl:fixed:px-0">
        <div className="flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4 3xl:fixed:container">
          <MobileNav
            tree={pageTree}
            items={siteConfig.navItems}
            className="flex lg:hidden"
          />

          <Link href="/" className="inline-flex items-center">
            <Icons.logo className="h-2 w-auto md:h-4" />
            <span className="sr-only">{siteConfig.name}</span>
          </Link>

          <MainNav items={siteConfig.navItems} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <CommandMenu tree={pageTree} />
            </div>

            <Separator orientation="vertical" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
