import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type Config = {
  style: "preskok"
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
}

const configAtom = atomWithStorage<Config>("config", {
  style: "preskok",
  packageManager: "pnpm",
})

export function useConfig() {
  return useAtom(configAtom)
}
