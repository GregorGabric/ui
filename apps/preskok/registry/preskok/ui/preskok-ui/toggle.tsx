"use client"

import { twMerge } from "cn"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type { ToggleButtonProps } from "react-aria-components/ToggleButton"
import { ToggleButton } from "react-aria-components/ToggleButton"
import { tv, type VariantProps } from "tailwind-variants"

const toggleStyles = tv({
  base: [
    "[--toggle-foreground:var(--color-foreground)] [--toggle-selected-background:var(--color-accent)] [--toggle-selected-foreground:var(--color-accent-foreground)]",
    "[--toggle-focused-background:var(--color-accent)] [--toggle-focused-foreground:var(--color-accent-foreground)]",
    "[--toggle-hover-background:var(--toggle-focused-background)]/70 [--toggle-hover-foreground:var(--toggle-focused-foreground)]",
    "relative isolate",
    "inline-flex items-center justify-center font-medium text-(--toggle-foreground) outline-hidden",
    "inset-ring inset-ring-transparent",
    "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center",
    "[&_svg.lucide]:-mx-0.5 [&_svg.lucide]:shrink-0 [&_svg.lucide]:self-center",
    "*:data-[slot=loader]:-mx-0.5 *:data-[slot=loader]:shrink-0 *:data-[slot=loader]:self-center",
    "[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:shrink-0",
  ],
  variants: {
    size: {
      xs: [
        "gap-x-1 px-1.5 py-1 text-sm sm:px-1 sm:py-1 sm:text-xs/4",
        "*:data-[slot=icon]:size-3.5 sm:*:data-[slot=icon]:size-3",
        "[&_svg.lucide]:size-3.5 sm:[&_svg.lucide]:size-3",
        "*:data-[slot=loader]:size-3.5 sm:*:data-[slot=loader]:size-3",
      ],
      sm: [
        "gap-x-1.5 px-2 py-1 sm:px-1.5 sm:py-1 sm:text-sm/5",
        "*:data-[slot=icon]:size-4.5 sm:*:data-[slot=icon]:size-4",
        "[&_svg.lucide]:size-4.5 sm:[&_svg.lucide]:size-4",
        "*:data-[slot=loader]:size-4.5 sm:*:data-[slot=loader]:size-4",
      ],
      md: [
        "gap-x-2 px-2.5 py-1.5 sm:px-2 sm:py-1 sm:text-sm/6",
        "*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4",
        "[&_svg.lucide]:size-5 sm:[&_svg.lucide]:size-4",
        "*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4",
      ],
      lg: [
        "gap-x-2 px-3 py-2 sm:px-2.5 sm:py-1.5 sm:text-sm/6",
        "*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4.5",
        "[&_svg.lucide]:size-5 sm:[&_svg.lucide]:size-4.5",
        "*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4.5",
      ],
      "sq-xs":
        "touch-target size-8 *:data-[slot=icon]:size-3.5 *:data-[slot=loader]:size-3.5 sm:size-7 sm:*:data-[slot=icon]:size-3 sm:*:data-[slot=loader]:size-3 [&_svg.lucide]:size-3.5 sm:[&_svg.lucide]:size-3",
      "sq-sm":
        "touch-target size-9 *:data-[slot=icon]:size-4.5 *:data-[slot=loader]:size-4.5 sm:size-8 sm:*:data-[slot=icon]:size-4 sm:*:data-[slot=loader]:size-4 [&_svg.lucide]:size-4.5 sm:[&_svg.lucide]:size-4",
      "sq-md":
        "touch-target size-10 *:data-[slot=icon]:size-5 *:data-[slot=loader]:size-5 sm:size-9 sm:*:data-[slot=icon]:size-4.5 sm:*:data-[slot=loader]:size-4.5 [&_svg.lucide]:size-5 sm:[&_svg.lucide]:size-4.5",
      "sq-lg":
        "touch-target size-11 *:data-[slot=icon]:size-5 *:data-[slot=loader]:size-5 sm:size-10 sm:*:data-[slot=icon]:size-5 sm:*:data-[slot=loader]:size-5 [&_svg.lucide]:size-5 sm:[&_svg.lucide]:size-5",
    },
    isCircle: {
      true: "rounded-full",
      false: "rounded-lg",
    },
    isSelected: {
      true: "bg-(--toggle-selected-background) text-(--toggle-selected-foreground) hover:bg-(--toggle-selected-background)/90",
    },
    isFocused: {
      true: "not-selected:bg-(--toggle-focused-background) not-selected:text-(--toggle-focused-foreground)",
    },
    isHovered: {
      true: "enabled:not-selected:bg-(--toggle-hover-background) enabled:not-selected:text-(--toggle-hover-foreground)",
    },
    isDisabled: {
      true: "opacity-50 forced-colors:text-[GrayText]",
    },
  },
  defaultVariants: {
    size: "md",
    isCircle: false,
  },
  compoundVariants: [
    {
      size: ["xs", "sq-xs"],
      className:
        "rounded-md *:data-[slot=icon]:size-3.5 sm:*:data-[slot=icon]:size-3 [&_svg.lucide]:size-3.5 sm:[&_svg.lucide]:size-3",
    },
  ],
})

interface ToggleProps
  extends ToggleButtonProps, VariantProps<typeof toggleStyles> {
  ref?: React.Ref<HTMLButtonElement>
}
const Toggle = ({ className, size, isCircle, ref, ...props }: ToggleProps) => {
  return (
    <ToggleButton
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) =>
        twMerge(
          toggleStyles({
            ...renderProps,
            size,
            isCircle,
            className,
          })
        )
      )}
      {...props}
    />
  )
}
export { Toggle }
export type { ToggleProps }
