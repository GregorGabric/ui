"use client"

import {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import {
  getLocalTimeZone,
  parseDate,
  today,
  type CalendarDate,
} from "@internationalized/date"
import { NumberFormatter, NumberParser } from "@internationalized/number"
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

/** A day range as ISO dates (`2026-11-20`); an empty end is open. */
interface FilterDateRange {
  start: string
  end: string
}

/**
 * A filter's value, tagged by kind so every consumer branches on `type` instead of guessing:
 * text, a number or a `range` (number `between`), the picked `options` of a select, a yes / no
 * `boolean`, a `day` or `days` (date `between`), and `none` for `isEmpty` / `isNotEmpty`.
 */
type FilterValue =
  | { type: "text"; text: string }
  | { type: "number"; number: number | null }
  | { type: "range"; min: number | null; max: number | null }
  | { type: "options"; values: Array<string> }
  | { type: "boolean"; value: boolean | null }
  | { type: "day"; day: string }
  | ({ type: "days" } & FilterDateRange)
  | { type: "none" }

/** A row's value for a field, as `matchesFilter` reads it. Lists are for `select` fields (tags). */
type FilterCellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | ReadonlyArray<string | number>

/** A field can be filtered once, so `field` also identifies the filter. */
interface Filter {
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
  /** Values for `select`. For `boolean`, the first option labels Yes and the second No. */
  options?: Array<FilterOption>
  /** `select` only: allow picking several values (default `true`). */
  multiple?: boolean
  /** Restrict or reorder the operators; the first one is the default. */
  operators?: [FilterOperator, ...Array<FilterOperator>]
  placeholder?: string
  /** Shown after number values, e.g. `km` or `€`. */
  unit?: string
  /** How number values read in the chip, e.g. `{ useGrouping: false }` so years show as 2019. */
  numberFormat?: Intl.NumberFormatOptions
}

type FilterDatePresetId = "today" | "7d" | "30d" | "90d" | "year"

/** Every string the bar shows, resolved. */
interface FilterBarStrings {
  filter: string
  addFilter: string
  clear: string
  searchFields: string
  fields: string
  noFields: string
  noResults: string
  backToFields: string
  yes: string
  no: string
  min: string
  max: string
  and: string
  notSet: string
  /** "in" before a date preset: "Listed in Last 30 days". */
  inPreset: string
  chipLabel: (field: string) => string
  removeFilter: (field: string) => string
  operatorLabel: (field: string) => string
  valueLabel: (field: string) => string
  searchOptions: (field: string) => string
  operators: Record<FilterOperator, string>
  datePresets: Record<FilterDatePresetId, string>
  placeholders: Record<FilterVariant, string>
}

/** Translations for `FilterBar`: any string left out stays English. */
type FilterBarMessages = Partial<
  Omit<FilterBarStrings, "operators" | "datePresets" | "placeholders">
> & {
  operators?: Partial<FilterBarStrings["operators"]>
  datePresets?: Partial<FilterBarStrings["datePresets"]>
  placeholders?: Partial<FilterBarStrings["placeholders"]>
}

const defaultMessages: FilterBarStrings = {
  filter: "Filter",
  addFilter: "Add filter",
  clear: "Clear",
  searchFields: "Filter by…",
  fields: "Fields",
  noFields: "No fields found",
  noResults: "No results found",
  backToFields: "Back to fields",
  yes: "Yes",
  no: "No",
  min: "Min",
  max: "Max",
  and: "and",
  notSet: "not set",
  inPreset: "in",
  chipLabel: (field) => `${field} filter`,
  removeFilter: (field) => `Remove ${field} filter`,
  operatorLabel: (field) => `${field} operator`,
  valueLabel: (field) => `${field} value`,
  searchOptions: (field) => `Search ${field.toLocaleLowerCase()}…`,
  operators: {
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
  },
  datePresets: {
    today: "Today",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    year: "This year",
  },
  placeholders: {
    text: "Enter text…",
    number: "Enter value…",
    select: "Select…",
    boolean: "Select…",
    date: "Pick dates…",
  },
}

function mergeMessages(input: FilterBarMessages = {}): FilterBarStrings {
  return {
    ...defaultMessages,
    ...input,
    operators: { ...defaultMessages.operators, ...input.operators },
    datePresets: {
      ...defaultMessages.datePresets,
      ...input.datePresets,
    },
    placeholders: {
      ...defaultMessages.placeholders,
      ...input.placeholders,
    },
  }
}

const operatorsByVariant: Record<FilterVariant, Array<FilterOperator>> = {
  text: ["contains", "notContains", "is", "isNot", "isEmpty", "isNotEmpty"],
  // A range first: an exact price or mileage rarely matches anything.
  number: [
    "between",
    "is",
    "isNot",
    "lt",
    "lte",
    "gt",
    "gte",
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

const noValue: FilterValue = { type: "none" }

/** A number value, or the end of a range that fits the operator. */
function toSingleNumber(operator: FilterOperator, previous: FilterValue) {
  if (previous.type === "number") return previous.number

  if (previous.type !== "range") return null

  // "is at most" / "is less than" take the range's max; the rest its min, else whichever is set.
  if (operator === "lt" || operator === "lte")
    return previous.max ?? previous.min

  return previous.min ?? previous.max
}

/** The empty value an operator starts with, keeping what still fits when the operator changes. */
function getInitialValue(
  field: FilterField,
  operator: FilterOperator,
  previous: FilterValue = noValue
): FilterValue {
  if (isValuelessOperator(operator)) return noValue

  switch (field.variant) {
    case "text":
      return previous.type === "text" ? previous : { type: "text", text: "" }
    case "number":
      if (operator !== "between") {
        return { type: "number", number: toSingleNumber(operator, previous) }
      }

      if (previous.type === "range") return previous

      return {
        type: "range",
        min: previous.type === "number" ? previous.number : null,
        max: null,
      }
    case "select":
      return previous.type === "options"
        ? previous
        : { type: "options", values: [] }
    case "boolean":
      // No value until Yes or No is picked, so picking Yes is a change the editor reports.
      return previous.type === "boolean"
        ? previous
        : { type: "boolean", value: null }
    case "date":
      if (operator === "between") {
        if (previous.type === "days") return previous

        const day = previous.type === "day" ? previous.day : ""

        return { type: "days", start: day, end: day }
      }

      if (previous.type === "day") return previous

      return {
        type: "day",
        day: previous.type === "days" ? previous.start : "",
      }
  }
}

function createFilter(
  field: FilterField,
  operator = getFilterOperators(field)[0],
  value?: FilterValue
): Filter {
  return {
    field: field.id,
    operator,
    value: value ?? getInitialValue(field, operator),
  }
}

/** A number bound that narrows something: NaN or Infinity (from a URL or a request) does not. */
function isBound(bound: number | null): bound is number {
  return bound !== null && Number.isFinite(bound)
}

/** True when a filter narrows anything: it has a value, or its operator needs none. */
function isFilterActive(filter: Filter) {
  const { value } = filter

  switch (value.type) {
    case "none":
      return true
    case "text":
      return value.text !== ""
    case "number":
      return isBound(value.number)
    case "range":
      return isBound(value.min) || isBound(value.max)
    case "options":
      return value.values.length > 0
    case "boolean":
      return value.value !== null
    case "day":
      return value.day !== ""
    case "days":
      return Boolean(value.start || value.end)
  }
}

/* -------------------------------------------------------------------------------------------------
 * Matching (client-side filtering)
 * -----------------------------------------------------------------------------------------------*/

// Cells come from the consumer's rows. They are read with String(), Number() and `instanceof`,
// which convert any cell without guessing at its representation.

function isEmptyCellValue(cell: FilterCellValue) {
  if (cell === null || cell === undefined) return true

  if (Array.isArray(cell)) return cell.length === 0

  if (cell instanceof Date) return Number.isNaN(cell.getTime())

  return String(cell).trim() === ""
}

function toDayString(cell: FilterCellValue): string {
  if (cell instanceof Date) {
    const month = String(cell.getMonth() + 1).padStart(2, "0")
    const day = String(cell.getDate()).padStart(2, "0")

    return `${cell.getFullYear()}-${month}-${day}`
  }

  const text = String(cell)

  // A timestamp names an instant: read its day in local time, like a Date cell. A plain
  // "2026-11-20" is already a day.
  if (text.includes("T")) {
    const instant = new Date(text)

    if (!Number.isNaN(instant.getTime())) return toDayString(instant)
  }

  return text.slice(0, 10)
}

function toNumber(cell: FilterCellValue) {
  if (cell instanceof Date || Array.isArray(cell)) return Number.NaN

  const text = String(cell).trim()

  return text === "" ? Number.NaN : Number(text)
}

function compareNumber(cell: number, operator: FilterOperator, value: number) {
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

function compareDay(day: string, operator: FilterOperator, value: string) {
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

function compareText(cell: string, operator: FilterOperator, query: string) {
  const text = cell.toLocaleLowerCase()
  const search = query.toLocaleLowerCase()

  switch (operator) {
    case "contains":
      return text.includes(search)
    case "notContains":
      return !text.includes(search)
    case "is":
      return text === search
    case "isNot":
      return text !== search
    default:
      return true
  }
}

/**
 * Whether a row's value passes a filter. Inactive filters (no value yet) pass everything.
 * `rows.filter((row) => filters.every((filter) => matchesFilter(row[filter.field], filter)))`
 */
function matchesFilter(cellValue: FilterCellValue, filter: Filter): boolean {
  if (!isFilterActive(filter)) return true

  const { operator, value } = filter

  if (operator === "isEmpty") return isEmptyCellValue(cellValue)

  if (operator === "isNotEmpty") return !isEmptyCellValue(cellValue)

  if (value.type === "options") {
    // A list cell (tags) matches when any of its values is picked.
    const cells = Array.isArray(cellValue) ? cellValue : [cellValue]
    const hasAny = cells.some((cell) => value.values.includes(String(cell)))

    return operator === "isNoneOf" ? !hasAny : hasAny
  }

  if (isEmptyCellValue(cellValue)) return false

  switch (value.type) {
    case "boolean":
      return cellValue === value.value
    case "text":
      return compareText(String(cellValue), operator, value.text)
    case "number": {
      const cell = toNumber(cellValue)

      return (
        isBound(value.number) && compareNumber(cell, operator, value.number)
      )
    }

    case "range": {
      const cell = toNumber(cellValue)

      // A missing or non-finite end leaves that side open.
      return (
        !Number.isNaN(cell) &&
        (!isBound(value.min) || cell >= value.min) &&
        (!isBound(value.max) || cell <= value.max)
      )
    }

    case "day":
      return compareDay(toDayString(cellValue), operator, value.day)
    case "days": {
      const day = toDayString(cellValue)

      return (
        (!value.start || day >= value.start) && (!value.end || day <= value.end)
      )
    }

    case "none":
      return true
  }
}

/* -------------------------------------------------------------------------------------------------
 * Date presets
 * -----------------------------------------------------------------------------------------------*/

interface FilterDatePreset {
  id: FilterDatePresetId
  getRange: (now: CalendarDate) => { start: CalendarDate; end: CalendarDate }
}

const filterDatePresets: Array<FilterDatePreset> = [
  {
    id: "today",
    getRange: (now) => ({ start: now, end: now }),
  },
  {
    id: "7d",
    getRange: (now) => ({ start: now.subtract({ days: 6 }), end: now }),
  },
  {
    id: "30d",
    getRange: (now) => ({ start: now.subtract({ days: 29 }), end: now }),
  },
  {
    id: "90d",
    getRange: (now) => ({ start: now.subtract({ days: 89 }), end: now }),
  },
  {
    id: "year",
    getRange: (now) => ({ start: now.set({ month: 1, day: 1 }), end: now }),
  },
]

function getPresetRange(
  preset: FilterDatePreset
): Extract<FilterValue, { type: "days" }> {
  const range = preset.getRange(today(getLocalTimeZone()))

  return {
    type: "days",
    start: range.start.toString(),
    end: range.end.toString(),
  }
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
  messages: FilterBarStrings
  /** The field being added from "+ Filter": its filter is already in `filters`, shown dimmed. */
  draftField: string | null
  setDraftField: (field: string | null) => void
  /** "+ Filter", so removing a chip can hand focus back to it. */
  addButtonRef: React.RefObject<HTMLButtonElement | null>
  /**
   * After a chip is removed or a filter added: focus "+ Filter", or the last chip when every field
   * is in use and "+ Filter" is gone. Runs after React renders the change.
   */
  restoreFocus: () => void
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
  /**
   * Called on every change, including while a filter is being added (it may have no value yet).
   * Use `isFilterActive` to skip filters that narrow nothing.
   */
  onChange?: (filters: Array<Filter>) => void
  /** Translations; anything left out falls back to English. */
  messages?: FilterBarMessages
  className?: string
  children?: ReactNode
}

const noFilters: Array<Filter> = []

/**
 * Holds the filters and lays out its children in a wrapping row. Compose it from
 * `FilterBarChips`, `FilterBarAdd` and `FilterBarClear`, next to your own search field or sort
 * button.
 */
function FilterBar({
  fields,
  value,
  defaultValue = noFilters,
  onChange,
  messages,
  className,
  children,
}: FilterBarProps) {
  const [uncontrolledFilters, setUncontrolledFilters] = useState(defaultValue)
  const [draftField, setDraftField] = useState<string | null>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const filters = value ?? uncontrolledFilters

  const restoreFocus = () =>
    requestAnimationFrame(() => {
      if (addButtonRef.current) {
        addButtonRef.current.focus()

        return
      }

      const chips = barRef.current?.querySelectorAll<HTMLElement>(
        "[data-slot=filter-chip]:not([data-draft])"
      )

      chips
        ?.item(chips.length - 1)
        ?.querySelector("button")
        ?.focus()
    })

  const setFilters = (next: Array<Filter>) => {
    if (value === undefined) setUncontrolledFilters(next)
    onChange?.(next)
  }

  return (
    <FilterBarContext
      value={{
        fields,
        filters,
        setFilters,
        messages: mergeMessages(messages),
        draftField,
        setDraftField,
        addButtonRef,
        restoreFocus,
      }}
    >
      <div
        ref={barRef}
        data-slot="filter-bar"
        className={twMerge("flex flex-wrap items-center gap-2", className)}
      >
        {children}
      </div>
    </FilterBarContext>
  )
}

/* -------------------------------------------------------------------------------------------------
 * FilterBarChips
 * -----------------------------------------------------------------------------------------------*/

interface FilterChipContextValue {
  filter: Filter
  field: FilterField
  /** Being added from "+ Filter": shown dimmed and not interactive until it is added. */
  isDraft: boolean
  update: (next: Partial<Filter>) => void
  remove: () => void
}

const FilterChipContext = createContext<FilterChipContextValue | null>(null)

function useFilterChip() {
  const context = use(FilterChipContext)

  if (!context) {
    throw new Error(
      "FilterChip parts must be rendered inside <FilterBarChips>."
    )
  }

  return context
}

type FilterChipRender = (chip: {
  filter: Filter
  field: FilterField
}) => ReactNode

const renderDefaultChip: FilterChipRender = () => <FilterChip />

/** Gives one chip (and its parts) its filter, and the update / remove for it. */
function FilterChipScope({
  filter,
  render,
}: {
  filter: Filter
  render: FilterChipRender
}) {
  const { fields, filters, setFilters, draftField, restoreFocus } =
    useFilterBar()

  const field = fields.find((candidate) => candidate.id === filter.field)

  if (!field) return null

  const update = (next: Partial<Filter>) =>
    setFilters(
      filters.map((item) =>
        item.field === filter.field ? { ...item, ...next } : item
      )
    )

  const remove = () => {
    setFilters(filters.filter((item) => item.field !== filter.field))
    restoreFocus()
  }

  return (
    <FilterChipContext
      value={{
        filter,
        field,
        isDraft: draftField === filter.field,
        update,
        remove,
      }}
    >
      {render({ filter, field })}
    </FilterChipContext>
  )
}

interface FilterBarChipsProps {
  /** Renders each chip. Defaults to `<FilterChip />` with its standard parts. */
  children?: FilterChipRender
}

/**
 * One chip per filter. The chips join the bar's own row (no wrapper box) and wrap, so "+ Filter"
 * and Clear flow right after the last chip.
 */
function FilterBarChips({ children = renderDefaultChip }: FilterBarChipsProps) {
  const { filters } = useFilterBar()

  return filters.map((filter) => (
    <FilterChipScope key={filter.field} filter={filter} render={children} />
  ))
}

/* -------------------------------------------------------------------------------------------------
 * "+ Filter" menu
 * -----------------------------------------------------------------------------------------------*/

/** Yes / No. A boolean field's `options` relabel them by position: the first is Yes, the second No. */
function getBooleanOptions(
  field: FilterField,
  messages: FilterBarStrings
): Array<FilterOption> {
  const [yes, no] = field.options ?? []

  return [
    { value: "true", label: yes?.label ?? messages.yes, icon: yes?.icon },
    { value: "false", label: no?.label ?? messages.no, icon: no?.icon },
  ]
}

interface FilterBarAddProps {
  /** A key that opens the menu from anywhere on the page, e.g. `"f"`. Off by default. */
  shortcut?: string
  className?: string
}

/**
 * "+ Filter": pick a field, then its operator and value in the same popover (Linear-style). The
 * filter shows as a dimmed chip and applies while you pick, and is dropped if you leave without a
 * value.
 */
function FilterBarAdd({ shortcut, className }: FilterBarAddProps) {
  const {
    fields,
    filters,
    setFilters,
    messages,
    draftField: draftFieldId,
    setDraftField,
    addButtonRef,
    restoreFocus,
  } = useFilterBar()

  const [isMenuOpen, setMenuOpen] = useState(false)
  const { contains } = useFilter({ sensitivity: "base" })

  const draft = filters.find((filter) => filter.field === draftFieldId)

  const draftField = draft
    ? fields.find((field) => field.id === draft.field)
    : undefined

  const shownFields = new Set(filters.map((filter) => filter.field))
  const addableFields = fields.filter((field) => !shownFields.has(field.id))
  const groups = Map.groupBy(addableFields, (field) => field.group ?? "")

  // A page-wide shortcut subscribes to `window`, which is what Effects are for; React Aria's
  // `useKeyboard` only sees events on the element it is spread onto.
  const canAdd = addableFields.length > 0

  useEffect(() => {
    // Nothing to add once every field is in use, so the shortcut has nothing to open.
    if (!shortcut || !canAdd) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isShortcutEvent(event, shortcut)) return

      event.preventDefault()
      addButtonRef.current?.focus()
      setMenuOpen(true)
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [shortcut, canAdd, addButtonRef])

  if (!canAdd && !isMenuOpen) return null

  const updateDraft = (next: Partial<Filter>) =>
    setFilters(
      filters.map((item) =>
        item.field === draftFieldId ? { ...item, ...next } : item
      )
    )

  /** Starts the value step: the filter goes in right away, dimmed, and applies as values are picked. */
  const startDraft = (filter: Filter) => {
    setFilters([...filters, filter])
    setDraftField(filter.field)
  }

  /** Every way out of the menu: "+ Filter" unmounts once every field is in use, so focus moves on. */
  const closeMenu = () => {
    setDraftField(null)
    setMenuOpen(false)
    restoreFocus()
  }

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setMenuOpen(true)

      return
    }

    // Leaving keeps what was picked so far, and drops a filter left without a value.
    if (draft && !isFilterActive(draft)) {
      setFilters(filters.filter((item) => item !== draft))
    }

    closeMenu()
  }

  const renderField = (field: FilterField) => {
    const Icon = field.icon

    return (
      <MenuItem key={field.id} id={field.id} textValue={field.label}>
        {Icon ? <Icon data-slot="icon" aria-hidden /> : null}
        <MenuLabel>{field.label}</MenuLabel>
      </MenuItem>
    )
  }

  return (
    <DialogTrigger isOpen={isMenuOpen} onOpenChange={onOpenChange}>
      <Button
        ref={addButtonRef}
        intent={filters.length ? "plain" : "outline"}
        className={twMerge("h-11 sm:h-9", className)}
        data-slot="filter-bar-add"
      >
        <ListFilterIcon data-slot="icon" aria-hidden />
        {filters.length ? messages.addFilter : messages.filter}
        {shortcut ? (
          <Keyboard className="ms-0.5 h-5 items-center rounded border border-foreground/15 px-1 text-[0.7rem]/none text-muted-foreground lg:inline-flex">
            {shortcut.toUpperCase()}
          </Keyboard>
        ) : null}
      </Button>
      <PopoverContent
        placement="bottom start"
        className="max-w-[calc(100vw-1.5rem)] min-w-0 overflow-x-hidden overflow-y-auto p-0"
      >
        <Dialog aria-label={messages.addFilter} className="outline-hidden">
          {draft && draftField ? (
            <div>
              <div className="flex items-center gap-1 border-b border-foreground/10 p-1">
                <ButtonPrimitive
                  aria-label={messages.backToFields}
                  onPress={() => {
                    setFilters(filters.filter((item) => item !== draft))
                    setDraftField(null)
                  }}
                  className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-hidden hover:bg-accent hover:text-foreground focus-visible:bg-accent"
                >
                  <ChevronLeftIcon className="size-4" aria-hidden />
                </ButtonPrimitive>
                <span className="ps-1 text-sm font-medium">
                  {draftField.label}
                </span>
                <FilterOperatorMenu
                  filter={draft}
                  field={draftField}
                  onChange={updateDraft}
                  className="h-7 rounded-md border-0 px-1.5 text-sm"
                />
              </div>
              {isValuelessOperator(draft.operator) ? (
                <div className="flex justify-end p-2">
                  <Button size="sm" autoFocus onPress={closeMenu}>
                    {messages.addFilter}
                  </Button>
                </div>
              ) : (
                <FilterValueEditor
                  filter={draft}
                  field={draftField}
                  onChange={(value) => updateDraft({ value })}
                  onCommit={(value) => {
                    updateDraft({ value })
                    closeMenu()
                  }}
                  onDone={() => onOpenChange(false)}
                />
              )}
            </div>
          ) : (
            // While the popover closes after a pick, this list shows again during the exit; inert
            // keeps the release of that same click from starting another filter.
            <div inert={!isMenuOpen}>
              <Autocomplete filter={contains}>
                <SearchField
                  autoFocus
                  aria-label={messages.searchFields}
                  className="w-64 max-w-full border-b border-foreground/10 p-1"
                >
                  <SearchInput placeholder={messages.searchFields} />
                </SearchField>
                <MenuPrimitive
                  aria-label={messages.fields}
                  // Picking a field moves to its value step; the popover stays open.
                  shouldCloseOnSelect={false}
                  className={menuContentStyles({
                    className: "max-h-80 w-64 max-w-full",
                  })}
                  onAction={(key) => {
                    const field = addableFields.find(
                      (candidate) => candidate.id === key
                    )

                    if (field) startDraft(createFilter(field))
                  }}
                  renderEmptyState={() => (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      {messages.noFields}
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
            </div>
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
  className?: string
  /** The chip's segments. Defaults to field, operator (not for yes / no), value and remove. */
  children?: ReactNode
}

/** A filter as a chip. Render it inside `FilterBarChips`; its parts read the filter from there. */
function FilterChip({ className, children }: FilterChipProps) {
  const { field, isDraft } = useFilterChip()
  const { messages } = useFilterBar()

  return (
    <div
      role="group"
      aria-label={messages.chipLabel(field.label)}
      data-slot="filter-chip"
      data-draft={isDraft || undefined}
      // The chip being added is edited in the "+ Filter" popover, not here.
      inert={isDraft}
      className={twMerge(
        "inline-flex h-11 max-w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-input bg-background text-base/6 sm:h-9 sm:text-sm/6",
        "has-focus-visible:border-ring/70 has-focus-visible:ring-3 has-focus-visible:ring-ring/20",
        "animate-in fade-in-0 zoom-in-95 duration-150",
        "data-draft:border-dashed data-draft:opacity-60",
        className
      )}
    >
      {children ?? (
        <>
          <FilterChipField />
          {/* "Electric · Yes" reads better than "Electric is Yes". */}
          {field.variant === "boolean" ? null : <FilterChipOperator />}
          <FilterChipValue />
          <FilterChipRemove />
        </>
      )}
    </div>
  )
}

/** The field's icon and name. In a narrow chip the value truncates first; the name keeps 10rem. */
function FilterChipField({ className }: { className?: string }) {
  const { field } = useFilterChip()
  const Icon = field.icon

  return (
    <span
      className={twMerge(
        "flex max-w-40 min-w-0 shrink-[2] items-center gap-1.5 ps-2.5 pe-2 text-muted-foreground",
        className
      )}
    >
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
      <span className="truncate">{field.label}</span>
    </span>
  )
}

function FilterChipRemove({ className }: { className?: string }) {
  const { field, remove } = useFilterChip()
  const { messages } = useFilterBar()

  return (
    <ButtonPrimitive
      aria-label={messages.removeFilter(field.label)}
      onPress={remove}
      className={twMerge(
        chipSegmentClassName,
        "w-9 justify-center px-0 text-muted-foreground hover:text-foreground sm:w-8",
        className
      )}
    >
      <XIcon className="size-4" aria-hidden />
    </ButtonPrimitive>
  )
}

/** "is any of" reads wrong with one value: say "is" / "is not" then. */
function getOperatorLabel(filter: Filter, messages: FilterBarStrings) {
  const { value } = filter
  const count = value.type === "options" ? value.values.length : 0

  if (count === 1 && filter.operator === "isAnyOf") return messages.operators.is

  if (count === 1 && filter.operator === "isNoneOf") {
    return messages.operators.isNot
  }

  if (value.type === "days" && findPreset(value)) return messages.inPreset

  return messages.operators[filter.operator]
}

interface FilterOperatorMenuProps {
  filter: Filter
  field: FilterField
  onChange: (next: Partial<Filter>) => void
  className?: string
}

/** The operator as a menu (plain text when the field has one). Used by the chip and the add step. */
function FilterOperatorMenu({
  filter,
  field,
  onChange,
  className,
}: FilterOperatorMenuProps) {
  const { messages } = useFilterBar()
  const operators = getFilterOperators(field)
  const label = getOperatorLabel(filter, messages)

  if (operators.length < 2) {
    return (
      <span
        className={twMerge(
          "flex min-w-0 shrink items-center border-s border-input px-2 text-muted-foreground",
          className
        )}
      >
        <span className="truncate">{label}</span>
      </span>
    )
  }

  return (
    <Menu>
      <ButtonPrimitive
        aria-label={`${messages.operatorLabel(field.label)}: ${label}`}
        className={twMerge(
          chipSegmentClassName,
          "min-w-0 shrink text-muted-foreground",
          className
        )}
      >
        <span className="truncate">{label}</span>
      </ButtonPrimitive>
      <MenuContent
        placement="bottom start"
        selectionMode="single"
        selectedKeys={[filter.operator]}
        onAction={(key) => {
          const operator = operators.find((candidate) => candidate === key)

          // Re-picking the checked operator changes nothing.
          if (operator && operator !== filter.operator) {
            onChange({
              operator,
              value: getInitialValue(field, operator, filter.value),
            })
          }
        }}
        className="min-w-44"
      >
        {operators.map((operator) => (
          <MenuItem key={operator} id={operator}>
            <MenuLabel>{messages.operators[operator]}</MenuLabel>
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  )
}

/** The operator: a menu when the field has several, plain text when it has one. */
function FilterChipOperator({ className }: { className?: string }) {
  const { filter, field, update } = useFilterChip()

  return (
    <FilterOperatorMenu
      filter={filter}
      field={field}
      onChange={update}
      className={className}
    />
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
  const { messages } = useFilterBar()

  const formatDay = (value: string, withYear = true) => {
    const day = parseDay(value)

    if (!day) return ""

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: withYear ? "numeric" : undefined,
      timeZone: "UTC",
    }).format(day.toDate("UTC"))
  }

  const formatNumber = (value: number | null) =>
    value === null || !Number.isFinite(value)
      ? "…"
      : `${new Intl.NumberFormat(locale, {
          // Intl stops at 3 decimals; a threshold of 0.0000001 would read "0".
          maximumFractionDigits: 20,
          ...field.numberFormat,
        }).format(value)}${field.unit ? ` ${field.unit}` : ""}`

  const { value } = filter

  if (!isFilterActive(filter)) return null

  switch (value.type) {
    case "options": {
      const options = field.options ?? []

      // Options order, not click order, so the chip reads the same however the values were picked.
      const known = options
        .filter((option) => value.values.includes(option.value))
        .map((option) => option.label)

      const unknown = value.values.filter(
        (item) => !options.some((option) => option.value === item)
      )

      return summarize([...known, ...unknown])
    }

    case "boolean":
      return (
        getBooleanOptions(field, messages).find(
          (option) => option.value === String(value.value)
        )?.label ?? ""
      )
    case "range":
      return `${formatNumber(value.min)} – ${formatNumber(value.max)}`
    case "number":
      return formatNumber(value.number)
    case "day":
      return formatDay(value.day)
    case "days": {
      const preset = findPreset(value)

      if (preset) return messages.datePresets[preset.id]

      if (!value.end) return `${formatDay(value.start)} – …`

      if (!value.start) return `… – ${formatDay(value.end)}`

      const sameYear = value.start.slice(0, 4) === value.end.slice(0, 4)

      return `${formatDay(value.start, !sameYear)} – ${formatDay(value.end)}`
    }

    case "text":
      // Quoted when rendered; see FilterChipValue.
      return value.text
    case "none":
      return null
  }
}

/** The value: opens the field's editor. Hidden for operators without a value (`is empty`). */
function FilterChipValue({ className }: { className?: string }) {
  const { filter, field, update, remove } = useFilterChip()
  const { messages } = useFilterBar()
  const [isOpen, setOpen] = useState(false)
  const label = useValueLabel(filter, field)

  if (isValuelessOperator(filter.operator)) return null

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(open) => {
        setOpen(open)

        // A chip whose value was cleared narrows nothing: drop it when its editor closes.
        if (!open && !isFilterActive(filter)) remove()
      }}
    >
      <ButtonPrimitive
        aria-label={`${messages.valueLabel(field.label)}: ${label ?? messages.notSet}`}
        className={twMerge(
          chipSegmentClassName,
          "min-w-10 shrink font-medium text-foreground",
          className
        )}
      >
        <span
          className={twMerge(
            "max-w-64 truncate",
            label === null && "font-normal text-muted-foreground"
          )}
        >
          {/* <bdi> keeps an RTL value from flipping the punctuation around it. */}
          {label !== null && field.variant === "text" ? (
            <>
              “<bdi>{label}</bdi>”
            </>
          ) : null}
          {label !== null && field.variant !== "text" ? (
            <bdi>{label}</bdi>
          ) : null}
          {label === null
            ? (field.placeholder ?? messages.placeholders[field.variant])
            : null}
        </span>
      </ButtonPrimitive>
      <PopoverContent
        placement="bottom start"
        className="max-w-[calc(100vw-1.5rem)] min-w-0 overflow-x-hidden overflow-y-auto p-0"
      >
        <Dialog
          aria-label={`${field.label} ${messages.operators[filter.operator]}`}
          className="outline-hidden"
        >
          {({ close }) => (
            <FilterValueEditor
              filter={filter}
              field={field}
              onChange={(value) => update({ value })}
              onCommit={(value) => {
                // Value and close in one update, so closing never sees the old value.
                setOpen(false)
                update({ value })
              }}
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
  const { messages } = useFilterBar()

  return (
    <form
      className="w-64 max-w-full p-2"
      onSubmit={(event) => {
        event.preventDefault()
        onDone()
      }}
    >
      {/* Controlled, so a parent that rewrites the value (trims, clamps) shows it here too. */}
      <Input
        autoFocus
        aria-label={field.label}
        placeholder={field.placeholder ?? messages.placeholders.text}
        value={filter.value.type === "text" ? filter.value.text : ""}
        onChange={(event) =>
          onChange({ type: "text", text: event.target.value })
        }
      />
    </form>
  )
}

/** What is typed, in the locale's digits and separators ("12,5" in sl-SI); "1e3" or "0x10" is no value. */
function parseNumberInput(raw: string, locale: string) {
  const parser = new NumberParser(locale)

  if (!raw.trim() || !parser.isValidPartialNumber(raw)) return null

  const number = parser.parse(raw)

  return Number.isFinite(number) ? number : null
}

/** In the locale's format, all digits: `String(0.0000001)` would be "1e-7". */
function formatNumberInput(value: number | null, locale: string) {
  if (value === null || !Number.isFinite(value)) return ""

  return new NumberFormatter(locale, {
    useGrouping: false,
    maximumFractionDigits: 20,
  }).format(value)
}

interface NumberInputProps {
  value: number | null
  onChange: (value: number | null) => void
  "aria-label": string
  placeholder: string
  autoFocus?: boolean
}

/**
 * Keeps partial typing ("1.") that parses to the parent's value, and shows the parent's value
 * whenever the two disagree (a parent that clamps, resets or rejects the number).
 */
function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const { locale } = useLocale()
  const [raw, setRaw] = useState(() => formatNumberInput(value, locale))
  // A NaN or Infinity passed in reads as no value, or the comparison below would never settle.
  const target = value !== null && Number.isFinite(value) ? value : null
  const formatted = formatNumberInput(target, locale)

  // The parent decides: when the text does not parse to its value (it clamped or reset it), show
  // the parent's. Partial input that parses the same ("1.") stays. Comparing the text too keeps a
  // value that cannot be read back from re-rendering forever.
  if (parseNumberInput(raw, locale) !== target && raw !== formatted) {
    setRaw(formatted)
  }

  return (
    <Input
      {...props}
      // Text, not type="number": a number input reports "" for "1." until the next digit, and
      // "-0" round-trips as "0", so the typed text and the value would disagree.
      inputMode="decimal"
      value={raw}
      onChange={(event) => {
        setRaw(event.target.value)
        onChange(parseNumberInput(event.target.value, locale))
      }}
    />
  )
}

function NumberEditor({
  filter,
  field,
  onChange,
  onDone,
}: FilterValueEditorProps) {
  const { messages } = useFilterBar()
  const isRange = filter.operator === "between"

  const { value } = filter
  const min = value.type === "range" ? value.min : null
  const max = value.type === "range" ? value.max : null
  const single = value.type === "number" ? value.number : null

  const unit = field.unit ? (
    <span className="shrink-0 text-sm text-muted-foreground">{field.unit}</span>
  ) : null

  return (
    <form
      className="flex w-72 max-w-full items-center gap-2 p-2"
      // A form with two inputs and no submit button does not submit on Enter, so handle it here.
      onKeyDown={(event) => {
        if (event.key !== "Enter" || event.nativeEvent.isComposing) return
        event.preventDefault()
        onDone()
      }}
      onSubmit={(event) => event.preventDefault()}
    >
      <NumberInput
        // `key` starts a fresh input when the operator switches between one value and a range.
        key={isRange ? "min" : "single"}
        autoFocus
        aria-label={isRange ? `${field.label} ${messages.min}` : field.label}
        placeholder={
          isRange
            ? messages.min
            : (field.placeholder ?? messages.placeholders.number)
        }
        value={isRange ? min : single}
        onChange={(next) =>
          onChange(
            isRange
              ? { type: "range", min: next, max }
              : { type: "number", number: next }
          )
        }
      />
      {isRange ? (
        <>
          <span className="shrink-0 text-sm text-muted-foreground">
            {messages.and}
          </span>
          <NumberInput
            aria-label={`${field.label} ${messages.max}`}
            placeholder={messages.max}
            value={max}
            onChange={(next) => onChange({ type: "range", min, max: next })}
          />
        </>
      ) : null}
      {unit}
    </form>
  )
}

/** Lists longer than this get a search field and show the picked options first. */
const longListThreshold = 7

function SelectEditor({
  filter,
  field,
  onChange,
  onCommit,
}: FilterValueEditorProps) {
  const { contains } = useFilter({ sensitivity: "base" })
  const { messages } = useFilterBar()
  const options = field.options ?? []
  const isLong = options.length > longListThreshold
  const isMultiple = field.multiple ?? true
  const selected = filter.value.type === "options" ? filter.value.values : []
  // What was picked when the editor opened goes first; it stays put while you pick more.
  const [pinned] = useState(selected)

  const items = isLong
    ? [
        ...options.filter((option) => pinned.includes(option.value)),
        ...options.filter((option) => !pinned.includes(option.value)),
      ]
    : options

  const listBox = (
    <ListBox
      aria-label={field.label}
      items={items}
      autoFocus={!isLong}
      selectionMode={isMultiple ? "multiple" : "single"}
      // Escape closes the popover; it must not clear the picks on the way out.
      escapeKeyBehavior="none"
      selectedKeys={selected}
      onSelectionChange={(keys) => {
        const next =
          keys === "all"
            ? options.map((option) => option.value)
            : [...keys].map(String)

        if (isMultiple) onChange({ type: "options", values: next })
        // Clicking the selected option of a single select deselects it; keep it instead.
        else
          onCommit({ type: "options", values: next.length ? next : selected })
      }}
      renderEmptyState={() => (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          {messages.noResults}
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

  if (!isLong) return <div className="w-56 max-w-full">{listBox}</div>

  return (
    <div className="w-64 max-w-full">
      <Autocomplete filter={contains}>
        <SearchField
          autoFocus
          aria-label={messages.searchOptions(field.label)}
          className="border-b border-foreground/10 p-1"
        >
          <SearchInput placeholder={messages.searchOptions(field.label)} />
        </SearchField>
        {listBox}
      </Autocomplete>
    </div>
  )
}

function BooleanEditor({ filter, field, onCommit }: FilterValueEditorProps) {
  const { messages } = useFilterBar()

  return (
    <ListBox
      aria-label={field.label}
      autoFocus
      items={getBooleanOptions(field, messages)}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={
        filter.value.type === "boolean" && filter.value.value !== null
          ? [String(filter.value.value)]
          : []
      }
      onSelectionChange={(keys) => {
        if (keys === "all") return
        onCommit({ type: "boolean", value: [...keys][0] === "true" })
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
  const { messages } = useFilterBar()

  if (filter.operator !== "between") {
    const day = parseDay(filter.value.type === "day" ? filter.value.day : "")

    return (
      // The calendar's 44px day cells are 308px wide; on a 320px screen they get 36px.
      <div className="p-3 max-sm:p-2 max-sm:[&_[role=gridcell]>*]:size-9">
        <Calendar
          aria-label={field.label}
          value={day}
          onChange={(next) => onCommit({ type: "day", day: next.toString() })}
        />
      </div>
    )
  }

  const range =
    filter.value.type === "days" ? filter.value : { start: "", end: "" }

  const start = parseDay(range.start)
  const end = parseDay(range.end)
  const activePreset = findPreset(range)

  return (
    // Presets beside the calendar from `sm`; above it on phones, where the two do not fit side by side.
    <div className="flex flex-col sm:flex-row">
      <div className="flex flex-wrap gap-1 border-b border-foreground/10 p-1.5 sm:w-36 sm:shrink-0 sm:flex-col sm:flex-nowrap sm:gap-0.5 sm:border-e sm:border-b-0">
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
            {messages.datePresets[preset.id]}
          </ButtonPrimitive>
        ))}
      </div>
      <div className="p-3">
        <RangeCalendar
          aria-label={field.label}
          value={start && end ? { start, end } : null}
          onChange={(next) =>
            onCommit({
              type: "days",
              start: next.start.toString(),
              end: next.end.toString(),
            })
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

function FilterBarClear({ className, children }: FilterBarClearProps) {
  const { filters, setFilters, setDraftField, messages, restoreFocus } =
    useFilterBar()

  if (!filters.length) return null

  return (
    <Button
      intent="plain"
      className={twMerge(
        "ms-auto h-11 text-muted-foreground sm:h-9",
        className
      )}
      onPress={() => {
        setDraftField(null)
        setFilters([])
        // Clear disappears with the filters; "Filter" takes the focus.
        restoreFocus()
      }}
    >
      {children ?? messages.clear}
    </Button>
  )
}

export {
  FilterBar,
  FilterBarAdd,
  FilterBarChips,
  FilterBarClear,
  FilterChip,
  FilterChipField,
  FilterChipOperator,
  FilterChipRemove,
  FilterChipValue,
  isFilterActive,
  matchesFilter,
}

export type {
  Filter,
  FilterBarAddProps,
  FilterBarChipsProps,
  FilterBarMessages,
  FilterBarProps,
  FilterCellValue,
  FilterChipProps,
  FilterField,
  FilterOperator,
  FilterOption,
  FilterValue,
  FilterVariant,
}
