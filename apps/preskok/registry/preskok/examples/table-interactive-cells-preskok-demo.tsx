"use client"

import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/registry/preskok/ui/preskok-ui/table"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

const vehicles = [
  { id: 1, vehicle: "Volvo EX30", stock: "VE-204", note: "Demo vehicle" },
  { id: 2, vehicle: "BMW i4", stock: "BM-118", note: "Priority lead" },
  { id: 3, vehicle: "Audi Q4 e-tron", stock: "AU-512", note: "" },
]

export default function TableInteractiveCellsPreskokDemo() {
  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl border bg-background p-4 shadow-sm">
      <Table
        aria-label="Vehicle notes"
        keyboardNavigationBehavior="tab"
        selectionMode="multiple"
      >
        <TableHeader>
          <TableColumn isRowHeader>Vehicle</TableColumn>
          <TableColumn>Stock</TableColumn>
          <TableColumn>Internal note</TableColumn>
        </TableHeader>
        <TableBody items={vehicles}>
          {(vehicle) => (
            <TableRow id={vehicle.id}>
              <TableCell className="font-medium text-foreground">
                {vehicle.vehicle}
              </TableCell>
              <TableCell>{vehicle.stock}</TableCell>
              <TableCell>
                <TextField
                  aria-label={`${vehicle.vehicle} internal note`}
                  defaultValue={vehicle.note}
                >
                  <Input className="min-w-48" placeholder="Add a note" />
                </TextField>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
