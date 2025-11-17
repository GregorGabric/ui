"use client"

import type { PropsWithChildren } from "react"
import * as React from "react"
import {
  Combobox as ComboboxPrimitive,
  ComboboxRootProps,
} from "@base-ui-components/react/combobox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/preskok/lib/utils"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"

const inputVariants = cva(
  `
    flex w-full bg-background border border-input shadow-xs shadow-black/5 transition-[color,box-shadow] text-foreground placeholder:text-muted-foreground/80 
    focus-visible:ring-ring/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px]     
    has-[[data-slot=combobox-input]:focus-visible]:ring-ring/30 
    has-[[data-slot=combobox-input]:focus-visible]:border-ring
    has-[[data-slot=combobox-input]:focus-visible]:outline-none
    has-[[data-slot=combobox-input]:focus-visible]:ring-[3px]
    [&_[data-slot=combobox-input]]:grow
    disabled:cursor-not-allowed disabled:opacity-60 
    [&[readonly]]:bg-muted/80 [&[readonly]]:cursor-not-allowed
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
  `,
  {
    variants: {
      variant: {
        lg: "py-1 min-h-10 px-4 text-sm rounded-md [&~[data-slot=combobox-icon]]:end-2.5 [&~[data-slot=combobox-clear]]:end-7",
        md: "py-1 min-h-9 px-3 text-sm rounded-md [&~[data-slot=combobox-icon]]:end-2 [&~[data-slot=combobox-clear]]:end-6",
        sm: "py-0.5 min-h-8 px-2.5 text-xs rounded-md [&~[data-slot=combobox-icon]]:end-1.75 [&~[data-slot=combobox-clear]]:end-5.75",
      },
    },
    defaultVariants: {
      variant: "md",
    },
  }
)

const chipsVariants = cva(
  [
    "flex items-center flex-wrap gap-1",
    "[&_[data-slot=combobox-input]]:py-0 [&_[data-slot=combobox-input]]:px-1.5 has-[[data-slot=combobox-chip]]:[&_[data-slot=combobox-input]]:px-0",
    "[&_[data-slot=combobox-input]]:min-h-0 [&_[data-slot=combobox-input]]:flex-1",
    "[&_[data-slot=combobox-input]]:border-0 [&_[data-slot=combobox-input]]:shadow-none [&_[data-slot=combobox-input]]:rounded-none",
    "[&_[data-slot=combobox-input]]:outline-none [&_[data-slot=combobox-input]]:ring-0",
  ],
  {
    variants: {
      variant: {
        sm: "px-0.75",
        md: "px-1",
        lg: "px-1.5",
      },
    },
  }
)

export type ComboboxControlledProps<
  Value,
  Multiple extends boolean | undefined = false,
> = Extract<ComboboxRootProps<Value, Multiple>, { value: unknown }>
export type ComboboxProps<
  ItemValue,
  Multiple extends boolean | undefined = false,
> = ComboboxControlledProps<ItemValue, Multiple>

function Combobox<ItemValue, Multiple extends boolean | undefined = false>(
  props: ComboboxProps<ItemValue, Multiple>
) {
  return <ComboboxPrimitive.Root data-slot="combobox" {...props} />
}

