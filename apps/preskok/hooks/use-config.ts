import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type Config = {
  style: "aria-nova"
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
}

const configAtom = atomWithStorage<Config>("config", {
  style: "aria-nova",
  packageManager: "pnpm",
})

export function useConfig() {
  return useAtom(configAtom)
}
