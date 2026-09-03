"use client"

import { twMerge } from "cn"
import {
  Separator as Divider,
  type SeparatorProps,
} from "react-aria-components/Separator"

const Separator = ({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) => {
  return (
    <Divider
      {...props}
      className={twMerge(
        "bg-border shrink-0 forced-colors:bg-[ButtonBorder]",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  )
}

export { Separator }
export type { SeparatorProps }
