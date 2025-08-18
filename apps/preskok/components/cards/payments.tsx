"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import { Menu } from "@/registry/preskok/ui/preskok-ui/menu"
import { Table } from "@/registry/preskok/ui/preskok-ui/table"

const data: Array<Payment> = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
  {
    id: "k9f2m3n4",
    amount: 450,
    status: "pending",
    email: "jason78@example.com",
  },
  {
    id: "p5q6r7s8",
    amount: 1280,
    status: "success",
    email: "sarah23@example.com",
  },
]

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: Array<ColumnDef<Payment>> = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        slot="selection"
        isIndeterminate={table.getIsSomePageRowsSelected()}
        isSelected={table.getIsAllPageRowsSelected()}
        onChange={(isSelected) => {
          table.toggleAllPageRowsSelected(!!isSelected)
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        slot="selection"
        isSelected={row.getIsSelected()}
        onChange={(isSelected) => {
          row.toggleSelected(!!isSelected)
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <Menu>
          <Menu.Trigger className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon />
          </Menu.Trigger>
          <Menu.Content aria-label="Actions" placement="bottom end">
            <Menu.Header>Actions</Menu.Header>
            <Menu.Item
              onAction={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item>View customer</Menu.Item>
            <Menu.Item>View payment details</Menu.Item>
          </Menu.Content>
        </Menu>
      )
    },
  },
]

export function CardsPayments() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Invoices</CardTitle>
        <CardDescription>
          Manage transport invoices and payments.
        </CardDescription>
        <CardAction>
          <Button intent="secondary" size="sm" className="shadow-none">
            Add Invoice
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="rounded-md border">
          <Table aria-label="Payments">
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Table.Column
                        key={header.id}
                        isNumeric={header.id === "amount"}
                        className="data-[name=actions]:w-10 data-[name=amount]:w-24 data-[name=select]:w-10 data-[name=status]:w-24 [&:has([role=checkbox])]:pl-3"
                        data-name={header.id}
                        isRowHeader={header.id === "email"}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Table.Column>
                    )
                  })}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <Table.Row
                    key={row.id}
                    id={row.original.id}
                    data-state={
                      row.getIsSelected() ? ("selected" as const) : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell
                        isNumeric={cell.column.id === "amount"}
                        key={cell.id}
                        className="data-[name=actions]:w-10 data-[name=amount]:w-24 data-[name=select]:w-10 data-[name=status]:w-24 [&:has([role=checkbox])]:pl-3"
                        data-name={cell.column.id}
                      >
                        {cell.column.id === "actions" ? (
                          <div className="flex justify-end">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex gap-2">
            <Button
              intent="outline"
              size="sm"
              onClick={() => {
                table.previousPage()
              }}
              isDisabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              intent="outline"
              size="sm"
              onClick={() => {
                table.nextPage()
              }}
              isDisabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
