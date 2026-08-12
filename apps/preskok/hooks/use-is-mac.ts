export function useIsMac() {
  return globalThis.navigator?.platform.toUpperCase().includes("MAC") ?? false
}
