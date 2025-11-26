import type { SyntheticEvent } from "react"
import * as React from "react"
import { ChevronsUpDownIcon, XIcon } from "lucide-react"

import {
  ChangeHandler,
  useControllableState,
} from "@/registry/preskok/hooks/use-controllable-state"
import { cn } from "@/registry/preskok/lib/utils"
import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"
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
  ComboboxProps,
  ComboboxTrigger,
} from "@/registry/preskok/ui/preskok-ui/multiselect/combobox-base"

const DEFAULT_PLACEHOLDER = "Select..."

interface MultiselectProps<
  TOption,
  Multiple extends boolean | undefined = false,
> extends ComboboxProps<TOption, Multiple> {
  itemLabel?: keyof NonNullable<TOption>
  itemValue?: keyof NonNullable<TOption>

  title?: string
  placeholder?: string
  filteringPlaceholder?: string
  hasFooter?: boolean
  onClear?: () => void
  onApply?: () => void
  isPending?: boolean
  isFetching?: boolean
}

/**
 * Creates a function to render item labels based on the itemLabel prop.
 */
function createItemRenderer<TOption>(itemLabel?: keyof TOption) {
  return (item: TOption): string => {
    if (itemLabel && typeof item === "object" && item !== null) {
      const val = item[itemLabel]
      return String(val)
    }
    return String(item)
  }
}

/**
 * Creates a function to compare items for equality based on the itemValue prop.
 */
function createItemComparator<TOption>(
  itemValueKey?: keyof NonNullable<TOption>
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

/**
 * Normalizes the value to ensure it matches items from the items array.
 */
function normalizeValue<TOption, Multiple extends boolean | undefined>(
  value: ComboboxProps<TOption, Multiple>["value"],
  items: ComboboxProps<TOption, Multiple>["items"],
  multiple: Multiple,
  isItemEqualToValue: (item: TOption, selected: TOption) => boolean
): typeof value {
  if (!items || items.length === 0 || value == null) {
    return value
  }

  const flatItems: Array<TOption> = []
  for (const item of items) {
    if (typeof item === "object" && item !== null && "items" in item) {
      flatItems.push(...(item as { items: Array<TOption> }).items)
    } else {
      flatItems.push(item)
    }
  }

  if (multiple) {
    const currentValue = Array.isArray(value) ? value : []
    if (currentValue.length === 0) {
      return value
    }

    const normalized = currentValue
      .map(
        (selectedItem) =>
          flatItems.find((item) =>
            isItemEqualToValue(item, selectedItem as TOption)
          ) ?? selectedItem
      )
      .filter((item) =>
        flatItems.some((currentItem) =>
          isItemEqualToValue(currentItem, item as TOption)
        )
      ) as typeof value

    return normalized
  }

  const matchingItem = flatItems.find((item) =>
    isItemEqualToValue(item, value as TOption)
  )
  return (matchingItem ?? value) as typeof value
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
      onClick={onClick}
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

interface ComboboxTriggerInnerProps<
  TOption,
  Multiple extends boolean | undefined,
> {
  multiple: Multiple
  normalizedValue: ComboboxProps<TOption, Multiple>["value"]
  title?: string
  placeholder?: string
  selectedValueLabel?: string | null
  disabled?: boolean
  onClear?: (event: SyntheticEvent<HTMLElement>) => void
}

/**
 * Renders the trigger content based on selection state.
 */
function ComboboxTriggerInner<TOption, Multiple extends boolean | undefined>({
  multiple,
  normalizedValue,
  title,
  placeholder,
  selectedValueLabel,
  disabled,
  onClear,
}: ComboboxTriggerInnerProps<TOption, Multiple>) {
  const isSingleSelectWithValue = !multiple && normalizedValue != null

  if (isSingleSelectWithValue) {
    return (
      <div className="flex flex-1 items-center gap-2">
        <ClearButton onClick={onClear} disabled={disabled} />
        {title && (
          <span
            className={cn("shrink-0 truncate text-left", {
              "border-border border-r pr-2": !!selectedValueLabel,
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
export function Multiselect<
  TOption,
  Multiple extends boolean | undefined = false,
>({
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
  ...rest
}: MultiselectProps<TOption, Multiple>) {
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen,
    onChange: onOpenChange as ChangeHandler<boolean>,
    caller: "Multiselect",
  })

  const defaultRenderItem = createItemRenderer(itemLabel)

  const isItemEqualToValue = createItemComparator(
    itemValueKey as keyof NonNullable<TOption>
  )

  const normalizedValue = normalizeValue(
    value as ComboboxProps<NonNullable<TOption>, Multiple>["value"],
    items,
    multiple,
    isItemEqualToValue
  ) as ComboboxProps<TOption, Multiple>["value"]

  const handleClearAll = React.useCallback(
    (event: SyntheticEvent<HTMLElement>) => {
      event.stopPropagation()
      onClear?.()
      setIsOpen(false)
    },
    [onClear, setIsOpen]
  )

  const handleApply = React.useCallback(() => {
    onApply?.()
    setIsOpen(false)
  }, [onApply, setIsOpen])

  const handleValueChange = React.useCallback(
    (
      newValue: Parameters<NonNullable<typeof onValueChange>>[0],
      reason?: Parameters<NonNullable<typeof onValueChange>>[1]
    ) => {
      if (!onValueChange) {
        return
      }

      // In single-select mode, if clicking the already-selected item, reset to null
      if (!multiple && normalizedValue != null) {
        const isSameValue = isItemEqualToValue(
          newValue as NonNullable<TOption>,
          normalizedValue as NonNullable<TOption>
        )
        if (isSameValue) {
          onValueChange(
            null as Parameters<typeof onValueChange>[0],
            reason ?? ({} as Parameters<typeof onValueChange>[1])
          )
          return
        }
      }

      onValueChange(
        newValue,
        reason ?? ({} as Parameters<typeof onValueChange>[1])
      )
    },
    [multiple, normalizedValue, isItemEqualToValue, onValueChange]
  )

  const valueArray = Array.isArray(normalizedValue) ? normalizedValue : []
  const isSingleSelectWithValue = !multiple && normalizedValue != null
  const selectedValueLabel = isSingleSelectWithValue
    ? defaultRenderItem(normalizedValue as NonNullable<TOption>)
    : null
  const hasClearEnabled = valueArray.length > 0

  return (
    <Combobox
      items={items}
      value={normalizedValue}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={setIsOpen}
      multiple={multiple}
      disabled={disabled}
      isItemEqualToValue={isItemEqualToValue}
      {...rest}
    >
      <ComboboxTrigger
        disabled={disabled}
        className={cn(
          "bg-grey-210 w-full justify-between",
          title && "min-h-10",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <ComboboxTriggerInner
          multiple={multiple}
          normalizedValue={normalizedValue}
          title={title}
          placeholder={placeholder}
          selectedValueLabel={selectedValueLabel}
          disabled={disabled}
          onClear={handleClearAll}
        />

        <div className="flex shrink-0 items-center gap-1">
          {hasClearEnabled && multiple && (
            <ActiveCountIndicatorWrapper>
              {valueArray.length}
              <ClearButton onClick={handleClearAll} disabled={disabled} />
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
            placeholder={filteringPlaceholder || `Type to search...`}
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
                const itemValue = defaultRenderItem(
                  item as NonNullable<TOption>
                )

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
            onReset={onClear}
            applyText="Apply"
            resetText="Reset"
          />
        )}
      </ComboboxContent>
    </Combobox>
  )
}
