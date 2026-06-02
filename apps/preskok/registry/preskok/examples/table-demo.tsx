"use client"

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
  fuelType: string
}

const vehicles: Array<Vehicle> = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    price: 28_400,
    mileage: 0,
    fuelType: "Gasoline",
  },
  {
    id: "2",
    make: "Honda",
    model: "Accord",
    year: 2023,
    price: 26_800,
    mileage: 15_000,
    fuelType: "Hybrid",
  },
  {
    id: "3",
    make: "Ford",
    model: "F-150",
    year: 2024,
    price: 35_200,
    mileage: 5000,
    fuelType: "Gasoline",
  },
  {
    id: "4",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 42_000,
    mileage: 8000,
    fuelType: "Electric",
  },
]

const columns = [
  { id: "make", name: "Make", isRowHeader: true },
  { id: "model", name: "Model" },
  { id: "year", name: "Year" },
  { id: "price", name: "Price" },
  { id: "mileage", name: "Mileage" },
  { id: "fuelType", name: "Fuel Type" },
] satisfies Array<{
  id: keyof Omit<Vehicle, "id">
  name: string
  isRowHeader?: boolean
}>

const renderCell = (vehicle: Vehicle, columnId: keyof Omit<Vehicle, "id">) => {
  switch (columnId) {
    case "price":
      return `$${vehicle.price.toLocaleString()}`
    case "mileage":
      return `${vehicle.mileage.toLocaleString()} mi`
    default:
      return vehicle[columnId]
  }
}

export default function TableDemo() {
  return (
    <div className="rounded-md border">
      <Table aria-label="Vehicle inventory" selectionMode="multiple">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn id={column.id} isRowHeader={column.isRowHeader}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={vehicles}>
          {(item) => (
            <TableRow id={item.id} columns={columns}>
              {(column) => <TableCell>{renderCell(item, column.id)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
