import { Client } from "@modelcontextprotocol/client"
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio"
import { resolve } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

const packageRoot = resolve(import.meta.dirname, "..")
const workflowNames = [
  "claude_design_to_figma",
  "figma_to_web_app",
  "web_app_to_figma",
  "claude_design_to_web_app",
  "theme_sync",
  "audit_figma_design",
  "maintain_design_system",
] as const

describe("Preskok Design MCP over stdio", () => {
  let client: Client
  let transport: StdioClientTransport

  beforeEach(async () => {
    client = new Client({ name: "preskok-design-mcp-test", version: "1.0.0" })
    transport = new StdioClientTransport({
      command: resolve(packageRoot, "node_modules/.bin/tsx"),
      args: [resolve(packageRoot, "src/cli.ts")],
      cwd: packageRoot,
      stderr: "pipe",
    })
    await client.connect(transport)
  })

  afterEach(async () => {
    await client.close()
  })

  it("advertises the complete workflow surface", async () => {
    const [{ tools }, { resources }, { resourceTemplates }, { prompts }] =
      await Promise.all([
        client.listTools(),
        client.listResources(),
        client.listResourceTemplates(),
        client.listPrompts(),
      ])

    expect(tools.map(({ name }) => name)).toEqual([
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
    ])
    expect(resources.map(({ uri }) => uri)).toEqual([
      "preskok://catalog/status",
      "preskok://catalog/components",
      "preskok://catalog/tokens",
      "preskok://figma/source",
      "preskok://workflows",
    ])
    expect(resourceTemplates.map(({ uriTemplate }) => uriTemplate)).toEqual([
      "preskok://components/{name}",
      "preskok://workflows/{name}",
    ])
    expect(prompts).toHaveLength(7)
  })

  it("discovers and resolves the real Button contract", async () => {
    const search = await client.callTool({
      name: "search_preskok",
      arguments: { query: "primary account action", limit: 5 },
    })
    const searchData = search.structuredContent as {
      results: Array<{ name: string }>
    }
    expect(searchData.results.map(({ name }) => name)).toContain("button")

    const component = await client.callTool({
      name: "get_preskok_component",
      arguments: { identifier: "button" },
    })
    const componentData = component.structuredContent as {
      component: {
        registryName: string
        figma: { assets: Array<{ componentKey: string }> }
      }
    }
    expect(componentData.component.registryName).toBe("@preskok/button")
    expect(componentData.component.figma.assets).toContainEqual(
      expect.objectContaining({
        componentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
      })
    )
  })

  it("reads catalog and workflow resources", async () => {
    const status = await client.readResource({
      uri: "preskok://catalog/status",
    })
    expect(readJsonResource(status.contents[0])).toMatchObject({
      components: { total: 96 },
    })

    const component = await client.readResource({
      uri: "preskok://components/button",
    })
    expect(readJsonResource(component.contents[0])).toMatchObject({
      name: "button",
      registryName: "@preskok/button",
    })

    const workflow = await client.readResource({
      uri: "preskok://workflows/figma_to_web_app",
    })
    expect(readJsonResource(workflow.contents[0])).toMatchObject({
      name: "figma_to_web_app",
    })
  })

  it("validates artifacts and creates implementation-ready handoffs", async () => {
    const invalid = await client.callTool({
      name: "validate_preskok_artifact",
      arguments: {
        target: "figma",
        components: [{ codeName: "button", detached: true }],
        tokens: [{ hardcodedValue: "#ff0000" }],
      },
    })
    expect(invalid.structuredContent).toMatchObject({
      validation: {
        valid: false,
        summary: { errors: 1, warnings: 1 },
      },
    })

    const handoff = await client.callTool({
      name: "create_preskok_handoff",
      arguments: {
        direction: "figma_to_code",
        components: [
          {
            figmaComponentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
            properties: { variant: "default" },
          },
        ],
      },
    })
    expect(handoff.structuredContent).toMatchObject({
      handoff: {
        ready: true,
        installCommands: ["pnpm dlx shadcn@latest add @preskok/button"],
        components: [{ codeName: "button" }],
      },
    })
  })

  it("plans and proves a Figma-to-code workflow over stdio", async () => {
    const planned = await client.callTool({
      name: "plan_preskok_design",
      arguments: {
        intent: "Primary account action",
        figmaStrategy: "published",
        theme: { style: "Default", mode: "Light" },
        requirements: [{ codeName: "button" }],
      },
    })
    if (!planned.structuredContent) {
      throw new Error(JSON.stringify(planned))
    }
    const plan = (
      planned.structuredContent as {
        plan: {
          source: {
            libraryKey: string
            collections: {
              style: { key: string }
              colorMode: { key: string }
            }
          }
          requirements: Array<{
            assetName: string
            componentKey: string
          }>
        }
      }
    ).plan
    const requirement = plan.requirements[0]
    if (!requirement) {
      throw new Error("Expected button plan requirement")
    }

    const finalized = await client.callTool({
      name: "finalize_preskok_design",
      arguments: {
        plan,
        evidence: {
          fileKey: "stdio-proof-file",
          rootNodeId: "800:1",
          enabledLibraryKeys: [plan.source.libraryKey],
          instances: [
            {
              nodeId: "800:2",
              name: "Primary action",
              assetName: requirement.assetName,
              componentKey: requirement.componentKey,
              remote: true,
              detached: false,
              properties: { Intent: "primary" },
            },
          ],
          manualNodes: [],
          localComponents: [],
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
                nodeId: "800:1",
                name: "Stdio proof root",
                type: "FRAME",
                width: 320,
                height: 80,
                layoutMode: "HORIZONTAL",
                primaryAxisSizingMode: "AUTO",
                counterAxisSizingMode: "AUTO",
                clipsContent: false,
                children: [
                  {
                    nodeId: "800:2",
                    name: "Primary action",
                    type: "INSTANCE",
                    x: 0,
                    y: 0,
                    width: 120,
                    height: 40,
                    visible: true,
                    layoutPositioning: "AUTO",
                  },
                ],
              },
            ],
          },
        },
      },
    })

    expect(finalized.structuredContent).toMatchObject({
      finalization: {
        ready: true,
        coverage: { requiredInstances: 1, satisfiedInstances: 1 },
        handoff: {
          installCommands: ["pnpm dlx shadcn@latest add @preskok/button"],
        },
      },
    })
  })

  it("returns failed finalization for a forged plan over stdio", async () => {
    const planned = await client.callTool({
      name: "plan_preskok_design",
      arguments: {
        intent: "Primary account action",
        figmaStrategy: "published",
        theme: { style: "Default", mode: "Light" },
        requirements: [{ codeName: "button" }],
      },
    })
    const plan = (
      planned.structuredContent as {
        plan: { contractDigest: string }
      }
    ).plan
    plan.contractDigest = "0".repeat(64)

    const finalized = await client.callTool({
      name: "finalize_preskok_design",
      arguments: {
        plan,
        evidence: {
          fileKey: "forged-stdio-file",
          rootNodeId: "forged-stdio-root",
          enabledLibraryKeys: [],
          instances: [],
          manualNodes: [],
          localComponents: [],
          modes: [],
          hardcodedValues: [],
        },
      },
    })

    expect(finalized.structuredContent).toMatchObject({
      finalization: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "plan_contract_mismatch" }),
        ]),
        handoff: null,
      },
    })
  })

  it("accepts every advertised handoff direction over stdio", async () => {
    const directions = [
      "figma_to_code",
      "code_to_figma",
      "claude_design_to_figma",
      "claude_design_to_code",
    ] as const

    for (const direction of directions) {
      const result = await client.callTool({
        name: "create_preskok_handoff",
        arguments: { direction, components: [{ codeName: "button" }] },
      })
      expect(result.structuredContent).toMatchObject({
        handoff: { direction, ready: true },
      })
    }
  })

  it("executes every workflow prompt through the protocol", async () => {
    for (const name of workflowNames) {
      const prompt = await client.getPrompt({
        name,
        arguments: {
          target: "Account settings screen",
          figmaUrl: "https://www.figma.com/design/file-key/name?node-id=1-2",
          sourceUrl: "http://127.0.0.1:4173",
          notes: "Use only linked Preskok controls and verify the result.",
        },
      })
      const content = prompt.messages[0]?.content
      expect(content).toMatchObject({ type: "text" })
      if (content?.type !== "text") {
        throw new Error(`Expected a text prompt for ${name}`)
      }
      expect(content.text).toContain("Preskok MCP")
      expect(content.text).toContain("Verification gates:")
      expect(content.text).toContain("Account settings screen")

      const workflow = await client.callTool({
        name: "get_preskok_workflow",
        arguments: { name },
      })
      expect(workflow.structuredContent).toMatchObject({
        workflow: {
          name,
          steps: expect.any(Array),
          verification: expect.any(Array),
        },
      })
    }
  })
})

function readJsonResource(
  content:
    | { uri: string; text: string }
    | { uri: string; blob: string }
    | undefined
) {
  if (!content || !("text" in content)) {
    throw new Error("Expected a JSON text resource")
  }
  return JSON.parse(content.text) as unknown
}
