"use client"

import { createContext, use, type ReactElement } from "react"
import { twJoin, twMerge } from "cn"
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
} from "lucide-react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type {
  CellProps,
  ColumnProps,
  ColumnResizerProps,
  TableHeaderProps as HeaderProps,
  RowProps,
  SortDirection,
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

import { cx } from "@/registry/preskok/lib/primitive"

import { Checkbox } from "./checkbox"

interface TableProps extends Omit<TablePrimitiveProps, "className"> {
  allowResize?: boolean
  className?: string
  bleed?: boolean
  /** Draws a rounded border around the table instead of letting it bleed to the edges of its container. */
  bordered?: boolean
  grid?: boolean
  striped?: boolean
  ref?: React.Ref<HTMLTableElement>
}

const TableContext = createContext<TableProps>({
  allowResize: false,
})

const DRAG_COLUMN_ID = "preskok-table-drag"
const SELECTION_COLUMN_ID = "preskok-table-selection"

/** Width of the drag and selection columns: the gutter, a 16px control and the trailing padding. */
const SYNTHETIC_COLUMN_WIDTH = 44

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

/** Padding shared by header and body cells, so the first and last columns line up with the surrounding gutter. */
const cellPadding = (bleed: boolean | undefined) =>
  twJoin(
    "px-2 py-(--gutter-y) first:pl-(--gutter,--spacing(2)) last:pr-(--gutter,--spacing(2))",
    !bleed && "sm:first:pl-2 sm:last:pr-3"
  )

/** Synthetic drag and selection columns hug their 16px control instead of taking a share of the free width. */
const syntheticCellClassName =
  "w-px pr-0 align-middle *:data-[slot=control]:flex *:data-[slot=control]:items-center"

const TABBABLE_SELECTOR = "input, select, textarea, button, a[href], [tabindex]"

/**
 * With `keyboardNavigationBehavior="tab"`, Tab moves through the controls of the table body in document order, as in
 * a form. React Aria's grid would otherwise move focus out of the table once a cell has no further tabbable element.
 * After the last control, the grid's own handling moves focus out of the table.
 */
const moveTabFocusWithinBody = (event: React.KeyboardEvent<HTMLDivElement>) => {
  const body =
    event.target instanceof Element
      ? event.target.closest("[data-slot=table-body]")
      : null

  if (
    event.key !== "Tab" ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    !body ||
    !event.currentTarget.contains(body)
  ) {
    return
  }

  const tabbables = Array.from(
    body.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.matches(
        ":disabled, [role=row], [role=gridcell], [role=rowheader]"
      ) &&
      element.getClientRects().length > 0
  )
  const currentIndex = tabbables.findIndex(
    (element) =>
      element === event.target || element.contains(event.target as Node)
  )
  const next =
    currentIndex === -1
      ? undefined
      : tabbables[currentIndex + (event.shiftKey ? -1 : 1)]

  if (!next) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  next.focus()
}

const Root = (props: TableProps) => {
  return (
    <TablePrimitive
      className="w-full min-w-full caption-bottom text-sm/6 outline-hidden [--table-selected-background:var(--color-secondary)]/50"
      {...props}
    />
  )
}

/** Rounded frame for `bordered` tables; the gutter variable keeps cell padding aligned inside the frame. */
const borderedFrameClassName = "rounded-lg border [--gutter:--spacing(3)]"

const Table = ({
  allowResize,
  className,
  bleed = false,
  bordered = false,
  grid = false,
  striped = false,
  ref,
  ...props
}: TableProps) => {
  const onKeyDownCapture =
    props.keyboardNavigationBehavior === "tab"
      ? moveTabFocusWithinBody
      : undefined

  // A resizable table measures its container to lay out `fr` widths, so the container must be the
  // width-constrained scroll box. Inside the `inline-block` wrapper its width follows its content and
  // every measurement widens the table again.
  if (allowResize) {
    return (
      <TableContext value={{ allowResize, bleed: true, grid, striped }}>
        <div className="flow-root w-full" onKeyDownCapture={onKeyDownCapture}>
          <ResizableTableContainer
            data-slot="table-resizable-container"
            data-bordered={bordered || undefined}
            className={twMerge(
              "relative overflow-auto [--gutter-y:--spacing(2)]",
              bordered ? borderedFrameClassName : "-mx-(--gutter)",
              className
            )}
          >
            <Root ref={ref} {...props} />
          </ResizableTableContainer>
        </div>
      </TableContext>
    )
  }

  return (
    <TableContext
      value={{ allowResize, bleed: bleed || bordered, grid, striped }}
    >
      <div className="flow-root" onKeyDownCapture={onKeyDownCapture}>
        <div
          data-bordered={bordered || undefined}
          className={twMerge(
            "relative overflow-x-auto whitespace-nowrap [--gutter-y:--spacing(2)]",
            bordered ? borderedFrameClassName : "-mx-(--gutter)",
            className
          )}
        >
          <div
            className={twJoin(
              "inline-block min-w-full align-middle",
              !bleed && !bordered && "sm:px-(--gutter)"
            )}
          >
            <Root ref={ref} {...props} />
          </div>
        </div>
      </div>
    </TableContext>
  )
}

