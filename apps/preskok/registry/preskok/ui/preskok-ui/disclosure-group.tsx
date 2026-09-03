"use client"

import { use } from "react"
import { twJoin, twMerge } from "cn"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type {
  ButtonProps,
  DisclosureGroupProps,
  DisclosurePanelProps,
  DisclosureProps,
} from "react-aria-components/DisclosureGroup"
import {
  Button,
  DisclosureStateContext,
  Heading,
  Disclosure as PrimitiveDisclosure,
  DisclosureGroup as PrimitiveDisclosureGroup,
  DisclosurePanel as PrimitiveDisclosurePanel,
} from "react-aria-components/DisclosureGroup"

import { cx } from "@/registry/preskok/lib/primitive"

const DisclosureGroup = ({ className, ...props }: DisclosureGroupProps) => {
  return (
    <PrimitiveDisclosureGroup
      className={cx(
        [
          "[--disclosure-gutter-x:--spacing(4)]",
          "[--disclosure-radius:var(--radius-lg)]",
          "[--disclosure-collapsed-border:var(--color-border)]",
          "[--disclosure-expanded-border:var(--color-muted-foreground)]/30",
          "[--disclosure-collapsed-background:var(--color-background)]",
          "[--disclosure-collapsed-foreground:var(--color-muted-foreground)]",
          "[--disclosure-expanded-background:var(--color-secondary)]/20",
          "[--disclosure-expanded-foreground:var(--color-foreground)]",
          "flex flex-col gap-y-2",
        ],
        className
      )}
      {...props}
    />
  )
}

const Disclosure = ({ className, ...props }: DisclosureProps) => {
  return (
    <PrimitiveDisclosure
      className={composeRenderProps(
        className,
        (className, { isExpanded, isFocusVisibleWithin }) =>
          twMerge(
            "group/disclosure-item w-full rounded-(--disclosure-radius,--spacing(0)) bg-(--disclosure-collapsed-background,transparent) inset-ring inset-ring-(--disclosure-collapsed-border,transparent) duration-200",
            (isExpanded || isFocusVisibleWithin) &&
              "bg-(--disclosure-expanded-background) inset-ring-(--disclosure-expanded-border,transparent)",
            "has-data-hovered:bg-(--disclosure-expanded-background) has-data-hovered:inset-ring-(--disclosure-expanded-border,transparent)",
            className
          )
      )}
      {...props}
    />
  )
}

interface DisclosureTriggerProps extends ButtonProps {
  ref?: React.Ref<HTMLButtonElement>
}

const DisclosureTrigger = ({
  ref,
  className,
  ...props
}: DisclosureTriggerProps) => {
  const state = use(DisclosureStateContext)!
  return (
    <Heading>
      <Button
        {...props}
        ref={ref}
        slot="trigger"
        className={cx(
          [
            "outline-hidden [--width:--spacing(2.5)]",
            "relative isolate flex w-full cursor-default items-center justify-between px-(--disclosure-gutter-x,--spacing(0)) py-[calc(var(--disclosure-gutter-x,--spacing(0))-(--spacing(1)))] text-left text-sm/6 font-medium",
            "**:data-[slot=icon]:shrink-0 [&_[data-slot='icon']:not([class*='size-'])]:size-5 sm:[&_[data-slot='icon']:not([class*='size-'])]:size-4",
            "disabled:opacity-50",
            state.isExpanded
              ? "rounded-t-(--disclosure-radius) rounded-b-none text-(--disclosure-expanded-foreground)"
              : "rounded-(--disclosure-radius) text-(--disclosure-collapsed-foreground) hover:text-(--disclosure-expanded-foreground)",
          ],
          className
        )}
      >
        {(values) => (
          <>
            {typeof props.children === "function"
              ? props.children(values)
              : props.children}
            <span
              data-slot="disclosure-indicator"
              className="pointer-events-none relative -mr-[calc(var(--disclosure-gutter-x,--spacing(0))-(--spacing(3)))] ml-(--disclosure-gutter-x,--spacing(0)) flex size-6 items-center justify-center"
            >
              <span
                className={twJoin([
                  "absolute h-[1.5px] w-(--width) origin-center bg-current transition-transform duration-300",
                  state.isExpanded ? "rotate-0" : "rotate-90",
                ])}
              />
              <span className="absolute h-[1.5px] w-(--width) origin-center bg-current transition-transform duration-300" />
            </span>
          </>
        )}
      </Button>
    </Heading>
  )
}

const DisclosurePanel = ({ className, ...props }: DisclosurePanelProps) => {
  return (
    <PrimitiveDisclosurePanel
      data-slot="disclosure-panel"
      className={cx(
        "h-(--disclosure-panel-height) overflow-clip text-sm/6 transition-[height] duration-200",
        className
      )}
    >
      <div
        data-slot="disclosure-panel-content"
        className="justify-start self-stretch px-(--disclosure-gutter-x,--spacing(0)) pt-2 pb-(--disclosure-gutter-x,--spacing(0)) text-pretty text-(--disclosure-collapsed-foreground)"
      >
        {props.children}
      </div>
    </PrimitiveDisclosurePanel>
  )
}

export { Disclosure, DisclosureGroup, DisclosurePanel, DisclosureTrigger }
