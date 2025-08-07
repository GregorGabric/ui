"use client"

import { CheckIcon, GripVerticalIcon } from "lucide-react"
import type {
  ListBoxItemProps,
  ListBoxProps,
  ListBoxSectionProps as ListBoxSectionPrimitiveProps,
} from "react-aria-components"
import {
  composeRenderProps,
  ListBoxItem as ListBoxItemPrimitive,
  ListBox as ListBoxPrimitive,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"

import { composeTailwindRenderProps } from "@/registry/preskok/lib/primitive"

import {
  DropdownDescription,
  dropdownItemStyles,
  DropdownLabel,
  DropdownSection,
} from "./dropdown"

const ListBox = <T extends object>({
  className,
  ...props
}: ListBoxProps<T>) => (
  <ListBoxPrimitive
    className={composeTailwindRenderProps(
      className,
      "bg-bg grid max-h-96 w-full min-w-56 scroll-py-1 grid-cols-[auto_1fr] flex-col gap-y-1 overflow-y-auto overscroll-contain rounded-xl border p-1 shadow-lg outline-hidden [scrollbar-width:thin] [&::-webkit-scrollbar]:size-0.5 *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1"
    )}
    data-slot="list-box"
    {...props}
  />
)

const ListBoxItem = <T extends object>({
  children,
  className,
  ...props
}: ListBoxItemProps<T>) => {
  const textValue = typeof children === "string" ? children : undefined
  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({
          ...renderProps,
          className,
        })
      )}
      data-slot="list-box-item"
      {...props}
    >
      {(renderProps) => {
        const { allowsDragging, isSelected, isFocused, isDragging } =
          renderProps

        return (
          <>
            {allowsDragging && (
              <GripVerticalIcon
                className={twMerge(
                  "text-muted-fg size-4 shrink-0 transition",
                  isFocused && "text-fg",
                  isDragging && "text-fg",
                  isSelected && "text-accent-fg/70"
                )}
              />
            )}
            {isSelected && (
              <CheckIcon className="-mx-0.5 mr-2" data-slot="checked-icon" />
            )}
            {typeof children === "function" ? (
              children(renderProps)
            ) : typeof children === "string" ? (
              <DropdownLabel>{children}</DropdownLabel>
            ) : (
              children
            )}
          </>
        )
      }}
    </ListBoxItemPrimitive>
  )
}

interface ListBoxSectionProps<T> extends ListBoxSectionPrimitiveProps<T> {
  title?: string
}

const ListBoxSection = <T extends object>({
  className,
  ...props
}: ListBoxSectionProps<T>) => {
  return (
    <DropdownSection
      className={twMerge(
        "gap-y-1 *:data-[slot=list-box-item]:last:-mb-1.5",
        className
      )}
      {...props}
    />
  )
}

const ListBoxLabel = DropdownLabel
const ListBoxDescription = DropdownDescription

ListBox.Section = ListBoxSection
ListBox.Label = ListBoxLabel
ListBox.Description = ListBoxDescription
ListBox.Item = ListBoxItem

export {
  ListBox,
  ListBoxDescription,
  ListBoxItem,
  ListBoxLabel,
  ListBoxSection,
}
export type { ListBoxItemProps, ListBoxSectionProps }
