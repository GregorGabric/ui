import { Client } from "@modelcontextprotocol/client"
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio"
import { execFile, spawn } from "node:child_process"
import { promises as fs } from "node:fs"
import { createServer } from "node:net"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const packageRoot = path.resolve(import.meta.dirname, "..")
const keep = process.argv.includes("--keep")
const outputDirectoryArgument = readArgument("--output")
const temporaryRoot = outputDirectoryArgument
  ? path.resolve(outputDirectoryArgument)
  : await fs.mkdtemp(path.join(tmpdir(), "preskok-consumer-"))

try {
  await fs.mkdir(path.join(temporaryRoot, "src"), { recursive: true })
  const handoff = await getHandoff()
  assertHandoff(handoff)
  await writeFixture(handoff)
  await run("pnpm", ["install"], temporaryRoot)
  await installRegistryItems(handoff)
  await assertInstalledFiles(handoff)
  await run("pnpm", ["typecheck"], temporaryRoot)
  await run("pnpm", ["build"], temporaryRoot)
  await assertProductionBundle()
  const runtime = await verifyBrowserRuntime()

  process.stdout.write(
    `${JSON.stringify(
      {
        status: "passed",
        directory: temporaryRoot,
        handoffReady: handoff.ready,
        components: handoff.components.map(({ codeName }) => codeName),
        installs: ["@preskok/default", ...handoff.installCommands],
        verification: [
          "MCP stdio plan and finalization",
          "public registry installation",
          "installed file targets",
          "consumer TypeScript",
          "Vite production build",
          "production bundle content",
          "production preview hashed assets",
          "desktop and mobile Chrome runtime",
        ],
        runtime,
      },
      null,
      2
    )}\n`
  )
} finally {
  if (!keep && !outputDirectoryArgument) {
    await fs.rm(temporaryRoot, { recursive: true, force: true })
  }
}

type ConsumerHandoff = {
  ready: boolean
  installCommands: Array<string>
  imports: Array<{ source: string; symbols: Array<string> }>
  components: Array<{
    codeName: string
    registryName: string
    importPath: string
    figmaStatus: string
    figmaAssets: Array<{ componentKey: string }>
  }>
  validation: { valid: boolean; summary: { errors: number; warnings: number } }
}

