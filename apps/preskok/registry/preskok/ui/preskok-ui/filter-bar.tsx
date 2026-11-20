"use client"

import {
  createContext,
  use,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react"
import {
  getLocalTimeZone,
  parseDate,
  today,
  type CalendarDate,
} from "@internationalized/date"
import { twMerge } from "cn"
import { ChevronLeftIcon, ListFilterIcon, XIcon } from "lucide-react"
import { Autocomplete, useFilter } from "react-aria-components/Autocomplete"
import { Button as ButtonPrimitive } from "react-aria-components/Button"
import { Dialog } from "react-aria-components/Dialog"
import { useLocale } from "react-aria-components/I18nProvider"
import { Menu as MenuPrimitive } from "react-aria-components/Menu"
import { DialogTrigger } from "react-aria-components/Popover"

import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { Keyboard } from "./keyboard"
import { ListBox, ListBoxItem } from "./list-box"
import {
  Menu,
  MenuContent,
  menuContentStyles,
  MenuItem,
  MenuLabel,
  MenuSection,
  MenuSubMenu,
} from "./menu"
import { PopoverContent } from "./popover"
import { RangeCalendar } from "./range-calendar"
import { SearchField, SearchInput } from "./search-field"

/* -------------------------------------------------------------------------------------------------
 * Model
 * -----------------------------------------------------------------------------------------------*/

type FilterIcon = ComponentType<{ className?: string; "aria-hidden"?: boolean }>

/**
 * What kind of value a field holds, which decides its operators and its value editor.
 * - `text`: free text (`contains`, `is`, …)
 * - `number`: a number (`is`, `is less than`, `is between`, …)
 * - `select`: one of `options` per row; a row value may also be an array of option values (tags)
 * - `boolean`: yes or no, set straight from the "+ Filter" menu
 * - `date`: a day (`is`, `is before`, `is after`, `is between` with presets)
 */
type FilterVariant = "text" | "number" | "select" | "boolean" | "date"

type FilterOperator =
  | "contains"
  | "notContains"
  | "is"
  | "isNot"
  | "isAnyOf"
  | "isNoneOf"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "between"
  | "before"
  | "after"
  | "isEmpty"
  | "isNotEmpty"

/** A day range as ISO dates (`2026-11-20`). */
interface FilterDateRange {
  start: string
  end: string
}

/**
 * A filter's value, by variant and operator:
 * text `string`, number `number | null` (`between`: `[min, max]`), select `Array<string>`,
 * boolean `boolean`, date ISO `string` (`between`: `{ start, end }`). Operators without a value
 * (`isEmpty`, `isNotEmpty`) keep `null`.
 */
type FilterValue =
  | string
  | number
  | boolean
  | Array<string>
  | [number | null, number | null]
  | FilterDateRange
  | null

interface Filter {
  /** Unique per filter. Fields can be filtered once, so the field id is used. */
  id: string
  field: string
  operator: FilterOperator
  value: FilterValue
}

interface FilterOption {
  value: string
  label: string
  icon?: FilterIcon
}

interface FilterField {
  id: string
  label: string
  variant: FilterVariant
  icon?: FilterIcon
  /** Section title in the "+ Filter" menu. Fields keep the order they are passed in. */
  group?: string
  /** Values for `select` (and the labels shown for `boolean`, defaulting to Yes / No). */
  options?: Array<FilterOption>
  /** `select` only: allow picking several values (default `true`). */
  multiple?: boolean
  /** Restrict or reorder the operators; the first one is the default. */
  operators?: Array<FilterOperator>
  placeholder?: string
  /** Shown after number values, e.g. `km` or `€`. */
  unit?: string
}

const operatorLabels: Record<FilterOperator, string> = {
  contains: "contains",
  notContains: "does not contain",
  is: "is",
  isNot: "is not",
  isAnyOf: "is any of",
  isNoneOf: "is none of",
  lt: "is less than",
  lte: "is at most",
  gt: "is greater than",
  gte: "is at least",
  between: "is between",
  before: "is before",
  after: "is after",
  isEmpty: "is empty",
  isNotEmpty: "is not empty",
}

const operatorsByVariant: Record<FilterVariant, Array<FilterOperator>> = {
  text: ["contains", "notContains", "is", "isNot", "isEmpty", "isNotEmpty"],
  number: [
    "is",
    "isNot",
    "lt",
    "lte",
    "gt",
    "gte",
    "between",
    "isEmpty",
    "isNotEmpty",
  ],
  select: ["isAnyOf", "isNoneOf", "isEmpty", "isNotEmpty"],
  boolean: ["is"],
  date: ["between", "is", "before", "after", "isEmpty", "isNotEmpty"],
}

const valuelessOperators = new Set<FilterOperator>(["isEmpty", "isNotEmpty"])

function getFilterOperators(field: FilterField) {
  return field.operators ?? operatorsByVariant[field.variant]
}

function isValuelessOperator(operator: FilterOperator) {
  return valuelessOperators.has(operator)
}

/** The empty value an operator starts with, keeping what still fits when the operator changes. */
function getInitialValue(
  field: FilterField,
  operator: FilterOperator,
  previous: FilterValue = null
): FilterValue {
  if (isValuelessOperator(operator)) return null

  switch (field.variant) {
    case "text":
      return typeof previous === "string" ? previous : ""
    case "number":
      if (operator === "between") {
        return [typeof previous === "number" ? previous : null, null]
      }
      if (typeof previous === "number") return previous
      return Array.isArray(previous) && typeof previous[0] === "number"
        ? previous[0]
        : null
    case "select":
      return Array.isArray(previous) &&
        previous.every((item) => typeof item === "string")
        ? previous
        : []
    case "boolean":
      return typeof previous === "boolean" ? previous : true
    case "date":
      if (operator === "between") {
        return typeof previous === "string"
          ? { start: previous, end: previous }
          : { start: "", end: "" }
      }
      if (typeof previous === "string") return previous
      return isDateRange(previous) ? previous.start : ""
  }
}

function createFilter(
  field: FilterField,
  operator = getFilterOperators(field)[0],
  value?: FilterValue
): Filter {
  return {
    id: field.id,
    field: field.id,
    operator,
    value: value ?? getInitialValue(field, operator),
  }
}

function isDateRange(value: unknown): value is FilterDateRange {
  return (
    typeof value === "object" &&
    value !== null &&
    "start" in value &&
    "end" in value
  )
}

function isStringList(value: FilterValue): value is Array<string> {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isNumberRange(
  value: FilterValue
): value is [number | null, number | null] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((item) => item === null || typeof item === "number")
  )
}

