"use client"

import type React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import type {
  SheetContentProps as SheetContentPrimitiveProps,
  SheetOverlayProps,
  SheetProps as SheetPrimitiveProps,
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

type SheetProps = SheetTriggerProps

const Sheet = (props: SheetProps) => <SheetTriggerPrimitive {...props} />

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
// It relies on React Aria 1.22 Sheet internals, so recheck them on upgrade: the sheet opens and
// closes through `scrollTo({ top | left, behavior: "smooth" })` on `[data-sheet-scroll]`,
// onEnter resolves on that element's `scrollend`, and onExit resolves once the sheet is out of view.
function createSpringScrollRef(spring: Spring) {
  return (overlay: HTMLDivElement | null) => {
    const scroller = overlay?.querySelector<HTMLElement>("[data-sheet-scroll]")

    return scroller ? springScroll(scroller, spring) : undefined
  }
}

type ScrollAxis = "scrollTop" | "scrollLeft"

type ScrollToArgs = [options?: ScrollToOptions] | [x: number, y: number]

interface SpringTarget {
  axis: ScrollAxis
  target: number
}

// The scroll travels a full viewport, but the sheet is off screen for most of it. Limit the
// spring to the stretch where the sheet is visible, so it spends its whole motion on screen:
// `from` is where the sheet starts to appear, `to` is where it has just left.
function visibleTravel(
  scroller: HTMLElement,
  axis: ScrollAxis,
  target: number
) {
  const current = scroller[axis]
  const sheet = scroller.querySelector("[data-sheet-content]")

  if (!sheet) {
    return { from: current, to: target }
  }

  const rect = sheet.getBoundingClientRect()
  const isVertical = axis === "scrollTop"
  const sheetStart = isVertical ? rect.top : rect.left
  const sheetEnd = isVertical ? rect.bottom : rect.right
  const viewportEnd = isVertical ? window.innerHeight : window.innerWidth
  const distance = target - current
  // Scrolling forward moves the sheet toward the start edge: it comes in from the end edge and
  // leaves past the start edge. Scrolling backward is the mirror image.
  const hidden = distance > 0 ? sheetStart - viewportEnd : -sheetEnd
  const visible = distance > 0 ? sheetEnd : viewportEnd - sheetStart

  const clamp = (travel: number) =>
    Math.min(Math.max(travel, 0), Math.abs(distance))

  return {
    from: current + Math.sign(distance) * clamp(hidden),
    to: current + Math.sign(distance) * clamp(visible),
  }
}

function springScroll(
  scroller: HTMLElement,
  { stiffness, damping, mass }: Spring
) {
  const nativeScrollTo = scroller.scrollTo.bind(scroller)
  let frame = 0
  let snapType = ""
  let running: SpringTarget = { axis: "scrollTop", target: 0 }

  // Ends the spring where it is.
  const stop = () => {
    if (!frame) {
      return
    }

    cancelAnimationFrame(frame)
    frame = 0
    scroller.style.scrollSnapType = snapType
    // React Aria waits for `scrollend` to finish entering.
    scroller.dispatchEvent(new Event("scrollend"))
  }

  // Ends the spring at React Aria's target. Stopping midway would let snapping pull a closing
  // sheet back open, or an opening one shut.
  const finish = () => {
    if (!frame) {
      return
    }

    scroller[running.axis] = running.target
    stop()
  }

  // Programmatic scrolls snap, so snapping is off while the spring runs.
  const suspendSnapping = () => {
    if (scroller.style.scrollSnapType !== "none") {
      snapType = scroller.style.scrollSnapType
      scroller.style.scrollSnapType = "none"
    }
  }

  const springTo = (axis: ScrollAxis, target: number) => {
    stop()
    suspendSnapping()

    const { from, to } = visibleTravel(scroller, axis, target)
    let position = from
    let velocity = 0
    let previous = performance.now()

    running = { axis, target }
    scroller[axis] = position

    const step = (now: number) => {
      const elapsed = Math.min(
        Math.max(now - previous, 0) / 1000,
        springStep.maxFrameSeconds
      )

      previous = now

      for (let time = 0; time < elapsed; time += springStep.seconds) {
        const force = -stiffness * (position - to) - damping * velocity
        velocity += (force / mass) * springStep.seconds
        position += velocity * springStep.seconds
      }

      suspendSnapping()

      if (
        Math.abs(position - to) < springStep.settleDistance &&
        Math.abs(velocity) < springStep.settleVelocity
      ) {
        finish()

        return
      }

      scroller[axis] = position
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
  }

  // React Aria passes an options object with `behavior: "smooth"`; any other call scrolls
  // natively. Defined on the instance, so removing it restores the prototype's scrollTo.
  const springScrollTo = (...args: ScrollToArgs) => {
    if (args.length === 2) {
      stop()
      nativeScrollTo(...args)

      return
    }

    const [options] = args

    if (options?.behavior !== "smooth") {
      stop()
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
  // A touch, click or wheel jumps the spring to its target, then takes over from there.
  scroller.addEventListener("pointerdown", finish)
  scroller.addEventListener("wheel", finish, { passive: true })

  return () => {
    stop()
    Reflect.deleteProperty(scroller, "scrollTo")
    scroller.removeEventListener("scrollend", holdScrollEnd)
    scroller.removeEventListener("pointerdown", finish)
    scroller.removeEventListener("wheel", finish)
  }
}

// Module-level so each ref keeps its identity across renders and doesn't reattach mid-animation.
const springScrollRefs = {
  snappy: createSpringScrollRef(springs.snappy),
  smooth: createSpringScrollRef(springs.smooth),
}

// Only the bottom-most sheet in a stack dims the page behind it.
const backdropStyles = tv({
  base: "data-[stack-index='0']:bg-black/15 dark:data-[stack-index='0']:bg-black/50",
  variants: {
    isBlurred: {
      true: "data-[stack-index='0']:backdrop-blur-[1px]",
    },
  },
})

// `position` is the resolved edge: React Aria maps start/end to left/right for the locale.
// The stack offsets nudge a parent sheet toward its edge while it scales back behind a child.
// Sheets that size to their content stop short of the viewport's height, so `SheetBody` scrolls
// instead of pushing the header off screen. The cap sits on the sheet, not the body, so the
// height is right on the first frame, when React Aria measures the snap points.
const sheetStyles = tv({
  base: "relative z-[1] box-content flex flex-col overflow-clip border-muted-foreground/20 bg-overlay text-overlay-foreground shadow-lg outline-hidden will-change-transform dark:border-border forced-colors:bg-[Canvas]",
  variants: {
    position: {
      top: "max-h-[calc(var(--visual-viewport-height,100dvh)---spacing(10))] w-full max-w-[800px] origin-bottom border-b [--sheet-stack-y:8px] min-[51rem]:border-x",
      bottom:
        "max-h-[calc(var(--visual-viewport-height,100dvh)---spacing(10))] w-full max-w-[800px] origin-top border-t [--sheet-stack-y:-8px] min-[51rem]:border-x",
      left: "h-full w-3/4 origin-right border-r [--sheet-stack-x:8px] sm:max-w-80",
      right:
        "h-full w-3/4 origin-left border-l [--sheet-stack-x:-8px] sm:max-w-80",
      center:
        "max-h-[calc(var(--visual-viewport-height,100dvh)---spacing(8))] w-[calc(100%-2rem)] max-w-lg rounded-xl border",
    },
    isFloat: {
      true: "rounded-xl border-0 ring-1 ring-foreground/5 dark:ring-border",
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
    Pick<SheetPrimitiveProps, "swipeAnimation" | "swipeAnimationRange"> {
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
  const hasSnapPoints = Boolean(snapPoints?.length)

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
          snapPoints?.length ? { start: snapPoints.length - 1 } : undefined
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
              className={contentStyles({ hasSnapPoints })}
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
export type { SheetContentProps, SheetProps, SheetTransition, Sides }
