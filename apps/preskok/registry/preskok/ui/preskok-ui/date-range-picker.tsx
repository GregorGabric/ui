"use client"

import type { DateDuration } from "@internationalized/date"
import { CalendarRangeIcon } from "lucide-react"
import {
  DateRangePicker as DateRangePickerPrimitive,
  type DateRangePickerProps as DateRangePickerPrimitiveProps,
  type DateValue,
  type PopoverProps,
} from "react-aria-components"
import { twJoin } from "tailwind-merge"

import { cx } from "@/registry/preskok/lib/primitive"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { DateInput as PrimitiveDateInput } from "@/registry/preskok/ui/preskok-ui/date-field"
import { InputGroup } from "@/registry/preskok/ui/preskok-ui/input"

import { DatePickerOverlay } from "./date-picker"
import { fieldStyles } from "./field"

export interface DateRangePickerProps<
  T extends DateValue,
> extends DateRangePickerPrimitiveProps<T> {
  visibleDuration?: DateDuration
  pageBehavior?: "visible" | "single"
  popover?: Omit<PopoverProps, "children">
}

export function DateRangePicker<T extends DateValue>({
  className,
  popover,
  children,
  visibleDuration = { months: 1 },
  ...props
}: DateRangePickerProps<T>) {
  return (
    <DateRangePickerPrimitive
      data-slot="control"
      className={cx(fieldStyles(), className)}
      {...props}
    >
      {(values) => (
        <>
          {typeof children === "function" ? children(values) : children}
          <DatePickerOverlay
            {...popover}
            visibleDuration={visibleDuration}
            range
          />
        </>
      )}
    </DateRangePickerPrimitive>
  )
}

export function DateRangePickerTrigger({
  className,
  ...props
}: React.ComponentProps<typeof InputGroup>) {
  return (
    <InputGroup
      className={cx(
        "flex items-center rounded-lg",
        "border-input hover:border-muted-foreground/30 border",
        "focus-within:border-ring/70 focus-within:ring-ring/20 focus-within:hover:border-ring/80 focus-within:ring-3 focus-within:outline-hidden",
        "invalid:border-destructive/70 focus-within:invalid:border-destructive/70 focus-within:invalid:ring-destructive/20 invalid:hover:border-destructive/80 focus-within:invalid:hover:border-destructive/80",
        "disabled:bg-muted disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex w-fit flex-1 items-center overflow-x-auto overflow-y-clip [scrollbar-width:none]">
        <DateInput slot="start" className="px-3 pr-2" />
        <span
          aria-hidden="true"
          className="bg-foreground/80 group-disabled:text-opacity-50 forced-colors:group-disabled:text- [GrayText] pointer-events-none -mx-3 block h-0.5 w-2 shrink-0 self-center rounded-full sm:-mx-2 forced-colors:text-[ButtonText]"
        />
        <DateInput slot="end" className="flex-1 pr-3 pl-2" />
      </div>
      <Button
        intent="plain"
        size="sq-xs"
        data-slot="date-picker-trigger"
        className={twJoin(
          "touch-target focus-visible:text-foreground grid place-content-center outline-hidden",
          "pressed:text-foreground text-muted-foreground hover:text-foreground focus-visible:text-foreground",
          "mr-1 shrink-0"
        )}
      >
        <CalendarRangeIcon data-slot="icon" className="size-4" />
      </Button>
    </InputGroup>
  )
}

function DateInput({
  className,
  ...props
}: React.ComponentProps<typeof PrimitiveDateInput>) {
  return (
    <PrimitiveDateInput
      className={cx("rounded-none border-none focus-within:ring-0", className)}
      {...props}
    />
  )
}