/** The selected option values of a `select` filter. */
function getSelectedValues(filter: Filter) {
  return isStringList(filter.value) ? filter.value : []
}

/** True when a filter narrows anything: it has a value, or its operator needs none. */
function isFilterActive(filter: Filter) {
  if (isValuelessOperator(filter.operator)) return true

  const { value } = filter
  if (value === null || value === "") return false
  if (isDateRange(value)) return Boolean(value.start || value.end)
  if (Array.isArray(value)) {
    return value.some((item) => item !== null && item !== "")
  }
  return true
}

/* -------------------------------------------------------------------------------------------------
 * Matching (client-side filtering)
 * -----------------------------------------------------------------------------------------------*/

function isEmptyCellValue(value: unknown) {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  return false
}

function toDayString(value: unknown) {
  if (value instanceof Date) {
    const month = String(value.getMonth() + 1).padStart(2, "0")
    const day = String(value.getDate()).padStart(2, "0")
    return `${value.getFullYear()}-${month}-${day}`
  }
  return typeof value === "string" ? value.slice(0, 10) : ""
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value
  if (typeof value === "string" && value.trim() !== "") return Number(value)
  return Number.NaN
}

function compareNumber(
  cell: number,
  operator: FilterOperator,
  value: FilterValue
) {
  if (operator === "between" && isNumberRange(value)) {
    const [min, max] = isNumberRange(value) ? value : [null, null]
    return (min === null || cell >= min) && (max === null || cell <= max)
  }
  if (typeof value !== "number") return true

  switch (operator) {
    case "is":
      return cell === value
    case "isNot":
      return cell !== value
    case "lt":
      return cell < value
    case "lte":
      return cell <= value
    case "gt":
      return cell > value
    case "gte":
      return cell >= value
    default:
      return true
  }
}

function compareDay(day: string, operator: FilterOperator, value: FilterValue) {
  if (operator === "between" && isDateRange(value)) {
    return (
      (!value.start || day >= value.start) && (!value.end || day <= value.end)
    )
  }
  if (typeof value !== "string" || !value) return true

  switch (operator) {
    case "is":
      return day === value
    case "isNot":
      return day !== value
    case "before":
      return day < value
    case "after":
      return day > value
    default:
      return true
  }
}

/**
 * Whether a cell value passes a filter. Inactive filters (no value yet) pass everything.
 * `rows.filter((row) => filters.every((filter) => matchesFilter(row[filter.field], filter)))`
 */
