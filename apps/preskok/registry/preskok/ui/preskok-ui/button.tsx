"use client"

import React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import { tv, type VariantProps } from "tailwind-variants"

import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"

const buttonStyles = tv({
  base: [
    "[--btn-border:var(--color-foreground)]/15 [--btn-icon-active:var(--btn-foreground)] [--btn-outline:var(--btn-background)] [--btn-ring:var(--btn-background)]/20",
    "bg-(--btn-background) pressed:bg-(--btn-overlay) text-(--btn-foreground) outline-(--btn-outline) ring-(--btn-ring) hover:bg-(--btn-overlay) focus-visible:bg-(--btn-overlay)",
    "relative border border-(--btn-border) isolate inline-flex items-center justify-center font-medium",
    "focus:outline-0 focus-visible:outline focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-offset-3 focus-visible:ring-offset-background active:scale-[98%] transition-transform duration-150",
    "*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) pressed:*:data-[slot=icon]:text-(--btn-icon-active) focus-visible:*:data-[slot=icon]:text-(--btn-icon-active)/80 hover:*:data-[slot=icon]:text-(--btn-icon-active)/90 sm:*:data-[slot=icon]:my-1 forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]",
    "[&_svg.lucide]:-mx-0.5 [&_svg.lucide]:my-0.5 [&_svg.lucide]:shrink-0 [&_svg.lucide]:self-center [&_svg.lucide]:text-(--btn-icon) pressed:[&_svg.lucide]:text-(--btn-icon-active) focus-visible:[&_svg.lucide]:text-(--btn-icon-active)/80 hover:[&_svg.lucide]:text-(--btn-icon-active)/90 sm:[&_svg.lucide]:my-1",
    "*:data-[slot=loader]:-mx-0.5 *:data-[slot=loader]:my-0.5 *:data-[slot=loader]:shrink-0 *:data-[slot=loader]:self-center *:data-[slot=loader]:text-(--btn-icon) sm:*:data-[slot=loader]:my-1",
    "[&_svg:not([class*='size-'])]:size-4",
    "[&_svg]:shrink-0",
  ],
  variants: {
    intent: {
      primary:
        "[--btn-background:var(--color-primary)] [--btn-foreground:var(--color-primary-foreground)] [--btn-icon:color-mix(in_oklab,var(--primary-foreground)_60%,var(--primary))] [--btn-overlay:var(--color-primary)]/85",
      secondary:
        "[--btn-background:var(--color-secondary)] [--btn-foreground:var(--color-secondary-foreground)] [--btn-icon:var(--color-muted-foreground)] [--btn-outline:var(--color-secondary-foreground)] [--btn-overlay:var(--color-secondary)]/85 [--btn-ring:var(--color-muted-foreground)]/20",
      warning:
        "[--btn-background:var(--color-warning)] [--btn-foreground:var(--color-warning-foreground)] [--btn-icon:color-mix(in_oklab,var(--warning-foreground)_60%,var(--warning))] [--btn-overlay:var(--color-warning)]/85",
      danger:
        "[--btn-background:var(--color-destructive)] [--btn-foreground:var(--color-destructive-foreground)] [--btn-icon:color-mix(in_oklab,var(--destructive-foreground)_60%,var(--destructive))] [--btn-overlay:var(--color-destructive)]/85",
      outline:
        "border-border [--btn-background:transparent] [--btn-icon:var(--color-muted-foreground)] [--btn-outline:var(--color-ring)] [--btn-overlay:var(--color-muted)] [--btn-ring:var(--color-ring)]/20",
      plain:
        "border-transparent [--btn-background:transparent] [--btn-icon:var(--color-foreground)] [--btn-outline:var(--color-ring)] [--btn-overlay:var(--color-muted)] [--btn-ring:var(--color-ring)]/20",
    },
    size: {
      xs: [
        "gap-x-1 px-2.5 py-1.5 text-sm sm:px-2 sm:py-[--spacing(1.4)] sm:text-xs/4",
        "*:data-[slot=icon]:size-3.5 sm:*:data-[slot=icon]:size-3",
        "[&_svg.lucide]:size-3.5 sm:[&_svg.lucide]:size-3",
        "*:data-[slot=loader]:size-3.5 sm:*:data-[slot=loader]:size-3",
      ],
      sm: [
        "gap-x-1.5 px-3 py-2 sm:px-2.5 sm:py-1.5 sm:text-sm/5",
        "*:data-[slot=icon]:size-4.5 sm:*:data-[slot=icon]:size-4",
        "[&_svg.lucide]:size-4.5 sm:[&_svg.lucide]:size-4",
        "*:data-[slot=loader]:size-4.5 sm:*:data-[slot=loader]:size-4",
      ],
      md: [
        "gap-x-2 px-3.5 py-2 sm:px-3 sm:py-1.5 sm:text-sm/6",
        "*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4",
        "[&_svg.lucide]:size-5 sm:[&_svg.lucide]:size-4",
        "*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4",
      ],
      lg: [
        "gap-x-2 px-4 py-2.5 sm:px-3.5 sm:py-2 sm:text-sm/6",
        "*:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:size-4.5",
        "[&_svg.lucide]:size-5 sm:[&_svg.lucide]:size-4.5",
        "*:data-[slot=loader]:size-5 sm:*:data-[slot=loader]:size-4.5",
      ],
      "sq-xs":
        "size-8 *:data-[slot=icon]:size-3.5 [&_svg.lucide]:size-3.5 *:data-[slot=loader]:size-3.5 sm:size-7 sm:*:data-[slot=icon]:size-3 sm:[&_svg.lucide]:size-3 sm:*:data-[slot=loader]:size-3",
      "sq-sm":
        "size-9 *:data-[slot=icon]:size-4.5 [&_svg.lucide]:size-4.5 *:data-[slot=loader]:size-4.5 sm:size-8 sm:*:data-[slot=icon]:size-4 sm:[&_svg.lucide]:size-4 sm:*:data-[slot=loader]:size-4",
      "sq-md":
        "size-10 *:data-[slot=icon]:size-5 [&_svg.lucide]:size-5 *:data-[slot=loader]:size-5 sm:size-9 sm:*:data-[slot=icon]:size-4 sm:[&_svg.lucide]:size-4 sm:*:data-[slot=loader]:size-4",
      "sq-lg":
        "size-11 *:data-[slot=icon]:size-5 [&_svg.lucide]:size-5 *:data-[slot=loader]:size-5 sm:size-10 sm:*:data-[slot=icon]:size-4.5 sm:[&_svg.lucide]:size-4.5 sm:*:data-[slot=loader]:size-4.5",
    },

    isCircle: {
      true: "rounded-full",
      false: "rounded-lg",
    },
    isDisabled: {
      true: "opacity-50 forced-colors:text-[GrayText]",
    },
    isPending: {
      true: "opacity-50",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
    isCircle: false,
  },
  compoundVariants: [
    {
      size: ["xs", "sq-xs"],
      className:
        "rounded-md *:data-[slot=icon]:size-3.5 [&_svg.lucide]:size-3.5",
    },
  ],
})

interface ButtonProps
  extends ButtonPrimitiveProps, VariantProps<typeof buttonStyles> {
  ref?: React.Ref<HTMLButtonElement>
}

const Button = ({
  className,
  intent,
  size,
  isCircle,
  ref,
  ...props
}: ButtonProps) => {
  return (
    <ButtonPrimitive
      ref={ref}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        buttonStyles({
          ...renderProps,
          intent,
          size,
          isCircle,
          className,
        })
      )}
    >
      {(values) => (
        <>
          {values.isPending && typeof props.children !== "function" && (
            <Loader variant="spin" />
          )}
          {typeof props.children === "function"
            ? props.children(values)
            : props.children}
        </>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonStyles }
export type { ButtonProps }
