import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type Config = {
  style: "preskok"
  packageManager: "npm" | "yarn" | "pnpm" | "bun"
  installationType: "cli" | "manual"
}

const configAtom = atomWithStorage<Config>("config", {
  style: "preskok",
  packageManager: "pnpm",
  installationType: "cli",
})

export function useConfig() {
  return useAtom(configAtom)
}