function matchesFilter(cellValue: unknown, filter: Filter): boolean {
  if (!isFilterActive(filter)) return true

  const { operator, value } = filter

  if (operator === "isEmpty") return isEmptyCellValue(cellValue)
  if (operator === "isNotEmpty") return !isEmptyCellValue(cellValue)
  if (isEmptyCellValue(cellValue)) return operator === "isNoneOf"

  if (typeof value === "boolean") return Boolean(cellValue) === value

  if (operator === "isAnyOf" || operator === "isNoneOf") {
    const cells = (Array.isArray(cellValue) ? cellValue : [cellValue]).map(
      String
    )
    const selected = isStringList(value) ? value : []
    const hasAny = cells.some((cell) => selected.includes(cell))
    return operator === "isAnyOf" ? hasAny : !hasAny
  }

  if (
    cellValue instanceof Date ||
    operator === "before" ||
    operator === "after" ||
    isDateRange(value)
  ) {
    return compareDay(toDayString(cellValue), operator, value)
  }

  if (typeof value === "number" || Array.isArray(value)) {
    const cell = toNumber(cellValue)
    return Number.isNaN(cell) ? false : compareNumber(cell, operator, value)
  }

  const cell = String(cellValue).toLocaleLowerCase()
  const query = (typeof value === "string" ? value : "").toLocaleLowerCase()

  switch (operator) {
    case "contains":
      return cell.includes(query)
    case "notContains":
      return !cell.includes(query)
    case "is":
      return cell === query
    case "isNot":
      return cell !== query
    default:
      return true
  }
}

/* -------------------------------------------------------------------------------------------------
 * Date presets
 * -----------------------------------------------------------------------------------------------*/

interface FilterDatePreset {
  id: string
  label: string
  getRange: (now: CalendarDate) => { start: CalendarDate; end: CalendarDate }
}

const filterDatePresets: Array<FilterDatePreset> = [
  {
    id: "today",
    label: "Today",
    getRange: (now) => ({ start: now, end: now }),
  },
  {
    id: "7d",
    label: "Last 7 days",
    getRange: (now) => ({ start: now.subtract({ days: 6 }), end: now }),
  },
  {
    id: "30d",
    label: "Last 30 days",
    getRange: (now) => ({ start: now.subtract({ days: 29 }), end: now }),
  },
  {
    id: "90d",
    label: "Last 90 days",
    getRange: (now) => ({ start: now.subtract({ days: 89 }), end: now }),
  },
  {
    id: "year",
    label: "This year",
    getRange: (now) => ({ start: now.set({ month: 1, day: 1 }), end: now }),
  },
]

function getPresetRange(preset: FilterDatePreset): FilterDateRange {
  const range = preset.getRange(today(getLocalTimeZone()))
  return { start: range.start.toString(), end: range.end.toString() }
}

function findPreset(range: FilterDateRange) {
  return filterDatePresets.find((preset) => {
    const presetRange = getPresetRange(preset)
    return presetRange.start === range.start && presetRange.end === range.end
  })
}

function parseDay(value: string) {
  try {
    return value ? parseDate(value) : null
  } catch {
    return null
  }
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

interface FilterBarContextValue {
  fields: Array<FilterField>
  filters: Array<Filter>
  setFilters: (filters: Array<Filter>) => void
  isMenuOpen: boolean
  setMenuOpen: (isOpen: boolean) => void
  addButtonRef: React.RefObject<HTMLButtonElement | null>
}

const FilterBarContext = createContext<FilterBarContextValue | null>(null)

function useFilterBar() {
  const context = use(FilterBarContext)
  if (!context) {
    throw new Error("FilterBar parts must be rendered inside <FilterBar>.")
  }
  return context
}

/** A key press that should open the "+ Filter" menu: the shortcut key outside text fields and overlays. */
function isShortcutEvent(event: KeyboardEvent, shortcut: string) {
  if (event.defaultPrevented || event.repeat) return false
  if (event.metaKey || event.ctrlKey || event.altKey) return false
  if (event.key.toLowerCase() !== shortcut.toLowerCase()) return false

  const { target } = event
  return (
    !(target instanceof Element) ||
    !target.closest(
      'input, textarea, select, [contenteditable="true"], [role="dialog"], [role="menu"], [role="listbox"], [role="grid"]'
    )
  )
}

/* -------------------------------------------------------------------------------------------------
 * FilterBar
 * -----------------------------------------------------------------------------------------------*/

interface FilterBarProps {
  fields: Array<FilterField>
  value?: Array<Filter>
  defaultValue?: Array<Filter>
  onChange?: (filters: Array<Filter>) => void
  /** Key that opens the "+ Filter" menu from anywhere on the page. `false` turns it off. */
  shortcut?: string | false
  className?: string
  children?: ReactNode
}

const noFilters: Array<Filter> = []

/**
 * A toolbar of filter chips. Compose it with `FilterBarItems` (the chips and "+ Filter") and
 * `FilterBarClear`, next to your own search field or sort button.
 */
function FilterBar({
  fields,
  value,
  defaultValue = noFilters,
  onChange,
  shortcut = "f",
  className,
  children,
}: FilterBarProps) {
  const [uncontrolledFilters, setUncontrolledFilters] = useState(defaultValue)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const filters = value ?? uncontrolledFilters

  const setFilters = (next: Array<Filter>) => {
    if (value === undefined) setUncontrolledFilters(next)
    onChange?.(next)
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!shortcut || !isShortcutEvent(event, shortcut)) return

    event.preventDefault()
    addButtonRef.current?.focus()
    setMenuOpen(true)
  })

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <FilterBarContext
      value={{
        fields,
        filters,
        setFilters,
        isMenuOpen,
        setMenuOpen,
        addButtonRef,
      }}
    >
      <div
        data-slot="filter-bar"
        className={twMerge("flex flex-wrap items-start gap-2", className)}
      >
        {children}
      </div>
    </FilterBarContext>
  )
}

