"use client"

import { createContext, use } from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import {
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from "react-aria-components/ToggleButtonGroup"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"

import { cx } from "@/registry/preskok/lib/primitive"

type ToggleSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "sq-xs"
  | "sq-sm"
  | "sq-md"
  | "sq-lg"

interface ToggleGroupContextValue extends Pick<
  ToggleButtonGroupProps,
  "selectionMode" | "orientation"
> {
  size?: ToggleSize
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: "md",
  selectionMode: "single",
  orientation: "horizontal",
})

const useToggleGroupContext = () => use(ToggleGroupContext)

interface ToggleGroupProps extends ToggleButtonGroupProps {
  size?: ToggleSize
  isCircle?: boolean
}

const ToggleGroup = ({
  size = "md",
  orientation = "horizontal",
  selectionMode = "single",
  isCircle,
  className,
  ...props
}: ToggleGroupProps) => {
  return (
    <ToggleGroupContext value={{ size, selectionMode, orientation }}>
      <ToggleButtonGroup
        data-slot="control"
        selectionMode={selectionMode}
        className={cx(
          [
            "[--toggle-group-radius:var(--radius-lg)] [--toggle-gutter:--spacing(0.5)]",
            "[--toggle-foreground:var(--color-foreground)] [--toggle-selected-background:var(--color-accent)] [--toggle-selected-foreground:var(--color-accent-foreground)]",
            "[--toggle-focused-background:var(--color-accent)] [--toggle-focused-foreground:var(--color-accent-foreground)]",
            "[--toggle-hover-background:var(--toggle-focused-background)]/70 [--toggle-hover-foreground:var(--toggle-focused-foreground)]",
            "inset-ring-border inline-flex overflow-hidden p-(--toggle-gutter) inset-ring",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            "gap-(--toggle-gutter)",
            isCircle ? "rounded-full" : "rounded-(--toggle-group-radius)",
            isCircle && "*:data-[slot=toggle-group-item]:rounded-full",
          ],
          className
        )}
        {...props}
      />
    </ToggleGroupContext>
  )
}

interface ToggleGroupItemProps extends ToggleButtonProps {
  size?: ToggleSize
}

const toggleGroupItemStyles = tv({
  base: [
    "relative isolate",
    "inline-flex flex-row items-center font-medium text-(--toggle-foreground) outline-hidden",
    "inset-ring inset-ring-transparent",
    "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center",
    "[&_svg.lucide]:-mx-0.5 [&_svg.lucide]:shrink-0 [&_svg.lucide]:self-center",
    "[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:shrink-0",
  ],
  variants: {
    orientation: {
      horizontal: "justify-center",
      vertical: "justify-start",
    },
    selectionMode: {
      single: "rounded-[calc(var(--toggle-group-radius)-var(--toggle-gutter))]",
      multiple:
        "rounded-[calc(var(--toggle-group-radius)-var(--toggle-gutter))]",
    },
    size: {
      xs: [
        "min-h-8 gap-x-1.5 px-1.5 py-1 text-sm sm:min-h-7 sm:px-1 sm:py-1 sm:text-xs/4",
        "*:data-[slot=icon]:-mx-px *:data-[slot=icon]:size-3.5 sm:*:data-[slot=icon]:size-3",
        "[&_svg.lucide]:-mx-px [&_svg.lucide]:size-3.5 sm:[&_svg.lucide]:size-3",
        "*:data-[slot=loader]:-mx-px *:data-[slot=loader]:size-3.5 sm:*:data-[slot=loader]:size-3",
      ],
      sm: [
        "min-h-9 gap-x-1.5 px-2 py-1 sm:min-h-8 sm:px-1.5 sm:py-1 sm:text-sm/5",
        "*:data-[slot=icon]:size-4.5 sm:*:data-[slot=icon]:size-4",
        "[&_svg.lucide]:size-4.5 sm:[&_svg.lucide]:size-4",
        "*:data-[slot=loader]:size-4.5 sm:*:data-[slot=loader]:size-4",
      ],
      md: [
        "min-h-10 gap-x-2 px-2.5 py-1.5 sm:min-h-9 sm:px-2 sm:py-1 sm:text-sm/6",
        "*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4",
        "[&_svg.lucide]:size-5 sm:[&_svg.lucide]:size-4",
        "*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4",
      ],
      lg: [
        "min-h-11 gap-x-2 px-3 py-2 sm:min-h-10 sm:px-2.5 sm:py-1.5 sm:text-sm/6",
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
  },
  compoundVariants: [],
})

const ToggleGroupItem = ({ className, ...props }: ToggleGroupItemProps) => {
  const { size, selectionMode, orientation } = useToggleGroupContext()

  return (
    <ToggleButton
      data-slot="toggle-group-item"
      className={composeRenderProps(className, (className, renderProps) =>
        twMerge(
          toggleGroupItemStyles({
            ...renderProps,
            size,
            orientation,
            selectionMode,
            className,
          })
        )
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
export type { ToggleGroupItemProps, ToggleGroupProps }
