"use client"

import { TextArea, type TextAreaProps } from "react-aria-components"
import { twJoin } from "tailwind-merge"

import { composeTailwindRenderProps } from "@/registry/preskok/lib/primitive"

const Textarea = ({ className, ...props }: TextAreaProps) => {
  return (
    <span data-slot="control" className="relative block w-full">
      <TextArea
        {...props}
        className={composeTailwindRenderProps(
          className,
          twJoin([
            "relative block field-sizing-content min-h-16 w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
            "text-foreground placeholder:text-muted-foreground text-base/6 sm:text-sm/6",
            "border-input enabled:hover:border-muted-foreground/30 border",
            "focus:border-ring/70 focus:bg-primary/5 focus:ring-ring/20 focus:enabled:hover:border-ring/80 focus:ring-3 focus:outline-hidden",
            "invalid:border-danger/70 invalid:bg-danger/5 focus:invalid:border-danger/70 focus:invalid:bg-danger/5 focus:invalid:ring-danger/20 invalid:enabled:hover:border-danger/80 invalid:focus:enabled:hover:border-danger/80",
            "disabled:bg-muted disabled:opacity-50 forced-colors:in-disabled:text-[GrayText]",
            "in-disabled:bg-muted in-disabled:opacity-50 forced-colors:in-disabled:text-[GrayText]",
            "dark:scheme-dark",
          ])
        )}
      />
    </span>
  )
}

export { Textarea }
