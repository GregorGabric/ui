"use client"

import * as React from "react"
import { buttonVariants } from "fumadocs-ui/components/ui/button"

import { cn } from "@/lib/utils"

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <div
      data-state={isOpened ? "open" : "closed"}
      className={cn(
        "group/collapsible not-prose relative mt-4 mb-6",
        className
      )}
      {...props}
    >
      <div className="absolute top-1.5 right-9 z-10 flex items-center">
        <button
          type="button"
          aria-expanded={isOpened}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-fd-muted-foreground h-7 rounded-md px-2"
          )}
          onClick={() => setIsOpened((open) => !open)}
        >
          {isOpened ? "Collapse" : "Expand"}
        </button>
        <div className="bg-fd-border mx-1.5 h-4 w-px" />
      </div>
      <div
        className="relative overflow-hidden data-[state=closed]:max-h-64 data-[state=closed]:[mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)] data-[state=closed]:[content-visibility:auto] [&>figure]:mt-0 [&>figure]:max-w-full"
        data-state={isOpened ? "open" : "closed"}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="to-fd-card pointer-events-none absolute inset-x-px bottom-12 h-12 bg-gradient-to-b from-transparent group-data-[state=open]/collapsible:hidden"
      />
      <button
        type="button"
        className="bg-fd-card text-fd-muted-foreground hover:text-fd-foreground absolute inset-x-px bottom-px flex h-12 items-center justify-center rounded-b-xl border-t text-sm font-medium transition-colors group-data-[state=open]/collapsible:hidden"
        onClick={() => setIsOpened((open) => !open)}
      >
        Expand
      </button>
    </div>
  )
}
