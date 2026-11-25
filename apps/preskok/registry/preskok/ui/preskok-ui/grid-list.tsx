"use client"

import { createContext, use } from "react"
import { twMerge } from "cn"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type {
  GridListItemProps,
  GridListProps,
  TextProps,
} from "react-aria-components/GridList"
import {
  Button,
  GridListHeader as GridListHeaderPrimitive,
  GridListItem as GridListItemPrimitive,
  GridList as GridListPrimitive,
  GridListSection as GridListSectionPrimitive,
  Text,
} from "react-aria-components/GridList"

import { cx } from "@/registry/preskok/lib/primitive"

import { Checkbox } from "./checkbox"

type GridListVariant = "card" | "bordered" | "plain"

interface GridListVariantContextValue {
  variant: GridListVariant
  /** Set when `onAction` is on the list, so rows know a click runs an action. */
  hasListAction: boolean
}

const GridListVariantContext = createContext<GridListVariantContextValue>({
  variant: "card",
  hasListAction: false,
})

/** Spacing and frame of the list itself; items read the variant from context. */
const listVariantStyles: Record<GridListVariant, string> = {
  card: "gap-y-1 has-data-[slot=grid-list-section]:gap-y-6",
  bordered:
    "divide-border divide-y overflow-hidden rounded-lg border border-border",
  plain: "gap-y-0.5 has-data-[slot=grid-list-section]:gap-y-4",
}

const sectionVariantStyles: Record<GridListVariant, string> = {
  card: "space-y-1",
  bordered: "divide-border divide-y",
  plain: "space-y-0.5",
}

const headerVariantStyles: Record<GridListVariant, string> = {
  card: "mb-2",
  bordered: "bg-muted/50 text-muted-foreground px-3 py-2",
  plain: "text-muted-foreground mb-1 px-2",
}

const itemVariantStyles: Record<GridListVariant, string> = {
  card: "inset-ring-border rounded-lg px-3 py-2.5 inset-ring",
  // Rows touching the frame's corners take its inner radius, so their focus outline follows the
  // curve instead of being clipped by the list's `overflow-hidden`.
  bordered:
    "px-3 py-2.5 [[data-slot=grid-list]>&:first-child]:rounded-t-[calc(var(--radius-lg)-1px)] [[data-slot=grid-list]>&:last-child]:rounded-b-[calc(var(--radius-lg)-1px)] [[data-slot=grid-list]>[data-slot=grid-list-section]:first-child>&:first-child]:rounded-t-[calc(var(--radius-lg)-1px)] [[data-slot=grid-list]>[data-slot=grid-list-section]:last-child>&:last-child]:rounded-b-[calc(var(--radius-lg)-1px)]",
  plain: "rounded-md px-2 py-2",
}

interface GridListRootProps<T extends object> extends GridListProps<T> {
  /**
   * `card` separates rows into framed tiles, `bordered` draws one frame with
   * dividers, `plain` drops the frame for menu-like rows.
   */
  variant?: GridListVariant
}

const GridList = <T extends object>({
  variant = "card",
  className,
  ...props
}: GridListRootProps<T>) => (
  <GridListVariantContext
    value={{ variant, hasListAction: Boolean(props.onAction) }}
  >
    <GridListPrimitive
      data-slot="grid-list"
      data-variant={variant}
      className={cx(
        [
          "relative flex flex-col sm:text-sm/6",
          // Insertion markers between rows when reordering. An outline, not a border, so it shows in
          // forced colors and doesn't pick up the bordered variant's dividers. Rows are positioned, so
          // the active marker is lifted above them or their dividers and backgrounds cover it.
          "[&_.react-aria-DropIndicator]:border-0 [&_.react-aria-DropIndicator[data-drop-target]]:relative [&_.react-aria-DropIndicator[data-drop-target]]:z-10 [&_.react-aria-DropIndicator[data-drop-target]]:outline [&_.react-aria-DropIndicator[data-drop-target]]:outline-primary forced-colors:[&_.react-aria-DropIndicator[data-drop-target]]:outline-[Highlight]",
          listVariantStyles[variant],
        ],
        className
      )}
      {...props}
    />
  </GridListVariantContext>
)

const GridListSection = <T extends object>({
  className,
  ...props
}: React.ComponentProps<typeof GridListSectionPrimitive<T>>) => {
  const { variant } = use(GridListVariantContext)

  return (
    <GridListSectionPrimitive
      data-slot="grid-list-section"
      className={twMerge(sectionVariantStyles[variant], className)}
      {...props}
    />
  )
}

