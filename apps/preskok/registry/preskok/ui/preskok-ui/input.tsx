"use client"

import { Group, type GroupProps } from "react-aria-components/Group"
import {
  Input as InputPrimitive,
  type InputProps as PrimitiveInputProps,
} from "react-aria-components/Input"
import { twMerge } from "tailwind-merge"

import { cx } from "@/registry/preskok/lib/primitive"
import {
  Button,
  type ButtonProps,
} from "@/registry/preskok/ui/preskok-ui/button"

interface InputProps extends PrimitiveInputProps {
  ref?: React.RefObject<HTMLInputElement>
}

export function Input({ className, ref, ...props }: InputProps) {
  return (
    <span data-slot="control" className="relative block w-full">
      <InputPrimitive
        ref={ref}
        className={cx(
          "relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
          "text-foreground placeholder:text-muted-foreground text-base/6 sm:text-sm/6",
          "border-input enabled:hover:border-muted-foreground/30 border",
          "focus:border-ring/70 focus:ring-ring/20 focus:enabled:hover:border-ring/80 focus:ring-3 focus:outline-hidden",
          "invalid:border-destructive/70 focus:invalid:border-destructive/70 focus:invalid:ring-destructive/20 invalid:enabled:hover:border-destructive/80 focus:invalid:enabled:hover:border-destructive/80",
          "[&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden",
          "disabled:bg-muted disabled:opacity-50 forced-colors:in-disabled:text-[GrayText]",
          "in-disabled:bg-muted in-disabled:opacity-50 forced-colors:in-disabled:text-[GrayText]",
          "dark:scheme-dark",
          className
        )}
        {...props}
      />
    </span>
  )
}

interface InputGroupProps extends Omit<GroupProps, "className"> {
  className?: string
}

export function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <Group
      data-slot="input-group"
      className={twMerge(
        "group/input-group border-input relative flex h-11 w-full min-w-0 items-center rounded-lg border transition-colors outline-none sm:h-9",
        "hover:border-muted-foreground/30",
        "has-[:disabled]:bg-muted has-[:disabled]:opacity-50",
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring/70 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/20 has-[[data-slot=input-group-control]:focus-visible]:ring-3",
        "has-[[data-slot][aria-invalid=true]]:border-destructive/70 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:ring-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col",
        "has-[>[data-align=block-end]]:[&_[data-slot=input-group-control]]:pt-3 has-[>[data-align=block-start]]:[&_[data-slot=input-group-control]]:pb-3",
        "has-[>[data-align=inline-end]]:[&_[data-slot=input-group-control]]:pr-1.5 has-[>[data-align=inline-start]]:[&_[data-slot=input-group-control]]:pl-1.5",
        "[&>[data-slot=control]]:min-w-0 [&>[data-slot=control]]:flex-1 [&>[data-slot=control]]:self-stretch",
        "[&_[data-slot=input-group-control]]:h-full [&_[data-slot=input-group-control]]:rounded-none [&_[data-slot=input-group-control]]:border-0 [&_[data-slot=input-group-control]]:bg-transparent [&_[data-slot=input-group-control]]:shadow-none [&_[data-slot=input-group-control]]:ring-0",
        "[&_[data-slot=input-group-control]]:focus:border-transparent [&_[data-slot=input-group-control]]:focus:ring-0 [&_[data-slot=input-group-control]]:focus:outline-hidden",
        "[&_[data-slot=input-group-control]]:invalid:border-transparent [&_[data-slot=input-group-control]]:focus:invalid:border-transparent [&_[data-slot=input-group-control]]:focus:invalid:ring-0",
        "[&_[data-slot=input-group-control]]:disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

interface InputGroupAddonProps extends React.ComponentProps<"div"> {
  align?: "inline-start" | "inline-end" | "block-start" | "block-end"
}

const inputGroupAddonStyles = {
  "inline-start": "order-first pl-2 has-[>button]:pl-px has-[>kbd]:pl-1.5",
  "inline-end": "order-last pr-1.25 has-[>button]:pr-px has-[>kbd]:pr-1.5",
  "block-start":
    "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
  "block-end":
    "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
}

export function InputGroupAddon({
  className,
  align = "inline-start",
  onClick,
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={twMerge(
        "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none",
        "group-data-[disabled=true]/input-group:opacity-50",
        "[&>kbd]:rounded-[calc(var(--radius-lg)-5px)] [&>svg:not([class*='size-'])]:size-4",
        inputGroupAddonStyles[align],
        className
      )}
      onClick={(event) => {
        onClick?.(event)

        if (
          event.defaultPrevented ||
          (event.target as HTMLElement).closest("button")
        ) {
          return
        }

        event.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

interface InputGroupButtonProps extends Omit<ButtonProps, "size"> {
  size?: "xs" | "sm" | "icon-xs" | "icon-sm"
}

const inputGroupButtonSizes = {
  xs: {
    button: "xs",
    className:
      "h-6 gap-1 rounded-[calc(var(--radius-lg)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
  },
  sm: {
    button: "sm",
    className:
      "h-7 rounded-[calc(var(--radius-lg)-2px)] px-2.5 [&>svg:not([class*='size-'])]:size-4",
  },
  "icon-xs": {
    button: "sq-xs",
    className: "size-6 rounded-[calc(var(--radius-lg)-3px)] p-0",
  },
  "icon-sm": {
    button: "sq-sm",
    className: "size-8 rounded-[calc(var(--radius-lg)-2px)] p-0",
  },
} as const

export function InputGroupButton({
  className,
  type = "button",
  intent = "plain",
  size = "xs",
  ...props
}: InputGroupButtonProps) {
  const sizeStyles = inputGroupButtonSizes[size]

  return (
    <Button
      type={type}
      data-slot="input-group-button"
      data-size={size}
      intent={intent}
      size={sizeStyles.button}
      className={cx("shrink-0 shadow-none", sizeStyles.className, className)}
      {...props}
    />
  )
}

export function InputGroupText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={twMerge(
        "text-muted-foreground flex items-center gap-2 text-sm",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cx("flex-1", className)}
      {...props}
    />
  )
}
