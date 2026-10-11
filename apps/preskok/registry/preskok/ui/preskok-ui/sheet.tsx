"use client"

import type React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type {
  SheetContentProps as SheetContentPrimitiveProps,
  SheetOverlayProps,
  SheetProps,
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

type Sides = "top" | "bottom" | "left" | "right" | "start" | "end" | "center"

const Sheet = (props: SheetTriggerProps) => <SheetTriggerPrimitive {...props} />

interface Spring {
  stiffness: number
  damping: number
  mass: number
}

// Spring presets from Silk. `snappy` covers 90% of the distance in about 200ms, without overshoot.
const springs = {
  snappy: { stiffness: 350, damping: 34, mass: 0.9 },
  smooth: { stiffness: 580, damping: 60, mass: 1.35 },
} satisfies Record<string, Spring>

type SheetTransition = keyof typeof springs | "native"

// The spring is integrated in 1ms steps and stops once it is within half a pixel and nearly still.
const springStep = {
  seconds: 0.001,
  maxFrameSeconds: 0.064,
  settleDistance: 0.5,
  settleVelocity: 10,
}

// React Aria opens and closes a sheet with a native smooth scroll, whose duration the browser
// picks. This replaces only that scroll with a spring; swiping and snapping stay native.
// Reduced motion is unaffected because React Aria scrolls instantly then.
function createSpringScrollRef(spring: Spring) {
  return (overlay: HTMLDivElement | null) => {
    const scroller = overlay?.querySelector<HTMLElement>("[data-sheet-scroll]")

    return scroller ? springScroll(scroller, spring) : undefined
  }
}

// The scroll travels a full viewport, but the sheet is off screen for most of it. Jump to where
// the sheet starts to appear, so the spring spends its whole motion on screen.
function skipHiddenTravel(
  scroller: HTMLElement,
  axis: "scrollTop" | "scrollLeft",
  target: number
) {
  const current = scroller[axis]
  const sheet = scroller.querySelector("[data-sheet-content]")

  if (!sheet) {
    return current
  }

  const rect = sheet.getBoundingClientRect()
  const isVertical = axis === "scrollTop"
  const sheetStart = isVertical ? rect.top : rect.left
  const sheetEnd = isVertical ? rect.bottom : rect.right
  const viewportEnd = isVertical ? window.innerHeight : window.innerWidth
  const distance = target - current
  // Scrolling forward brings the sheet in from the end edge, backward from the start edge.
  const hidden = distance > 0 ? sheetStart - viewportEnd : -sheetEnd

  const skip = Math.min(Math.max(hidden, 0), Math.abs(distance))

  return current + Math.sign(distance) * skip
}

function springScroll(
  scroller: HTMLElement,
  { stiffness, damping, mass }: Spring
) {
  const nativeScrollTo = scroller.scrollTo.bind(scroller)
  let frame = 0
  let snapType = ""

  const settle = () => {
    if (!frame) {
      return
    }

    cancelAnimationFrame(frame)
    frame = 0
    scroller.style.scrollSnapType = snapType
    // React Aria waits for `scrollend` to finish entering.
    scroller.dispatchEvent(new Event("scrollend"))
  }

  // Programmatic scrolls snap, so snapping is off while the spring runs.
  const suspendSnapping = () => {
    if (scroller.style.scrollSnapType !== "none") {
      snapType = scroller.style.scrollSnapType
      scroller.style.scrollSnapType = "none"
    }
  }

  const springTo = (axis: "scrollTop" | "scrollLeft", target: number) => {
    settle()
    suspendSnapping()

    let position = skipHiddenTravel(scroller, axis, target)
    scroller[axis] = position

    let velocity = 0
    let previous = performance.now()

    const step = (now: number) => {
      const elapsed = Math.min(
        Math.max(now - previous, 0) / 1000,
        springStep.maxFrameSeconds
      )

      previous = now

      for (let time = 0; time < elapsed; time += springStep.seconds) {
        const force = -stiffness * (position - target) - damping * velocity
        velocity += (force / mass) * springStep.seconds
        position += velocity * springStep.seconds
      }

      suspendSnapping()

      if (
        Math.abs(position - target) < springStep.settleDistance &&
        Math.abs(velocity) < springStep.settleVelocity
      ) {
        scroller[axis] = target
        settle()

        return
      }

      scroller[axis] = position
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
  }

  // React Aria always passes an options object. Defined on the instance, so removing it restores
  // the prototype's scrollTo.
  const springScrollTo = (options?: ScrollToOptions) => {
    if (options?.behavior !== "smooth") {
      settle()
      nativeScrollTo(options)

      return
    }

    if (options.top !== undefined) {
      springTo("scrollTop", options.top)

      return
    }

    if (options.left !== undefined) {
      springTo("scrollLeft", options.left)
    }
  }

  Object.defineProperty(scroller, "scrollTo", {
    value: springScrollTo,
    configurable: true,
  })

  // The spring's own scroll steps would end the enter early.
  const holdScrollEnd = (event: Event) => {
    if (frame && event.isTrusted) {
      event.stopImmediatePropagation()
    }
  }

  scroller.addEventListener("scrollend", holdScrollEnd)
  // A touch, click or wheel takes over from the spring.
  scroller.addEventListener("pointerdown", settle)
  scroller.addEventListener("wheel", settle, { passive: true })

  return () => {
    settle()
    Reflect.deleteProperty(scroller, "scrollTo")
    scroller.removeEventListener("scrollend", holdScrollEnd)
    scroller.removeEventListener("pointerdown", settle)
    scroller.removeEventListener("wheel", settle)
  }
}

// Module-level so each ref keeps its identity across renders and doesn't reattach mid-animation.
const springScrollRefs = {
  snappy: createSpringScrollRef(springs.snappy),
  smooth: createSpringScrollRef(springs.smooth),
}

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

// At a partial snap point, a swipe on the body moves the sheet instead of scrolling it.
// Sheets without snap points skip this: React Aria marks a sheet expanded only when it is
// 100% in view, and the scrollbar gutter it reserves can clip a right sheet by a few pixels.
const contentStyles = tv({
  base: "peer/dialog group/dialog relative box-border flex min-h-0 w-full flex-auto flex-col overflow-hidden pb-(--sheet-scroll-padding-y) outline-hidden [--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]",
  variants: {
    hasSnapPoints: {
      true: "**:data-[slot=dialog-body]:overflow-hidden group-data-expanded/sheet:**:data-[slot=dialog-body]:overflow-auto",
    },
  },
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
    >,
    Pick<SheetProps, "swipeAnimation" | "swipeAnimationRange"> {
  className?: string
  style?: React.CSSProperties
  /** The edge the sheet slides in from. `start` and `end` follow the locale direction; `center` swipes vertically. */
  side?: Sides
  /** Inset the sheet from the viewport edge with rounded corners. */
  isFloat?: boolean
  isBlurred?: boolean
  closeButton?: boolean
  /** Show a drag handle on top and bottom sheets that can be swiped away. */
  notch?: boolean
  /** How the sheet opens and closes. `native` keeps the browser's smooth scroll. */
  transition?: SheetTransition
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
  transition = "snappy",
  swipeAnimation,
  swipeAnimationRange,
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
      ref={transition === "native" ? undefined : springScrollRefs[transition]}
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
        swipeAnimation={swipeAnimation}
        swipeAnimationRange={swipeAnimationRange}
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
              className={contentStyles({ hasSnapPoints: Boolean(snapPoints) })}
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
export type { SheetContentProps, SheetTransition, Sides }
