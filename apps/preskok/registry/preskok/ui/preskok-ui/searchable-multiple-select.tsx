"use client"

import React, { ComponentProps, RefObject, useRef, useState } from "react"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"
import type {
  ComboBoxProps,
  GroupProps,
  Key,
  ListBoxProps,
  Selection,
} from "react-aria-components"
import {
  Autocomplete,
  Group,
  ListBoxItem,
  useFilter,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"

import { useControllableState } from "@/registry/preskok/hooks/use-controllable-state"
import { composeTailwindRenderProps } from "@/registry/preskok/lib/primitive"
import {
  DropdownItem,
  DropdownLabel,
  DropdownSection,
} from "@/registry/preskok/ui/preskok-ui/dropdown"
import {
  Description,
  FieldGroup,
  Label,
  type FieldProps,
} from "@/registry/preskok/ui/preskok-ui/field"
import { ListBox } from "@/registry/preskok/ui/preskok-ui/list-box"
import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"
import { Popover } from "@/registry/preskok/ui/preskok-ui/popover"
import { SearchField } from "@/registry/preskok/ui/preskok-ui/search-field"

export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event)
    }
  }
}

interface MultipleSelectProps<T>
  extends Omit<ListBoxProps<T>, "renderEmptyState">,
    Pick<
      ComboBoxProps<T & { selectedKeys: Selection }>,
      "isRequired" | "validate" | "validationBehavior"
    >,
    FieldProps,
    Pick<GroupProps, "isDisabled" | "isInvalid"> {
  className?: string
  errorMessage?: string
  maxItems?: number
  renderEmptyState?: (inputValue: string) => React.ReactNode
  renderValue?: (items: Array<T>) => React.ReactNode
  itemKey?: keyof T | "id"
  itemTextValue?: keyof T | "label"
  isPending?: boolean
  displayVariant?: "chips" | "text" | "count"
}

function mapToNewObject<T extends object>(
  array: Array<T>,
  itemKey: keyof T | "id",
  itemTextValue: keyof T | "label"
): Array<{ id: T[keyof T]; textValue: T[keyof T] }> {
  return array.map((item) => ({
    id: item[itemKey as keyof T],
    textValue: item[itemTextValue as keyof T],
  }))
}

function isEmpty(value: Selection) {
  if (value === undefined || value === null) {
    return true
  }
  if (value instanceof Set) {
    return value.size === 0
  }
  return false
}

