"use client"

import { CaretSortIcon } from "@radix-ui/react-icons"
import type {
  ComboBoxProps as AriaComboBoxProps,
  InputProps as AriaInputProps,
  ListBoxProps as AriaListBoxProps,
  PopoverProps as AriaPopoverProps,
  ValidationResult as AriaValidationResult,
} from "react-aria-components"
import {
  ComboBox as AriaComboBox,
  Input as AriaInput,
  ListBox as AriaListBox,
  composeRenderProps,
  Text,
} from "react-aria-components"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  FieldError,
  FieldGroup,
  Label,
} from "@/registry/new-york-v4/ui/preskok-ui/field"
import {
  ListBoxCollection,
  ListBoxHeader,
  ListBoxItem,
  ListBoxSection,
} from "@/registry/new-york-v4/ui/preskok-ui/list-box"
import { Popover } from "@/registry/new-york-v4/ui/preskok-ui/popover"

const ComboboxPrimitive = AriaComboBox

const ComboboxItem = ListBoxItem

const ComboboxHeader = ListBoxHeader

const ComboboxSection = ListBoxSection

const ComboboxCollection = ListBoxCollection

const ComboboxInput = ({ className, ...props }: AriaInputProps) => (
  <AriaInput
    className={composeRenderProps(className, (className) =>
      cn(
        "bg-background placeholder:text-muted-foreground flex h-10 w-full px-3 py-2 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium",
        /* Disabled */
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )
    )}
    {...props}
  />
)

const ComboboxPopover = ({ className, ...props }: AriaPopoverProps) => (
  <Popover
    className={composeRenderProps(className, (className) =>
      cn("w-[calc(var(--trigger-width)+4px)]", className)
    )}
    {...props}
  />
)

const ComboboxListBox = <T extends object>({
  className,
  ...props
}: AriaListBoxProps<T>) => (
  <AriaListBox
    className={composeRenderProps(className, (className) =>
      cn(
        "max-h-[inherit] overflow-auto p-1 outline-none [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))]",
        className
      )
    )}
    {...props}
  />
)

interface ComboboxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, "children"> {
  label?: string
  description?: string | null
  errorMessage?: string | ((validation: AriaValidationResult) => string)
  children: React.ReactNode | ((item: T) => React.ReactNode)
}

function Combobox<T extends object>({
  label,
  description,
  errorMessage,
  className,
  children,
  ...props
}: ComboboxProps<T>) {
  return (
    <ComboboxPrimitive
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className)
      )}
      {...props}
    >
      <Label>{label}</Label>
      <FieldGroup className="p-0">
        <ComboboxInput />
        <Button variant="ghost" size="icon" className="mr-1 size-6 p-1">
          <CaretSortIcon aria-hidden="true" className="size-4 opacity-50" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-muted-foreground text-sm" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <ComboboxPopover>
        <ComboboxListBox>{children}</ComboboxListBox>
      </ComboboxPopover>
    </ComboboxPrimitive>
  )
}

export {
  Combobox,
  ComboboxCollection,
  ComboboxHeader,
  ComboboxInput,
  ComboboxItem,
  ComboboxListBox,
  ComboboxPopover,
  ComboboxPrimitive,
  ComboboxSection,
}
export type { ComboboxProps }
