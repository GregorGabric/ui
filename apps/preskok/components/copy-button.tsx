"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon } from "lucide-react"

import type { Event } from "@/lib/events"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Tooltip,
  TooltipContent,
} from "@/registry/preskok/ui/preskok-ui/tooltip"

export function copyToClipboardWithMeta(value: string, event?: Event) {
  void navigator.clipboard.writeText(value)
  if (event) {
    trackEvent(event)
  }
}

export function CopyButton({
  value,
  className,
  intent = "plain",
  event,
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string
  src?: string
  event?: Event["name"]
}) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [])

  return (
    <Tooltip>
      <Button
        data-slot="copy-button"
        size="sq-sm"
        intent={intent}
        className={cn(
          "bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
          className
        )}
        onPress={() => {
          copyToClipboardWithMeta(
            value,
            event
              ? {
                  name: event,
                  properties: {
                    code: value,
                  },
                }
              : undefined
          )
          setHasCopied(true)
        }}
        {...props}
      >
        <span className="sr-only">Copy</span>
        {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
      </Button>
      <TooltipContent>
        {hasCopied ? "Copied" : "Copy to Clipboard"}
      </TooltipContent>
    </Tooltip>
  )
}
