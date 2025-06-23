"use client"

import { createContext, use } from "react"

/**
 * A helper to create the Context and its Provider. The code below will make sure to skip the
 * undefined checks normally associated with Context creation.
 *
 * @return useCtx, createdContext.Provider
 */
export function createCtx<T extends object | null>() {
  const createdContext = createContext<T | undefined>(undefined)
  function useCtx() {
    const importContext = use(createdContext)
    if (importContext === undefined) {
      throw new Error(
        "ERROR: useCtx must be used inside a Provider with a provided value! Check usage for createCtx function"
      )
    }
    return importContext
  }
  return [useCtx, createdContext.Provider] as const
}
