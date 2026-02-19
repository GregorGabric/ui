import type { SyntheticEvent } from "react"
import * as React from "react"
import type { ComboboxRootProps } from "@base-ui-components/react/combobox"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"

import type { ChangeHandler } from "@/registry/preskok/hooks/use-controllable-state"
import { useControllableState } from "@/registry/preskok/hooks/use-controllable-state"
import { cn } from "@/registry/preskok/lib/utils"
import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"
import type { ComboboxProps } from "@/registry/preskok/ui/preskok-ui/multiselect/combobox-base"
import {
  ActiveCountIndicatorWrapper,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxFooter,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@/registry/preskok/ui/preskok-ui/multiselect/combobox-base"

const DEFAULT_PLACEHOLDER = "Select..."

type MultiselectOptionKey<TOption> = keyof Extract<NonNullable<TOption>, object>
type NoInferT<T> = [T][T extends unknown ? 0 : never]

interface MultiselectSharedProps<TOption> {
  items: MultiselectItems<TOption>
  itemLabel?: MultiselectOptionKey<TOption>
  itemValue?: MultiselectOptionKey<TOption>

  title?: string
  placeholder?: string
  filteringPlaceholder?: string
  hasFooter?: boolean
  onClear?: () => void
  onApply?: () => void
  isPending?: boolean
  isFetching?: boolean
}

type MultiselectItems<TOption> = NonNullable<
  ComboboxRootProps<TOption, false>["items"]
>

type MultiselectBaseProps<TOption, Multiple extends boolean | undefined> = Omit<
  ComboboxRootProps<TOption, Multiple>,
  "items" | "multiple" | "value" | "onValueChange"
>

type SingleChangeDetails<TOption> = Parameters<
  NonNullable<ComboboxRootProps<TOption, false>["onValueChange"]>
>[1]

type SingleValue<TOption> = Parameters<
  NonNullable<ComboboxRootProps<TOption, false>["onValueChange"]>
>[0]

type MultipleChangeDetails<TOption> = Parameters<
  NonNullable<ComboboxRootProps<TOption, true>["onValueChange"]>
>[1]

type MultipleValue<TOption> = Parameters<
  NonNullable<ComboboxRootProps<TOption, true>["onValueChange"]>
>[0]

type MultiselectSingleProps<TOption> = MultiselectBaseProps<TOption, false> & {
  multiple?: false
  value?: SingleValue<NoInferT<TOption>> | undefined
  onValueChange?: (
    value: SingleValue<NoInferT<TOption>>,
    eventDetails?: SingleChangeDetails<TOption>
  ) => void
}

type MultiselectMultipleProps<TOption> = MultiselectBaseProps<TOption, true> & {
  multiple: true
  value?: MultipleValue<NoInferT<TOption>> | undefined
  onValueChange?: (
    value: MultipleValue<NoInferT<TOption>>,
    eventDetails?: MultipleChangeDetails<TOption>
  ) => void
}

type MultiselectProps<TOption> =
  | (MultiselectSingleProps<TOption> & MultiselectSharedProps<TOption>)
  | (MultiselectMultipleProps<TOption> & MultiselectSharedProps<TOption>)

function getMultipleComboboxProps<TOption>(
  props: MultiselectMultipleProps<TOption> & MultiselectSharedProps<TOption>
): MultiselectBaseProps<TOption, true> {
  const {
    itemLabel: _itemLabel,
    itemValue: _itemValue,
    title: _title,
    placeholder: _placeholder,
    filteringPlaceholder: _filteringPlaceholder,
    hasFooter: _hasFooter,
    onClear: _onClear,
    onApply: _onApply,
    isPending: _isPending,
    isFetching: _isFetching,
    ...comboboxProps
  } = props

  return comboboxProps
}

function getSingleComboboxProps<TOption>(
  props: MultiselectSingleProps<TOption> & MultiselectSharedProps<TOption>
): MultiselectBaseProps<TOption, false> {
  const {
    itemLabel: _itemLabel,
    itemValue: _itemValue,
    title: _title,
    placeholder: _placeholder,
    filteringPlaceholder: _filteringPlaceholder,
    hasFooter: _hasFooter,
    onClear: _onClear,
    onApply: _onApply,
    isPending: _isPending,
    isFetching: _isFetching,
    multiple: _multiple,
    ...comboboxProps
  } = props

  return comboboxProps
}

/**
 * Creates a function to render item labels based on the itemLabel prop.
 */
function createItemRenderer<TOption>(
  itemLabel?: MultiselectOptionKey<TOption>
) {
  return (item: TOption): string => {
    if (itemLabel && typeof item === "object" && item !== null) {
      const val = (item as Extract<NonNullable<TOption>, object>)[itemLabel]
      return String(val)
    }
    return String(item)
  }
}

/**
 * Creates a function to compare items for equality based on the itemValue prop.
 */
function createItemComparator<TOption>(
  itemValueKey?: MultiselectOptionKey<TOption>
) {
  return (itemValue: TOption, selectedValue: TOption): boolean => {
    if (
      itemValueKey &&
      typeof itemValue === "object" &&
      typeof selectedValue === "object" &&
      itemValue !== null &&
      selectedValue !== null
    ) {
      return (
        (itemValue as NonNullable<TOption>)[itemValueKey] ===
        (selectedValue as NonNullable<TOption>)[itemValueKey]
      )
    }
    return itemValue === selectedValue
  }
}

function isItemGroup<TOption>(
  item: unknown
): item is { items: Array<TOption> } {
  return (
    typeof item === "object" &&
    item !== null &&
    "items" in item &&
    Array.isArray((item as { items?: unknown }).items)
  )
}

function flattenItems<TOption>(items: ComboboxProps<TOption>["items"]) {
  if (!items?.length) {
    return [] as Array<TOption>
  }

  const flatItems: Array<TOption> = []

  for (const item of items) {
    if (isItemGroup<TOption>(item)) {
      flatItems.push(...item.items)
      continue
    }

    flatItems.push(item as TOption)
  }

  return flatItems
}

/**
 * Normalizes single-select value to match item references in the items array.
 */
function normalizeSingleValue<TOption>(
  value: SingleValue<TOption>,
  items: ComboboxProps<TOption>["items"],
  isItemEqualToValue: (item: TOption, selected: TOption) => boolean
): SingleValue<TOption> {
  if (value == null) {
    return value
  }

  const flatItems = flattenItems<TOption>(items)
  if (flatItems.length === 0) {
    return value
  }

  const matchingItem = flatItems.find((item) => isItemEqualToValue(item, value))

  return matchingItem ?? value
}

/**
 * Normalizes multi-select values to match item references in the items array.
 */
function normalizeMultipleValue<TOption>(
  value: MultipleValue<TOption> | undefined,
  items: ComboboxProps<TOption>["items"],
  isItemEqualToValue: (item: TOption, selected: TOption) => boolean
): MultipleValue<TOption> | undefined {
  if (!value?.length) {
    return value
  }

  const flatItems = flattenItems<TOption>(items)
  if (!flatItems.length) {
    return value
  }

  return value.map((selectedItem) => {
    const matchingItem = flatItems.find((item) =>
      isItemEqualToValue(item, selectedItem)
    )

    return matchingItem ?? selectedItem
  })
}

interface ClearButtonProps {
  onClick: ((event: SyntheticEvent<HTMLElement>) => void) | undefined
  disabled?: boolean
  className?: string
}

/**
 * Clear button component for removing selections.
 */
function ClearButton({ onClick, disabled, className }: ClearButtonProps) {
  if (disabled) {
    return null
  }

  return (
    <span
      onMouseDown={onClick}
      className={cn(
        "m-0 flex shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0",
        className
      )}
      aria-label="Clear selection"
    >
      <XIcon className="size-4 opacity-60 hover:opacity-100" />
    </span>
  )
}

interface ComboboxTriggerInnerProps<TOption> {
  multiple: boolean
  normalizedValue:
    | ComboboxProps<TOption>["value"]
    | ComboboxProps<TOption, true>["value"]
  title?: string
  placeholder?: string
  selectedValueLabel?: string | null
  disabled?: boolean
  onClear?: (event: SyntheticEvent<HTMLElement>) => void
}

/**
 * Renders the trigger content based on selection state.
 */
function ComboboxTriggerInner<TOption>({
  multiple,
  normalizedValue,
  title,
  placeholder,
  selectedValueLabel,
  disabled,
  onClear,
}: ComboboxTriggerInnerProps<TOption>) {
  const isSingleSelectWithValue = !multiple && normalizedValue != null

  if (isSingleSelectWithValue) {
    return (
      <div className="flex flex-1 items-center gap-2">
        <ClearButton onClick={onClear} disabled={disabled} />
        {title && (
          <span
            className={cn("shrink-0 truncate text-left", {
              "border-border border-r pr-2": Boolean(selectedValueLabel),
            })}
          >
            {title}
          </span>
        )}
        <Badge intent="info" isCircle={false} className="truncate">
          {selectedValueLabel}
        </Badge>
      </div>
    )
  }

  return (
    <span className="flex-1 truncate text-left">{title || placeholder}</span>
  )
}

/**
 * Multiselect - A fully controlled multiselect component
 * Extends Base UI Combobox with filter-specific UI (sticky search, footer, title).
 */
export function Multiselect<TOption>(props: MultiselectProps<TOption>) {
  const {
    items,
    value,
    onValueChange,
    open,
    defaultOpen = false,
    onOpenChange,
    itemLabel,
    itemValue: itemValueKey,
    title,
    placeholder = DEFAULT_PLACEHOLDER,
    filteringPlaceholder,
    hasFooter = true,
    onClear,
    onApply,
    disabled = false,
    isPending = false,
    isFetching = false,
    multiple,
  } = props

  const hasOpenProp = open !== undefined
  const hasValueProp = value !== undefined

  const isMultiple = multiple === true
  const openProp = hasOpenProp && open === undefined ? false : open

  const [isOpen, setIsOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange as ChangeHandler<boolean>,
    caller: "Multiselect",
  })

  const defaultRenderItem = createItemRenderer(itemLabel)

  const isItemEqualToValue = createItemComparator(itemValueKey)

  const controlledValue = React.useMemo(() => {
    if (!hasValueProp) {
      return value
    }

    if (isMultiple) {
      return Array.isArray(value) ? value : []
    }

    return value ?? null
  }, [hasValueProp, isMultiple, value])

  const normalizedSingleValue = React.useMemo(() => {
    let singleValue: SingleValue<TOption> = null

    if (!isMultiple && !Array.isArray(controlledValue)) {
      singleValue = controlledValue ?? null
    }

    return normalizeSingleValue(singleValue, items, isItemEqualToValue)
  }, [controlledValue, isMultiple, items, isItemEqualToValue])

  const normalizedMultipleValue = React.useMemo(() => {
    if (!isMultiple) {
      return normalizeMultipleValue(undefined, items, isItemEqualToValue)
    }

    const multipleValue = Array.isArray(controlledValue) ? controlledValue : []
    return normalizeMultipleValue(multipleValue, items, isItemEqualToValue)
  }, [controlledValue, isMultiple, items, isItemEqualToValue])

  const normalizedValue = isMultiple
    ? normalizedMultipleValue
    : normalizedSingleValue

  const emitSingleValueChange = React.useCallback(
    (
      nextValue: SingleValue<TOption>,
      details?: SingleChangeDetails<TOption>
    ) => {
      const handler =
        onValueChange as MultiselectSingleProps<TOption>["onValueChange"]

      if (!handler) {
        return
      }

      handler(nextValue, details)
    },
    [onValueChange]
  )

  const emitMultipleValueChange = React.useCallback(
    (
      nextValue: MultipleValue<TOption>,
      details?: MultipleChangeDetails<TOption>
    ) => {
      const handler =
        onValueChange as MultiselectMultipleProps<TOption>["onValueChange"]

      if (!handler) {
        return
      }

      handler(nextValue, details)
    },
    [onValueChange]
  )

  const clearSelection = React.useCallback(
    (event?: SyntheticEvent<HTMLElement>) => {
      event?.preventDefault()
      event?.stopPropagation()

      if (isMultiple) {
        emitMultipleValueChange([])
      } else {
        emitSingleValueChange(null)
      }

      onClear?.()
      setIsOpen(false)
    },
    [
      emitMultipleValueChange,
      emitSingleValueChange,
      isMultiple,
      onClear,
      setIsOpen,
    ]
  )

  const handleApply = React.useCallback(() => {
    onApply?.()
    setIsOpen(false)
  }, [onApply, setIsOpen])

  const handleSingleValueChange = React.useCallback<
    NonNullable<ComboboxProps<TOption>["onValueChange"]>
  >(
    (newValue, reason) => {
      const nextValue = newValue ?? null

      if (
        normalizedSingleValue != null &&
        nextValue != null &&
        isItemEqualToValue(nextValue, normalizedSingleValue)
      ) {
        emitSingleValueChange(null, reason)
        return
      }

      emitSingleValueChange(nextValue, reason)
    },
    [emitSingleValueChange, isItemEqualToValue, normalizedSingleValue]
  )

  const handleMultipleValueChange = React.useCallback<
    NonNullable<ComboboxProps<TOption, true>["onValueChange"]>
  >(
    (newValue, reason) => {
      if (!Array.isArray(newValue)) {
        emitMultipleValueChange([], reason)
        return
      }

      emitMultipleValueChange(newValue, reason)
    },
    [emitMultipleValueChange]
  )

  const valueArray = normalizedMultipleValue ?? []
  const isSingleSelectWithValue = !isMultiple && normalizedSingleValue != null
  const selectedValueLabel = isSingleSelectWithValue
    ? defaultRenderItem(normalizedSingleValue)
    : null
  const hasClearEnabled = isMultiple
    ? valueArray.length > 0
    : isSingleSelectWithValue

  const comboboxChildren = (
    <>
      <ComboboxTrigger
        disabled={disabled}
        className={cn(
          "bg-grey-210 w-full justify-between",
          title && "min-h-10",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <ComboboxTriggerInner
          multiple={isMultiple}
          normalizedValue={normalizedValue}
          title={title}
          placeholder={placeholder}
          selectedValueLabel={selectedValueLabel}
          disabled={disabled}
          onClear={clearSelection}
        />

        <div className="flex shrink-0 items-center gap-1">
          {hasClearEnabled && isMultiple && (
            <ActiveCountIndicatorWrapper>
              {valueArray.length}
              <ClearButton onClick={clearSelection} disabled={disabled} />
            </ActiveCountIndicatorWrapper>
          )}
          <ComboboxIcon className="flex">
            <ChevronsUpDownIcon className="size-4" />
          </ComboboxIcon>
        </div>
      </ComboboxTrigger>

      <ComboboxContent
        className={cn(
          "max-h-[24rem] w-auto overflow-hidden p-0",
          "[--input-container-height:calc(3rem+--spacing(2))]",
          hasFooter && "[--footer-height:3.5rem]",
          !hasFooter && "[--footer-height:0rem]"
        )}
      >
        <div className="border-border bg-muted h-[var(--input-container-height)] w-full border-b p-2 text-center">
          <ComboboxInput
            placeholder={filteringPlaceholder || "Type to search..."}
            isFetching={isFetching}
            className="bg-background"
            disabled={disabled}
          />
        </div>

        {isPending ? (
          <div className="text-muted-foreground p-4 text-center text-sm">
            <Loader variant="spin" size="sm" className="mx-auto mb-[4px]" />
          </div>
        ) : (
          <>
            <ComboboxList
              className={cn(
                "scroll-py-2 overflow-y-auto overscroll-contain p-1",
                "max-h-[min(calc(24rem-var(--input-container-height)-var(--footer-height)),calc(var(--available-height)-var(--input-container-height)-var(--footer-height)))]",
                "empty:p-0"
              )}
            >
              {(item: TOption, index: number) => {
                const itemValue = defaultRenderItem(item)

                return (
                  <ComboboxItem key={index} value={item}>
                    <ComboboxItemIndicator />
                    <span className="truncate">{itemValue}</span>
                  </ComboboxItem>
                )
              }}
            </ComboboxList>
            <ComboboxEmpty className="text-muted-foreground p-2 text-center text-sm">
              No options found
            </ComboboxEmpty>
          </>
        )}
        {hasFooter && (
          <ComboboxFooter
            className="bg-background"
            onApply={handleApply}
            onReset={() => clearSelection()}
            applyText="Apply"
            resetText="Reset"
          />
        )}
      </ComboboxContent>
    </>
  )

  if (props.multiple) {
    const multipleProps = getMultipleComboboxProps(props)

    return (
      <Combobox<TOption, true>
        {...multipleProps}
        items={items}
        value={normalizedMultipleValue ?? []}
        onValueChange={handleMultipleValueChange}
        open={isOpen}
        onOpenChange={setIsOpen}
        multiple
        disabled={disabled}
        isItemEqualToValue={isItemEqualToValue}
      >
        {comboboxChildren}
      </Combobox>
    )
  }

  const singleProps = getSingleComboboxProps(props)

  return (
    <Combobox<TOption>
      {...singleProps}
      items={items}
      value={normalizedSingleValue as ComboboxProps<TOption>["value"]}
      onValueChange={handleSingleValueChange}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={disabled}
      isItemEqualToValue={isItemEqualToValue}
    >
      {comboboxChildren}
    </Combobox>
  )
}
