import { Client } from "@modelcontextprotocol/client"
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio"
import { execFile, spawn } from "node:child_process"
import { promises as fs } from "node:fs"
import { createServer } from "node:net"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

import liveDashboardInspection from "../test/fixtures/live-dashboard-inspection.json" with { type: "json" }

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
          "MCP stdio automatic Figma inspection ingestion",
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
  inspectFiles: Array<string>
  imports: Array<{ source: string; symbols: Array<string> }>
  components: Array<{
    codeName: string
    registryName: string
    importPath: string
    installedSourcePath: string
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
    const ingested = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: {
        figmaStrategy: "published",
        theme: { style: "Default", mode: "Light" },
        inspection: liveDashboardInspection,
        libraries: { libraries_added_to_file: [] },
        notes: [
          "Verified from the checked return value of the exact official Figma MCP inspection script against the Cursor dashboard.",
        ],
      },
    })
    const structured = ingested.structuredContent as
      | { analysis?: { ready: boolean; handoff: ConsumerHandoff | null } }
      | undefined
    const analysis = structured?.analysis
    if (!analysis?.ready || !analysis.handoff) {
      throw new Error(
        `Preskok MCP returned no inspection handoff: ${JSON.stringify(ingested)}`
      )
    }
    return analysis.handoff
  } finally {
    await client.close()
  }
}

