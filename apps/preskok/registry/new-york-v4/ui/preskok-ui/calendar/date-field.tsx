"use client"

import type { VariantProps } from "class-variance-authority"
import type {
  DateFieldProps as AriaDateFieldProps,
  DateInputProps as AriaDateInputProps,
  DateSegmentProps as AriaDateSegmentProps,
  DateValue as AriaDateValue,
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue as AriaTimeValue,
  ValidationResult as AriaValidationResult,
} from "react-aria-components"
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  TimeField as AriaTimeField,
  composeRenderProps,
  Text,
} from "react-aria-components"

import { cn } from "@/lib/utils"
import {
  FieldError,
  fieldGroupVariants,
  Label,
} from "@/registry/new-york-v4/ui/preskok-ui/field"

const DateFieldPrimitive = AriaDateField

const TimeFieldPrimitive = AriaTimeField

function DateSegment({ className, ...props }: AriaDateSegmentProps) {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (className) =>
        cn(
          "type-literal:px-0 inline rounded p-0.5 caret-transparent outline outline-0",
          /* Placeholder */
          "data-[placeholder]:text-muted-foreground",
          /* Disabled */
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          /* Focused */
          "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
          /* Invalid */
          "data-[invalid]:data-[focused]:bg-destructive data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive",
          className
        )
      )}
      {...props}
    />
  )
}

interface DateInputProps
  extends AriaDateInputProps,
    VariantProps<typeof fieldGroupVariants> {}

function DateInput({
  className,
  variant,
  ...props
}: Omit<DateInputProps, "children">) {
  return (
    <AriaDateInput
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant }), "text-sm", className)
      )}
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </AriaDateInput>
  )
}

interface DateFieldProps<T extends AriaDateValue>
  extends AriaDateFieldProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function DateField<T extends AriaDateValue>({
  label,
  description,
  className,
  errorMessage,
  ...props
}: DateFieldProps<T>) {
  return (
    <DateFieldPrimitive
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      <Label>{label}</Label>
      <DateInput />
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </DateFieldPrimitive>
  )
}

interface TimeFieldProps<T extends AriaTimeValue>
  extends AriaTimeFieldProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function TimeField<T extends AriaTimeValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: TimeFieldProps<T>) {
  return (
    <TimeFieldPrimitive
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      <Label>{label}</Label>
      <DateInput />
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </TimeFieldPrimitive>
  )
}

export {
  DateField,
  DateFieldPrimitive,
  DateInput,
  DateSegment,
  TimeField,
  TimeFieldPrimitive,
}
export type { DateFieldProps, DateInputProps, TimeFieldProps }
