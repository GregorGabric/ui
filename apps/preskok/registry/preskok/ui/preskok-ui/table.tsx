"use client"

import { createContext, use, type ReactElement } from "react"
import { ChevronDownIcon } from "lucide-react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type {
  CellProps,
  ColumnProps,
  ColumnResizerProps,
  TableHeaderProps as HeaderProps,
  RowProps,
  TableBodyProps,
  TableProps as TablePrimitiveProps,
} from "react-aria-components/Table"
import {
  Button,
  Cell,
  Column,
  ColumnResizer as ColumnResizerPrimitive,
  ResizableTableContainer,
  Row,
  TableBody as TableBodyPrimitive,
  TableHeader as TableHeaderPrimitive,
  Table as TablePrimitive,
  useTableOptions,
} from "react-aria-components/Table"
import { twJoin, twMerge } from "tailwind-merge"

import { cx } from "@/registry/preskok/lib/primitive"

import { Checkbox } from "./checkbox"

interface TableProps extends Omit<TablePrimitiveProps, "className"> {
  allowResize?: boolean
  className?: string
  bleed?: boolean
  grid?: boolean
  striped?: boolean
  ref?: React.Ref<HTMLTableElement>
}

const TableContext = createContext<TableProps>({
  allowResize: false,
})

const DRAG_COLUMN_ID = "preskok-table-drag"
const SELECTION_COLUMN_ID = "preskok-table-selection"

type SyntheticColumn =
  | { id: typeof DRAG_COLUMN_ID; kind: "drag" }
  | { id: typeof SELECTION_COLUMN_ID; kind: "selection" }

const DRAG_COLUMN: SyntheticColumn = {
  id: DRAG_COLUMN_ID,
  kind: "drag",
}

const SELECTION_COLUMN: SyntheticColumn = {
  id: SELECTION_COLUMN_ID,
  kind: "selection",
}

const getSyntheticColumns = (
  allowsDragging: boolean,
  selectionBehavior: string | null
) => {
  const syntheticColumns: Array<SyntheticColumn> = []

  if (allowsDragging) {
    syntheticColumns.push(DRAG_COLUMN)
  }

  if (selectionBehavior === "toggle") {
    syntheticColumns.push(SELECTION_COLUMN)
  }

  return syntheticColumns
}

const isSyntheticColumn = <T extends object>(
  column: T | SyntheticColumn
): column is SyntheticColumn => {
  return (
    "kind" in column && (column.kind === "drag" || column.kind === "selection")
  )
}

const useTableContext = () => use(TableContext)

const Root = (props: TableProps) => {
  return (
    <TablePrimitive
      className="w-full min-w-full caption-bottom text-sm/6 outline-hidden [--table-selected-background:var(--color-secondary)]/50"
      {...props}
    />
  )
}

const Table = ({
  allowResize,
  className,
  bleed = false,
  grid = false,
  striped = false,
  ref,
  ...props
}: TableProps) => {
  return (
    <TableContext value={{ allowResize, bleed, grid, striped }}>
      <div className="flow-root">
        <div
          className={twMerge(
            "relative -mx-(--gutter) overflow-x-auto whitespace-nowrap [--gutter-y:--spacing(2)] has-data-[slot=table-resizable-container]:overflow-auto",
            className
          )}
        >
          <div
            className={twJoin(
              "inline-block min-w-full align-middle",
              !bleed && "sm:px-(--gutter)"
            )}
          >
            {allowResize ? (
              <ResizableTableContainer data-slot="table-resizable-container">
                <Root ref={ref} {...props} />
              </ResizableTableContainer>
            ) : (
              <Root {...props} ref={ref} />
            )}
          </div>
        </div>
      </div>
    </TableContext>
  )
}

const ColumnResizer = ({ className, ...props }: ColumnResizerProps) => (
  <ColumnResizerPrimitive
    {...props}
    className={cx(
      "&[data-resizable-direction=left]:cursor-e-resize &[data-resizable-direction=right]:cursor-w-resize [&[data-resizing]>div]:bg-primary absolute top-0 right-0 bottom-0 grid w-px touch-none place-content-center px-1 data-[resizable-direction=both]:cursor-ew-resize",
      className
    )}
  >
    <div className="h-full w-px bg-border py-(--gutter-y)" />
  </ColumnResizerPrimitive>
)