/* -------------------------------------------------------------------------------------------------
 * FilterBarItems: the chips and "+ Filter"
 * -----------------------------------------------------------------------------------------------*/

interface FilterBarItemsProps {
  className?: string
}

function FilterBarItems({ className }: FilterBarItemsProps) {
  const { fields, filters } = useFilterBar()

  return (
    <div
      data-slot="filter-bar-items"
      role="list"
      aria-label="Filters"
      className={twMerge(
        "flex min-w-0 flex-1 flex-wrap items-center gap-2 max-sm:basis-full",
        className
      )}
    >
      {filters.map((filter) => {
        const field = fields.find((candidate) => candidate.id === filter.field)
        return field ? (
          <FilterChip key={filter.id} filter={filter} field={field} />
        ) : null
      })}
      <FilterAddMenu />
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * "+ Filter" menu
 * -----------------------------------------------------------------------------------------------*/

const booleanOptions = (field: FilterField): Array<FilterOption> =>
  field.options ?? [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ]

/**
 * "+ Filter": pick a field, then its value in the same popover (Linear-style). The filter is added
 * once it has a value, so the bar never shows an empty chip. Yes / No and date presets are picked
 * straight from submenus.
 */
function FilterAddMenu() {
  const { fields, filters, setFilters, isMenuOpen, setMenuOpen, addButtonRef } =
    useFilterBar()
  const { contains } = useFilter({ sensitivity: "base" })
  /** The filter being set up in the value step; `null` while picking a field. */
  const [draft, setDraft] = useState<Filter | null>(null)

  const shownFields = new Set(filters.map((filter) => filter.field))
  const addableFields = fields.filter((field) => !shownFields.has(field.id))
  const groups = Map.groupBy(addableFields, (field) => field.group ?? "")
  const draftField = draft
    ? fields.find((field) => field.id === draft.field)
    : undefined

  if (!addableFields.length && !isMenuOpen) return null

  const add = (filter: Filter) => {
    setFilters([...filters, filter])
    setDraft(null)
    setMenuOpen(false)
  }

  const onOpenChange = (isOpen: boolean) => {
    // Dismissing the value step keeps what was picked so far (e.g. several makes, then Escape).
    if (!isOpen && draft && isFilterActive(draft)) {
      setFilters([...filters, draft])
    }
    if (!isOpen) setDraft(null)
    setMenuOpen(isOpen)
  }

  const renderField = (field: FilterField) => {
    const Icon = field.icon
    const item = (
      <MenuItem key={field.id} id={field.id} textValue={field.label}>
        {Icon ? <Icon data-slot="icon" aria-hidden /> : null}
        <MenuLabel>{field.label}</MenuLabel>
      </MenuItem>
    )

    if (field.variant === "boolean") {
      return (
        <MenuSubMenu key={field.id}>
          {item}
          <MenuContent
            placement="end top"
            className="min-w-28"
            onAction={(key) =>
              add(createFilter(field, "is", key === `${field.id}:true`))
            }
          >
            {booleanOptions(field).map((option) => (
              <MenuItem key={option.value} id={`${field.id}:${option.value}`}>
                <MenuLabel>{option.label}</MenuLabel>
              </MenuItem>
            ))}
          </MenuContent>
        </MenuSubMenu>
      )
    }

    if (field.variant === "date") {
      return (
        <MenuSubMenu key={field.id}>
          {item}
          <MenuContent
            placement="end top"
            className="min-w-40"
            shouldCloseOnSelect={false}
            onAction={(key) => {
              const preset = filterDatePresets.find(
                (candidate) => `${field.id}:${candidate.id}` === key
              )
              if (preset) {
                add(createFilter(field, "between", getPresetRange(preset)))
              } else {
                setDraft(createFilter(field, "between"))
              }
            }}
          >
            {[
              ...filterDatePresets.map((preset) => (
                <MenuItem key={preset.id} id={`${field.id}:${preset.id}`}>
                  <MenuLabel>{preset.label}</MenuLabel>
                </MenuItem>
              )),
              <MenuItem key="custom" id={`${field.id}:custom`}>
                <MenuLabel>Custom range…</MenuLabel>
              </MenuItem>,
            ]}
          </MenuContent>
        </MenuSubMenu>
      )
    }

    return item
  }

  return (
    <DialogTrigger isOpen={isMenuOpen} onOpenChange={onOpenChange}>
      <Button
        ref={addButtonRef}
        intent={filters.length ? "plain" : "outline"}
        className="h-11 sm:h-9"
        data-slot="filter-bar-add"
      >
        <ListFilterIcon data-slot="icon" aria-hidden />
        {filters.length ? "Add filter" : "Filter"}
        <Keyboard className="ms-0.5 h-5 items-center rounded border border-foreground/15 px-1 text-[0.7rem]/none text-muted-foreground lg:inline-flex">
          F
        </Keyboard>
      </Button>
      <PopoverContent
        placement="bottom start"
        className="max-w-none min-w-0 overflow-hidden p-0"
      >
        <Dialog aria-label="Add filter" className="outline-hidden">
          {draft && draftField ? (
            <div>
              <div className="flex items-center gap-1 border-b border-foreground/10 p-1">
                <ButtonPrimitive
                  aria-label="Back to fields"
                  onPress={() => setDraft(null)}
                  className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:bg-accent"
                >
                  <ChevronLeftIcon className="size-4" aria-hidden />
                </ButtonPrimitive>
                <span className="text-sm font-medium">{draftField.label}</span>
                <span className="text-sm text-muted-foreground">
                  {getOperatorLabel(draft)}
                </span>
              </div>
              <FilterValueEditor
                filter={draft}
                field={draftField}
                onChange={(value) => setDraft({ ...draft, value })}
                onCommit={(value) => add({ ...draft, value })}
                onDone={() => onOpenChange(false)}
              />
            </div>
          ) : (
            <Autocomplete filter={contains}>
              <SearchField
                autoFocus
                aria-label="Filter by"
                className="w-64 border-b border-foreground/10 p-1"
              >
                <SearchInput placeholder="Filter by…" />
              </SearchField>
              <MenuPrimitive
                aria-label="Fields"
                // Picking a field moves to its value step; the popover stays open.
                shouldCloseOnSelect={false}
                className={menuContentStyles({ className: "max-h-80 w-64" })}
                onAction={(key) => {
                  const field = addableFields.find(
                    (candidate) => candidate.id === key
                  )
                  if (field) setDraft(createFilter(field))
                }}
                renderEmptyState={() => (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No fields found
                  </div>
                )}
              >
                {[...groups].map(([group, groupFields]) =>
                  group ? (
                    <MenuSection key={group} id={group} label={group}>
                      {groupFields.map(renderField)}
                    </MenuSection>
                  ) : (
                    groupFields.map(renderField)
                  )
                )}
              </MenuPrimitive>
            </Autocomplete>
          )}
        </Dialog>
      </PopoverContent>
    </DialogTrigger>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Chip
 * -----------------------------------------------------------------------------------------------*/

const chipSegmentClassName =
  "flex h-full shrink-0 cursor-pointer items-center border-0 border-s border-input bg-transparent px-2 outline-hidden transition-colors hover:bg-accent focus-visible:bg-accent pressed:bg-accent"

interface FilterChipProps {
  filter: Filter
  field: FilterField
}

function FilterChip({ filter, field }: FilterChipProps) {
  const { filters, setFilters, addButtonRef } = useFilterBar()
  const [isEditing, setEditing] = useState(false)
  const Icon = field.icon
  const operators = getFilterOperators(field)

  const update = (next: Partial<Filter>) =>
    setFilters(
      filters.map((item) =>
        item.id === filter.id ? { ...item, ...next } : item
      )
    )

  const remove = () => {
    setFilters(filters.filter((item) => item.id !== filter.id))
    addButtonRef.current?.focus()
  }

  // Backspace or Delete on a chip's button removes the chip, like a token in a text field.
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Backspace" && event.key !== "Delete") return
    if (!(event.target instanceof HTMLButtonElement)) return

    event.preventDefault()
    remove()
  }

  return (
    <div
      role="listitem"
      aria-label={`${field.label} filter`}
      data-slot="filter-chip"
      onKeyDown={onKeyDown}
      className={twMerge(
        "inline-flex h-11 max-w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-input bg-background text-base/6 sm:h-9 sm:text-sm/6",
        "has-focus-visible:border-ring/70 has-focus-visible:ring-3 has-focus-visible:ring-ring/20",
        "animate-in fade-in-0 zoom-in-95 duration-150"
      )}
    >
      {/* In a narrow chip the value truncates; the field name keeps up to 10rem. */}
      <span className="flex max-w-40 shrink-0 items-center gap-1.5 ps-2.5 pe-2 text-muted-foreground">
        {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
        <span className="truncate">{field.label}</span>
      </span>

      <FilterOperatorSegment
        filter={filter}
        field={field}
        operators={operators}
        onChange={(operator) =>
          update({
            operator,
            value: getInitialValue(field, operator, filter.value),
          })
        }
      />

      {isValuelessOperator(filter.operator) ? null : (
        <FilterValueSegment
          filter={filter}
          field={field}
          isOpen={isEditing}
          onOpenChange={(isOpen) => {
            setEditing(isOpen)
            // A chip closed without a value narrows nothing: drop it.
            if (!isOpen && !isFilterActive(filter)) remove()
          }}
          onChange={(value) => update({ value })}
          onCommit={(value) => {
            setEditing(false)
            update({ value })
          }}
        />
      )}

      <ButtonPrimitive
        aria-label={`Remove ${field.label} filter`}
        onPress={remove}
        className={twMerge(
          chipSegmentClassName,
          "w-9 justify-center px-0 text-muted-foreground hover:text-foreground sm:w-8"
        )}
      >
        <XIcon className="size-4" aria-hidden />
      </ButtonPrimitive>
    </div>
  )
}

/** "is any of" reads wrong with one value: say "is" / "is not" then. */
function getOperatorLabel(filter: Filter) {
  const count = Array.isArray(filter.value) ? filter.value.length : 0
  if (count === 1 && filter.operator === "isAnyOf") return "is"
  if (count === 1 && filter.operator === "isNoneOf") return "is not"
  if (filter.operator === "between" && isDateRange(filter.value)) {
    return findPreset(filter.value) ? "in" : operatorLabels.between
  }
  return operatorLabels[filter.operator]
}

interface FilterOperatorSegmentProps {
  filter: Filter
  field: FilterField
  operators: Array<FilterOperator>
  onChange: (operator: FilterOperator) => void
}

function FilterOperatorSegment({
  filter,
  field,
  operators,
  onChange,
}: FilterOperatorSegmentProps) {
  const label = getOperatorLabel(filter)

  if (operators.length < 2) {
    return (
      <span className="flex shrink-0 items-center border-s border-input px-2 text-muted-foreground">
        {label}
      </span>
    )
  }

  return (
    <Menu>
      <ButtonPrimitive
        aria-label={`${field.label} operator: ${label}`}
        className={twMerge(chipSegmentClassName, "text-muted-foreground")}
      >
        {label}
      </ButtonPrimitive>
      <MenuContent
        placement="bottom start"
        selectionMode="single"
        selectedKeys={[filter.operator]}
        onAction={(key) => {
          const operator = operators.find((candidate) => candidate === key)
          if (operator) onChange(operator)
        }}
        className="min-w-44"
      >
        {operators.map((operator) => (
          <MenuItem key={operator} id={operator}>
            <MenuLabel>{operatorLabels[operator]}</MenuLabel>
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Value segment and editors
 * -----------------------------------------------------------------------------------------------*/

/** "Slovenia", "Slovenia, Croatia", "Slovenia, Croatia +3". */
function summarize(labels: Array<string>) {
  if (labels.length <= 2) return labels.join(", ")
  return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`
}

function useValueLabel(filter: Filter, field: FilterField) {
  const { locale } = useLocale()
  const formatDay = (value: string, withYear = true) => {
    const day = parseDay(value)
    if (!day) return ""
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      ...(withYear ? { year: "numeric" } : {}),
      timeZone: "UTC",
    }).format(day.toDate("UTC"))
  }
  const formatNumber = (value: number | null) =>
    value === null
      ? "…"
      : `${new Intl.NumberFormat(locale).format(value)}${field.unit ? ` ${field.unit}` : ""}`

  const { value } = filter

  if (!isFilterActive(filter)) return null

  switch (field.variant) {
    case "select": {
      const selected = getSelectedValues(filter)
      const options = field.options ?? []
      // Options order, not click order, so the chip reads the same however the values were picked.
      const known = options
        .filter((option) => selected.includes(option.value))
        .map((option) => option.label)
      const unknown = selected.filter(
        (item) => !options.some((option) => option.value === item)
      )
      return summarize([...known, ...unknown])
    }
    case "boolean":
      return (
        booleanOptions(field).find(
          (option) => option.value === String(value === true)
        )?.label ?? ""
      )
    case "number":
      if (Array.isArray(value)) {
        const [min, max] = isNumberRange(value) ? value : [null, null]
        return `${formatNumber(min)} – ${formatNumber(max)}`
      }
      return formatNumber(typeof value === "number" ? value : null)
    case "date": {
      if (!isDateRange(value)) {
        return formatDay(typeof value === "string" ? value : "")
      }
      const preset = findPreset(value)
      if (preset) return preset.label
      if (!value.end) return `${formatDay(value.start)} – …`
      if (!value.start) return `… – ${formatDay(value.end)}`
      const sameYear = value.start.slice(0, 4) === value.end.slice(0, 4)
      return `${formatDay(value.start, !sameYear)} – ${formatDay(value.end)}`
    }
    case "text":
      return `“${typeof value === "string" ? value : ""}”`
  }
}

const valuePlaceholders: Record<FilterVariant, string> = {
  text: "Enter text…",
  number: "Enter value…",
  select: "Select…",
  boolean: "Select…",
  date: "Pick dates…",
}

/** Number inputs without the browser's spin buttons: the chip is too small for them. */
const numberInputClassName =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

interface FilterValueSegmentProps {
  filter: Filter
  field: FilterField
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onChange: (value: FilterValue) => void
  /** Sets the value and closes the editor in one update, so closing never sees the old value. */
  onCommit: (value: FilterValue) => void
}

function FilterValueSegment({
  filter,
  field,
  isOpen,
  onOpenChange,
  onChange,
  onCommit,
}: FilterValueSegmentProps) {
  const label = useValueLabel(filter, field)

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ButtonPrimitive
        aria-label={`${field.label} value: ${label ?? "not set"}`}
        className={twMerge(
          chipSegmentClassName,
          "min-w-10 shrink font-medium text-foreground"
        )}
      >
        <span
          className={twMerge(
            "max-w-64 truncate",
            label === null && "font-normal text-muted-foreground"
          )}
        >
          {label ?? field.placeholder ?? valuePlaceholders[field.variant]}
        </span>
      </ButtonPrimitive>
      <PopoverContent
        placement="bottom start"
        className="max-w-none min-w-0 overflow-hidden p-0"
      >
        <Dialog
          aria-label={`${field.label} ${operatorLabels[filter.operator]}`}
          className="outline-hidden"
        >
          {({ close }) => (
            <FilterValueEditor
              filter={filter}
              field={field}
              onChange={onChange}
              onCommit={onCommit}
              onDone={close}
            />
          )}
        </Dialog>
      </PopoverContent>
    </DialogTrigger>
  )
}

interface FilterValueEditorProps {
  filter: Filter
  field: FilterField
  onChange: (value: FilterValue) => void
  onCommit: (value: FilterValue) => void
  /** Closes the editor, keeping the value typed so far. */
  onDone: () => void
}

function FilterValueEditor(props: FilterValueEditorProps) {
  switch (props.field.variant) {
    case "text":
      return <TextEditor {...props} />
    case "number":
      return <NumberEditor {...props} />
    case "select":
      return <SelectEditor {...props} />
    case "boolean":
      return <BooleanEditor {...props} />
    case "date":
      return <DateEditor {...props} />
  }
}

function TextEditor({
  filter,
  field,
  onChange,
  onDone,
}: FilterValueEditorProps) {
  return (
    <form
      className="w-64 p-2"
      onSubmit={(event) => {
        event.preventDefault()
        onDone()
      }}
    >
      <Input
        autoFocus
        aria-label={field.label}
        placeholder={field.placeholder ?? `${field.label}…`}
        defaultValue={typeof filter.value === "string" ? filter.value : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </form>
  )
}

const parseNumberInput = (raw: string) =>
  raw.trim() === "" || Number.isNaN(Number(raw)) ? null : Number(raw)

function NumberEditor({
  filter,
  field,
  onChange,
  onDone,
}: FilterValueEditorProps) {
  const isRange = filter.operator === "between"
  const [min, max] = isNumberRange(filter.value)
    ? filter.value
    : [typeof filter.value === "number" ? filter.value : null, null]
  const unit = field.unit ? (
    <span className="shrink-0 text-sm text-muted-foreground">{field.unit}</span>
  ) : null

  return (
    <form
      className="flex w-72 items-center gap-2 p-2"
      onSubmit={(event) => {
        event.preventDefault()
        onDone()
      }}
    >
      <Input
        autoFocus
        type="number"
        inputMode="decimal"
        className={numberInputClassName}
        aria-label={isRange ? `${field.label} from` : field.label}
        placeholder={isRange ? "Min" : (field.placeholder ?? "Value")}
        defaultValue={min ?? ""}
        onChange={(event) => {
          const next = parseNumberInput(event.target.value)
          onChange(isRange ? [next, max] : next)
        }}
      />
      {isRange ? (
        <>
          <span className="shrink-0 text-sm text-muted-foreground">and</span>
          <Input
            type="number"
            inputMode="decimal"
            className={numberInputClassName}
            aria-label={`${field.label} to`}
            placeholder="Max"
            defaultValue={max ?? ""}
            onChange={(event) =>
              onChange([min, parseNumberInput(event.target.value)])
            }
          />
        </>
      ) : null}
      {unit}
    </form>
  )
}

function SelectEditor({
  filter,
  field,
  onChange,
  onCommit,
}: FilterValueEditorProps) {
  const { contains } = useFilter({ sensitivity: "base" })
  const options = field.options ?? []
  const isMultiple = field.multiple ?? true
  const selected = getSelectedValues(filter)
  const listBox = (
    <ListBox
      aria-label={field.label}
      items={options}
      autoFocus={options.length <= 7}
      selectionMode={isMultiple ? "multiple" : "single"}
      // Escape closes the popover; it must not clear the picks on the way out.
      escapeKeyBehavior="none"
      selectedKeys={selected}
      onSelectionChange={(keys) => {
        const next =
          keys === "all"
            ? options.map((option) => option.value)
            : [...keys].map(String)
        if (isMultiple) onChange(next)
        else onCommit(next)
      }}
      renderEmptyState={() => (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No results found
        </div>
      )}
      className="max-h-72 min-w-0 rounded-none border-0 bg-transparent"
    >
      {(option) => {
        const Icon = option.icon
        return (
          <ListBoxItem id={option.value} textValue={option.label}>
            {Icon ? <Icon data-slot="icon" aria-hidden /> : null}
            <MenuLabel>{option.label}</MenuLabel>
          </ListBoxItem>
        )
      }}
    </ListBox>
  )

  // Short lists need no search.
  if (options.length <= 7) return <div className="w-56">{listBox}</div>

  return (
    <div className="w-64">
      <Autocomplete filter={contains}>
        <SearchField
          autoFocus
          aria-label={`Search ${field.label}`}
          className="border-b border-foreground/10 p-1"
        >
          <SearchInput
            placeholder={`Search ${field.label.toLocaleLowerCase()}…`}
          />
        </SearchField>
        {listBox}
      </Autocomplete>
    </div>
  )
}

function BooleanEditor({ filter, field, onCommit }: FilterValueEditorProps) {
  return (
    <ListBox
      aria-label={field.label}
      autoFocus
      items={booleanOptions(field)}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[String(filter.value === true)]}
      onSelectionChange={(keys) => {
        if (keys === "all") return
        onCommit([...keys][0] === "true")
      }}
      className="w-36 min-w-0 rounded-none border-0 bg-transparent"
    >
      {(option) => (
        <ListBoxItem id={option.value} textValue={option.label}>
          {option.label}
        </ListBoxItem>
      )}
    </ListBox>
  )
}

function DateEditor({ filter, field, onCommit }: FilterValueEditorProps) {
  if (filter.operator !== "between") {
    const day = parseDay(typeof filter.value === "string" ? filter.value : "")
    return (
      <div className="p-3">
        <Calendar
          aria-label={field.label}
          value={day}
          onChange={(next) => onCommit(next.toString())}
        />
      </div>
    )
  }

  const range = isDateRange(filter.value)
    ? filter.value
    : { start: "", end: "" }
  const start = parseDay(range.start)
  const end = parseDay(range.end)
  const activePreset = findPreset(range)

  return (
    <div className="flex">
      <div className="flex w-36 shrink-0 flex-col gap-0.5 border-e border-foreground/10 p-1.5">
        {filterDatePresets.map((preset) => (
          <ButtonPrimitive
            key={preset.id}
            onPress={() => onCommit(getPresetRange(preset))}
            className={twMerge(
              "cursor-pointer rounded-md px-2.5 py-1.5 text-start text-sm whitespace-nowrap outline-hidden hover:bg-accent focus-visible:bg-accent",
              activePreset?.id === preset.id &&
                "bg-primary/10 font-medium text-primary hover:bg-primary/15"
            )}
          >
            {preset.label}
          </ButtonPrimitive>
        ))}
      </div>
      <div className="p-3">
        <RangeCalendar
          aria-label={field.label}
          value={start && end ? { start, end } : null}
          onChange={(next) =>
            onCommit({ start: next.start.toString(), end: next.end.toString() })
          }
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * FilterBarClear
 * -----------------------------------------------------------------------------------------------*/

interface FilterBarClearProps {
  className?: string
  children?: ReactNode
}

function FilterBarClear({
  className,
  children = "Clear",
}: FilterBarClearProps) {
  const { filters, setFilters } = useFilterBar()

  if (!filters.length) return null

  return (
    <Button
      intent="plain"
      className={twMerge(
        "ms-auto h-11 text-muted-foreground sm:h-9",
        className
      )}
      onPress={() => setFilters([])}
    >
      {children}
    </Button>
  )
}

export {
  createFilter,
  FilterBar,
  FilterBarClear,
  FilterBarItems,
  filterDatePresets,
  getFilterOperators,
  isFilterActive,
  matchesFilter,
  operatorLabels,
}
export type {
  Filter,
  FilterBarProps,
  FilterDateRange,
  FilterField,
  FilterOperator,
  FilterOption,
  FilterValue,
  FilterVariant,
}
