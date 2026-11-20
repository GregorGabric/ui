"use client"

import {
  CalendarDaysIcon,
  CarFrontIcon,
  CircleDotIcon,
  EuroIcon,
  GaugeIcon,
  GlobeIcon,
} from "lucide-react"

import {
  FilterBar,
  FilterBarAdd,
  FilterBarChips,
  FilterBarClear,
  type Filter,
  type FilterField,
} from "@/registry/preskok/ui/preskok-ui/filter-bar"

const fields: Array<FilterField> = [
  {
    id: "make",
    label: "Make",
    variant: "select",
    icon: CarFrontIcon,
    options: ["Audi", "BMW", "Škoda", "Tesla", "Volkswagen"].map((make) => ({
      value: make,
      label: make,
    })),
  },
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
  { id: "price", label: "Price", variant: "number", icon: EuroIcon, unit: "€" },
  {
    id: "mileage",
    label: "Mileage",
    variant: "number",
    icon: GaugeIcon,
    unit: "km",
  },
  {
    id: "country",
    label: "Country",
    variant: "select",
    icon: GlobeIcon,
    options: [
      { value: "si", label: "Slovenia" },
      { value: "hr", label: "Croatia" },
      { value: "at", label: "Austria" },
    ],
  },
  { id: "listed", label: "Listed", variant: "date", icon: CalendarDaysIcon },
]

const filters: Array<Filter> = [
  {
    id: "make",
    field: "make",
    operator: "isAnyOf",
    value: ["Tesla", "Volkswagen"],
  },
  { id: "status", field: "status", operator: "isAnyOf", value: ["available"] },
  { id: "price", field: "price", operator: "between", value: [15_000, 40_000] },
  { id: "mileage", field: "mileage", operator: "lte", value: 60_000 },
  { id: "country", field: "country", operator: "isAnyOf", value: ["si", "hr"] },
]

/** `max` keeps the row to two chips; the rest open from "+3 more" and stay editable there. */
export default function FilterBarOverflowDemo() {
  return (
    <div className="w-2xl max-w-full">
      <FilterBar fields={fields} defaultValue={filters}>
        <FilterBarChips max={2} />
        <FilterBarAdd shortcut={false} />
        <FilterBarClear />
      </FilterBar>
    </div>
  )
}
