"use client"

import { PreskokIcon } from "@/registry/preskok/ui/preskok-ui/preskok-icon"

export default function PreskokIconPreskokDemo() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <PreskokIcon className="size-8" />
        <span className="text-muted-foreground text-xs">Small (32px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <PreskokIcon className="size-12" />
        <span className="text-muted-foreground text-xs">Medium (48px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <PreskokIcon className="size-16" />
        <span className="text-muted-foreground text-xs">Large (64px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <PreskokIcon className="size-24" />
        <span className="text-muted-foreground text-xs">
          Extra Large (96px)
        </span>
      </div>
    </div>
  )
}
