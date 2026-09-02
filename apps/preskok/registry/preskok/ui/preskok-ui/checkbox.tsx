"use client"

import { twMerge } from "cn"
import { CheckIcon, MinusIcon } from "lucide-react"
import type {
  CheckboxGroupProps,
  CheckboxProps,
} from "react-aria-components/CheckboxGroup"
import {
  CheckboxGroup as CheckboxGroupPrimitive,
  Checkbox as CheckboxPrimitive,
} from "react-aria-components/CheckboxGroup"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { cx } from "@/registry/preskok/lib/primitive"

import { Label } from "./field"

export function CheckboxGroup({ className, ...props }: CheckboxGroupProps) {
  return (
    <CheckboxGroupPrimitive
      {...props}
      data-slot="control"
      className={cx(
        "space-y-3 has-[[slot=description]]:space-y-6 has-[[slot=description]]:**:data-[slot=label]:font-medium **:[[slot=description]]:block",
        className
      )}
    />
  )
}

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive
      data-slot="control"
      className={cx("group block disabled:opacity-50", className)}
      {...props}
    >
      {composeRenderProps(
        children,
        (
          children,
          { isSelected, isIndeterminate, isFocusVisible, isInvalid }
        ) => {
          const isStringChild = typeof children === "string"
          const indicator = isIndeterminate ? (
            <MinusIcon data-slot="check-indicator" />
          ) : isSelected ? (
            <CheckIcon data-slot="check-indicator" />
          ) : null

          const content = isStringChild ? (
            <CheckboxLabel>{children}</CheckboxLabel>
          ) : (
            children
          )

          return (
            <div
              className={twMerge(
                "flex items-center",
                "has-[*:nth-child(2)]:grid has-[*:nth-child(2)]:grid-cols-[1.125rem_1fr] has-[*:nth-child(2)]:gap-x-3 has-[*:nth-child(2)]:gap-y-1 has-[*:nth-child(2)]:sm:grid-cols-[1rem_1fr]",
                "*:data-[slot=indicator]:col-start-1 *:data-[slot=indicator]:row-start-1 *:data-[slot=indicator]:my-auto",
                "*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1",
                "*:[[slot=description]]:col-start-2 *:[[slot=description]]:row-start-2",
                "has-[[slot=description]]:**:data-[slot=label]:font-medium"
              )}
            >
              <span
                data-slot="indicator"
                className={twMerge([
                  "inset-ring-input text-background group-hover:inset-ring-muted-foreground/30 relative isolate flex shrink-0 items-center justify-center rounded inset-ring transition",
                  "sm:size-4 sm:*:data-[slot=check-indicator]:size-3.5",
                  "size-4.5 *:data-[slot=check-indicator]:size-4",
                  (isSelected || isIndeterminate) && [
                    "inset-ring-primary bg-primary text-primary-foreground",
                    "group-invalid:inset-ring-destructive/70 group-invalid:bg-destructive group-invalid:text-destructive-foreground dark:group-invalid:inset-ring-destructive/70",
                  ],
                  isFocusVisible && [
                    "inset-ring-primary ring-ring/20 ring-3",
                    "group-invalid:inset-ring-destructive/70 group-invalid:text-destructive-foreground group-invalid:ring-destructive/20",
                  ],
                  isInvalid &&
                    "inset-ring-destructive/70 text-destructive-foreground ring-destructive/20 group-hover:inset-ring-destructive/70",
                ])}
              >
                {indicator}
              </span>
              {content}
            </div>
          )
        }
      )}
    </CheckboxPrimitive>
  )
}

export function CheckboxLabel(props: React.ComponentProps<typeof Label>) {
  return <Label elementType="span" {...props} />
}
