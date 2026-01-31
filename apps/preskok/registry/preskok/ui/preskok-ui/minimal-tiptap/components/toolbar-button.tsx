import * as React from "react"

import { cn } from "@/registry/preskok/lib/utils"
import { Toggle } from "@/registry/preskok/ui/preskok-ui/toggle"
import {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
} from "@/registry/preskok/ui/preskok-ui/tooltip"

interface ToolbarButtonProps extends React.ComponentProps<typeof Toggle> {
  tooltip?: string
  tooltipOptions?: TooltipContentProps
  isActive?: boolean
}

export const ToolbarButton = ({
  children,
  tooltip,
  className,
  tooltipOptions,
  isActive,
  ...props
}: ToolbarButtonProps) => {
  const toggleRef = React.useRef<HTMLButtonElement>(null)

  const toggleButton = (
    <Toggle
      ref={toggleRef}
      className={cn({ "bg-muted/90": isActive }, className, "*:flex-1")}
      {...props}
    >
      {children}
    </Toggle>
  )

  if (!tooltip) {
    return toggleButton
  }

  return (
    <Tooltip>
      {toggleButton}
      <TooltipContent {...tooltipOptions}>
        <div className="flex flex-col items-center text-center">{tooltip}</div>
      </TooltipContent>
    </Tooltip>
  )
}

ToolbarButton.displayName = "ToolbarButton"
