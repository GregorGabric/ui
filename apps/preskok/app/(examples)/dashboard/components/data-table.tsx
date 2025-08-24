"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/registry/preskok/hooks/use-mobile"
import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button, buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/preskok/ui/preskok-ui/chart-helpers"
import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import { Drawer } from "@/registry/preskok/ui/preskok-ui/drawer"
import { Input, Label } from "@/registry/preskok/ui/preskok-ui/field"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import { Select } from "@/registry/preskok/ui/preskok-ui/select"
import { Separator } from "@/registry/preskok/ui/preskok-ui/separator"
import { Table } from "@/registry/preskok/ui/preskok-ui/table"
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/registry/preskok/ui/preskok-ui/tabs"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      intent="plain"
      size="sq-sm"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          isSelected={table.getIsAllPageRowsSelected()}
          isIndeterminate={table.getIsSomePageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          isSelected={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge intent="outline" className="text-muted-foreground px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge intent="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Done" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Target
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Limit
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer"

      if (isAssigned) {
        return row.original.reviewer
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Reviewer
          </Label>
          <Select placeholder="Assign reviewer">
            <Select.Trigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              id={`${row.original.id}-reviewer`}
            />
            <Select.List>
              <Select.Option id="Eddie Lake">Eddie Lake</Select.Option>
              <Select.Option id="Jamik Tashpulatov">
                Jamik Tashpulatov
              </Select.Option>
            </Select.List>
          </Select>
        </>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <Menu>
        <MenuTrigger>
          <Button
            intent="plain"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="sq-sm"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </MenuTrigger>
        <MenuContent className="w-32" placement="bottom end">
          <MenuItem>Edit</MenuItem>
          <MenuItem>Make a copy</MenuItem>
          <MenuItem>Favorite</MenuItem>
          <MenuSeparator />
          <MenuItem isDanger>Delete</MenuItem>
        </MenuContent>
      </Menu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <Table.Row
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="group hover:bg-muted/50 relative z-0 border-b last:border-b-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <Table.Cell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Table.Cell>
      ))}
    </Table.Row>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultSelectedKey="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select selectedKey="outline">
          <Select.Trigger
            className="flex w-fit @4xl/main:hidden"
            id="view-selector"
          />
          <Select.List>
            <Select.Option id="outline">Outline</Select.Option>
            <Select.Option id="past-performance">
              Past Performance
            </Select.Option>
            <Select.Option id="key-personnel">Key Personnel</Select.Option>
            <Select.Option id="focus-documents">Focus Documents</Select.Option>
          </Select.List>
        </Select>
        <TabList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <Tab id="outline">Outline</Tab>
          <Tab id="past-performance">
            Past Performance <Badge intent="secondary">3</Badge>
          </Tab>
          <Tab id="key-personnel">
            Key Personnel <Badge intent="secondary">2</Badge>
          </Tab>
          <Tab id="focus-documents">Focus Documents</Tab>
        </TabList>
        <div className="flex items-center gap-2">
          <Menu>
            <MenuTrigger>
              <Button intent="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </MenuTrigger>
            <MenuContent className="w-56" placement="bottom end">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <MenuItem
                      key={column.id}
                      className="capitalize"
                      onAction={() =>
                        column.toggleVisibility(!column.getIsVisible())
                      }
                    >
                      {column.id}
                    </MenuItem>
                  )
                })}
            </MenuContent>
          </Menu>
          <Button intent="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabPanel
        id="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <Table.Header className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <Table.Column key={header.id}>
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
              <Table.Body className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <Table.Row>
                    <Table.Cell
                      className="h-24 text-center"
                      colSpan={columns.length}
                    >
                      No results.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                selectedKey={`${table.getState().pagination.pageSize}`}
                onSelectionChange={(key) => {
                  if (key && typeof key === "string") {
                    table.setPageSize(Number(key))
                  }
                }}
              >
                <Select.Trigger className="w-20" id="rows-per-page" />
                <Select.List>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <Select.Option key={pageSize} id={`${pageSize}`}>
                      {pageSize}
                    </Select.Option>
                  ))}
                </Select.List>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                intent="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                isDisabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                intent="outline"
                className="size-8"
                size="sq-sm"
                onClick={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                intent="outline"
                className="size-8"
                size="sq-sm"
                onClick={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                intent="outline"
                className="hidden size-8 lg:flex"
                size="sq-sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                isDisabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel id="past-performance" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabPanel>
      <TabPanel id="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabPanel>
      <TabPanel id="focus-documents" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabPanel>
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer>
      <Drawer.Trigger
        className={buttonStyles({
          intent: "plain",
          className: "text-foreground w-fit px-0 text-left",
        })}
      >
        {item.header}
      </Drawer.Trigger>
      <Drawer.Content side={isMobile ? "bottom" : "right"}>
        <Drawer.Header className="gap-1">
          <Drawer.Title>{item.header}</Drawer.Title>
          <Drawer.Description>
            Showing total visitors for the last 6 months
          </Drawer.Description>
        </Drawer.Header>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select selectedKey={item.type}>
                  <Select.Trigger id="type" className="w-full" />
                  <Select.List>
                    <Select.Option id="Table of Contents">
                      Table of Contents
                    </Select.Option>
                    <Select.Option id="Executive Summary">
                      Executive Summary
                    </Select.Option>
                    <Select.Option id="Technical Approach">
                      Technical Approach
                    </Select.Option>
                    <Select.Option id="Design">Design</Select.Option>
                    <Select.Option id="Capabilities">
                      Capabilities
                    </Select.Option>
                    <Select.Option id="Focus Documents">
                      Focus Documents
                    </Select.Option>
                    <Select.Option id="Narrative">Narrative</Select.Option>
                    <Select.Option id="Cover Page">Cover Page</Select.Option>
                  </Select.List>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select selectedKey={item.status}>
                  <Select.Trigger id="status" className="w-full" />
                  <Select.List>
                    <Select.Option id="Done">Done</Select.Option>
                    <Select.Option id="In Progress">In Progress</Select.Option>
                    <Select.Option id="Not Started">Not Started</Select.Option>
                  </Select.List>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select selectedKey={item.reviewer}>
                <Select.Trigger id="reviewer" className="w-full" />
                <Select.List>
                  <Select.Option id="Eddie Lake">Eddie Lake</Select.Option>
                  <Select.Option id="Jamik Tashpulatov">
                    Jamik Tashpulatov
                  </Select.Option>
                  <Select.Option id="Emily Whalen">Emily Whalen</Select.Option>
                </Select.List>
              </Select>
            </div>
          </form>
        </div>
        <Drawer.Footer>
          <Button>Submit</Button>
          <Drawer.Close intent="outline">Done</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
