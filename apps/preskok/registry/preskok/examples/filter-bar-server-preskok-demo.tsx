"use client"

import { useState } from "react"
import { CircleDotIcon, EuroIcon, TagIcon } from "lucide-react"

import {
  FilterBar,
  FilterBarAdd,
  FilterBarChips,
  FilterBarClear,
  isFilterActive,
  type Filter,
  type FilterField,
  type FilterValue,
} from "@/registry/preskok/ui/preskok-ui/filter-bar"

const fields: Array<FilterField> = [
  {
    id: "status",
    label: "Status",
    variant: "select",
    icon: CircleDotIcon,
    options: [
      { value: "available", label: "Available" },
      { value: "reserved", label: "Reserved" },
      { value: "sold", label: "Sold" },
    ],
  },
  { id: "model", label: "Model", variant: "text", icon: TagIcon },
  { id: "price", label: "Price", variant: "number", icon: EuroIcon, unit: "€" },
]

/** `?status=isAnyOf.available%2Creserved&price=between.10000%2C25000`: one way to put filters in a URL. */
/** One string per value kind: "available,reserved", "10000,25000", "2026-11-01,2026-11-30". */
function serialize(value: FilterValue) {
  switch (value.type) {
    case "text":
      return value.text
    case "number":
      return String(value.number ?? "")
    case "range":
      return `${value.min ?? ""},${value.max ?? ""}`
    case "options":
      return value.values.join(",")
    case "boolean":
      return String(value.value ?? "")
    case "day":
      return value.day
    case "days":
      return `${value.start},${value.end}`
    case "none":
      return ""
  }
}

function toSearchParams(filters: Array<Filter>) {
  const params = new URLSearchParams()

  for (const filter of filters) {
    const value = serialize(filter.value)

    params.set(
      filter.field,
      value ? `${filter.operator}.${value}` : filter.operator
    )
  }

  return params.toString()
}

/**
 * Filtering on the server: send only the active filters. While a filter is being added it is in
 * the list without a value yet; `isFilterActive` leaves it out of the request.
 */
export default function FilterBarServerDemo() {
  const [filters, setFilters] = useState<Array<Filter>>([
    {
      field: "status",
      operator: "isAnyOf",
      value: { type: "options", values: ["available", "reserved"] },
    },
    {
      field: "price",
      operator: "between",
      value: { type: "range", min: 10_000, max: 25_000 },
    },
  ])

  const active = filters.filter(isFilterActive)
  const query = toSearchParams(active)

  return (
    <div className="w-2xl max-w-full space-y-4">
      <FilterBar fields={fields} value={filters} onChange={setFilters}>
        <FilterBarChips />
        <FilterBarAdd />
        <FilterBarClear />
      </FilterBar>
      <div className="rounded-lg border bg-muted/40 p-3 font-mono text-xs/5 break-all text-muted-foreground">
        GET /api/vehicles{query ? `?${query}` : ""}
      </div>
    </div>
  )
}