const GridListHeader = ({
  className,
  ...props
}: React.ComponentProps<typeof GridListHeaderPrimitive>) => {
  const { variant } = use(GridListVariantContext)

  return (
    <GridListHeaderPrimitive
      data-slot="grid-list-header"
      className={twMerge(
        "text-sm/6 font-semibold",
        headerVariantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

const GridListItem = ({ className, children, ...props }: GridListItemProps) => {
  const { variant, hasListAction } = use(GridListVariantContext)
  const isLink = Boolean(props.href)
  const textValue = typeof children === "string" ? children : undefined

  return (
    <GridListItemPrimitive
      textValue={textValue}
      {...props}
      className={composeRenderProps(
        className,
        (
          className,
          {
            isHovered,
            isPressed,
            isFocusVisible,
            isSelected,
            isDisabled,
            isDropTarget,
            allowsDragging,
            selectionMode,
          }
        ) =>
          twMerge(
            "group",
            itemVariantStyles[variant],
            // `outline-0` rather than `outline-hidden`: in forced colors the latter turns into a
            // visible outline on every row.
            "relative min-w-0 outline-0 -outline-offset-2 [--mr-icon:--spacing(2)]",
            "flex min-w-0 cursor-default items-center gap-2 sm:gap-2.5",
            "dragging:opacity-70 dragging:**:[[slot=drag]]:text-foreground",
            "**:data-[slot=icon]:text-muted-foreground **:data-[slot=icon]:size-5 **:data-[slot=icon]:shrink-0 sm:**:data-[slot=icon]:size-4",
            isHovered && "bg-accent/50",
            isPressed && "bg-accent/70",
            // Forced colors drop box shadows and backgrounds, so selection and focus use outlines there.
            isSelected &&
              "bg-accent text-accent-foreground forced-colors:outline-2 forced-colors:outline-[Highlight]",
            // A 2px outline stays visible on top of the selected background and the card border. In
            // forced colors it is dashed, and stays Highlight on a selected row, so focus and
            // selection both read.
            isFocusVisible &&
              "outline-2 outline-ring forced-colors:outline-dashed forced-colors:outline-[CanvasText]",
            isFocusVisible && isSelected && "forced-colors:outline-[Highlight]",
            // An inset ring, unlike a border, marks the drop target without shifting the row. Forced
            // colors drop the ring, so an outline marks it there.
            isDropTarget &&
              "inset-ring-primary inset-ring-2 forced-colors:outline-2 forced-colors:outline-[Highlight]",
            isDisabled && "opacity-50 forced-colors:text-[GrayText]",
            isLink && "cursor-pointer",
            // Rows that only reorder can be grabbed anywhere; rows that also select or act keep the
            // default cursor so a click doesn't read as "move", and only the handle shows the grab hand.
            allowsDragging &&
              selectionMode === "none" &&
              !isDisabled &&
              !isLink &&
              !props.onAction &&
              !hasListAction &&
              "cursor-grab",
            className
          )
      )}
    >
      {(values) => (
        <>
          {values.allowsDragging && (
            // React Aria sets `pointer-events: none` on the drag button because the whole row starts a
            // mouse drag, so the grab cursor and hover colour live on this wrapper instead.
            <span
              className={twMerge(
                "group/drag -m-1 flex p-1",
                !values.isDisabled && "cursor-grab"
              )}
            >
              <Button
                slot="drag"
                className="rounded-sm text-muted-foreground outline-0 outline-offset-1 group-hover/drag:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-ring forced-colors:outline-[Highlight]"
              >
                <svg
                  data-slot="drag-icon"
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M11 5.5C11 6.32843 10.3284 7 9.5 7C8.67157 7 8 6.32843 8 5.5C8 4.67157 8.67157 4 9.5 4C10.3284 4 11 4.67157 11 5.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16 5.5C16 6.32843 15.3284 7 14.5 7C13.6716 7 13 6.32843 13 5.5C13 4.67157 13.6716 4 14.5 4C15.3284 4 16 4.67157 16 5.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16 18.5C16 19.3284 15.3284 20 14.5 20C13.6716 20 13 19.3284 13 18.5C13 17.6716 13.6716 17 14.5 17C15.3284 17 16 17.6716 16 18.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M11 12C11 12.8284 10.3284 13.5 9.5 13.5C8.67157 13.5 8 12.8284 8 12C8 11.1716 8.67157 10.5 9.5 10.5C10.3284 10.5 11 11.1716 11 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16 12C16 12.8284 15.3284 13.5 14.5 13.5C13.6716 13.5 13 12.8284 13 12C13 11.1716 13.6716 10.5 14.5 10.5C15.3284 10.5 16 11.1716 16 12Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </span>
          )}

          {values.selectionMode === "multiple" &&
            values.selectionBehavior === "toggle" && (
              <Checkbox className="*:gap-x-0" slot="selection" />
            )}
          {typeof children === "function" ? children(values) : children}
        </>
      )}
    </GridListItemPrimitive>
  )
}

const GridListEmptyState = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    ref={ref}
    className={twMerge(
      "text-muted-foreground p-6 text-center text-sm",
      className
    )}
    {...props}
  />
)

const GridListSpacer = ({
  className,
  ref,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      ref={ref}
      aria-hidden
      className={twMerge("-ml-2 min-w-6 flex-1", className)}
      {...props}
    />
  )
}

const GridListStart = ({
  className,
  ref,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        "relative flex min-w-0 items-center gap-x-2.5 sm:gap-x-3",
        className
      )}
      {...props}
    />
  )
}

interface GridListTextProps extends TextProps {
  ref?: React.Ref<HTMLDivElement>
}

const GridListLabel = ({ className, ref, ...props }: GridListTextProps) => (
  <Text
    ref={ref}
    className={twMerge("block min-w-0 font-medium", className)}
    {...props}
  />
)

const GridListDescription = ({
  className,
  ref,
  ...props
}: GridListTextProps) => (
  <Text
    slot="description"
    ref={ref}
    className={twMerge(
      "text-muted-foreground block text-sm font-normal",
      className
    )}
    {...props}
  />
)

export {
  GridList,
  GridListDescription,
  GridListEmptyState,
  GridListHeader,
  GridListItem,
  GridListLabel,
  GridListSection,
  GridListSpacer,
  GridListStart,
}

export type {
  GridListItemProps,
  GridListRootProps as GridListProps,
  GridListVariant,
}