function ComboboxControl({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <span
      data-slot="combobox-control"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function ComboboxValue({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Value> & {
  className?: string
}) {
  return (
    <span
      data-slot="combobox-value"
      className={cn(
        "flex-1 truncate text-left [:has([data-slot=combobox-clear])_>&]:pr-5",
        className
      )}
    >
      <ComboboxPrimitive.Value {...props} />
    </span>
  )
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="combobox-label"
      className={cn("px-0.5 py-1.5 text-sm font-semibold", className)}
      {...props}
    />
  )
}

function ComboboxInput({
  className,
  variant = "md",
  isFetching = false,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input> &
  VariantProps<typeof inputVariants> & { isFetching?: boolean }) {
  return (
    <div className="relative">
      <ComboboxPrimitive.Input
        data-slot="combobox-input"
        data-variant={variant}
        className={cn(
          inputVariants({ variant }),
          "appearance-none",
          isFetching && "pr-8",
          className
        )}
        {...props}
      />
      {isFetching && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Loader
            variant="spin"
            size="sm"
            data-slot="loader"
            className="mb-[4px]"
          />
        </div>
      )}
    </div>
  )
}

function ComboboxStatus({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Status>) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn(
        "text-muted-foreground px-3 py-2 text-xs font-medium empty:m-0 empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxPortal({
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Portal>) {
  return <ComboboxPrimitive.Portal data-slot="combobox-portal" {...props} />
}

function ComboboxBackdrop({
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Backdrop>) {
  return <ComboboxPrimitive.Backdrop data-slot="combobox-backdrop" {...props} />
}

function ComboboxContent({
  className,
  children,
  showBackdrop = false,
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  side = "bottom",
  anchor,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> & {
  align?: ComboboxPrimitive.Positioner.Props["align"]
  sideOffset?: ComboboxPrimitive.Positioner.Props["sideOffset"]
  alignOffset?: ComboboxPrimitive.Positioner.Props["alignOffset"]
  anchor?: ComboboxPrimitive.Positioner.Props["anchor"]
  side?: ComboboxPrimitive.Positioner.Props["side"]
  showBackdrop?: boolean
}) {
  return (
    <ComboboxPortal>
      {showBackdrop && <ComboboxBackdrop />}
      <ComboboxPositioner
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        side={side}
        anchor={anchor}
      >
        <ComboboxPopup className={className} {...props}>
          {children}
        </ComboboxPopup>
      </ComboboxPositioner>
    </ComboboxPortal>
  )
}

function ComboboxPositioner({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Positioner>) {
  return (
    <ComboboxPrimitive.Positioner
      data-slot="combobox-positioner"
      className={cn("z-[1061] outline-none", className)}
      {...props}
    />
  )
}

function ComboboxPopup({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup>) {
  return (
    <ComboboxPrimitive.Popup
      data-slot="combobox-popup"
      className={cn(
        "max-h-[min(var(--available-height),24rem)] w-[var(--anchor-width)] max-w-[var(--available-width)] py-1",
        "scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain bg-[canvas]",
        "border-border bg-popover text-popover-foreground rounded-md border shadow-md shadow-black/5",
        "origin-[var(--transform-origin)] transition-[transform,scale,opacity] data-[ending-style]:scale-90",
        "data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn("space-y-0.5", className)}
      {...props}
    />
  )
}

function ComboboxCollection({
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Collection>) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  )
}

function ComboboxRow({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Row>) {
  return (
    <ComboboxPrimitive.Row
      data-slot="combobox-row"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex cursor-default items-center",
        "text-foreground items-center gap-2 rounded-md py-1.5 ps-7 pe-2 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        "data-[highlighted]:text-foreground data-[highlighted]:before:bg-accent data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ItemIndicator>) {
  return (
    <ComboboxPrimitive.ItemIndicator
      data-slot="combobox-item-indicator"
      className={cn(
        "absolute start-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center",
        className
      )}
      {...props}
    >
      <Check className="text-primary h-4 w-4" />
    </ComboboxPrimitive.ItemIndicator>
  )
}

function ComboboxGroup({
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />
}

function ComboboxGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-xs font-medium",
        className
      )}
      {...props}
    />
  )
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "text-muted-foreground px-2 py-1.5 text-sm empty:m-0 empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxClear({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Clear>) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(
        "ring-offset-background absolute end-7 top-1/2 -translate-y-1/2 rounded-sm",
        "focus:ring-ring opacity-60 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none",
        "disabled:pointer-events-none data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    >
      {children ? children : <XIcon className="size-4 opacity-100" />}
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxIcon({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Icon>) {
  return (
    <ComboboxPrimitive.Icon
      data-slot="combobox-icon"
      className={cn("shrink-0 opacity-60 transition-opacity", className)}
      {...props}
    >
      {children ? children : <ChevronDownIcon className="size-4 opacity-100" />}
    </ComboboxPrimitive.Icon>
  )
}

function ComboboxArrow({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Arrow>) {
  return (
    <ComboboxPrimitive.Arrow
      data-slot="combobox-arrow"
      className={cn("", className)}
      {...props}
    />
  )
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "bg-background m-0 cursor-pointer appearance-none border",
        "border-input flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm",
        "shadow-xs shadow-black/5 transition-[color,box-shadow]",
        "hover:bg-muted/50",
        "focus-visible:ring-ring/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "data-[state=open]:ring-ring/30 data-[state=open]:border-ring data-[state=open]:ring-[3px]",
        "has-[[data-slot=combobox-chips]]:px-0 has-[[data-slot=combobox-chips]]:py-0",
        "has-[[data-slot=combobox-chips]]:bg-transparent",
        "has-[[data-slot=combobox-chips]]:border-none has-[[data-slot=combobox-chips]]:shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxChips({
  className,
  variant = "md",
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chips> &
  VariantProps<typeof inputVariants>) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        inputVariants({ variant }),
        chipsVariants({ variant }),
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chip>) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "bg-muted text-foreground inline-flex min-w-0 items-center gap-1 truncate rounded-md px-2 py-1 text-xs font-medium text-pretty wrap-break-word",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChipRemove({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.ChipRemove>) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot="combobox-chip-remove"
      className={cn(
        "hover:bg-muted-foreground/20 ms-1 cursor-pointer rounded-sm [&_svg]:opacity-60 hover:[&_svg]:opacity-100",
        className
      )}
      {...props}
    >
      {children ? children : <XIcon data-slot="icon" className="size-3.5" />}
    </ComboboxPrimitive.ChipRemove>
  )
}

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("bg-muted my-1.5 h-px", className)}
      {...props}
    />
  )
}

function ComboboxFooter({
  onApply,
  onReset,
  applyText = "Apply",
  resetText = "Reset",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  onApply?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onReset?: (e: React.MouseEvent<HTMLButtonElement>) => void
  applyText?: string
  resetText?: string
}) {
  if (!onApply && !onReset && !children) {
    return null
  }

  const handleApply = (e: React.MouseEvent) => {
    onApply?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
  }

  const handleReset = (e: React.MouseEvent) => {
    onReset?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
  }

  return (
    <div data-slot="combobox-footer" className={className} {...props}>
      {children || (
        <div className="border-border flex gap-2 border-t p-2">
          {onReset && (
            <Button className="flex-1" onClick={handleReset} intent="secondary">
              {resetText}
            </Button>
          )}
          {onApply && (
            <Button className="flex-1" onClick={handleApply} intent="primary">
              {applyText}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function ActiveCountIndicatorWrapper({ children }: PropsWithChildren) {
  return (
    <div className="bg-background text-slate-blue-900 flex items-center gap-2 rounded-lg px-1.5 py-0.5 font-mono text-xs select-none">
      {children}
    </div>
  )
}

export {
  ActiveCountIndicatorWrapper,
  Combobox,
  ComboboxArrow,
  ComboboxBackdrop,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxFooter,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxRow,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
}
