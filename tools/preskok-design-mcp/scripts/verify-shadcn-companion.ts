import { Client } from "@modelcontextprotocol/client"
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const packageRoot = resolve(import.meta.dirname, "..")
const workspaceRoot = resolve(packageRoot, "../..")
const config = JSON.parse(
  await readFile(resolve(workspaceRoot, ".mcp.json"), "utf8")
) as {
  mcpServers: Record<string, { command: string; args: Array<string> }>
}
const preskokConfig = getServerConfig("preskok-design-system")
const shadcnConfig = getServerConfig("shadcn")
let preskokToolCount = 0

const preskokClient = await connect("preskok-project-config", preskokConfig)
try {
  const { tools } = await preskokClient.listTools()
  const names = tools.map(({ name }) => name)
  const expectedNames = [
    "search_preskok",
    "get_preskok_component",
    "get_preskok_tokens",
    "get_preskok_status",
    "plan_preskok_design",
    "prepare_preskok_figma_inspection",
    "ingest_preskok_figma_inspection",
    "finalize_preskok_design",
    "validate_preskok_artifact",
    "create_preskok_handoff",
    "list_preskok_workflows",
    "get_preskok_workflow",
  ]
  if (JSON.stringify(names) !== JSON.stringify(expectedNames)) {
    throw new Error(
      `The project Preskok MCP tool surface differs: ${JSON.stringify(names)}`
    )
  }
  preskokToolCount = tools.length
  const status = await preskokClient.callTool({
    name: "get_preskok_status",
    arguments: {},
  })
  if (!JSON.stringify(status.structuredContent).includes('"total":96')) {
    throw new Error("The project Preskok MCP did not load all 96 components")
  }
} finally {
  await preskokClient.close()
}

const client = await connect("preskok-shadcn-companion-verifier", shadcnConfig)
try {
  const { tools } = await client.listTools()
  const names = tools.map(({ name }) => name)
  const required = [
    "get_project_registries",
    "list_items_in_registries",
    "search_items_in_registries",
    "view_items_in_registries",
    "get_item_examples_from_registries",
  ]
  for (const name of required) {
    if (!names.includes(name)) {
      throw new Error(`The shadcn MCP is missing ${name}`)
    }
  }

  const registries = await client.callTool({
    name: "get_project_registries",
    arguments: {},
  })
  if (registries.isError) {
    throw new Error(
      "The shadcn MCP could not read apps/preskok/components.json"
    )
  }
  const output = JSON.stringify(
    registries.structuredContent ?? registries.content
  )
  if (!output.includes("@preskok")) {
    throw new Error(
      `The shadcn MCP did not expose the @preskok registry: ${output}`
    )
  }

  console.log(
    JSON.stringify({
      transport: "stdio",
      projectConfig: ".mcp.json",
      preskok: {
        tools: preskokToolCount,
        components: 96,
      },
      companion: "shadcn",
      tools: tools.length,
      registry: "@preskok",
      workingDirectory: "apps/preskok",
    })
  )
} finally {
  await client.close()
}

function getServerConfig(name: string) {
  const server = config.mcpServers[name]
  if (!server?.command || !Array.isArray(server.args)) {
    throw new Error(`.mcp.json is missing a valid ${name} stdio server`)
  }
  return server
}

async function connect(
  name: string,
  server: { command: string; args: Array<string> }
) {
  const client = new Client({ name, version: "1.0.0" })
  await client.connect(
    new StdioClientTransport({
      command: server.command,
      args: server.args,
      cwd: workspaceRoot,
      stderr: "pipe",
    })
  )
  return client
}