/**
 * Resize handle on a column's trailing edge. The hit area straddles the boundary and its line sits on the
 * column separator, so resizing never draws a second line next to it. The line shows while the header is
 * hovered (for `grid` tables the border already is the separator) and turns primary while dragging.
 */
const ColumnResizer = ({ className, ...props }: ColumnResizerProps) => {
  const { grid } = useTableContext()

  return (
    <ColumnResizerPrimitive
      {...props}
      className={cx(
        [
          "group/resizer absolute inset-y-0 right-0 z-10 flex w-3 translate-x-1/2 touch-none justify-center overflow-hidden outline-hidden",
          "cursor-col-resize data-[resizable-direction=left]:cursor-e-resize data-[resizable-direction=right]:cursor-w-resize",
          "in-[[data-slot=table-column]:last-child]:translate-x-0 in-[[data-slot=table-column]:last-child]:justify-end",
        ],
        className
      )}
    >
      <div
        className={twJoin(
          "h-full w-px transition-colors",
          grid
            ? "bg-transparent"
            : "bg-transparent group-hover/header:bg-border",
          "group-hover/resizer:bg-primary group-focus-visible/resizer:bg-primary group-data-resizing/resizer:bg-primary"
        )}
      />
    </ColumnResizerPrimitive>
  )
}

const TableBody = <T extends object>(props: TableBodyProps<T>) => (
  <TableBodyPrimitive data-slot="table-body" {...props} />
)

interface TableColumnProps extends ColumnProps {
  isResizable?: boolean
  /**
   * Sort direction to show when sorting is controlled outside the table, e.g. a server-side multi-column sort
   * where several columns are sorted at once. Defaults to the table's `sortDescriptor`.
   */
  sortDirection?: SortDirection | null
}

const TableColumn = ({
  isResizable = false,
  sortDirection,
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
          "allows-sorting:cursor-pointer allows-sorting:hover:text-foreground has-data-sort-direction:bg-primary/5 has-data-sort-direction:font-semibold has-data-sort-direction:text-foreground relative outline-hidden data-dragging:cursor-grabbing",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-inset",
          cellPadding(bleed),
          grid && "border-border border-l first:border-l-0",
        ],
        className
      )}
    >
      {(values) => {
        const direction =
          sortDirection === undefined ? values.sortDirection : sortDirection

        return (
          <div
            className={twJoin(
              "flex min-w-0 items-center gap-2 **:data-[slot=icon]:shrink-0",
              isResizable && "pr-2"
            )}
          >
            <span
              className={twJoin(
                "min-w-0",
                isResizable && "truncate",
                direction && "text-foreground"
              )}
            >
              {typeof props.children === "function"
                ? props.children(values)
                : props.children}
            </span>
            {values.allowsSorting && (
              <span
                data-sort-direction={direction ?? undefined}
                className={twJoin(
                  "flex-none transition-colors *:data-[slot=icon]:size-3.5 data-sort-direction:*:data-[slot=icon]:size-4 data-sort-direction:*:data-[slot=icon]:stroke-[2.5]",
                  direction ? "text-primary" : "text-muted-foreground/50",
                  values.isHovered && !direction && "text-muted-foreground"
                )}
              >
                {direction === "ascending" && (
                  <ChevronUpIcon data-slot="icon" />
                )}
                {direction === "descending" && (
                  <ChevronDownIcon data-slot="icon" />
                )}
                {!direction && <ChevronsUpDownIcon data-slot="icon" />}
              </span>
            )}
            {isResizable && <ColumnResizer />}
          </div>
        )
      }}
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
    return (
      <Column
        key={column.id}
        id={column.id}
        data-slot="table-column"
        width={SYNTHETIC_COLUMN_WIDTH}
        minWidth={SYNTHETIC_COLUMN_WIDTH}
        maxWidth={SYNTHETIC_COLUMN_WIDTH}
        className={twMerge(cellPadding(bleed), syntheticCellClassName)}
      >
        {column.kind === "selection" && selectionMode === "multiple" && (
          <Checkbox slot="selection" />
        )}
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
      className={cx("group/header border-border border-b", className)}
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
        <TableCell
          key={column.id}
          className={twJoin(syntheticCellClassName, "cursor-grab")}
        >
          <Button
            slot="drag"
            className="grid place-content-center rounded-xs outline-hidden focus-visible:ring focus-visible:ring-ring"
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
      <TableCell key={column.id} className={syntheticCellClassName}>
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
            !striped && "border-border border-b last:border-b-0",
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
          "group group-has-data-focus-visible-within:text-foreground align-middle outline-hidden",
          cellPadding(bleed),
          grid && "border-border border-l first:border-l-0",
          allowResize && "truncate overflow-hidden"
        ),
        className
      )}
    />
  )
}

export { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow }
export type { TableColumnProps, TableProps, TableRowProps }
