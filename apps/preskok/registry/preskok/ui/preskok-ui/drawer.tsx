"use client"

import type React from "react"
import { twMerge } from "cn"
import { Button as ButtonPrimitive } from "react-aria-components/Button"
import type { HeadingProps } from "react-aria-components/Heading"
import { Heading } from "react-aria-components/Heading"
import type {
  SheetContentProps,
  SheetOverlayProps,
  SheetTriggerProps,
} from "react-aria-components/Sheet"
import {
  Sheet,
  SheetBackdrop,
  SheetContent,
  SheetOverlay,
  SheetTrigger,
} from "react-aria-components/Sheet"
import type { TextProps } from "react-aria-components/Text"
import { Text } from "react-aria-components/Text"
import { tv } from "tailwind-variants"

import { Button, type ButtonProps } from "./button"

type DrawerSide = "top" | "bottom" | "left" | "right"

const Drawer = (props: SheetTriggerProps) => <SheetTrigger {...props} />

// Only the bottom-most drawer in a stack dims the page behind it.
const backdropStyles = tv({
  base: "data-[stack-index='0']:bg-black/20",
  variants: {
    isBlurred: {
      true: "data-[stack-index='0']:backdrop-blur-[1px]",
    },
  },
})

// The perspective lets a parent drawer scale backward along the z-axis when a child opens.
const drawerStyles = tv({
  base: "z-[1] box-content flex [transform:perspective(1000px)] flex-col overflow-clip bg-background text-foreground ring ring-input outline-hidden will-change-transform forced-colors:bg-[Canvas]",
  variants: {
    side: {
      top: "max-h-[calc(100%-2rem)] origin-[center_150px]",
      bottom: "max-h-[calc(100%-2rem)] origin-[center_-150px]",
      left: "h-full w-full max-w-xs origin-[150px_center] **:[[slot=header]]:text-left",
      right:
        "h-full w-full max-w-xs origin-[-150px_center] **:[[slot=header]]:text-left",
    },
    isFloat: {
      true: "rounded-lg",
      false: "",
    },
  },
  compoundVariants: [
    { side: ["top", "bottom"], isFloat: false, className: "w-full" },
    {
      side: ["top", "bottom"],
      isFloat: true,
      className: "w-[calc(100%-1rem)]",
    },
    {
      side: ["left", "right"],
      isFloat: true,
      className: "h-[calc(100%-1rem)]",
    },
    { side: "top", isFloat: false, className: "rounded-b-2xl" },
    { side: "bottom", isFloat: false, className: "rounded-t-2xl" },
    { side: "top", isFloat: true, className: "mt-2" },
    { side: "bottom", isFloat: true, className: "mb-2" },
    { side: "left", isFloat: true, className: "ml-2" },
    { side: "right", isFloat: true, className: "mr-2" },
  ],
})

// Inner content only scrolls once the drawer is fully expanded. At a partial snap point a swipe
// on the content expands the drawer instead.
const contentStyles = tv({
  base: "box-border flex min-h-0 w-full flex-auto flex-col overflow-hidden outline-hidden group-data-expanded/drawer:overflow-auto",
  variants: {
    side: {
      top: "mx-auto max-w-lg",
      bottom: "mx-auto max-w-lg pb-(--sheet-scroll-padding-y)",
      left: "pb-(--sheet-scroll-padding-y)",
      right: "pb-(--sheet-scroll-padding-y)",
    },
  },
})

const notchStyles = tv({
  base: "mx-auto h-1.5 w-10 shrink-0 rounded-full bg-foreground/20",
  variants: {
    side: {
      top: "mb-2.5",
      bottom: "mt-2.5",
    },
  },
})

interface DrawerContentProps
  extends
    Omit<SheetOverlayProps, "className" | "children" | "position" | "style">,
    Pick<
      SheetContentProps,
      "aria-label" | "aria-labelledby" | "role" | "children"
    > {
  className?: string
  style?: React.CSSProperties
  side?: DrawerSide
  /** Inset the drawer from the viewport edge with rounded corners. */
  isFloat?: boolean
  isBlurred?: boolean
  /** Show a drag handle on top and bottom drawers. */
  notch?: boolean
}

const DrawerContent = ({
  side = "bottom",
  isFloat = false,
  isBlurred = true,
  notch = true,
  role = "dialog",
  className,
  style,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: DrawerContentProps) => {
  const { snapPoints } = props
  const showNotch = notch && (side === "top" || side === "bottom")

  return (
    <SheetOverlay {...props} position={side} className="group/drawer z-50">
      {/* With snap points, the backdrop stays hidden until the drawer passes the last one. */}
      <SheetBackdrop
        className={backdropStyles({ isBlurred })}
        swipeAnimation="drawer-backdrop"
        swipeAnimationRange={
          snapPoints ? { start: snapPoints.length - 1 } : undefined
        }
      />
      {/* A floating drawer is inset from the edge, so it must not appear to continue past it. */}
      <Sheet
        overscrollPadding={!isFloat}
        stackAnimation="drawer-scale-back"
        className={drawerStyles({ side, isFloat, className })}
        style={style}
      >
        {showNotch && side === "bottom" && (
          <div aria-hidden className={notchStyles({ side })} />
        )}
        <SheetContent
          role={role}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className={contentStyles({ side })}
        >
          {children}
        </SheetContent>
        {showNotch && side === "top" && (
          <div aria-hidden className={notchStyles({ side })} />
        )}
      </Sheet>
    </SheetOverlay>
  )
}

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    slot="header"
    className={twMerge("flex flex-col p-4 text-center sm:text-left", className)}
    {...props}
  />
)

const DrawerTitle = ({ className, ...props }: HeadingProps) => (
  <Heading
    slot="title"
    className={twMerge("text-lg/8 font-semibold", className)}
    {...props}
  />
)

const DrawerDescription = ({ className, ...props }: TextProps) => (
  <Text
    slot="description"
    className={twMerge("text-muted-foreground text-sm", className)}
    {...props}
  />
)

const DrawerBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    slot="body"
    className={twMerge("isolate flex flex-col px-4 py-1", className)}
    {...props}
  />
)

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    slot="footer"
    className={twMerge(
      "isolate mt-auto flex flex-col-reverse justify-end gap-2 p-4 sm:flex-row",
      className
    )}
    {...props}
  />
)

const DrawerClose = ({ intent = "outline", ...props }: ButtonProps) => (
  <Button slot="close" intent={intent} {...props} />
)

Drawer.Trigger = ButtonPrimitive
Drawer.Footer = DrawerFooter
Drawer.Header = DrawerHeader
Drawer.Title = DrawerTitle
Drawer.Description = DrawerDescription
Drawer.Body = DrawerBody
Drawer.Content = DrawerContent
Drawer.Close = DrawerClose

export { Drawer }
export type { DrawerContentProps, DrawerSide }
