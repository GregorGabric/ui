"use client"

import * as React from "react"
import { IconMenu3 } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Popover,
  PopoverContent,
} from "@/registry/preskok/ui/preskok-ui/popover"

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    for (const id of itemIds ?? []) {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => {
      for (const id of itemIds ?? []) {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      }
    }
  }, [itemIds])

  return activeId
}

export function DocsTableOfContents({
  toc,
  variant = "list",
  className,
}: {
  toc: {
    title?: React.ReactNode
    url: string
    depth: number
  }[]
  variant?: "dropdown" | "list"
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const itemIds = toc.map((item) => item.url.replace("#", ""))
  const activeHeading = useActiveItem(itemIds)

  if (!toc?.length) {
    return null
  }

  if (variant === "dropdown") {
    return (
      <Popover isOpen={open} onOpenChange={setOpen}>
        <Button
          intent="outline"
          size="sm"
          className={cn("h-8 md:h-7", className)}
        >
          <IconMenu3 /> On This Page
        </Button>
        <PopoverContent
          placement="bottom start"
          className="no-scrollbar flex max-h-[70svh] flex-col gap-1 overflow-y-auto p-1"
        >
          {toc.map((item) => (
            <a
              key={item.url}
              onClick={() => {
                setOpen(false)
              }}
              data-depth={item.depth}
              className="hover:bg-secondary text-muted-foreground hover:text-foreground rounded-md px-2 py-1.5 text-sm data-[depth=3]:pl-6 data-[depth=4]:pl-8"
              href={item.url}
            >
              {item.title}
            </a>
          ))}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2 p-4 pt-0 text-sm", className)}>
      <p className="text-muted-foreground bg-background sticky top-0 h-6 text-xs">
        On This Page
      </p>
      {toc.map((item) => (
        <a
          key={item.url}
          href={item.url}
          className="text-muted-foreground hover:text-foreground data-[active=true]:text-foreground text-[0.8rem] no-underline transition-colors data-[depth=3]:pl-4 data-[depth=4]:pl-6"
          data-active={item.url === `#${activeHeading}`}
          data-depth={item.depth}
        >
          {item.title}
        </a>
      ))}
    </div>
  )
}
