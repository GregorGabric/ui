import { Client } from "@modelcontextprotocol/client"
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio"
import { resolve } from "node:path"

const packageRoot = resolve(import.meta.dirname, "..")
const client = new Client({
  name: "preskok-design-mcp-built-verifier",
  version: "1.0.0",
})
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [resolve(packageRoot, "dist/cli.js")],
  cwd: packageRoot,
  stderr: "pipe",
})

try {
  await client.connect(transport)
  const { tools } = await client.listTools()
  const status = await client.callTool({
    name: "get_preskok_status",
    arguments: {},
  })
  const structured = status.structuredContent as
    | { status?: { components?: { total?: number } } }
    | undefined

  const expectedTools = [
    "search_preskok",
    "get_preskok_component",
    "get_preskok_tokens",
    "get_preskok_status",
    "plan_preskok_design",
    "finalize_preskok_design",
    "validate_preskok_artifact",
    "create_preskok_handoff",
    "list_preskok_workflows",
    "get_preskok_workflow",
  ]
  const advertisedTools = tools.map(({ name }) => name)
  if (JSON.stringify(advertisedTools) !== JSON.stringify(expectedTools)) {
    throw new Error(
      `Built MCP tool surface differs: ${JSON.stringify(advertisedTools)}`
    )
  }
  if (structured?.status?.components?.total !== 96) {
    throw new Error("The built MCP did not load all 96 Preskok components")
  }

  console.log(
    JSON.stringify({
      transport: "stdio",
      entrypoint: "dist/cli.js",
      tools: tools.length,
      components: structured.status.components.total,
    })
  )
} finally {
  await client.close()
}
