export function useIsMac() {
  return typeof navigator !== "undefined"
    ? navigator.platform.toUpperCase().includes("MAC")
    : false
}
