"use client"

import { useState } from "react"
import {
  BatteryChargingIcon,
  CalendarDaysIcon,
  CarFrontIcon,
  CircleDotIcon,
  EuroIcon,
  GaugeIcon,
  HashIcon,
  TagIcon,
} from "lucide-react"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import {
  FilterBar,
  FilterBarAdd,
  FilterBarChips,
  FilterBarClear,
  matchesFilter,
  type Filter,
  type FilterCellValue,
  type FilterField,
} from "@/registry/preskok/ui/preskok-ui/filter-bar"
import {
  SearchField,
  SearchInput,
} from "@/registry/preskok/ui/preskok-ui/search-field"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/registry/preskok/ui/preskok-ui/table"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  status: "available" | "reserved" | "sold"
  electric: boolean
  listed: string
}

const vehicles: Array<Vehicle> = [
  {
    id: "1",
    make: "Volkswagen",
    model: "Golf",
    year: 2023,
    price: 24_900,
    mileage: 12_400,
    status: "available",
    electric: false,
    listed: "2026-11-18",
  },
  {
    id: "2",
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    price: 39_500,
    mileage: 8100,
    status: "reserved",
    electric: true,
    listed: "2026-11-02",
  },
  {
    id: "3",
    make: "BMW",
    model: "i4",
    year: 2023,
    price: 47_800,
    mileage: 21_000,
    status: "available",
    electric: true,
    listed: "2026-10-12",
  },
  {
    id: "4",
    make: "Škoda",
    model: "Octavia",
    year: 2021,
    price: 17_300,
    mileage: 64_200,
    status: "sold",
    electric: false,
    listed: "2026-08-30",
  },
  {
    id: "5",
    make: "Renault",
    model: "Zoe",
    year: 2022,
    price: 15_900,
    mileage: 31_700,
    status: "available",
    electric: true,
    listed: "2026-11-15",
  },
  {
    id: "6",
    make: "Audi",
    model: "A4 Avant",
    year: 2022,
    price: 33_400,
    mileage: 41_900,
    status: "available",
    electric: false,
    listed: "2026-09-21",
  },
  {
    id: "7",
    make: "Volkswagen",
    model: "ID.4",
    year: 2024,
    price: 41_200,
    mileage: 2300,
    status: "reserved",
    electric: true,
    listed: "2026-11-19",
  },
  {
    id: "8",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    price: 14_800,
    mileage: 88_500,
    status: "sold",
    electric: false,
    listed: "2026-07-04",
  },
]

/** A vehicle's value for a filter field, for `matchesFilter`. */
function cellOf(vehicle: Vehicle, field: string): FilterCellValue {
  switch (field) {
    case "make":
      return vehicle.make
    case "model":
      return vehicle.model
    case "year":
      return vehicle.year
    case "electric":
      return vehicle.electric
    case "price":
      return vehicle.price
    case "mileage":
      return vehicle.mileage
    case "status":
      return vehicle.status
    case "listed":
      return vehicle.listed
    default:
      return undefined
  }
}

const makes = [...new Set(vehicles.map((vehicle) => vehicle.make))].toSorted()

const fields: Array<FilterField> = [
  {
    id: "make",
    label: "Make",
    variant: "select",
    icon: CarFrontIcon,
    group: "Vehicle",
    options: makes.map((make) => ({ value: make, label: make })),
  },
  {
    id: "model",
    label: "Model",
    variant: "text",
    icon: TagIcon,
    group: "Vehicle",
  },
  {
    id: "year",
    label: "Year",
    variant: "number",
    icon: HashIcon,
    group: "Vehicle",
    numberFormat: { useGrouping: false },
  },
  {
    id: "electric",
    label: "Electric",
    variant: "boolean",
    icon: BatteryChargingIcon,
    group: "Vehicle",
  },
  {
    id: "price",
    label: "Price",
    variant: "number",
    icon: EuroIcon,
    group: "Listing",
    unit: "€",
  },
  {
    id: "mileage",
    label: "Mileage",
    variant: "number",
    icon: GaugeIcon,
    group: "Listing",
    unit: "km",
  },
  {
    id: "status",
    label: "Status",
    variant: "select",
    icon: CircleDotIcon,
    group: "Listing",
    options: [
      { value: "available", label: "Available" },
      { value: "reserved", label: "Reserved" },
      { value: "sold", label: "Sold" },
    ],
  },
  {
    id: "listed",
    label: "Listed",
    variant: "date",
    icon: CalendarDaysIcon,
    group: "Listing",
  },
]

const columns = [
  { id: "vehicle", name: "Vehicle", isRowHeader: true },
  { id: "year", name: "Year" },
  { id: "price", name: "Price" },
  { id: "mileage", name: "Mileage" },
  { id: "status", name: "Status" },
  { id: "listed", name: "Listed" },
]

const fieldsById = new Map(fields.map((field) => [field.id, field]))

const listedDate = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

const statusIntent = {
  available: "success",
  reserved: "warning",
  sold: "secondary",
} as const

const euro = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

export default function FilterBarDemo() {
  const [query, setQuery] = useState("")

  const [filters, setFilters] = useState<Array<Filter>>([
    {
      field: "status",
      operator: "isAnyOf",
      value: ["available", "reserved"],
    },
  ])

  const rows = vehicles.filter(
    (vehicle) =>
      `${vehicle.make} ${vehicle.model}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()) &&
      filters.every((filter) => {
        const field = fieldsById.get(filter.field)

        return (
          !field || matchesFilter(cellOf(vehicle, filter.field), filter, field)
        )
      })
  )

  return (
    <div className="w-4xl max-w-full space-y-4">
      <FilterBar fields={fields} value={filters} onChange={setFilters}>
        <SearchField
          aria-label="Search vehicles"
          value={query}
          onChange={setQuery}
          className="w-full sm:w-56"
        >
          <SearchInput placeholder="Search" />
        </SearchField>
        <FilterBarChips />
        <FilterBarAdd shortcut="f" />
        <FilterBarClear />
      </FilterBar>

      <div className="overflow-hidden rounded-xl border bg-background">
        <Table aria-label="Vehicles">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn id={column.id} isRowHeader={column.isRowHeader}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            renderEmptyState={() => (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No vehicles match these filters.
              </div>
            )}
          >
            {(vehicle) => (
              <TableRow id={vehicle.id} columns={columns}>
                {(column) => (
                  <TableCell
                    className={
                      column.id === "price" || column.id === "mileage"
                        ? "tabular-nums"
                        : undefined
                    }
                  >
                    {renderCell(vehicle, column.id)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function renderCell(vehicle: Vehicle, columnId: string) {
  switch (columnId) {
    case "vehicle":
      return `${vehicle.make} ${vehicle.model}`
    case "year":
      return vehicle.year
    case "price":
      return euro.format(vehicle.price)
    case "mileage":
      return `${vehicle.mileage.toLocaleString("en")} km`
    case "status":
      return (
        <Badge intent={statusIntent[vehicle.status]} className="capitalize">
          {vehicle.status}
        </Badge>
      )
    case "listed":
      return listedDate.format(new Date(vehicle.listed))
    default:
      return null
  }
}
