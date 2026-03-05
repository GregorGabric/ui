"use client"

import type React from "react"
import {
  Children,
  createContext,
  isValidElement,
  use,
  useEffect,
  useEffectEvent,
  useReducer,
  useRef,
} from "react"
import { ImageOffIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

import { Skeleton } from "./skeleton"
import { Text } from "./text"

type AsyncImageStatus = "loading" | "loaded" | "error"

type AsyncImageLazyLoad = false | IntersectionObserverInit

interface AsyncImageState {
  status: AsyncImageStatus
}

type AsyncImageEvent =
  | { type: "RESET" }
  | { type: "LOAD_SUCCESS" }
  | { type: "LOAD_ERROR" }

const DEFAULT_LAZY_LOAD_OPTIONS: IntersectionObserverInit = {
  threshold: 0.01,
  rootMargin: "75%",
}

interface AsyncImageSizeProps {
  width: number | string
  height: number | string
}

type AsyncImageRootImgProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height"
>

interface AsyncImageRootProps
  extends Omit<React.ComponentProps<"div">, "children">, AsyncImageSizeProps {
  src: string
  alt?: string
  children?: React.ReactNode
  imgProps?: AsyncImageRootImgProps
  loadingDelayMs?: number
  lazyLoad?: AsyncImageLazyLoad
  onLoadingEnd?: () => void
  onErrorFallback?: () => void
}

interface AsyncImageContextValue extends AsyncImageSizeProps {
  src: string
  alt: string
  status: AsyncImageStatus
  imgProps?: AsyncImageRootImgProps
}

interface AsyncImageSlotProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  children?: React.ReactNode
}

type AsyncImageContentProps = Omit<
  React.ComponentProps<"img">,
  "src" | "alt" | "width" | "height"
>

const AsyncImageContext = createContext<AsyncImageContextValue | null>(null)

function useAsyncImageContext() {
  const context = use(AsyncImageContext)

  if (!context) {
    throw new Error(
      "AsyncImage compound components must be used inside AsyncImage.Root."
    )
  }

  return context
}

function AsyncImageLoading({
  children,
  className,
  ...props
}: AsyncImageSlotProps) {
  const { status } = useAsyncImageContext()

  if (status !== "loading") {
    return null
  }

  return (
    <div
      data-slot="async-image-loading"
      className={twMerge("size-full", className)}
      {...props}
    >
      {children ?? (
        <Skeleton className="border-border/60 bg-muted-foreground/20 size-full rounded-md border" />
      )}
    </div>
  )
}

function AsyncImageError({
  children,
  className,
  ...props
}: AsyncImageSlotProps) {
  const { status } = useAsyncImageContext()

  if (status !== "error") {
    return null
  }

  return (
    <div
      data-slot="async-image-error"
      className={twMerge(
        "bg-muted text-muted-foreground grid size-full place-content-center gap-1 rounded-md text-xs",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <ImageOffIcon className="mx-auto size-5" />
          <Text>Image unavailable</Text>
        </>
      )}
    </div>
  )
}

function AsyncImageContent({ className, ...props }: AsyncImageContentProps) {
  const { src, alt, status, width, height, imgProps } = useAsyncImageContext()

  if (status !== "loaded") {
    return null
  }

  const imageClassName = twMerge(
    "size-full object-cover rounded-md border border-border/60",
    imgProps?.className,
    className
  )

  return (
    <img
      {...imgProps}
      {...props}
      data-slot="async-image-content"
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      className={imageClassName}
    />
  )
}

function transitionAsyncImageState(
  state: AsyncImageState,
  event: AsyncImageEvent
): AsyncImageState {
  switch (event.type) {
    case "RESET": {
      return { status: "loading" }
    }
    case "LOAD_SUCCESS": {
      if (state.status === "loaded") {
        return state
      }
      return { status: "loaded" }
    }
    case "LOAD_ERROR": {
      if (state.status === "error") {
        return state
      }
      return { status: "error" }
    }
    default: {
      return state
    }
  }
}

