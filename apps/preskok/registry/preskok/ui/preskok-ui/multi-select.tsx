"use client"

import {
  Children,
  isValidElement,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react"
import { PlusIcon } from "lucide-react"
import { Autocomplete, useFilter } from "react-aria-components/Autocomplete"
import {
  Select,
  SelectValue,
  type SelectProps,
} from "react-aria-components/Select"

import { cx } from "@/registry/preskok/lib/primitive"

import { Button } from "./button"
import { fieldStyles } from "./field"
import { ListBox, ListBoxItem } from "./list-box"
import { PopoverContent } from "./popover"
import { SearchField, SearchInput } from "./search-field"
import { Tag, TagGroup, TagList } from "./tag-group"

interface OptionBase {
  id: string | number
  name: string
}

interface MultiSelectProps<T extends OptionBase> extends Omit<
  SelectProps<T, "multiple">,
  "selectionMode" | "children"
> {
  placeholder?: string
  className?: string
  children?: ReactNode
  name?: string
}

interface MultiSelectContentProps<T extends OptionBase> {
  items: Iterable<T>
  children: (item: T) => ReactNode
}

function MultiSelectContent<T extends OptionBase>(
  _props: MultiSelectContentProps<T>
) {
  return null
}

function isMultiSelectContent<T extends OptionBase>(
  child: ReactNode
): child is ReactElement<MultiSelectContentProps<T>> {
  return isValidElement(child) && child.type === MultiSelectContent
}

function MultiSelect<T extends OptionBase>({
  placeholder = "No selected items",
  className,
  children,
  name,
  ...props
}: MultiSelectProps<T>) {
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const { contains } = useFilter({ sensitivity: "base" })

  const childArray = Children.toArray(children)
  const contentIndex = childArray.findIndex((child) =>
    isMultiSelectContent<T>(child)
  )
  let before = childArray
  let after: ReactNode[] = []
  let content: MultiSelectContentProps<T> | null = null

  if (contentIndex >= 0) {
    const contentElement = childArray[contentIndex]

    if (isMultiSelectContent<T>(contentElement)) {
      before = childArray.slice(0, contentIndex)
      after = childArray.slice(contentIndex + 1)
      content = contentElement.props
    }
  }

  return (
    <Select
      name={name}
      data-slot="control"
      className={cx(fieldStyles(), className)}
      selectionMode="multiple"
      {...props}
    >
      {before}
      {content && (
        <>
          <div
            data-slot="control"
            ref={triggerRef}
            className="flex w-full items-center gap-2 rounded-lg border p-1"
          >
            <SelectValue<T> className="flex-1">
              {({ selectedItems, state }) => (
                <TagGroup
                  aria-label="Selected items"
                  onRemove={(keys) => {
                    if (Array.isArray(state.value)) {
                      state.setValue(state.value.filter((k) => !keys.has(k)))
                    }
                  }}
                >
                  <TagList
                    items={selectedItems.filter((i) => i != null)}
                    renderEmptyState={() => (
                      <i className="pl-2 text-sm text-muted-foreground">
                        {placeholder}
                      </i>
                    )}
                  >
                    {(item) => <Tag className="rounded-md">{item.name}</Tag>}
                  </TagList>
                </TagGroup>
              )}
            </SelectValue>
            <Button
              intent="secondary"
              size="sq-xs"
              className="self-end rounded-[calc(var(--radius-lg)-(--spacing(1)))]"
            >
              <PlusIcon data-slot="icon" />
            </Button>
          </div>
          <PopoverContent
            triggerRef={triggerRef}
            placement="bottom"
            className="flex w-full flex-col"
          >
            <Autocomplete filter={contains}>
              <SearchField autoFocus className="rounded-none outline-hidden">
                <SearchInput className="border-none outline-hidden focus:ring-0" />
              </SearchField>
              <ListBox
                className="rounded-t-none border-0 border-t bg-transparent shadow-none"
                items={content.items}
              >
                {content.children}
              </ListBox>
            </Autocomplete>
          </PopoverContent>
        </>
      )}
      {after}
    </Select>
  )
}

const MultiSelectItem = ListBoxItem

export { MultiSelect, MultiSelectContent, MultiSelectItem }
