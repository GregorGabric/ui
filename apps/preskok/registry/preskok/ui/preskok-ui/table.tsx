"use client"

import {
  createContext,
  use,
  type ComponentProps,
  type ReactElement,
} from "react"
import { twJoin, twMerge } from "cn"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"
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

import { Button as ActionButton, type ButtonProps } from "./button"
import { Checkbox } from "./checkbox"
import { Loader } from "./loader"
import { Tooltip, TooltipContent } from "./tooltip"

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
  "pr-0 align-middle *:data-[slot=control]:flex *:data-[slot=control]:items-center"

/**
 * Class names for a synthetic header or body cell. Only auto-layout tables need `w-px` to hug the control: a
 * resizable table gives the column a fixed width, and `w-px` would override it and hide the checkbox.
 */
const getSyntheticCellClassName = (allowResize: boolean | undefined) =>
  twJoin(!allowResize && "w-px", syntheticCellClassName)

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
  const target = event.target as Node
  const currentIndex = tabbables.findIndex(
    (element) => element === target || element.contains(target)
  )
  // Focus on a row or cell (after a click, or when the grid restores focus) is not one of the controls: continue from
  // its position in the document instead, so Tab reaches the controls of that row rather than leaving the table.
  const next =
    currentIndex === -1
      ? event.shiftKey
        ? tabbables.findLast(
            (element) =>
              !!(
                target.compareDocumentPosition(element) &
                Node.DOCUMENT_POSITION_PRECEDING
              ) && !element.contains(target)
          )
        : tabbables.find(
            (element) =>
              !!(
                target.compareDocumentPosition(element) &
                Node.DOCUMENT_POSITION_FOLLOWING
              )
          )
      : tabbables[currentIndex + (event.shiftKey ? -1 : 1)]

  if (!next) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  next.focus()
}