const TableBody = <T extends object>(props: TableBodyProps<T>) => (
  <TableBodyPrimitive data-slot="table-body" {...props} />
)

interface TableColumnProps extends ColumnProps {
  isResizable?: boolean
}

const TableColumn = ({
  isResizable = false,
  className,
  ...props
}: TableColumnProps) => {
  const { bleed, grid } = useTableContext()
  return (
    <Column
      data-slot="table-column"
      {...props}
      className={cx(
        [
          "text-muted-foreground text-left font-medium",
          "allows-sorting:cursor-default relative outline-hidden data-dragging:cursor-grabbing",
          "px-2 py-(--gutter-y)",
          "first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
          !bleed && "sm:first:pl-2 sm:last:pr-3",
          grid && "border-l first:border-l-0",
          isResizable && "truncate overflow-hidden",
        ],
        className
      )}
    >
      {(values) => (
        <div
          className={twJoin([
            "inline-flex items-center gap-2 **:data-[slot=icon]:shrink-0",
          ])}
        >
          {typeof props.children === "function"
            ? props.children(values)
            : props.children}
          {values.allowsSorting && (
            <span
              className={twJoin(
                "bg-secondary text-foreground grid size-[1.15rem] flex-none shrink-0 place-content-center rounded *:data-[slot=icon]:size-3.5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:transition-transform *:data-[slot=icon]:duration-200",
                values.isHovered ? "bg-secondary-foreground/10" : ""
              )}
            >
              <ChevronDownIcon
                data-slot="icon"
                className={
                  values.sortDirection === "ascending" ? "rotate-180" : ""
                }
              />
            </span>
          )}
          {isResizable && <ColumnResizer />}
        </div>
      )}
    </Column>
  )
}

interface TableHeaderProps<T extends object> extends HeaderProps<T> {
  ref?: React.Ref<HTMLTableSectionElement>
}

const TableHeader = <T extends object>({
  children,
  ref,
  columns,
  className,
  ...props
}: TableHeaderProps<T>) => {
  const { bleed } = useTableContext()
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions()
  const syntheticColumns = getSyntheticColumns(
    allowsDragging,
    selectionBehavior
  )
  const dynamicColumns =
    columns && typeof children === "function"
      ? [...syntheticColumns, ...Array.from(columns)]
      : undefined

  const renderSyntheticColumn = (column: SyntheticColumn) => {
    if (column.kind === "drag") {
      return (
        <Column
          key={column.id}
          id={column.id}
          data-slot="table-column"
          width={32}
          minWidth={32}
          style={{ width: 32 }}
          className={twMerge(
            "px-2 py-(--gutter-y)",
            "first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
            !bleed && "sm:first:pl-2 sm:last:pr-3"
          )}
        />
      )
    }

    return (
      <Column
        key={column.id}
        id={column.id}
        width={32}
        minWidth={32}
        style={{ width: 32 }}
        data-slot="table-column"
        className={twMerge(
          "px-2 py-(--gutter-y)",
          "first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
          !bleed && "sm:first:pl-2 sm:last:pr-3"
        )}
      >
        {selectionMode === "multiple" && <Checkbox slot="selection" />}
      </Column>
    )
  }

  const renderColumn = (column: T | SyntheticColumn) => {
    if (isSyntheticColumn(column)) {
      return renderSyntheticColumn(column)
    }

    return (children as (item: T) => ReactElement)(column)
  }

  const staticChildren = (
    <>
      {syntheticColumns.map((column) => renderSyntheticColumn(column))}
      {children}
    </>
  )

  return (
    <TableHeaderPrimitive
      data-slot="table-header"
      className={cx("border-b", className)}
      ref={ref}
      {...props}
      columns={dynamicColumns}
    >
      {dynamicColumns ? renderColumn : staticChildren}
    </TableHeaderPrimitive>
  )
}

