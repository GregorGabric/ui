"use client"

import type React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type {
  SheetContentProps as SheetContentPrimitiveProps,
  SheetOverlayProps,
  SheetTriggerProps,
} from "react-aria-components/Sheet"
import {
  SheetBackdrop,
  SheetContent as SheetContentPrimitive,
  SheetOverlay,
  Sheet as SheetPrimitive,
  SheetTrigger as SheetTriggerPrimitive,
} from "react-aria-components/Sheet"
import { tv } from "tailwind-variants"

import {
  DialogBody,
  DialogClose,
  DialogCloseIcon,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

type Sides = "top" | "bottom" | "left" | "right" | "start" | "end"

const Sheet = (props: SheetTriggerProps) => <SheetTriggerPrimitive {...props} />

// Only the bottom-most sheet in a stack dims the page behind it.
const backdropStyles = tv({
  base: "data-[stack-index='0']:bg-black/15",
  variants: {
    isBlurred: {
      true: "data-[stack-index='0']:backdrop-blur-[1px]",
    },
  },
})

// `position` is the resolved edge: React Aria maps start/end to left/right for the locale.
// The stack offsets nudge a parent sheet toward its edge while it scales back behind a child.
const sheetStyles = tv({
  base: "relative z-[1] box-content flex flex-col overflow-clip border-muted-foreground/20 bg-overlay text-overlay-foreground shadow-lg outline-hidden will-change-transform dark:border-border forced-colors:bg-[Canvas]",
  variants: {
    position: {
      top: "w-full max-w-[800px] origin-bottom border-b [--sheet-stack-y:8px]",
      bottom: "w-full max-w-[800px] origin-top border-t [--sheet-stack-y:-8px]",
      left: "h-full w-3/4 origin-right border-r [--sheet-stack-x:8px] sm:max-w-80",
      right:
        "h-full w-3/4 origin-left border-l [--sheet-stack-x:-8px] sm:max-w-80",
      center: "w-[calc(100%-2rem)] max-w-lg rounded-2xl border",
    },
    isFloat: {
      true: "rounded-lg border-0 ring-1 ring-foreground/5 dark:ring-border",
      false: "",
    },
  },
  compoundVariants: [
    { position: "top", isFloat: false, className: "rounded-b-2xl" },
    { position: "bottom", isFloat: false, className: "rounded-t-2xl" },
    { position: "top", isFloat: true, className: "mt-2 w-[calc(100%-1rem)]" },
    {
      position: "bottom",
      isFloat: true,
      className: "mb-2 w-[calc(100%-1rem)]",
    },
    {
      position: "left",
      isFloat: true,
      className: "my-2 ml-2 h-[calc(100%-1rem)]",
    },
    {
      position: "right",
      isFloat: true,
      className: "my-2 mr-2 h-[calc(100%-1rem)]",
    },
  ],
})

// Until the sheet is fully expanded, a swipe on the body moves the sheet instead of scrolling it.
const contentStyles = tv({
  base: [
    "peer/dialog group/dialog relative box-border flex min-h-0 w-full flex-auto flex-col overflow-hidden pb-(--sheet-scroll-padding-y) outline-hidden [--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]",
    "**:data-[slot=dialog-body]:overflow-hidden group-data-expanded/sheet:**:data-[slot=dialog-body]:overflow-auto",
  ],
})

const notchStyles = tv({
  base: "pointer-events-none absolute left-1/2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground/20",
  variants: {
    position: {
      top: "bottom-2",
      bottom: "top-2",
    },
  },
})

interface SheetContentProps
  extends
    Omit<SheetOverlayProps, "children" | "className" | "style" | "position">,
    Pick<
      SheetContentPrimitiveProps,
      "aria-label" | "aria-labelledby" | "role" | "children"
    > {
  className?: string
  style?: React.CSSProperties
  /** The edge the sheet slides in from. `start` and `end` follow the locale direction. */
  side?: Sides
  /** Inset the sheet from the viewport edge with rounded corners. */
  isFloat?: boolean
  isBlurred?: boolean
  closeButton?: boolean
  /** Show a drag handle on top and bottom sheets that can be swiped away. */
  notch?: boolean
  overlay?: Omit<SheetOverlayProps, "children" | "position">
}

const SheetContent = ({
  side = "right",
  isFloat = true,
  isBlurred = false,
  closeButton = true,
  notch = true,
  role = "dialog",
  preventDismissal = role === "alertdialog",
  overlay,
  className,
  style,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: SheetContentProps) => {
  const { snapPoints } = props

  return (
    <SheetOverlay
      {...overlay}
      {...props}
      position={side}
      preventDismissal={preventDismissal}
      className={composeRenderProps(
        overlay?.className,
        (overlayClassName) => `group/sheet z-50 ${overlayClassName ?? ""}`
      )}
    >
      {/* With snap points, the backdrop stays hidden until the sheet passes the last one. */}
      <SheetBackdrop
        className={backdropStyles({ isBlurred })}
        swipeAnimation="sheet-backdrop"
        swipeAnimationRange={
          snapPoints ? { start: snapPoints.length - 1 } : undefined
        }
      />
      {/* A floating sheet is inset from the edge, so it must not appear to continue past it. */}
      <SheetPrimitive
        overscrollPadding={!isFloat}
        stackAnimation="sheet-scale-back"
        className={({ position }) =>
          sheetStyles({ position, isFloat, className })
        }
        style={style}
      >
        {({ position }) => (
          <>
            {notch &&
              !preventDismissal &&
              (position === "top" || position === "bottom") && (
                <div aria-hidden className={notchStyles({ position })} />
              )}
            <SheetContentPrimitive
              data-slot="dialog"
              role={role}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              className={contentStyles()}
            >
              {composeRenderProps(children, (resolvedChildren) => (
                <>
                  {resolvedChildren}
                  {closeButton && (
                    <DialogCloseIcon
                      className="top-2.5 right-2.5"
                      isDismissable={!preventDismissal}
                    />
                  )}
                </>
              ))}
            </SheetContentPrimitive>
          </>
        )}
      </SheetPrimitive>
    </SheetOverlay>
  )
}

const SheetTrigger = DialogTrigger
const SheetFooter = DialogFooter
const SheetHeader = DialogHeader
const SheetTitle = DialogTitle
const SheetDescription = DialogDescription
const SheetBody = DialogBody
const SheetClose = DialogClose

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
export type { SheetContentProps, Sides }
