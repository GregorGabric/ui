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

/** `?status=isAnyOf.available,reserved&price=between.10000,25000`: one way to put filters in a URL. */
function toSearchParams(filters: Array<Filter>) {
  const params = new URLSearchParams()
  for (const filter of filters) {
    const value = Array.isArray(filter.value)
      ? filter.value.map((item) => item ?? "").join(",")
      : String(filter.value ?? "")
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
      id: "status",
      field: "status",
      operator: "isAnyOf",
      value: ["available", "reserved"],
    },
    {
      id: "price",
      field: "price",
      operator: "between",
      value: [10_000, 25_000],
    },
  ])
  const active = filters.filter(isFilterActive)
  const query = toSearchParams(active)

  return (
    <div className="w-2xl max-w-full space-y-4">
      <FilterBar fields={fields} value={filters} onChange={setFilters}>
        <FilterBarChips />
        <FilterBarAdd shortcut={false} />
        <FilterBarClear />
      </FilterBar>
      <div className="rounded-lg border bg-muted/40 p-3 font-mono text-xs/5 break-all text-muted-foreground">
        GET /api/vehicles{query ? `?${decodeURIComponent(query)}` : ""}
      </div>
    </div>
  )
}
