"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function NavHeader() {
  const pathname = usePathname()
  const items = [
    { href: "/", label: "Home" },
    { href: "/forms", label: "Forms" },
  ]

  return (
    <nav className="hidden items-center gap-2 sm:flex">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          data-active={pathname === item.href}
          className={cn(
            "text-muted-foreground hover:text-foreground data-[active=true]:text-foreground rounded-md px-2 py-1 text-sm font-medium transition-colors"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
