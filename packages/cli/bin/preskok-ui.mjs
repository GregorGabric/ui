#!/usr/bin/env node
import { spawnSync } from "node:child_process"

const REGISTRY_BASE_URL = (
  process.env.PRESKOK_REGISTRY_URL ?? "https://ui-three-mu.vercel.app"
).replace(/\/$/, "")
const SHADCN_VERSION = process.env.PRESKOK_SHADCN_VERSION ?? "4.9.0"
const REGISTRY = `@preskok=${REGISTRY_BASE_URL}/r/{name}.json`
const DEFAULT_REGISTRY_ITEM = `${REGISTRY_BASE_URL}/r/default.json`
const CWD_OPTION_VALUES = new Set(["-c", "--cwd"])
const ADD_OPTION_VALUES = new Set(["-c", "--cwd", "-p", "--path", "--diff"])
const INIT_OPTION_VALUES = new Set([
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

const args = process.argv.slice(2)
const [command, ...commandArgs] = args

if (!command || command === "-h" || command === "--help") {
  printHelp()
  process.exit(0)
}

if (command === "add") {
  const registryStatus = runShadcn([
    "registry",
    "add",
    REGISTRY,
    ...getCommandOptions(commandArgs, CWD_OPTION_VALUES),
  ])

  if (registryStatus !== 0) {
    process.exit(registryStatus)
  }

  process.exit(
    runShadcn([
      "add",
      "--yes",
      ...toPreskokCommandItems(commandArgs, ADD_OPTION_VALUES),
    ])
  )
}

if (command === "init") {
  const { initArgs, items } = splitInitArgs(commandArgs)

  const initStatus = runShadcn(["init", DEFAULT_REGISTRY_ITEM, ...initArgs])

  if (initStatus !== 0) {
    process.exit(initStatus)
  }

  const registryStatus = runShadcn([
    "registry",
    "add",
    REGISTRY,
    ...getCommandOptions(initArgs, CWD_OPTION_VALUES),
  ])

  if (registryStatus !== 0) {
    process.exit(registryStatus)
  }

  if (items.length === 0) {
    process.exit(0)
  }

  process.exit(
    runShadcn([
      "add",
      "--yes",
      ...getCommandOptions(initArgs, CWD_OPTION_VALUES),
      ...toPreskokItems(items),
    ])
  )
}

if (command === "registry") {
  const registryArgs =
    commandArgs[0] === "add" ? commandArgs.slice(1) : commandArgs
  process.exit(runShadcn(["registry", "add", REGISTRY, ...registryArgs]))
}

if (command === "view") {
  process.exit(
    runShadcn([
      "view",
      ...toPreskokCommandItems(commandArgs, CWD_OPTION_VALUES),
    ])
  )
}

if (command === "diff") {
  process.exit(
    runShadcn([
      "add",
      ...toPreskokCommandItems(commandArgs, CWD_OPTION_VALUES),
      "--diff",
    ])
  )
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
      `shadcn@${SHADCN_VERSION}`,
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
  return values.map(toPreskokItem)
}

function toPreskokItem(value) {
  if (value.startsWith("-") || value.startsWith("@") || value.includes("/")) {
    return value
  }

  return `@preskok/${value.replace(/\.(tsx|ts|jsx|js|json)$/, "")}`
}

function toPreskokCommandItems(values, optionsWithValues) {
  let skipNext = false

  return values.map((value) => {
    if (skipNext) {
      skipNext = false
      return value
    }

    if (optionsWithValues.has(value)) {
      skipNext = true
      return value
    }

    return toPreskokItem(value)
  })
}

function getCommandOptions(values, optionsWithValues) {
  let skipNext = false
  const options = []

  for (const value of values) {
    if (skipNext) {
      skipNext = false
      options.push(value)
      continue
    }

    if (optionsWithValues.has(value)) {
      skipNext = true
      options.push(value)
      continue
    }

    if (hasInlineOptionValue(value, optionsWithValues)) {
      options.push(value)
    }
  }

  return options
}

function splitInitArgs(values) {
  let skipNext = false
  const initArgs = []
  const items = []

  for (const value of values) {
    if (skipNext) {
      skipNext = false
      initArgs.push(value)
      continue
    }

    if (INIT_OPTION_VALUES.has(value)) {
      skipNext = true
      initArgs.push(value)
      continue
    }

    if (
      hasInlineOptionValue(value, INIT_OPTION_VALUES) ||
      value.startsWith("-")
    ) {
      initArgs.push(value)
      continue
    }

    items.push(value)
  }

  return { initArgs, items }
}

function hasInlineOptionValue(value, options) {
  return [...options].some((option) => value.startsWith(`${option}=`))
}

function printHelp() {
  console.log(`Usage: preskok-ui <command> [options]

Commands:
  init [items...]     run shadcn init, register Preskok, and optionally add items
  add <items...>      register Preskok and add items by name
  registry            register the @preskok namespace in components.json

Examples:
  npx preskok-ui@latest init
  npx preskok-ui@latest init button
  npx preskok-ui@latest add button
  npx preskok-ui@latest view button
  npx preskok-ui@latest diff button
  npx preskok-ui@latest registry`)
}
