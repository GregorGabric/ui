"use client"

import { CalendarIcon } from "@radix-ui/react-icons"
import type {
  DatePickerProps as AriaDatePickerProps,
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue as AriaDateValue,
  DialogProps as AriaDialogProps,
  PopoverProps as AriaPopoverProps,
  ValidationResult as AriaValidationResult,
} from "react-aria-components"
import {
  DatePicker as AriaDatePicker,
  DateRangePicker as AriaDateRangePicker,
  Dialog as AriaDialog,
  composeRenderProps,
  Text,
} from "react-aria-components"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar,
} from "@/registry/new-york-v4/ui/preskok-ui/calendar/calendar"
import { DateInput } from "@/registry/new-york-v4/ui/preskok-ui/calendar/date-field"
import {
  FieldError,
  FieldGroup,
  Label,
} from "@/registry/new-york-v4/ui/preskok-ui/field"
import { Popover } from "@/registry/new-york-v4/ui/preskok-ui/popover"

const DatePickerPrimitive = AriaDatePicker

const DateRangePickerPrimitive = AriaDateRangePicker

const DatePickerContent = ({
  className,
  popoverClassName,
  ...props
}: AriaDialogProps & { popoverClassName?: AriaPopoverProps["className"] }) => (
  <Popover
    className={composeRenderProps(popoverClassName, (className) =>
      cn("w-auto p-3", className)
    )}
  >
    <AriaDialog
      className={cn(
        "flex w-full flex-col space-y-4 outline-none sm:flex-row sm:space-y-0 sm:space-x-4",
        className
      )}
      {...props}
    />
  </Popover>
)

interface DatePickerProps<T extends AriaDateValue>
  extends AriaDatePickerProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function DatePicker<T extends AriaDateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: DatePickerProps<T>) {
  return (
    <DatePickerPrimitive
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      <Label>{label}</Label>
      <FieldGroup>
        <DateInput className="flex-1" variant="ghost" />
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
        >
          <CalendarIcon aria-hidden className="size-4" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent>
        <Calendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => <CalendarCell date={date} />}
            </CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </DatePickerContent>
    </DatePickerPrimitive>
  )
}

interface DateRangePickerProps<T extends AriaDateValue>
  extends AriaDateRangePickerProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function DateRangePicker<T extends AriaDateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: DateRangePickerProps<T>) {
  return (
    <DateRangePickerPrimitive
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      <Label>{label}</Label>
      <FieldGroup>
        <DateInput variant="ghost" slot={"start"} />
        <span aria-hidden className="text-muted-foreground px-2 text-sm">
          -
        </span>
        <DateInput className="flex-1" variant="ghost" slot={"end"} />

        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
        >
          <CalendarIcon aria-hidden className="size-4" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent>
        <RangeCalendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => <CalendarCell date={date} />}
            </CalendarGridBody>
          </CalendarGrid>
        </RangeCalendar>
      </DatePickerContent>
    </DateRangePickerPrimitive>
  )
}

export {
  DatePicker,
  DatePickerContent,
  DatePickerPrimitive,
  DateRangePicker,
  DateRangePickerPrimitive,
}
export type { DatePickerProps, DateRangePickerProps }
