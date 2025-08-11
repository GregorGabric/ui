"use client"

import {
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "react-aria-components"
import { twJoin, twMerge } from "tailwind-merge"

import { composeTailwindRenderProps } from "@/registry/preskok/lib/primitive"

import { Label } from "./field"

interface SwitchProps extends SwitchPrimitiveProps {
  ref?: React.RefObject<HTMLLabelElement>
}
const Switch = ({ children, className, ref, ...props }: SwitchProps) => {
  return (
    <SwitchPrimitive
      data-slot="switch"
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(
        className,
        twJoin(
          "[--switch-background-ring:var(--color-primary)]/90 [--switch-background:var(--color-primary)] dark:[--switch-background-ring:transparent]",
          "[--switch-ring:var(--color-primary)]/90 [--switch-shadow:color-mix(in_oklab,var(--color-primary)_30%,var(--color-secondary-foreground)_70%))]/20 [--switch:white]",
          "group relative grid cursor-default grid-cols-[1fr_auto] gap-x-6 gap-y-1 disabled:opacity-50 *:data-[slot=indicator]:col-start-2 *:data-[slot=indicator]:self-start *:data-[slot=label]:col-start-1 *:data-[slot=label]:row-start-1 has-[[slot=description]]:**:data-[slot=label]:font-medium sm:*:data-[slot=indicator]:mt-0.5 *:[[slot=description]]:col-start-1 *:[[slot=description]]:row-start-2"
        )
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {(values) => (
        <>
          <span
            data-slot="indicator"
            className={twMerge(
              "relative isolate inline-flex h-6 w-10 cursor-default rounded-full p-[3px] sm:h-5 sm:w-8",
              "transition duration-200 ease-in-out",
              "inset-ring-foreground/5 bg-secondary dark:inset-ring-foreground/15 inset-ring",
              "forced-colors:outline forced-colors:[--switch-background:Highlight]",
              values.isHovered &&
                "inset-ring-foreground/15 dark:inset-ring-foreground/25",
              values.isFocusVisible &&
                "inset-ring-ring/70 selected:inset-ring-ring/30 bg-ring/20 ring-ring/20 dark:inset-ring-ring/70 ring-2",
              values.isSelected &&
                "bg-(--switch-background) inset-ring-(--switch-shadow) dark:inset-ring-(--switch-background-ring)",
              values.isDisabled &&
                "dark:group-disabled:bg-foreground/15 dark:group-disabled:group-selected:inset-ring-foreground/15 dark:group-disabled:group-selected:bg-(--switch-background)"
            )}
          >
            <span
              aria-hidden="true"
              className={twJoin(
                "ring-foreground/5 pointer-events-none relative inline-block size-4.5 translate-x-0 rounded-full border border-transparent bg-white shadow-sm ring transition duration-200 ease-in-out sm:size-3.5",
                values.isSelected &&
                  "group-disabled:ring-secondary-foreground/5 translate-x-4 bg-(--switch) shadow-(--switch-shadow) ring-(--switch-ring) group-disabled:shadow-sm sm:translate-x-3"
              )}
            />
          </span>
          {typeof children === "function" ? (
            children(values)
          ) : typeof children === "string" ? (
            <Label>{children}</Label>
          ) : (
            children
          )}
        </>
      )}
    </SwitchPrimitive>
  )
}

export { Switch }
export type { SwitchProps }