function AsyncImageRoot({
  src,
  alt = "",
  width,
  height,
  children,
  imgProps,
  loadingDelayMs = 0,
  lazyLoad = DEFAULT_LAZY_LOAD_OPTIONS,
  onLoadingEnd,
  onErrorFallback,
  className,
  style,
  ...props
}: AsyncImageRootProps) {
  const [state, dispatch] = useReducer(transitionAsyncImageState, {
    status: "loading",
  })
  const rootRef = useRef<HTMLDivElement | null>(null)
  const onLoadingEndEvent = useEffectEvent(() => onLoadingEnd?.())
  const onErrorFallbackEvent = useEffectEvent(() => onErrorFallback?.())

  useEffect(() => {
    if (!src) {
      dispatch({ type: "LOAD_ERROR" })
      onErrorFallbackEvent()
      return
    }

    dispatch({ type: "RESET" })

    let isCancelled = false
    let isSettled = false
    let hasStartedLoad = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let intersectionObserver: IntersectionObserver | null = null
    const preloadImage = new Image()
    const normalizedDelay = Math.max(loadingDelayMs, 0)

    const settle = (nextStatus: AsyncImageStatus) => {
      if (isCancelled || isSettled) {
        return
      }

      isSettled = true

      const applyStatus = () => {
        if (isCancelled) {
          return
        }

        dispatch({
          type: nextStatus === "loaded" ? "LOAD_SUCCESS" : "LOAD_ERROR",
        })

        if (nextStatus === "loaded") {
          onLoadingEndEvent()
        } else {
          onErrorFallbackEvent()
        }
      }

      if (nextStatus === "loaded" && normalizedDelay > 0) {
        timeoutId = setTimeout(() => {
          applyStatus()
        }, normalizedDelay)

        return
      }

      applyStatus()
    }

    const startImageLoad = () => {
      if (hasStartedLoad) {
        return
      }

      hasStartedLoad = true
      preloadImage.src = src

      preloadImage
        .decode()
        .then(() => {
          settle("loaded")
        })
        .catch(() => {
          if (preloadImage.complete && preloadImage.naturalWidth > 0) {
            settle("loaded")
            return
          }

          settle("error")
        })
    }

    if (
      lazyLoad !== false &&
      typeof window !== "undefined" &&
      rootRef.current
    ) {
      const observedElement = rootRef.current
      const observerOptions = {
        ...DEFAULT_LAZY_LOAD_OPTIONS,
        ...lazyLoad,
      }

      intersectionObserver = new IntersectionObserver((entries) => {
        const isVisible = entries.some(
          (entry) => entry.isIntersecting || entry.intersectionRatio > 0
        )

        if (!isVisible) {
          return
        }

        startImageLoad()
        intersectionObserver?.unobserve(observedElement)
        intersectionObserver?.disconnect()
        intersectionObserver = null
      }, observerOptions)

      intersectionObserver.observe(observedElement)
    } else {
      startImageLoad()
    }

    return () => {
      isCancelled = true

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      intersectionObserver?.disconnect()
    }
  }, [lazyLoad, loadingDelayMs, src])

  const contextValue: AsyncImageContextValue = {
    src,
    alt,
    status: state.status,
    width,
    height,
    imgProps,
  }

  const slotFlags = Children.toArray(children).reduce(
    (flags, child) => {
      if (!isValidElement(child)) {
        return flags
      }

      if (child.type === AsyncImageLoading) {
        flags.hasLoadingSlot = true
        return flags
      }

      if (child.type === AsyncImageError) {
        flags.hasErrorSlot = true
        return flags
      }

      if (child.type === AsyncImageContent) {
        flags.hasContentSlot = true
      }

      return flags
    },
    {
      hasLoadingSlot: false,
      hasErrorSlot: false,
      hasContentSlot: false,
    }
  )

  return (
    <AsyncImageContext value={contextValue}>
      <div
        data-slot="async-image-root"
        className={twMerge("relative overflow-hidden", className)}
        style={{ width, height, ...style }}
        {...props}
        ref={rootRef}
      >
        {!slotFlags.hasLoadingSlot && <AsyncImageLoading />}
        {!slotFlags.hasErrorSlot && <AsyncImageError />}
        {!slotFlags.hasContentSlot && <AsyncImageContent />}
        {children}
      </div>
    </AsyncImageContext>
  )
}

const AsyncImage = {
  Root: AsyncImageRoot,
  Loading: AsyncImageLoading,
  Error: AsyncImageError,
  Content: AsyncImageContent,
}

export { AsyncImage }
export type {
  AsyncImageContentProps,
  AsyncImageRootProps,
  AsyncImageSlotProps,
  AsyncImageStatus,
}
