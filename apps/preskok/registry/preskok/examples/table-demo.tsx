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
  { key: "make", name: "Make", isRowHeader: true },
  { key: "model", name: "Model" },
  { key: "year", name: "Year" },
  { key: "price", name: "Price" },
  { key: "mileage", name: "Mileage" },
  { key: "fuelType", name: "Fuel Type" },
]

export default function TableDemo() {
  return (
    <div className="rounded-md border">
      <Table aria-label="Vehicle inventory" selectionMode="multiple">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} isRowHeader={column.isRowHeader}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={vehicles}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.make}</TableCell>
              <TableCell>{item.model}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>${item.price.toLocaleString()}</TableCell>
              <TableCell>{item.mileage.toLocaleString()} mi</TableCell>
              <TableCell>{item.fuelType}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
