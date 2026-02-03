"use client"

import type { DateDuration } from "@internationalized/date"
import { CalendarDaysIcon } from "lucide-react"
import type {
  DatePickerProps as DatePickerPrimitiveProps,
  DateValue,
  GroupProps,
  PopoverProps,
} from "react-aria-components"
import { DatePicker as DatePickerPrimitive } from "react-aria-components"
import { twJoin } from "tailwind-merge"

import { useMediaQuery } from "@/hooks/use-media-query"
import { cx } from "@/registry/preskok/lib/primitive"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { DateInput as PrimitiveDateInput } from "@/registry/preskok/ui/preskok-ui/date-field"
import { fieldStyles } from "@/registry/preskok/ui/preskok-ui/field"
import { InputGroup } from "@/registry/preskok/ui/preskok-ui/input"

import { Calendar } from "./calendar"
import { ModalContent } from "./modal"
import { PopoverContent } from "./popover"
import { RangeCalendar } from "./range-calendar"

export interface DatePickerProps<
  T extends DateValue,
> extends DatePickerPrimitiveProps<T> {
  popover?: Omit<PopoverProps, "children">
}

export function DatePicker<T extends DateValue>({
  className,
  children,
  popover,
  ...props
}: DatePickerProps<T>) {
  return (
    <DatePickerPrimitive
      data-slot="control"
      className={cx(fieldStyles(), className)}
      {...props}
    >
      {(values) => (
        <>
          {typeof children === "function" ? children(values) : children}
          <DatePickerOverlay {...popover} />
        </>
      )}
    </DatePickerPrimitive>
  )
}

export interface DatePickerOverlayProps extends Omit<PopoverProps, "children"> {
  range?: boolean
  visibleDuration?: DateDuration
  pageBehavior?: "visible" | "single"
}

export function DatePickerOverlay({
  visibleDuration = { months: 1 },
  pageBehavior = "visible",
  placement = "bottom",
  range,
  ...props
}: DatePickerOverlayProps) {
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false

  return isMobile ? (
    <ModalContent aria-label="Date picker" closeButton={false}>
      <div className="flex justify-center p-6">
        {range ? (
          <RangeCalendar
            pageBehavior={pageBehavior}
            visibleDuration={visibleDuration}
          />
        ) : (
          <Calendar />
        )}
      </div>
    </ModalContent>
  ) : (
    <PopoverContent
      placement={placement}
      arrow={false}
      className={twJoin(
        "flex max-w-none min-w-auto snap-x justify-center p-4 sm:min-w-[16.5rem] sm:p-2 sm:pt-3",
        visibleDuration?.months === 1 ? "sm:max-w-2xs" : "sm:max-w-none"
      )}
      {...props}
    >
      {range ? (
        <RangeCalendar
          pageBehavior={pageBehavior}
          visibleDuration={visibleDuration}
        />
      ) : (
        <Calendar />
      )}
    </PopoverContent>
  )
}

export function DatePickerTrigger({ className, ...props }: GroupProps) {
  return (
    <InputGroup
      className={cx(
        "flex items-center rounded-lg",
        "border-input hover:border-muted-foreground/30 border",
        "focus-visible:focus-within:border-ring/70 focus-visible:focus-within:ring-ring/20 focus-visible:focus-within:hover:border-ring/80 focus-visible:focus-within:ring-3 focus-visible:focus-within:outline-hidden",
        "invalid:border-destructive/70 focus-visible:focus-within:invalid:border-destructive/70 focus-visible:focus-within:invalid:ring-destructive/20 invalid:hover:border-destructive/80 focus-visible:focus-within:invalid:hover:border-destructive/80",
        "disabled:bg-muted disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex w-fit flex-1 items-center overflow-x-auto overflow-y-clip [scrollbar-width:none]">
        <DateInput className="px-3 pr-2" />
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
        <CalendarDaysIcon data-slot="icon" className="size-4" />
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
      className={cx(
        "rounded-none border-none focus-visible:focus-within:ring-0",
        className
      )}
      {...props}
    />
  )
}
