"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <div
      data-state={isOpened ? "open" : "closed"}
      className={cn("group/collapsible relative md:-mx-4", className)}
      {...props}
    >
      <div className="absolute top-1.5 right-9 z-10 flex items-center">
        <Button
          intent="plain"
          size="sm"
          className="text-muted-foreground h-7 rounded-md px-2"
          onPress={() => setIsOpened((open) => !open)}
        >
          {isOpened ? "Collapse" : "Expand"}
        </Button>
        <Separator orientation="vertical" className="mx-1.5 !h-4" />
      </div>
      <div
        className="relative mt-6 overflow-hidden data-[state=closed]:max-h-64 [&>figure]:mt-0 [&>figure]:md:!mx-0"
        data-state={isOpened ? "open" : "closed"}
      >
        {children}
      </div>
      <button
        type="button"
        className="from-code/70 to-code text-muted-foreground absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b text-sm group-data-[state=open]/collapsible:hidden"
        onClick={() => setIsOpened((open) => !open)}
      >
        {isOpened ? "Collapse" : "Expand"}
      </button>
    </div>
  )
}