const Root = (props: TableProps) => {
  // The row tint variables are opaque, so the pinned actions cell can follow the row's hover and selected state.
  return (
    <TablePrimitive
      className="w-full min-w-full caption-bottom text-sm/6 outline-hidden [--table-row-hover:color-mix(in_oklab,var(--color-muted)_45%,var(--color-card))] [--table-row-selected:color-mix(in_oklab,var(--color-primary)_7%,var(--color-card))]"
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
              "@container/table relative overflow-auto [--gutter-y:--spacing(2)]",
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

/**
 * Table body. In a resizable table the empty state spans every column, so a wide, horizontally scrolling table would
 * center it outside the visible area: it is kept to the scroll box's visible width and pinned while scrolling.
 */
const TableBody = <T extends object>({
  renderEmptyState,
  ...props
}: TableBodyProps<T>) => {
  const { allowResize } = useTableContext()
  const emptyState =
    allowResize && renderEmptyState
      ? (renderProps: Parameters<typeof renderEmptyState>[0]) => (
          <div
            data-slot="table-empty-state"
            className="sticky left-(--gutter,--spacing(2)) w-[calc(100cqw_-_2_*_var(--gutter,0.5rem))]"
          >
            {renderEmptyState(renderProps)}
          </div>
        )
      : renderEmptyState

  return (
    <TableBodyPrimitive
      data-slot="table-body"
      renderEmptyState={emptyState}
      {...props}
    />
  )
}

/** Horizontal alignment of a column's header and cells: `center` for checkbox/toggle/status columns, `end` for numbers. */
type TableAlign = "start" | "center" | "end"

const cellAlignClassName: Record<TableAlign, string> = {
  start: "",
  center:
    "text-center [--table-cell-justify:center] [&>[data-slot=control]]:flex [&>[data-slot=control]]:justify-center",
  end: "text-right [--table-cell-justify:flex-end] [&>[data-slot=control]]:flex [&>[data-slot=control]]:justify-end",
}

interface TableColumnProps extends ColumnProps {
  isResizable?: boolean
  /**
   * Row actions column: fixed width, never resizable or sortable, right-aligned and pinned to the table's trailing
   * edge so the actions stay reachable when the table scrolls horizontally. Pair it with `TableCell isActions`.
   */
  isActions?: boolean
  /**
   * Sort direction to show when sorting is controlled outside the table, e.g. a server-side multi-column sort
   * where several columns are sorted at once. Defaults to the table's `sortDescriptor`.
   */
  sortDirection?: SortDirection | null
  /** Horizontal alignment of the header label; pass the same `align` to the column's `TableCell`s. */
  align?: TableAlign
}

/** Default width of an actions column: room for two icon buttons and the cell padding. */
const ACTIONS_COLUMN_WIDTH = 96

/** Width per `TableAction` button when sizing an actions column: a 32px button plus the gap. */
const TABLE_ACTION_WIDTH = 36

/**
 * Pinned actions cells: an opaque background (matching the header band or the card) so scrolled content passes
 * underneath, and an inset divider on the leading edge instead of a border that would scroll away.
 */
const actionsCellClassName =
  "sticky right-0 z-1 text-right shadow-[inset_1px_0_0_var(--color-border)] *:justify-end"

const TableColumn = ({
  isResizable = false,
  isActions = false,
  sortDirection,
  align = "start",
  className,
  ...props
}: TableColumnProps) => {
  const { bleed, grid } = useTableContext()
  const requestedWidth = props.width ?? props.defaultWidth
  const actionsWidth =
    typeof requestedWidth === "number" ? requestedWidth : ACTIONS_COLUMN_WIDTH
  const resizable = isResizable && !isActions

  return (
    <Column
      data-slot="table-column"
      data-actions={isActions || undefined}
      {...props}
      {...(isActions && {
        allowsSorting: false,
        width: actionsWidth,
        minWidth: actionsWidth,
        maxWidth: actionsWidth,
        defaultWidth: undefined,
      })}
      className={cx(
        [
          // Explicit case, wrapping and alignment: legacy page and modal styles for `th` must not leak into the header.
          "text-muted-foreground text-left align-middle font-medium whitespace-nowrap normal-case",
          "allows-sorting:cursor-pointer allows-sorting:hover:text-foreground has-data-sort-direction:bg-primary/5 has-data-sort-direction:font-semibold has-data-sort-direction:text-foreground relative outline-hidden data-dragging:cursor-grabbing",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-inset",
          cellPadding(bleed),
          grid && "border-border border-l first:border-l-0",
          isActions && [
            actionsCellClassName,
            "bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-card))]",
            grid && "border-l-0",
          ],
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
              "flex min-w-0 items-center gap-1.5 **:data-[slot=icon]:shrink-0",
              align === "center" && "justify-center",
              align === "end" && "justify-end",
              resizable && "pr-2"
            )}
          >
            <span
              className={twJoin(
                "min-w-0 truncate",
                direction && "text-foreground",
                isActions && "sr-only"
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
                  "flex flex-none items-center transition-colors *:data-[slot=icon]:size-3.5 *:data-[slot=icon]:stroke-[2.5]",
                  direction ? "text-primary" : "text-muted-foreground/50",
                  values.isHovered && !direction && "text-muted-foreground"
                )}
              >
                {direction === "ascending" && <ArrowUpIcon data-slot="icon" />}
                {direction === "descending" && (
                  <ArrowDownIcon data-slot="icon" />
                )}
                {!direction && <ArrowUpDownIcon data-slot="icon" />}
              </span>
            )}
            {resizable && <ColumnResizer />}
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
  const { allowResize, bleed } = useTableContext()
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
        className={twMerge(
          cellPadding(bleed),
          getSyntheticCellClassName(allowResize)
        )}
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
  const { allowResize, striped } = useTableContext()
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
          className={twJoin(
            getSyntheticCellClassName(allowResize),
            "cursor-grab"
          )}
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
      <TableCell
        key={column.id}
        className={getSyntheticCellClassName(allowResize)}
      >
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
            // Named group: a bare `group` would also trigger `group-hover` styles of content such as badges.
            "group/row text-muted-foreground hover:bg-(--table-row-hover) relative cursor-default outline outline-transparent",
            isFocusVisible &&
              "bg-(--table-row-hover) outline-primary ring-ring/20 ring-3",
            isDragging &&
              "bg-(--table-row-hover) text-foreground outline-primary cursor-grabbing",
            isSelected &&
              "text-foreground bg-(--table-row-selected) hover:bg-(--table-row-selected)",
            striped && "even:bg-muted",
            !striped && "border-border border-b last:border-b-0",
            (props.href || props.onAction || selectionMode === "multiple") &&
              "hover:text-foreground",
            (props.href || props.onAction || selectionMode === "multiple") &&
              isFocusVisibleWithin &&
              !isSelected &&
              "text-foreground bg-(--table-row-hover)",
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
  /** Cell of a `TableColumn isActions` column: pinned to the trailing edge with its controls right-aligned. */
  isActions?: boolean
  /** Horizontal alignment of the cell content; match the column's `align`. */
  align?: TableAlign
}
const TableCell = ({
  className,
  ref,
  isActions = false,
  align = "start",
  ...props
}: TableCellProps) => {
  const { allowResize, bleed, grid } = useTableContext()
  return (
    <Cell
      ref={ref}
      data-slot="table-cell"
      data-actions={isActions || undefined}
      {...props}
      className={cx(
        twJoin(
          "group-has-data-focus-visible-within/row:text-foreground align-middle outline-hidden",
          cellAlignClassName[align],
          cellPadding(bleed),
          grid && "border-border border-l first:border-l-0",
          allowResize && !isActions && "truncate overflow-hidden",
          isActions && [
            actionsCellClassName,
            "bg-card group-hover/row:bg-(--table-row-hover) group-data-selected/row:bg-(--table-row-selected)",
            grid && "border-l-0",
          ]
        ),
        className
      )}
    />
  )
}

/** Row of icon actions inside a `TableCell isActions`. */
const TableActions = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="table-actions"
    className={twMerge("flex items-center justify-end gap-1", className)}
    {...props}
  />
)

interface TableActionProps extends Omit<
  ButtonProps,
  "children" | "aria-label" | "size"
> {
  /** Action name, used as the accessible name and the tooltip. */
  label: string
  icon: LucideIcon
}

/**
 * Compact icon button for a row action, with its label as tooltip and accessible name. While pending, the spinner
 * replaces the icon so the button keeps its size. `intent` defaults to `plain`; use `danger` for destructive actions.
 */
const TableAction = ({
  label,
  icon: Icon,
  intent = "plain",
  ...props
}: TableActionProps) => (
  <Tooltip>
    <ActionButton intent={intent} size="sq-sm" aria-label={label} {...props}>
      {({ isPending }) =>
        isPending ? <Loader variant="spin" /> : <Icon data-slot="icon" />
      }
    </ActionButton>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

export {
  TABLE_ACTION_WIDTH,
  Table,
  TableAction,
  TableActions,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
}
export type {
  TableActionProps,
  TableAlign,
  TableColumnProps,
  TableProps,
  TableRowProps,
}
