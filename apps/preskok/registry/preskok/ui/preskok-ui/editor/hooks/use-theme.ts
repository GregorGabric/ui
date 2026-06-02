"use client"

import * as React from "react"

export const useTheme = () => {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      )
      darkModeMediaQuery.addEventListener("change", onStoreChange)
      return () =>
        darkModeMediaQuery.removeEventListener("change", onStoreChange)
    },
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false
  )
}
