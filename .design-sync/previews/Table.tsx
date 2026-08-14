import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "preskok"

const vehicles = [
  { id: 1, vehicle: "Volvo EX30", stock: "VE-204", note: "Demo vehicle" },
  { id: 2, vehicle: "BMW i4", stock: "BM-118", note: "Priority lead" },
  { id: 3, vehicle: "Audi Q4 e-tron", stock: "AU-512", note: "No notes yet" },
]

export function Basic() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background p-4 shadow-sm">
      <Table aria-label="Vehicles" selectionMode="multiple">
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
              <TableCell>{vehicle.note}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
