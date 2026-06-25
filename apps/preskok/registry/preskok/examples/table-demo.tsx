"use client"

import { useState } from "react"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
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
  status: "Available" | "Reserved" | "In service"
}

const vehicles: Array<Vehicle> = [
  {
    id: "veh-101",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    price: 28_400,
    mileage: 0,
    status: "Available",
  },
  {
    id: "veh-102",
    make: "Honda",
    model: "Accord",
    year: 2023,
    price: 26_800,
    mileage: 15_000,
    status: "Reserved",
  },
  {
    id: "veh-103",
    make: "Ford",
    model: "F-150",
    year: 2024,
    price: 35_200,
    mileage: 5000,
    status: "In service",
  },
  {
    id: "veh-104",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 42_000,
    mileage: 8000,
    status: "Available",
  },
]

const columns = [
  { id: "model", name: "Vehicle", isRowHeader: true },
  { id: "year", name: "Year" },
  { id: "price", name: "Price" },
  { id: "mileage", name: "Mileage" },
  { id: "status", name: "Status" },
] satisfies Array<{
  id: keyof Omit<Vehicle, "id">
  name: string
  isRowHeader?: boolean
}>

const renderCell = (vehicle: Vehicle, columnId: keyof Omit<Vehicle, "id">) => {
  switch (columnId) {
    case "model":
      return `${vehicle.make} ${vehicle.model}`
    case "price":
      return `$${vehicle.price.toLocaleString()}`
    case "mileage":
      return `${vehicle.mileage.toLocaleString()} mi`
    case "status":
      return <StatusBadge status={vehicle.status} />
    default:
      return vehicle[columnId]
  }
}

function StatusBadge({ status }: { status: Vehicle["status"] }) {
  if (status === "Available") {
    return <Badge intent="success">{status}</Badge>
  }

  if (status === "Reserved") {
    return <Badge intent="warning">{status}</Badge>
  }

  return <Badge intent="secondary">{status}</Badge>
}

export default function TableDemo() {
  const [query, setQuery] = useState("")
  const [selectionLabel, setSelectionLabel] = useState("0 selected")
  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = [vehicle.make, vehicle.model, vehicle.status]
      .join(" ")
      .toLowerCase()

    return searchText.includes(query.toLowerCase())
  })

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          aria-label="Search inventory"
          className="w-full sm:w-72"
          placeholder="Search inventory"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button
          intent="outline"
          isDisabled={selectionLabel === "0 selected"}
          className="self-start whitespace-nowrap sm:self-auto"
        >
          Archive {selectionLabel}
        </Button>
      </div>
      <div className="bg-background overflow-hidden rounded-xl border p-4 shadow-sm">
        <Table
          aria-label="Vehicle inventory"
          selectionMode="multiple"
          onSelectionChange={(keys) => {
            if (keys === "all") {
              setSelectionLabel(`${filteredVehicles.length} selected`)
              return
            }

            setSelectionLabel(`${keys.size} selected`)
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn id={column.id} isRowHeader={column.isRowHeader}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={filteredVehicles}>
            {(item) => (
              <TableRow id={item.id} columns={columns}>
                {(column) => (
                  <TableCell
                    className={
                      column.id === "price" || column.id === "mileage"
                        ? "tabular-nums"
                        : undefined
                    }
                  >
                    {renderCell(item, column.id)}
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
