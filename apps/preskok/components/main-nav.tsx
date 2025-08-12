"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: Array<{ href: string; label: string }>
}) {
  const pathname = usePathname()

  return (
    <nav className={cn("items-center gap-0.5", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            pathname === item.href && "text-primary",
            buttonStyles({ intent: "plain", size: "sm" })
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