interface TableRowProps<T extends object> extends RowProps<T> {
  ref?: React.Ref<HTMLTableRowElement>
}

const TableRow = <T extends object>({
  children,
  className,
  columns,
  id,
  ref,
  ...props
}: TableRowProps<T>) => {
  const { selectionBehavior, allowsDragging } = useTableOptions()
  const { striped } = useTableContext()
  const syntheticColumns = getSyntheticColumns(
    allowsDragging,
    selectionBehavior
  )
  const dynamicColumns =
    columns && typeof children === "function"
      ? [...syntheticColumns, ...Array.from(columns)]
      : undefined

  const renderSyntheticCell = (column: SyntheticColumn) => {
    if (column.kind === "drag") {
      return (
        <TableCell key={column.id} className="cursor-grab">
          <Button
            slot="drag"
            className="grid place-content-center rounded-xs px-[calc(var(--gutter)/2)] outline-hidden focus-visible:ring focus-visible:ring-ring"
          >
            <svg
              aria-hidden
              data-slot="icon"
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-grip-vertical-icon lucide-grip-vertical"
            >
              <circle cx={9} cy={12} r={1} />
              <circle cx={9} cy={5} r={1} />
              <circle cx={9} cy={19} r={1} />
              <circle cx={15} cy={12} r={1} />
              <circle cx={15} cy={5} r={1} />
              <circle cx={15} cy={19} r={1} />
            </svg>
          </Button>
        </TableCell>
      )
    }

    return (
      <TableCell key={column.id}>
        <Checkbox slot="selection" />
      </TableCell>
    )
  }

  const renderCell = (column: T | SyntheticColumn) => {
    if (isSyntheticColumn(column)) {
      return renderSyntheticCell(column)
    }

    return (children as (item: T) => ReactElement)(column)
  }

  const staticChildren = (
    <>
      {syntheticColumns.map((column) => renderSyntheticCell(column))}
      {children}
    </>
  )

  return (
    <Row
      ref={ref}
      data-slot="table-row"
      id={id}
      {...props}
      columns={dynamicColumns}
      className={composeRenderProps(
        className,
        (
          className,
          {
            isSelected,
            selectionMode,
            isFocusVisibleWithin,
            isDragging,
            isDisabled,
            isFocusVisible,
          }
        ) =>
          twMerge(
            "group text-muted-foreground relative cursor-default outline outline-transparent",
            isFocusVisible &&
              "bg-primary/5 outline-primary ring-ring/20 hover:bg-primary/10 ring-3",
            isDragging &&
              "bg-primary/10 text-foreground outline-primary cursor-grabbing",
            isSelected &&
              "text-foreground bg-(--table-selected-background) hover:bg-(--table-selected-background)/50",
            striped && "even:bg-muted",
            !striped && "border-b last:border-b-0",
            (props.href || props.onAction || selectionMode === "multiple") &&
              "hover:text-foreground hover:bg-(--table-selected-background)",
            (props.href || props.onAction || selectionMode === "multiple") &&
              isFocusVisibleWithin &&
              "selected:bg-(--table-selected-background)/50 text-foreground bg-(--table-selected-background)/50",
            isDisabled && "opacity-50",
            className
          )
      )}
    >
      {dynamicColumns ? renderCell : staticChildren}
    </Row>
  )
}

interface TableCellProps extends CellProps {
  ref?: React.Ref<HTMLTableCellElement>
}
const TableCell = ({ className, ref, ...props }: TableCellProps) => {
  const { allowResize, bleed, grid } = useTableContext()
  return (
    <Cell
      ref={ref}
      data-slot="table-cell"
      {...props}
      className={cx(
        twJoin(
          "group group-has-data-focus-visible-within:text-foreground px-2 py-(--gutter-y) align-middle outline-hidden first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
          grid && "border-l first:border-l-0",
          !bleed && "sm:first:pl-2 sm:last:pr-3",
          allowResize && "truncate overflow-hidden"
        ),
        className
      )}
    />
  )
}

export { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow }
export type { TableColumnProps, TableProps, TableRowProps }
