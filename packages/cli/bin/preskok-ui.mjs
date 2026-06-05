#!/usr/bin/env node
import { spawnSync } from "node:child_process"

const REGISTRY = "@preskok=https://ui-three-mu.vercel.app/r/{name}.json"
const DEFAULT_REGISTRY_ITEM = "https://ui-three-mu.vercel.app/r/default.json"

const args = process.argv.slice(2)
const [command, ...commandArgs] = args

if (!command || command === "-h" || command === "--help") {
  printHelp()
  process.exit(0)
}

if (command === "add") {
  const registryStatus = runShadcn(["registry", "add", REGISTRY])

  if (registryStatus !== 0) {
    process.exit(registryStatus)
  }

  process.exit(
    runShadcn(["add", "--overwrite", "--yes", ...toPreskokItems(commandArgs)])
  )
}

if (command === "init") {
  process.exit(
    runShadcn(["init", DEFAULT_REGISTRY_ITEM, ...toPreskokInitItems(commandArgs)])
  )
}

if (command === "registry") {
  const registryArgs =
    commandArgs[0] === "add" ? commandArgs.slice(1) : commandArgs
  process.exit(runShadcn(["registry", "add", REGISTRY, ...registryArgs]))
}

process.exit(runShadcn(args))

function runShadcn(shadcnArgs) {
  const executable = process.platform === "win32" ? "npm.cmd" : "npm"
  const result = spawnSync(
    executable,
    [
      "exec",
      "--yes",
      "--package",
      "shadcn@latest",
      "--",
      "shadcn",
      ...shadcnArgs,
    ],
    {
      stdio: "inherit",
    }
  )

  return result.status ?? 1
}

function toPreskokItems(values) {
  return values.map((value) => {
    if (value.startsWith("-") || value.startsWith("@") || value.includes("/")) {
      return value
    }

    return `@preskok/${value}`
  })
}

function toPreskokInitItems(values) {
  const initOptionsWithValues = new Set([
    "-t",
    "--template",
    "-b",
    "--base",
    "-p",
    "--preset",
    "-c",
    "--cwd",
    "-n",
    "--name",
  ])

  let skipNext = false

  return values.map((value) => {
    if (skipNext) {
      skipNext = false
      return value
    }

    if (initOptionsWithValues.has(value)) {
      skipNext = true
      return value
    }

    return toPreskokItems([value])[0]
  })
}

function printHelp() {
  console.log(`Usage: preskok-ui <command> [options]

Commands:
  init [items...]     run shadcn init with the Preskok base and optional items
  add <items...>      register Preskok and add items by name
  registry            register the @preskok namespace in components.json

Examples:
  npx preskok-ui@latest init button
  npx preskok-ui@latest add button
  npx preskok-ui@latest diff
  npx preskok-ui@latest registry`)
}