async function getHandoff() {
  const client = new Client({
    name: "preskok-consumer-verifier",
    version: "1.0.0",
  })
  const transport = new StdioClientTransport({
    command: path.join(packageRoot, "node_modules/.bin/tsx"),
    args: [path.join(packageRoot, "src/cli.ts")],
    cwd: packageRoot,
    stderr: "pipe",
  })
  await client.connect(transport)
  try {
    const planned = await client.callTool({
      name: "plan_preskok_design",
      arguments: {
        intent: "Verified account settings consumer",
        figmaStrategy: "published",
        theme: { style: "Default", mode: "Light" },
        requirements: [
          { id: "settings-card", codeName: "card", assetName: "Card" },
          {
            id: "status-badge",
            parentRequirementId: "settings-card",
            codeName: "badge",
          },
          {
            id: "email-field",
            parentRequirementId: "settings-card",
            codeName: "text-field",
          },
          {
            id: "email-label",
            parentRequirementId: "settings-card",
            codeName: "field",
            assetName: "Field Label",
          },
          {
            id: "email-input",
            parentRequirementId: "settings-card",
            codeName: "input",
            assetName: "Input",
          },
          {
            id: "email-description",
            parentRequirementId: "settings-card",
            codeName: "field",
            assetName: "Field Description",
          },
          {
            id: "updates-switch",
            parentRequirementId: "settings-card",
            codeName: "switch",
            assetName: "Switch",
          },
          {
            id: "save-action",
            parentRequirementId: "settings-card",
            codeName: "button",
            assetName: "Button",
          },
        ],
      },
    })
    const plannedContent = planned.structuredContent as
      | { plan?: DesignPlanContract }
      | undefined
    const plan = plannedContent?.plan
    if (!plan?.readyToBuild) {
      throw new Error(
        `Preskok MCP returned no ready plan: ${JSON.stringify(planned)}`
      )
    }
    const cardNodeId = "settings-card:0"
    const instances = plan.requirements.flatMap((requirement) =>
      Array.from({ length: requirement.minimumInstances }, (_, index) => ({
        nodeId: `${requirement.id}:${index}`,
        requirementId: requirement.id,
        name: `${requirement.assetName} ${index + 1}`,
        assetName: requirement.assetName,
        componentKey: requirement.componentKey,
        ancestorNodeIds: requirement.parentRequirementId ? [cardNodeId] : [],
        remote: true,
        detached: false,
        properties: {},
      }))
    )
    const card = instances.find(({ nodeId }) => nodeId === cardNodeId)
    if (!card) {
      throw new Error("Expected the planned settings card instance")
    }
    const contentInstances = instances.filter(
      ({ nodeId }) => nodeId !== cardNodeId
    )
    const finalized = await client.callTool({
      name: "finalize_preskok_design",
      arguments: {
        plan,
        evidence: {
          fileKey: "verified-consumer-figma",
          rootNodeId: "900:1",
          enabledLibraryKeys: [plan.source.libraryKey],
          instances,
          manualNodes: [],
          localComponents: [
            {
              nodeId: "900:2",
              name: "Account settings product content",
              instanceCount: 1,
              reason:
                "Product-specific composition used inside the Preskok Card content slot.",
            },
          ],
          modes: [
            {
              collectionName: "Style",
              collectionKey: plan.source.collections.style.key,
              mode: "Default",
              explicit: true,
              remote: true,
            },
            {
              collectionName: "Mode",
              collectionKey: plan.source.collections.colorMode.key,
              mode: "Light",
              explicit: true,
              remote: true,
            },
          ],
          hardcodedValues: [],
          layout: {
            containers: [
              {
                nodeId: "900:1",
                name: "Verified consumer root",
                type: "FRAME",
                width: 1000,
                height: 800,
                layoutMode: "VERTICAL",
                primaryAxisSizingMode: "FIXED",
                counterAxisSizingMode: "FIXED",
                clipsContent: false,
                children: [
                  {
                    nodeId: card.nodeId,
                    name: card.name,
                    type: "INSTANCE",
                    x: 0,
                    y: 0,
                    width: 640,
                    height: 600,
                    visible: true,
                    layoutPositioning: "AUTO",
                  },
                ],
              },
              {
                nodeId: card.nodeId,
                name: card.name,
                type: "INSTANCE",
                width: 640,
                height: 600,
                layoutMode: "VERTICAL",
                primaryAxisSizingMode: "AUTO",
                counterAxisSizingMode: "FIXED",
                clipsContent: false,
                children: contentInstances.map((instance, index) => ({
                  nodeId: instance.nodeId,
                  name: instance.name,
                  type: "INSTANCE",
                  x: 24,
                  y: 24 + index * 56,
                  width: 592,
                  height: 40,
                  visible: true,
                  layoutPositioning: "AUTO",
                })),
              },
              {
                nodeId: "900:2",
                name: "Account settings product content",
                type: "COMPONENT",
                width: 592,
                height: 400,
                layoutMode: "VERTICAL",
                primaryAxisSizingMode: "AUTO",
                counterAxisSizingMode: "FIXED",
                clipsContent: false,
                children: [],
              },
            ],
          },
        },
        notes: [
          "Representative account settings workflow generated and proven by the MCP verification script.",
        ],
      },
    })
    const structured = finalized.structuredContent as
      | { handoff?: ConsumerHandoff }
      | { finalization?: { ready: boolean; handoff: ConsumerHandoff | null } }
      | undefined
    const finalization =
      structured && "finalization" in structured
        ? structured.finalization
        : undefined
    if (!finalization?.ready || !finalization.handoff) {
      throw new Error(
        `Preskok MCP returned no finalized handoff: ${JSON.stringify(finalized)}`
      )
    }
    return finalization.handoff
  } finally {
    await client.close()
  }
}

type DesignPlanContract = {
  readyToBuild: boolean
  source: {
    libraryKey: string
    collections: {
      style: { key: string }
      colorMode: { key: string }
    }
  }
  requirements: Array<{
    id: string
    assetName: string
    componentKey: string
    minimumInstances: number
    parentRequirementId?: string
  }>
}

