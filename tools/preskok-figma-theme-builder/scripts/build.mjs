import { readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import preact from "@preact/preset-vite"
import { build } from "vite"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const distDir = path.join(root, "dist")
const tempUiDir = path.join(root, ".vite-ui")

await rm(distDir, { force: true, recursive: true })
await rm(tempUiDir, { force: true, recursive: true })

await build({
  configFile: false,
  root,
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.join(root, "code.js"),
      fileName: () => "code.js",
      formats: ["iife"],
      name: "PreskokThemeBuilder",
    },
    minify: false,
    outDir: distDir,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    target: "es2020",
  },
})

await build({
  configFile: false,
  plugins: [preact()],
  root,
  build: {
    emptyOutDir: true,
    minify: false,
    outDir: tempUiDir,
    rollupOptions: {
      input: path.join(root, "src/ui/index.html"),
    },
    target: "es2020",
  },
})

let html = await readFile(path.join(tempUiDir, "src/ui/index.html"), "utf8")
const scripts = []

for (const match of html.matchAll(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/g
)) {
  const [tag, sourcePath] = match
  const script = await readFile(resolveBuiltAsset(sourcePath), "utf8")
  scripts.push(`<script>${script}</script>`)
  html = html.replace(tag, "")
}

for (const match of html.matchAll(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/g
)) {
  const [tag, sourcePath] = match
  const css = await readFile(resolveBuiltAsset(sourcePath), "utf8")
  html = html.replace(tag, `<style>${css}</style>`)
}

html = html.replace("</body>", `${scripts.join("\n")}\n  </body>`)
html = html.replace(/[ \t]+$/gm, "")

await writeFile(path.join(distDir, "ui.html"), html)
await rm(tempUiDir, { force: true, recursive: true })

function resolveBuiltAsset(sourcePath) {
  return path.join(tempUiDir, sourcePath.replace(/^\//, ""))
}
