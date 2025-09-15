"use client"

import React, {
  ComponentProps,
  RefObject,
  useMemo,
  useRef,
  useState,
} from "react"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"
import type {
  ComboBoxProps,
  GroupProps,
  Key,
  ListBoxProps,
  Selection,
} from "react-aria-components"
import { Autocomplete, Group, useFilter } from "react-aria-components"
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
}

function mapToNewObject<T extends object>(
  array: Array<T>,
  itemKey: keyof T | "id",
  itemTextValue: keyof T | "label"
): Array<{ id: T[keyof T]; textValue: T[keyof T] }> {
  return array.map((item) => {
    const idProperty = Object.keys(item).find((key) => key === itemKey)
    const textProperty = Object.keys(item).find((key) => key === itemTextValue)
    return {
      id: item[idProperty as keyof T],
      textValue: item[textProperty as keyof T],
    }
  })
}

function isEmpty(value: Selection) {
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
  ...props
}: MultipleSelectProps<T>) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const [inputValue, setInputValue] = useState("")
  const { contains } = useFilter({ sensitivity: "base" })

  const [selectedKeys, onSelectionChange] = useControllableState({
    prop: props.selectedKeys as Selection,
    defaultProp: props.defaultSelectedKeys as Selection,
    onChange: props.onSelectionChange,
  })

  const removeItem = (e: Set<Key>) => {
    onSelectionChange?.(
      (s) => new Set([...s].filter((i) => i !== e.values().next().value))
    )
  }

  const parsedItems = props.items
    ? mapToNewObject(props.items as Array<T>, itemKey, itemTextValue)
    : []

  const normalizedItems = parsedItems.map((item) => ({
    id: item.id as Key,
    textValue: String(item.textValue),
  }))

  const showPlaceholder = isEmpty(selectedKeys)

  const renderSelectedItem = useMemo(() => {
    // Show placeholder only when selection is an empty Set
    if (isEmpty(selectedKeys)) return props.placeholder

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

    if (selectedKeys === "all") {
      return normalizedItems.map((item) => (
        <Item onClick={() => removeItem(new Set([item.id]))} key={item.id}>
          {item.textValue}
        </Item>
      ))
    }

    const items = Array.from(selectedKeys).map((key) =>
      normalizedItems.find((item) => item.id === key)
    )

    return items.map((item) => (
      <Item
        onClick={() => removeItem(new Set([item?.id as Key]))}
        key={item?.id}
      >
        {item?.textValue}
      </Item>
    ))
  }, [selectedKeys, props.renderValue, props.placeholder])

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
            <Popover.Trigger onClick={console.log}>
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
                      {renderSelectedItem}
                    </div>
                  </div>
                )}

                <div className="flex w-full flex-row items-center justify-between pr-1.5">
                  <ChevronsUpDownIcon
                    data-slot="chevron"
                    className="text-muted-foreground group-open:text-foreground size-4"
                  />
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
                    onFocus={() => triggerButtonRef.current?.click()}
                    onBlur={() => {
                      setInputValue("")
                    }}
                  />
                </div>
                <ListBox
                  selectionBehavior="toggle"
                  selectionMode="multiple"
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
                  items={props.items}
                  {...props}
                  children={children}
                />
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

function Item({
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

MultipleSelect.Item = DropdownItem
MultipleSelect.Label = DropdownLabel
MultipleSelect.Section = DropdownSection

export { MultipleSelect }
export type { MultipleSelectProps }