function assertHandoff(handoff: ConsumerHandoff) {
  const expected = [
    "badge",
    "button",
    "card",
    "field",
    "input",
    "switch",
    "text-field",
  ]
  const names = handoff.components.map(({ codeName }) => codeName).sort()
  if (!handoff.ready || !handoff.validation.valid) {
    throw new Error(
      `Handoff is not ready: ${JSON.stringify(handoff.validation)}`
    )
  }
  if (JSON.stringify(names) !== JSON.stringify(expected)) {
    throw new Error(`Unexpected handoff components: ${names.join(", ")}`)
  }
  for (const component of handoff.components) {
    if (component.figmaStatus === "missing") {
      throw new Error(`${component.codeName} has no Figma mapping`)
    }
    if (component.figmaAssets.length === 0) {
      throw new Error(`${component.codeName} has no published Figma asset`)
    }
  }
}

async function writeFixture(handoff: ConsumerHandoff) {
  const files: Record<string, string> = {
    "package.json": `${JSON.stringify(
      {
        name: "preskok-mcp-consumer-verification",
        version: "0.0.0",
        private: true,
        type: "module",
        scripts: {
          build: "vite build",
          typecheck: "tsc --noEmit",
        },
        dependencies: {
          react: "19.2.7",
          "react-dom": "19.2.7",
        },
        devDependencies: {
          "@tailwindcss/vite": "4.3.3",
          "@types/react": "19.2.17",
          "@types/react-dom": "19.2.3",
          "@types/node": "26.0.0",
          "@vitejs/plugin-react": "6.0.5",
          "playwright-core": "1.62.1",
          tailwindcss: "4.3.3",
          typescript: "6.0.3",
          vite: "8.2.1",
        },
      },
      null,
      2
    )}\n`,
    "components.json": `${JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "preskok",
        rsc: false,
        tsx: true,
        tailwind: {
          config: "",
          css: "src/index.css",
          baseColor: "neutral",
          cssVariables: true,
          prefix: "",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
        registries: {
          "@preskok": "https://ui-three-mu.vercel.app/r/{name}.json",
        },
        iconLibrary: "lucide",
      },
      null,
      2
    )}\n`,
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>Preskok account settings</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    "tsconfig.json": `${JSON.stringify(
      {
        compilerOptions: {
          target: "ES2024",
          useDefineForClassFields: true,
          lib: ["ES2024", "DOM", "DOM.Iterable"],
          allowJs: false,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          module: "ESNext",
          moduleResolution: "Bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          paths: { "@/*": ["./src/*"] },
          types: ["node", "vite/client"],
        },
        include: ["src", "vite.config.ts"],
      },
      null,
      2
    )}\n`,
    "vite.config.ts": `import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
})
`,
    "src/index.css": `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; min-height: 100vh; }
`,
    "src/vite-env.d.ts": `/// <reference types="vite/client" />\n`,
    "src/main.tsx": renderApp(handoff),
    "runtime-check.mjs": `import { chromium } from "playwright-core"

const [url, desktopScreenshot, mobileScreenshot, executablePath] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text())
})
page.on("pageerror", (error) => errors.push(error.message))

await page.goto(url, { waitUntil: "networkidle" })
await page.getByText("Account settings", { exact: true }).waitFor()
const email = page.getByRole("textbox", { name: "Design handoff email" })
const save = page.getByRole("button", { name: "Save changes" })
const updates = page.getByRole("switch", { name: "Product and library updates" })
await email.fill("invalid")
if (!(await save.isDisabled())) throw new Error("Save should be disabled for invalid email")
await email.fill("designer@preskok.si")
if (await save.isDisabled()) throw new Error("Save should be enabled for a valid email")
await page.getByText("Product and library updates", { exact: true }).click()
if (await updates.isChecked()) throw new Error("Switch did not toggle off")
await updates.focus()
await page.keyboard.press("Space")
if (!(await updates.isChecked())) throw new Error("Switch did not toggle on with Space")
await save.click()
await page.getByText("Saved", { exact: true }).waitFor()
await page.screenshot({ path: desktopScreenshot, fullPage: true })
const desktop = await page.evaluate(() => ({
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  activeText: document.activeElement?.textContent || document.activeElement?.getAttribute("aria-label"),
}))

await page.setViewportSize({ width: 390, height: 844 })
await page.reload({ waitUntil: "networkidle" })
await page.getByText("Account settings", { exact: true }).waitFor()
await page.screenshot({ path: mobileScreenshot, fullPage: true })
const mobile = await page.evaluate(() => ({
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  bodyWidth: document.body.getBoundingClientRect().width,
}))

await browser.close()
if (desktop.scrollWidth > desktop.width) throw new Error("Desktop layout overflows horizontally")
if (mobile.scrollWidth > mobile.width) throw new Error("Mobile layout overflows horizontally")
if (errors.length > 0) throw new Error(\`Browser errors: \${errors.join(" | ")}\`)
process.stdout.write(JSON.stringify({ desktop, mobile, errors }))
`,
  }

  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      const target = path.join(temporaryRoot, relativePath)
      await fs.mkdir(path.dirname(target), { recursive: true })
      await fs.writeFile(target, contents)
    })
  )
}

