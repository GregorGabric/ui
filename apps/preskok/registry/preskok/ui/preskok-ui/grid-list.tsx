"use client"

import type React from "react"
import { GripVerticalIcon } from "lucide-react"
import type { GridListItemProps, GridListProps } from "react-aria-components"
import {
  Button,
  composeRenderProps,
  GridListItem as GridListItemPrimitive,
  GridList as GridListPrimitive,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"

import { composeTailwindRenderProps } from "@/registry/preskok/lib/primitive"

import { Checkbox } from "./checkbox"

const GridList = <T extends object>({
  children,
  className,
  ...props
}: GridListProps<T>) => (
  <GridListPrimitive
    className={composeTailwindRenderProps(
      className,
      "*:data-drop-target:border-accent relative max-h-96 scroll-py-1 overflow-y-auto overscroll-contain rounded-lg border *:data-drop-target:border"
    )}
    {...props}
  >
    {children}
  </GridListPrimitive>
)

const itemStyles = tv({
  base: "group -mb-px -outline-offset-2 relative flex cursor-default select-none gap-3 border-y px-3 py-2 text-fg outline-hidden transition [--selected-item-hovered:--color-muted]/70 [--selected-item:var(--color-muted)]/80 first:rounded-t-md first:border-t-0 last:mb-0 last:rounded-b-md last:border-b-0 sm:text-sm",
  variants: {
    isHovered: { true: "bg-subtle" },
    isSelected: {
      true: "z-20 border-border/50 bg-(--selected-item) hover:bg-(--selected-item-hovered)",
    },
    isFocused: {
      true: "outline-hidden",
    },
    isFocusVisible: {
      true: "bg-(--selected-item) selected:bg-(--selected-item) outline-hidden ring-1 ring-ring hover:bg-(--selected-item-hovered)",
    },
    isDisabled: {
      true: "text-muted-fg/70 forced-colors:text-[GrayText]",
    },
  },
})

const GridListItem = ({ className, children, ...props }: GridListItemProps) => {
  const textValue =
    props.textValue || (typeof children === "string" ? children : undefined)
  return (
    <GridListItemPrimitive
      textValue={textValue}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        itemStyles({ ...renderProps, className })
      )}
    >
      {(values) => (
        <>
          {values.allowsDragging && (
            <Button
              slot="drag"
              className="*:data-[slot=icon]:text-muted-fg cursor-grab data-dragging:cursor-grabbing"
            >
              <GripVerticalIcon />
            </Button>
          )}

          <span
            aria-hidden
            className="bg-primary group-selected:block absolute inset-y-0 left-0 hidden h-full w-0.5"
          />
          {values.selectionMode === "multiple" &&
            values.selectionBehavior === "toggle" && (
              <Checkbox className="-mr-2" slot="selection" />
            )}
          {typeof children === "function" ? children(values) : children}
        </>
      )}
    </GridListItemPrimitive>
  )
}

const GridEmptyState = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div ref={ref} className={twMerge("p-6", className)} {...props} />
)

GridList.Item = GridListItem
GridList.EmptyState = GridEmptyState

export { GridList, GridListItem }
export type { GridListItemProps, GridListProps }
