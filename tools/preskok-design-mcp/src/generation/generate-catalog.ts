import path from "node:path"
import { fileURLToPath } from "node:url"

import { checkPreskokCatalog, writePreskokCatalog } from "./catalog.js"

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(sourceDirectory, "../..")
const workspaceRoot = path.resolve(packageRoot, "../..")
const outputPath = path.join(packageRoot, "generated/catalog.json")
const check = process.argv.includes("--check")

if (check) {
  const current = await checkPreskokCatalog({ workspaceRoot, outputPath })
  if (!current) {
    process.stderr.write(
      "Generated Preskok design catalog is stale. Run pnpm catalog:generate.\n"
    )
    process.exitCode = 1
  } else {
    process.stderr.write("Generated Preskok design catalog is current.\n")
  }
} else {
  await writePreskokCatalog({ workspaceRoot, outputPath })
  process.stderr.write(`Generated ${outputPath}.\n`)
}