function renderApp(handoff: ConsumerHandoff) {
  const imports = new Map(
    handoff.imports.map(({ source, symbols }) => [source, symbols])
  )
  assertImport(imports, "@/components/ui/preskok-ui/badge", "Badge")
  assertImport(imports, "@/components/ui/preskok-ui/button", "Button")
  assertImport(imports, "@/components/ui/preskok-ui/card", "Card")
  assertImport(imports, "@/components/ui/preskok-ui/field", "Description")
  assertImport(imports, "@/components/ui/preskok-ui/input", "Input")
  assertImport(imports, "@/components/ui/preskok-ui/switch", "Switch")
  assertImport(imports, "@/components/ui/preskok-ui/text-field", "TextField")

  return `import { useState } from "react"
import { createRoot } from "react-dom/client"

import { Badge } from "@/components/ui/preskok-ui/badge"
import { Button } from "@/components/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/preskok-ui/card"
import {
  Description,
  Label,
} from "@/components/ui/preskok-ui/field"
import { Input } from "@/components/ui/preskok-ui/input"
import { Switch } from "@/components/ui/preskok-ui/switch"
import { TextField } from "@/components/ui/preskok-ui/text-field"

import "./index.css"

function AccountSettings() {
  const [email, setEmail] = useState("designer@preskok.si")
  const [updates, setUpdates] = useState(true)
  const [saved, setSaved] = useState(false)

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-8">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Account settings</CardTitle>
              <CardDescription>
                Keep project notifications and handoff details current.
              </CardDescription>
            </div>
            <Badge intent={saved ? "success" : "secondary"}>
              {saved ? "Saved" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextField
            value={email}
            onChange={(value) => {
              setEmail(value)
              setSaved(false)
            }}
          >
            <Label>Design handoff email</Label>
            <Input placeholder="you@example.com" />
            <Description>Used for Figma and implementation reviews.</Description>
          </TextField>
          <Switch
            isSelected={updates}
            onChange={(selected) => {
              setUpdates(selected)
              setSaved(false)
            }}
          >
            Product and library updates
          </Switch>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            intent="primary"
            onPress={() => setSaved(true)}
            isDisabled={!email.includes("@")}
          >
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(<AccountSettings />)
`
}

function assertImport(
  imports: Map<string, Array<string>>,
  source: string,
  symbol: string
) {
  if (!imports.get(source)?.includes(symbol)) {
    throw new Error(`Handoff is missing ${symbol} from ${source}`)
  }
}

async function assertInstalledFiles(handoff: ConsumerHandoff) {
  for (const component of handoff.components) {
    const target = path.join(
      temporaryRoot,
      "src/components/ui/preskok-ui",
      `${component.codeName}.tsx`
    )
    await fs.access(target)
  }
}

async function installRegistryItems(handoff: ConsumerHandoff) {
  const items = [
    "@preskok/default",
    ...handoff.components.map(({ registryName }) => registryName),
  ]
  for (let attempt = 0; attempt < 3; attempt++) {
    const arguments_ = ["dlx", "shadcn@latest", "add", ...items, "--yes"]
    if (attempt > 0) {
      arguments_.push("--overwrite")
    }
    try {
      await run("pnpm", arguments_, temporaryRoot)
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const retryable =
        /Connect Timeout|ECONNRESET|ETIMEDOUT|fetch failed/i.test(message)
      if (!retryable || attempt === 2) {
        throw error
      }
    }
  }
}