const MultipleSelect = <T extends object>({
  className,
  renderEmptyState,
  children,
  itemKey = "id",
  itemTextValue = "label",
  selectionMode = "multiple",
  displayVariant,
  ...props
}: MultipleSelectProps<T>) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")
  const { contains } = useFilter({ sensitivity: "base" })

  // Determine the default display variant based on selection mode
  const resolvedDisplayVariant =
    displayVariant || (selectionMode === "single" ? "text" : "chips")

  const [selectedKeys, onSelectionChange] = useControllableState({
    prop: props.selectedKeys as Selection,
    defaultProp: props.defaultSelectedKeys as Selection,
    onChange: props.onSelectionChange,
    caller: "MultipleSelect",
  })

  const removeItem = (e: Set<Key>) => {
    onSelectionChange?.((s) => {
      // In single selection mode, just clear the selection
      if (selectionMode === "single") {
        return new Set()
      }

      // Handle the case where current selection is "all"
      if (s === "all") {
        // When removing from "all", create a Set with all items except the one being removed
        const itemToRemove = e.values().next().value
        return new Set(
          normalizedItems
            .map((item) => item.id)
            .filter((id) => id !== itemToRemove)
        )
      }
      // Handle normal Set case or undefined
      const currentSet = s || new Set()
      return new Set(
        [...currentSet].filter((i) => i !== e.values().next().value)
      )
    })
  }

  const parsedItems = props.items
    ? mapToNewObject(props.items as Array<T>, itemKey, itemTextValue)
    : []

  const normalizedItems = parsedItems.map((item) => ({
    id: item.id as Key,
    textValue: String(item.textValue),
  }))

  const showPlaceholder =
    isEmpty(selectedKeys) ||
    (selectedKeys === "all" && normalizedItems.length === 0)

  const renderSelectedItem = () => {
    if (isEmpty(selectedKeys)) {
      return props.placeholder
    }

    // If a custom renderer is provided, honor it for both Set and "all"
    if (props.renderValue && typeof props.renderValue === "function") {
      function getFilteredItems(
        items: Iterable<T> | undefined,
        selectedKeys: Selection
      ) {
        if (!items) return []
        if (selectedKeys === "all") return Array.from(items)
        return Array.from(items).filter((item) =>
          selectedKeys.has(item[itemKey as keyof T] as Key)
        )
      }

      const items = getFilteredItems(props.items, selectedKeys)
      return props.renderValue(items as Array<T>)
    }

    // Count variant - just show the number of selected items
    if (resolvedDisplayVariant === "count") {
      const count =
        selectedKeys === "all"
          ? normalizedItems.length
          : selectedKeys?.size || 0
      return (
        <span className="truncate pl-[3px] text-sm/6">
          {count} item{count !== 1 ? "s" : ""} selected
        </span>
      )
    }

    // Text variant - show the text content (typically for single selection)
    if (resolvedDisplayVariant === "text") {
      const selectedKey = Array.from(selectedKeys || [])[0]
      const selectedItem = normalizedItems.find(
        (item) => item.id === selectedKey
      )
      return (
        <span className="truncate pl-[3px] text-sm/6">
          {selectedItem?.textValue || ""}
        </span>
      )
    }

    // Chips variant - show removable chips (default for multiple selection)
    if (selectedKeys === "all") {
      return normalizedItems.map((item) => (
        <Chip onClick={() => removeItem(new Set([item.id]))} key={item.id}>
          {item.textValue}
        </Chip>
      ))
    }

    const items = Array.from(selectedKeys || []).map((key) =>
      normalizedItems.find((item) => item.id === key)
    )

    return items.map((item) => (
      <Chip
        onClick={() => removeItem(new Set([item?.id as Key]))}
        key={item?.id}
      >
        {item?.textValue}
      </Chip>
    ))
  }

  return (
    <Group
      isDisabled={props.isDisabled}
      isInvalid={props.isInvalid}
      className={composeTailwindRenderProps(
        className,
        "group flex h-fit min-w-[16rem] flex-col gap-y-1"
      )}
    >
      {({ isInvalid, isDisabled }) => (
        <>
          {props.label && <Label>{props.label}</Label>}
          <Popover>
            <Popover.Trigger>
              <FieldGroup
                ref={triggerRef as RefObject<HTMLDivElement>}
                isDisabled={isDisabled}
                isInvalid={isInvalid}
                className={"grid grid-cols-[1fr_auto] text-left"}
              >
                {showPlaceholder ? (
                  <div className="flex-wrap gap-1 px-1.5 py-1.5">
                    <span className="text-muted-foreground grid flex-1 grid-cols-[auto_1fr] items-center truncate sm:text-sm/6">
                      {props.placeholder}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col flex-wrap">
                    <div className="flex flex-wrap gap-1 px-1.5 py-1.5 outline-hidden [[role='row']]:last:-mr-1">
                      {renderSelectedItem()}
                    </div>
                  </div>
                )}

                <div className="flex w-full flex-row items-center justify-between pr-1.5">
                  {props.isPending ? (
                    <Loader variant="spin" />
                  ) : (
                    <ChevronsUpDownIcon
                      data-slot="chevron"
                      className="text-muted-foreground group-open:text-foreground size-4"
                    />
                  )}
                </div>
              </FieldGroup>
            </Popover.Trigger>
            <Autocomplete filter={contains}>
              <Popover.Content
                placement="bottom start"
                className="min-w-(--trigger-width) scroll-py-1 overflow-y-auto overscroll-contain"
                triggerRef={triggerRef}
              >
                <div className="bg-muted flex w-full flex-row items-center justify-between border-b p-2">
                  <SearchField
                    className={"w-full"}
                    autoFocus
                    isPending={props.isPending}
                    onBlur={() => {
                      setInputValue("")
                    }}
                  />
                </div>
                <ListBox
                  selectionBehavior={
                    selectionMode === "single" ? "replace" : "toggle"
                  }
                  selectionMode={selectionMode}
                  className={composeTailwindRenderProps(
                    className,
                    "grid max-h-96 w-full grid-cols-[auto_1fr] flex-col gap-y-1 overflow-auto rounded-none p-1 shadow-none outline-hidden *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1"
                  )}
                  renderEmptyState={() =>
                    renderEmptyState ? (
                      renderEmptyState(inputValue)
                    ) : (
                      <Description className="block p-3">
                        {inputValue ? (
                          <>
                            No results found for:{" "}
                            <strong className="text-foreground font-medium">
                              {inputValue}
                            </strong>
                          </>
                        ) : (
                          "No options"
                        )}
                      </Description>
                    )
                  }
                  selectedKeys={selectedKeys}
                  onSelectionChange={onSelectionChange}
                  {...props}
                >
                  {typeof children === "undefined"
                    ? (item) => {
                        const id = item[itemKey as keyof T] as Key
                        const textValue = item[
                          itemTextValue as keyof T
                        ] as string

                        return (
                          <MultipleSelect.Item
                            id={id}
                            textValue={textValue}
                            key={id}
                          >
                            {textValue}
                          </MultipleSelect.Item>
                        )
                      }
                    : children}
                </ListBox>
              </Popover.Content>
            </Autocomplete>
          </Popover>
          {props.description && <Description>{props.description}</Description>}
          {props.errorMessage && isInvalid && (
            <Description className="text-danger text-sm/5">
              {props.errorMessage}
            </Description>
          )}
        </>
      )}
    </Group>
  )
}

export function Chip({
  children,
  className,
  onClick,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      onClick={(event) => {
        onClick?.(event)
        event.stopPropagation()
      }}
      className={twMerge(
        "bg-secondary/50 text-secondary-foreground inset-ring-border inline-flex cursor-default items-center gap-x-1.5 rounded-[calc(var(--radius-sm)-1px)] px-2 py-0.5 text-sm/5 font-medium inset-ring outline-hidden sm:text-xs/5 forced-colors:outline",
        className
      )}
      {...props}
    >
      {children}
      <XIcon className="size-3" />
    </div>
  )
}

MultipleSelect.CustomItem = ListBoxItem
MultipleSelect.Item = DropdownItem
MultipleSelect.Label = DropdownLabel
MultipleSelect.Section = DropdownSection

export { MultipleSelect }
export type { MultipleSelectProps }
