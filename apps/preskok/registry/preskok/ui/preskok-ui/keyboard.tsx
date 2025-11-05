"use client"

import { Keyboard as KeyboardPrimitive } from "react-aria-components"
import { twMerge } from "tailwind-merge"

interface KeyboardProps
  extends React.ComponentProps<typeof KeyboardPrimitive> {}

const Keyboard = ({ className, ...props }: KeyboardProps) => {
  return (
    <KeyboardPrimitive
      data-slot="keyboard"
      className={twMerge(
        "group-hover:text-foreground group-focus:text-foreground forced-colors:group-focus:text-[HighlightText hidden font-mono text-[0.80rem]/6 text-current/60 group-focus:opacity-90 group-disabled:opacity-50 lg:inline",
        className
      )}
      {...props}
    />
  )
}

export { Keyboard }
export type { KeyboardProps }