function assertHandoff(handoff: ConsumerHandoff) {
  const expected = [
    "area-chart",
    "avatar",
    "badge",
    "button",
    "card",
    "sidebar",
    "table",
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
    if (!handoff.inspectFiles.includes(component.installedSourcePath)) {
      throw new Error(
        `${component.codeName} is missing its installed-source inspection path`
      )
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
    <title>Preskok analytics dashboard</title>
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
await page.getByText("Analytics overview", { exact: true }).waitFor()
const exportReport = page.getByRole("button", { name: "Export report" })
await exportReport.focus()
await page.keyboard.press("Enter")
await page.getByText("Export queued", { exact: true }).waitFor()
const table = page.getByRole("grid", { name: "Recent orders" })
if ((await table.getByRole("row").count()) !== 5) {
  throw new Error("Recent orders table did not render its header and four rows")
}
await page.screenshot({ path: desktopScreenshot, fullPage: true })
const desktop = await page.evaluate(() => ({
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  activeText: document.activeElement?.textContent || document.activeElement?.getAttribute("aria-label"),
}))

await page.setViewportSize({ width: 390, height: 844 })
await page.reload({ waitUntil: "networkidle" })
await page.getByText("Analytics overview", { exact: true }).waitFor()
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
  assertImport(imports, "@/components/ui/preskok-ui/area-chart", "AreaChart")
  assertImport(imports, "@/components/ui/preskok-ui/avatar", "Avatar")
  assertImport(imports, "@/components/ui/preskok-ui/badge", "Badge")
  assertImport(imports, "@/components/ui/preskok-ui/button", "Button")
  assertImport(imports, "@/components/ui/preskok-ui/card", "Card")
  assertImport(imports, "@/components/ui/preskok-ui/sidebar", "Sidebar")
  assertImport(imports, "@/components/ui/preskok-ui/table", "Table")

  return `import { useState } from "react"
import { createRoot } from "react-dom/client"

import { AreaChart } from "@/components/ui/preskok-ui/area-chart"
import { Avatar } from "@/components/ui/preskok-ui/avatar"
import { Badge } from "@/components/ui/preskok-ui/badge"
import { Button } from "@/components/ui/preskok-ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/preskok-ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarLabel,
  SidebarNav,
  SidebarProvider,
  SidebarSection,
  SidebarTrigger,
} from "@/components/ui/preskok-ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/preskok-ui/table"

import "./index.css"

const metrics = [
  ["Monthly revenue", "€48,240 · +12.4%"],
  ["New orders", "1,284 · +8.2%"],
  ["Active customers", "8,492 · +5.1%"],
] as const

const revenue = [
  { day: "1", revenue: 28 },
  { day: "7", revenue: 36 },
  { day: "13", revenue: 41 },
  { day: "19", revenue: 74 },
  { day: "25", revenue: 66 },
  { day: "30", revenue: 76 },
]

const orders = [
  { id: "acme", account: "Acme Labs", owner: "Maya Chen", value: "$84,000", stage: "Renewal" },
  { id: "northstar", account: "Northstar Health", owner: "Noah Reed", value: "$128,000", stage: "Security review" },
  { id: "riverbank", account: "Riverbank Studio", owner: "Iris Patel", value: "$42,500", stage: "Negotiation" },
  { id: "vertex", account: "Vertex Freight", owner: "Sam Ortiz", value: "$96,200", stage: "Proposal" },
]

function AnalyticsDashboard() {
  const [exportQueued, setExportQueued] = useState(false)

  return (
    <SidebarProvider className="min-h-svh">
      <Sidebar>
        <SidebarHeader>
          <SidebarLabel className="font-semibold">Preskok UI</SidebarLabel>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSection label="Workspace">
            <SidebarItem href="#overview" isCurrent>
              <SidebarLabel>Overview</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#orders">
              <SidebarLabel>Orders</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="#customers">
              <SidebarLabel>Customers</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2">
            <Avatar alt="Maya Chen" initials="MC" isSquare size="sm" />
            <SidebarLabel>Maya Chen</SidebarLabel>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SidebarNav className="border-sidebar-border border-b px-4 md:hidden">
          <SidebarTrigger />
        </SidebarNav>
        <main className="flex flex-1 flex-col gap-5 overflow-auto p-6 lg:p-10">
          <header id="overview" className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Analytics overview</h1>
              <p className="text-muted-foreground">Monitor revenue, orders, and customer activity.</p>
            </div>
            <div className="flex items-center gap-3">
              {exportQueued ? <Badge intent="success">Export queued</Badge> : null}
              <Button intent="primary" size="md" onPress={() => setExportQueued(true)}>
                Export report
              </Button>
              <Avatar alt="Current user" initials="GG" size="md" />
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map(([title, description]) => (
              <Card key={title}>
                <CardHeader title={title} description={description} />
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue trend</CardTitle>
              <CardDescription>Gross revenue over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart
                className="h-52 min-h-52"
                config={{ revenue: { label: "Gross revenue", color: "var(--chart-1)" } }}
                data={revenue}
                dataKey="day"
                fillType="gradient"
                hideGridLines
                hideXAxis
                hideYAxis
                legend={false}
                lineType="monotone"
                valueFormatter={(value) => "€" + value + "k"}
              />
            </CardContent>
          </Card>

          <Card id="orders">
            <CardHeader>
              <CardTitle>Recent orders</CardTitle>
              <CardDescription>Latest activity across the storefront</CardDescription>
              <CardAction className="flex gap-2">
                <Badge intent="success" isCircle={false}>Paid</Badge>
                <Badge intent="warning" isCircle={false}>Pending</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table aria-label="Recent orders" selectionMode="multiple">
                <TableHeader>
                  <TableColumn isRowHeader>Account</TableColumn>
                  <TableColumn>Owner</TableColumn>
                  <TableColumn>Value</TableColumn>
                  <TableColumn>Stage</TableColumn>
                </TableHeader>
                <TableBody items={orders}>
                  {(order) => (
                    <TableRow id={order.id}>
                      <TableCell>{order.account}</TableCell>
                      <TableCell>{order.owner}</TableCell>
                      <TableCell>{order.value}</TableCell>
                      <TableCell>{order.stage}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

createRoot(document.getElementById("root")!).render(<AnalyticsDashboard />)
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
    const aliasPath = component.installedSourcePath.replace(/^@\//, "src/")
    const target = path.join(temporaryRoot, aliasPath)
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
  if (!bundles.some((bundle) => bundle.includes("Analytics overview"))) {
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
