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
    account: "Acme Labs",
    owner: "Maya Chen",
    value: 84_000,
    stage: "Renewal",
  },
  {
    id: 2,
    account: "Northstar Health",
    owner: "Noah Reed",
    value: 128_000,
    stage: "Security review",
  },
  {
    id: 3,
    account: "Riverbank Studio",
    owner: "Iris Patel",
    value: 42_500,
    stage: "Negotiation",
  },
  {
    id: 4,
    account: "Vertex Freight",
    owner: "Sam Ortiz",
    value: 96_200,
    stage: "Proposal",
  },
  {
    id: 5,
    account: "Bluefield Energy",
    owner: "Lena Park",
    value: 152_400,
    stage: "Legal",
  },
  {
    id: 6,
    account: "Kite Systems",
    owner: "Owen Brooks",
    value: 31_900,
    stage: "Discovery",
  },
  {
    id: 7,
    account: "Summit Foods",
    owner: "Ava Stone",
    value: 77_300,
    stage: "Procurement",
  },
  {
    id: 8,
    account: "Harbor Finance",
    owner: "Theo Miles",
    value: 118_600,
    stage: "Contracting",
  },
]

type Row = (typeof rows)[number]

export function TableDemoSort() {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "account",
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
    <div className="w-full max-w-4xl overflow-hidden rounded-xl border bg-background p-4 shadow-sm">
      <Table
        aria-label="Sales pipeline"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <TableColumn id="id" allowsSorting>
            ID
          </TableColumn>
          <TableColumn id="account" isRowHeader allowsSorting>
            Account
          </TableColumn>
          <TableColumn id="owner" allowsSorting>
            Owner
          </TableColumn>
          <TableColumn id="value" allowsSorting>
            Value
          </TableColumn>
          <TableColumn id="stage" allowsSorting>
            Stage
          </TableColumn>
        </TableHeader>
        <TableBody items={sortedRows}>
          {(item) => (
            <TableRow id={item.id}>
              <TableCell className="tabular-nums">{item.id}</TableCell>
              <TableCell>{item.account}</TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell className="tabular-nums">
                ${item.value.toLocaleString()}
              </TableCell>
              <TableCell>{item.stage}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
