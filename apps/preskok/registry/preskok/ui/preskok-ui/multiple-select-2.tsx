"use client"

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react"
import { ChevronsUpDownIcon } from "lucide-react"
import type {
  ComboBoxProps,
  GroupProps,
  Key,
  ListBoxProps,
  Selection,
} from "react-aria-components"
import { Button, ComboBox, Group } from "react-aria-components"

import { composeTailwindRenderProps } from "@/registry/preskok/lib/primitive"
import { ListBox } from "@/registry/preskok/ui/preskok-ui/list-box"

import { DropdownItem, DropdownLabel, DropdownSection } from "./dropdown"
import { Description, FieldGroup, Input, Label, type FieldProps } from "./field"
import { PopoverContent } from "./popover"
import { Tag, TagGroup, TagList } from "./tag-group"

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
}

function mapToNewObject<T extends object>(
  array: Array<T>
): Array<{ id: T[keyof T]; textValue: T[keyof T] }> {
  return array.map((item) => {
    const idProperty = Object.keys(item).find(
      (key) => key === "id" || key === "key"
    )
    const textProperty = Object.keys(item).find(
      (key) => key !== "id" && key !== "key"
    )
    return {
      id: item[idProperty as keyof T],
      textValue: item[textProperty as keyof T],
    }
  })
}

const MultipleSelect = <T extends object>({
  className,
  maxItems = Number.POSITIVE_INFINITY,
  renderEmptyState,
  children,
  ...props
}: MultipleSelectProps<T>) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [selectedKeys, onSelectionChange] = useState<Selection>(
    new Set(props.selectedKeys)
  )

  const isMax = [...selectedKeys].length >= maxItems

  useEffect(() => {
    setInputValue("")
    return () => {
      inputRef.current?.focus()
    }
  }, [props?.selectedKeys, selectedKeys])

  const addItem = (e: Key | null) => {
    if (!e || isMax) {
      return
    }
    onSelectionChange?.((s) => new Set([...s, e]))
    // @ts-expect-error incompatible type Key and Selection
    props.onSelectionChange?.((s) => new Set([...s, e]))
  }

  const toggleItem = (event: Key | null) => {
    if (!event) {
      return
    }
    onSelectionChange?.((selection) => {
      if (selection.has(event)) {
        selection.delete(event)
      } else {
        selection.add(event)
      }
      return selection
    })
  }

  const removeItem = (e: Set<Key>) => {
    onSelectionChange?.(
      (s) => new Set([...s].filter((i) => i !== e.values().next().value))
    )
    props.onSelectionChange?.(
      // @ts-expect-error incompatible type Key and Selection
      (s) => new Set([...s].filter((i) => i !== e.values().next().value))
    )
  }

  const onKeyDownCapture = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "") {
      onSelectionChange?.((s) => new Set([...s].slice(0, -1)))
      // @ts-expect-error incompatible type Key and Selection
      props.onSelectionChange?.((s) => new Set([...s].slice(0, -1)))
    }
  }

  const parsedItems = props.items
    ? mapToNewObject(props.items as Array<T>)
    : mapToNewObject(
        Children.map(
          children as React.ReactNode,
          (child) => isValidElement(child) && child.props
        ) as Array<T>
      )

  console.log({ selectedKeys })

  const availableItemsToSelect = props.items
    ? parsedItems.filter((item) => ![...selectedKeys].includes(item.id as Key))
    : parsedItems

  const filteredChildren = props.items
    ? parsedItems.filter((item) => ![...selectedKeys].includes(item.id as Key))
    : Children.map(
        children as React.ReactNode,
        (child) => isValidElement(child) && child.props
      )?.filter((item: T & any) => ![...selectedKeys].includes(item.id))

  const itemsToRender = props.items

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
          {props.label && (
            <Label onClick={() => inputRef.current?.focus()}>
              {props.label}
            </Label>
          )}
          <FieldGroup
            ref={triggerRef as RefObject<HTMLDivElement>}
            isDisabled={isDisabled}
            isInvalid={isInvalid}
          >
            <TagGroup
              onRemove={removeItem}
              aria-hidden
              aria-label="Selected items"
            >
              <TagList
                className="gap-1 px-1.5 py-1 outline-hidden [[role='row']]:last:-mr-1"
                items={[...selectedKeys].map((key) => ({
                  id: key,
                  textValue: parsedItems.find((item) => item.id === key)
                    ?.textValue as string,
                }))}
              >
                {(item: { id: Key; textValue: Key }) => (
                  <Tag
                    className="bg-secondary/50 text-secondary-foreground rounded-[calc(var(--radius-sm)-1px)]"
                    isDisabled={isDisabled}
                    textValue={item.textValue as string}
                  >
                    {item.textValue as string}
                  </Tag>
                )}
              </TagList>
            </TagGroup>
            <ComboBox
              isRequired={props.isRequired}
              validate={props.validate}
              validationBehavior={props.validationBehavior}
              isReadOnly={isMax}
              isDisabled={isDisabled}
              className="flex flex-1"
              aria-label="Search"
              onSelectionChange={addItem}
              inputValue={inputValue}
              onInputChange={isMax ? () => {} : setInputValue}
            >
              <div className="flex w-full flex-row items-center justify-between pr-2">
                <Input
                  className="px-0 sm:px-0"
                  onFocus={() => triggerButtonRef.current?.click()}
                  ref={inputRef as RefObject<HTMLInputElement>}
                  onBlur={() => {
                    setInputValue("")
                  }}
                  onKeyDownCapture={onKeyDownCapture}
                  placeholder={isMax ? "Maximum reached" : props.placeholder}
                />
                <Button
                  ref={triggerButtonRef}
                  aria-label="Open"
                  className="text-muted-foreground ml-auto inline-flex items-center justify-center rounded-lg outline-hidden"
                >
                  <ChevronsUpDownIcon
                    data-slot="chevron"
                    className="text-muted-foreground group-open:text-foreground size-4"
                  />
                </Button>
              </div>
              <PopoverContent
                isOpen
                className="min-w-(--trigger-width) scroll-py-1 overflow-y-auto overscroll-contain"
                triggerRef={triggerRef}
              >
                <ListBox
                  selectionMode="multiple"
                  className={composeTailwindRenderProps(
                    className,
                    "grid max-h-96 w-full grid-cols-[auto_1fr] flex-col gap-y-1 p-1 outline-hidden *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1"
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
                  items={itemsToRender}
                  {...props}
                >
                  {(item: { id: Key; textValue: string }) => (
                    <ListBox.Item
                      key={item.id}
                      id={item.id}
                      textValue={item.textValue}
                    >
                      {item.textValue}
                    </ListBox.Item>
                  )}
                </ListBox>
              </PopoverContent>
            </ComboBox>
          </FieldGroup>
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

MultipleSelect.Item = DropdownItem
MultipleSelect.Label = DropdownLabel
MultipleSelect.Section = DropdownSection

export { MultipleSelect }
export type { MultipleSelectProps }
