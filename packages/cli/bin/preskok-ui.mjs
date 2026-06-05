#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs"
import path from "node:path"

const REGISTRY_BASE_URL = (
  process.env.PRESKOK_REGISTRY_URL ?? "https://ui-three-mu.vercel.app"
).replace(/\/$/, "")
const REGISTRY = `@preskok=${REGISTRY_BASE_URL}/r/{name}.json`
const DEFAULT_REGISTRY_ITEM = `${REGISTRY_BASE_URL}/r/default.json`
const CWD_OPTION_VALUES = new Set(["-c", "--cwd"])
const ADD_OPTION_VALUES = new Set(["-c", "--cwd", "-p", "--path", "--diff"])
const DEPENDENCY_SECTIONS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
]
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
const LOCKFILES = [
  "package-lock.json",
  "npm-shrinkwrap.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
]

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
    runPreskokAdd(toPreskokCommandItems(commandArgs, ADD_OPTION_VALUES))
  )
}

if (command === "init") {
  const { initArgs, items } = splitInitArgs(commandArgs)
  const cwd = getCwd(initArgs)

  if (!existsSync(path.join(cwd, "components.json"))) {
    const initStatus = runShadcn(["init", DEFAULT_REGISTRY_ITEM, ...initArgs])

    if (initStatus !== 0) {
      process.exit(initStatus)
    }
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
    runPreskokAdd([
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

function runPreskokAdd(addArgs) {
  const packageState = capturePackageState(addArgs)
  const status = runShadcn(["add", "--yes", ...addArgs])
  restorePackageState(packageState)

  return status
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

function getCwd(values) {
  for (let index = 0; index < values.length; index++) {
    const value = values[index]

    if (value === "-c" || value === "--cwd") {
      return path.resolve(values[index + 1] ?? process.cwd())
    }

    if (value.startsWith("--cwd=")) {
      return path.resolve(value.slice("--cwd=".length))
    }
  }

  return process.cwd()
}

function hasInlineOptionValue(value, options) {
  return [...options].some((option) => value.startsWith(`${option}=`))
}

function capturePackageState(values) {
  const cwd = getCwd(values)
  const packageJsonPath = path.join(cwd, "package.json")

  if (!existsSync(packageJsonPath)) {
    return null
  }

  const packageJsonContent = readFileSync(packageJsonPath, "utf8")
  const packageJson = JSON.parse(packageJsonContent)
  const lockfiles = new Map()

  for (const lockfile of LOCKFILES) {
    const lockfilePath = path.join(cwd, lockfile)

    if (existsSync(lockfilePath)) {
      lockfiles.set(lockfile, readFileSync(lockfilePath))
    }
  }

  return {
    cwd,
    lockfiles,
    packageJson,
    packageJsonContent,
    packageJsonPath,
  }
}

function restorePackageState(packageState) {
  if (!packageState || !existsSync(packageState.packageJsonPath)) {
    return
  }

  const packageJson = JSON.parse(
    readFileSync(packageState.packageJsonPath, "utf8")
  )
  const beforeDependencyNames = getDependencyNames(packageState.packageJson)
  const afterDependencyNames = getDependencyNames(packageJson)
  const hasNewDependencies = [...afterDependencyNames].some((dependency) => {
    return !beforeDependencyNames.has(dependency)
  })

  if (!hasNewDependencies) {
    writeFileSync(packageState.packageJsonPath, packageState.packageJsonContent)
    restoreLockfiles(packageState)
    return
  }

  restoreExistingDependencySpecs(packageState.packageJson, packageJson)
  writeFileSync(
    packageState.packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`
  )
}

function getDependencyNames(packageJson) {
  const names = new Set()

  for (const section of DEPENDENCY_SECTIONS) {
    for (const dependency of Object.keys(packageJson[section] ?? {})) {
      names.add(dependency)
    }
  }

  return names
}

function restoreExistingDependencySpecs(sourcePackageJson, targetPackageJson) {
  for (const section of DEPENDENCY_SECTIONS) {
    const sourceDependencies = sourcePackageJson[section] ?? {}
    const targetDependencies = targetPackageJson[section] ?? {}

    for (const [dependency, version] of Object.entries(sourceDependencies)) {
      if (targetDependencies[dependency] !== undefined) {
        targetDependencies[dependency] = version
      }
    }
  }
}

function restoreLockfiles(packageState) {
  for (const lockfile of LOCKFILES) {
    const lockfilePath = path.join(packageState.cwd, lockfile)
    const content = packageState.lockfiles.get(lockfile)

    if (content) {
      writeFileSync(lockfilePath, content)
      continue
    }

    if (existsSync(lockfilePath)) {
      unlinkSync(lockfilePath)
    }
  }
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
