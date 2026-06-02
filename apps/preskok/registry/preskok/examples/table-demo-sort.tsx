"use client"

import { useState } from "react"
import type { SortDescriptor } from "react-aria-components/Table"

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/registry/preskok/ui/preskok-ui/table"

const rows = [
  {
    id: 1,
    name: "Charizard",
    type: "Fire, Flying",
    level: 67,
    description: "A fire dragon that can fly and breathe fire.",
  },
  {
    id: 2,
    name: "Blastoise",
    type: "Water",
    level: 56,
    description: "A water dragon that can swim and breathe water.",
  },
  {
    id: 3,
    name: "Venusaur",
    type: "Grass, Poison",
    level: 83,
    description: "A grass dragon that can grow and breathe grass.",
  },
  {
    id: 4,
    name: "Pikachu",
    type: "Electric",
    level: 100,
    description: "An electric dragon that can charge and breathe electricity.",
  },
  {
    id: 5,
    name: "Charizard",
    type: "Fire, Flying",
    level: 67,
    description: "A fire dragon that can fly and breathe fire.",
  },
  {
    id: 6,
    name: "Blastoise",
    type: "Water",
    level: 56,
    description: "A water dragon that can swim and breathe water.",
  },
  {
    id: 7,
    name: "Venusaur",
    type: "Grass, Poison",
    level: 83,
    description: "A grass dragon that can grow and breathe grass.",
  },
  {
    id: 8,
    name: "Pikachu",
    type: "Electric",
    level: 100,
    description: "An electric dragon that can charge and breathe electricity.",
  },
]

type Row = (typeof rows)[number]

export function TableDemoSort() {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  })

  let sortedRows = rows
  if (sortDescriptor) {
    sortedRows = rows.toSorted((a, b) => {
      const column = sortDescriptor.column as keyof Row
      const first = a[column]
      const second = b[column]
      let cmp = first < second ? -1 : 1
      if (sortDescriptor.direction === "descending") {
        cmp = -cmp
      }
      return cmp
    })
  }

  return (
    <div className="overflow-auto rounded-lg border p-4">
      <Table
        aria-label="Favorite pokemon"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <TableColumn id="id" allowsSorting>
            ID
          </TableColumn>
          <TableColumn id="name" isRowHeader allowsSorting>
            Name
          </TableColumn>
          <TableColumn id="type" allowsSorting>
            Type
          </TableColumn>
          <TableColumn id="level" allowsSorting>
            Level
          </TableColumn>
          <TableColumn id="description" allowsSorting>
            Description
          </TableColumn>
        </TableHeader>
        <TableBody items={sortedRows}>
          {(item) => (
            <TableRow id={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.level}</TableCell>
              <TableCell>{item.description}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
