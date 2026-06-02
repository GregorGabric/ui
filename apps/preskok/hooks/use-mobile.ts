import * as React from "react"

export function useIsMobile(mobileBreakpoint = 768) {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`)
      mql.addEventListener("change", onStoreChange)
      return () => mql.removeEventListener("change", onStoreChange)
    },
    () => window.innerWidth < mobileBreakpoint,
    () => false
  )
}