async function assertProductionBundle() {
  const assetsDirectory = path.join(temporaryRoot, "dist/assets")
  const files = await fs.readdir(assetsDirectory)
  const javascript = files.filter((file) => file.endsWith(".js"))
  if (javascript.length === 0) {
    throw new Error("Vite produced no JavaScript bundle")
  }
  const bundles = await Promise.all(
    javascript.map((file) =>
      fs.readFile(path.join(assetsDirectory, file), "utf8")
    )
  )
  if (!bundles.some((bundle) => bundle.includes("Account settings"))) {
    throw new Error("Production bundle is missing the representative screen")
  }
}

async function verifyBrowserRuntime() {
  const executablePath = await findChromeExecutable()
  const port = await findAvailablePort()
  const url = `http://127.0.0.1:${port}`
  const desktopScreenshot = path.join(temporaryRoot, "runtime-desktop.png")
  const mobileScreenshot = path.join(temporaryRoot, "runtime-mobile.png")
  const server = spawn(
    "pnpm",
    [
      "exec",
      "vite",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    {
      cwd: temporaryRoot,
      env: { ...process.env, CI: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    }
  )
  let logs = ""
  server.stdout.on("data", (chunk) => {
    logs += String(chunk)
  })
  server.stderr.on("data", (chunk) => {
    logs += String(chunk)
  })

  try {
    await waitForUrl(url, server, () => logs)
    await assertProductionPreview(url)
    const result = await run(
      "node",
      [
        path.join(temporaryRoot, "runtime-check.mjs"),
        url,
        desktopScreenshot,
        mobileScreenshot,
        executablePath,
      ],
      temporaryRoot
    )
    const retainScreenshots = keep || Boolean(outputDirectoryArgument)
    return {
      ...JSON.parse(result.stdout),
      screenshots: {
        captured: ["desktop", "mobile"],
        retained: retainScreenshots,
        ...(retainScreenshots
          ? { desktopPath: desktopScreenshot, mobilePath: mobileScreenshot }
          : {}),
      },
    } as Record<string, unknown>
  } finally {
    server.kill("SIGTERM")
    await new Promise<void>((resolve) => {
      if (server.exitCode !== null) {
        resolve()
        return
      }
      server.once("exit", () => resolve())
    })
  }
}

async function assertProductionPreview(url: string) {
  const response = await fetch(url)
  const html = await response.text()
  const hashedAsset = /\/assets\/[^"']+-[A-Za-z0-9_-]{8,}\.(?:css|js)/
  if (!hashedAsset.test(html)) {
    throw new Error(
      "Vite preview HTML does not reference a hashed /assets/ build artifact"
    )
  }
}

async function findChromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter((candidate): candidate is string => Boolean(candidate))
  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {
      continue
    }
  }
  throw new Error(
    "Chrome is required for consumer runtime verification. Set CHROME_PATH to its executable."
  )
}

async function findAvailablePort() {
  const server = createServer()
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", () => resolve())
  })
  const address = server.address()
  if (!address || typeof address === "string") {
    server.close()
    throw new Error("Could not allocate a runtime verification port")
  }
  const port = address.port
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
  return port
}

async function waitForUrl(
  url: string,
  process_: ReturnType<typeof spawn>,
  readLogs: () => string
) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (process_.exitCode !== null) {
      throw new Error(`Vite exited before runtime verification:\n${readLogs()}`)
    }
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`Timed out waiting for ${url}:\n${readLogs()}`)
}

async function run(command: string, arguments_: Array<string>, cwd: string) {
  try {
    return await execFileAsync(command, arguments_, {
      cwd,
      env: { ...process.env, CI: "1" },
      maxBuffer: 10 * 1024 * 1024,
      timeout: 180_000,
    })
  } catch (error) {
    if (error instanceof Error) {
      const output = commandOutput(error)
      throw new Error(
        `${command} ${arguments_.join(" ")} failed in ${cwd}:\n${error.message}${output}`,
        { cause: error }
      )
    }
    throw error
  }
}

function commandOutput(error: Error) {
  const candidate = error as Error & { stdout?: unknown; stderr?: unknown }
  const stdout = candidate.stdout
    ? `\nstdout:\n${String(candidate.stdout)}`
    : ""
  const stderr = candidate.stderr
    ? `\nstderr:\n${String(candidate.stderr)}`
    : ""
  return `${stdout}${stderr}`
}

function readArgument(name: string) {
  const index = process.argv.indexOf(name)
  if (index === -1) {
    return undefined
  }
  const value = process.argv[index + 1]
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value after ${name}`)
  }
  return value
}
