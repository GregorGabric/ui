import { Client } from "@modelcontextprotocol/client"
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio"
import { resolve } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import type {
  FigmaInspectionInput,
  FigmaInspectionNode,
} from "../src/design-system.js"
import liveDashboardInspection from "./fixtures/live-dashboard-inspection.json" with { type: "json" }

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
      "prepare_preskok_figma_inspection",
      "ingest_preskok_figma_inspection",
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

  it("discovers every dashboard component from one Figma inspection and returns local source guidance", async () => {
    const prepared = await client.callTool({
      name: "prepare_preskok_figma_inspection",
      arguments: { rootNodeId: "3:13" },
    })
    expect(prepared.structuredContent).toMatchObject({
      inspection: {
        rootNodeId: "3:13",
        figmaTool: "use_figma",
        nextTool: "ingest_preskok_figma_inspection",
      },
    })
    const code = (
      prepared.structuredContent as { inspection: { code: string } }
    ).inspection.code
    expect(code).toContain('getNodeByIdAsync("3:13")')
    expect(code).toContain("getMainComponentAsync")
    expect(code).toContain("componentProperties")
    expect(code).toContain("explicitVariableModes")
    expect(code).not.toContain("@preskok/")

    const ingested = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: createDashboardInspectionInput(),
    })
    const analysis = (
      ingested.structuredContent as {
        analysis: {
          ready: boolean
          discovery: {
            components: Array<{ codeName: string; instanceCount: number }>
            unmappedInstances: Array<unknown>
          }
          handoff: {
            installCommands: Array<string>
            inspectFiles: Array<string>
            components: Array<{
              codeName: string
              installedSourcePath: string
              properties?: Record<string, string | number | boolean>
              figmaInstances: Array<{
                nodeId: string
                properties: Record<string, string | number | boolean>
              }>
            }>
          } | null
        }
      }
    ).analysis

    expect(analysis.ready).toBe(true)
    expect(analysis.discovery.unmappedInstances).toEqual([])
    expect(analysis.discovery.components).toEqual([
      { codeName: "area-chart", instanceCount: 1 },
      { codeName: "avatar", instanceCount: 1 },
      { codeName: "badge", instanceCount: 2 },
      { codeName: "button", instanceCount: 1 },
      { codeName: "card", instanceCount: 3 },
      { codeName: "sidebar", instanceCount: 1 },
      { codeName: "table", instanceCount: 1 },
    ])
    expect(analysis.handoff?.installCommands).toEqual([
      "pnpm dlx shadcn@latest add @preskok/area-chart @preskok/avatar @preskok/badge @preskok/button @preskok/card @preskok/sidebar @preskok/table",
    ])
    expect(analysis.handoff?.inspectFiles).toContain(
      "@/components/ui/preskok-ui/sidebar.tsx"
    )
    expect(analysis.handoff?.components).toContainEqual(
      expect.objectContaining({
        codeName: "badge",
        installedSourcePath: "@/components/ui/preskok-ui/badge.tsx",
        figmaInstances: expect.arrayContaining([
          expect.objectContaining({
            nodeId: "6:767",
            properties: expect.objectContaining({
              Intent: "success",
              isCircle: "false",
            }),
          }),
          expect.objectContaining({
            nodeId: "6:769",
            properties: expect.objectContaining({ Intent: "warning" }),
          }),
        ]),
      })
    )
    expect(
      analysis.handoff?.components.find(({ codeName }) => codeName === "badge")
    ).not.toHaveProperty("properties")
  })

  it("proves the real Cursor dashboard inspection without hand-built evidence", async () => {
    expect(JSON.stringify(liveDashboardInspection).length).toBeLessThan(20_000)

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: {
        figmaStrategy: "published",
        theme: { style: "Default", mode: "Light" },
        inspection: liveDashboardInspection,
        libraries: { libraries_added_to_file: [] },
      },
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: true,
        discovery: {
          components: [
            { codeName: "area-chart", instanceCount: 1 },
            { codeName: "avatar", instanceCount: 1 },
            { codeName: "badge", instanceCount: 2 },
            { codeName: "button", instanceCount: 1 },
            { codeName: "card", instanceCount: 3 },
            { codeName: "sidebar", instanceCount: 1 },
            { codeName: "table", instanceCount: 1 },
          ],
          unmappedInstances: [],
        },
        issues: [
          expect.objectContaining({
            severity: "warning",
            code: "library_not_enabled",
          }),
        ],
        handoff: {
          installCommands: [
            "pnpm dlx shadcn@latest add @preskok/area-chart @preskok/avatar @preskok/badge @preskok/button @preskok/card @preskok/sidebar @preskok/table",
          ],
        },
      },
    })
  })

  it("withholds the handoff when a visible top-level Figma instance is unmapped", async () => {
    const input = createDashboardInspectionInput()
    input.inspection.nodes.push({
      nodeId: "7:1",
      parentId: "3:13",
      ancestorNodeIds: ["3:13"],
      name: "Foreign date picker",
      type: "INSTANCE",
      visible: true,
      x: 40,
      y: 940,
      width: 240,
      height: 40,
      layoutMode: "HORIZONTAL",
      layoutPositioning: "AUTO",
      clipsContent: false,
      insideInstance: false,
      explicitVariableModes: {},
      boundVariableFields: [],
      semanticFields: [],
      instance: {
        assetName: "Foreign date picker",
        componentKey: "not-preskok",
        remote: true,
        properties: {},
      },
    })

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        discovery: {
          unmappedInstances: [
            {
              nodeId: "7:1",
              name: "Foreign date picker",
              componentKey: "not-preskok",
            },
          ],
        },
        issues: [expect.objectContaining({ code: "unmapped_figma_instance" })],
        handoff: null,
      },
    })
  })

  it("withholds the handoff when a visible instance is missing its identity payload", async () => {
    const input = createDashboardInspectionInput()
    const incompleteInstance = input.inspection.nodes.find(
      ({ type }) => type === "INSTANCE"
    ) as { instance?: unknown } | undefined
    if (!incompleteInstance) {
      throw new Error("Expected a dashboard instance fixture")
    }
    delete incompleteInstance.instance

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "figma_inspection_invalid" }),
        ]),
        handoff: null,
      },
    })
  })

  it("does not count an instance inside a hidden ancestor as visible", async () => {
    const input = createCopiedButtonInspectionInput()
    const button = input.inspection.nodes.find(
      ({ nodeId }) => nodeId === "20:2"
    )
    if (!button) {
      throw new Error("Expected a copied Button fixture")
    }
    button.parentId = "20:hidden"
    input.inspection.nodes.splice(1, 0, {
      nodeId: "20:hidden",
      parentId: "20:1",
      name: "Hidden state",
      type: "FRAME",
      visible: false,
      x: 0,
      y: 0,
      width: 200,
      height: 80,
      layoutMode: "VERTICAL",
      layoutPositioning: "AUTO",
    })

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        discovery: { components: [] },
        plan: { readyToBuild: false },
        handoff: null,
      },
    })
  })

  it("rejects an inspection whose declared root has a parent", async () => {
    const input = createCopiedButtonInspectionInput()
    const root = input.inspection.nodes.find(
      ({ nodeId }) => nodeId === input.inspection.rootNodeId
    )
    if (!root) {
      throw new Error("Expected an inspection root fixture")
    }
    root.parentId = "outside-root"

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "figma_inspection_invalid" }),
        ]),
        handoff: null,
      },
    })
  })

  it("rejects nodes disconnected from the declared inspection root", async () => {
    const input = createCopiedButtonInspectionInput()
    const button = input.inspection.nodes.find(
      ({ nodeId }) => nodeId === "20:2"
    )
    if (!button) {
      throw new Error("Expected a copied Button fixture")
    }
    input.inspection.nodes.push({
      ...button,
      nodeId: "20:disconnected",
      parentId: null,
      name: "Disconnected action",
    })

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "figma_inspection_invalid" }),
        ]),
        handoff: null,
      },
    })
  })

  it("rejects duplicate Figma node IDs before generating a handoff", async () => {
    const input = createCopiedButtonInspectionInput()
    input.inspection.nodes.push({
      nodeId: "20:2",
      parentId: "20:1",
      name: "Duplicate node",
      type: "FRAME",
      visible: true,
      x: 0,
      y: 0,
      width: 120,
      height: 40,
      layoutMode: "NONE",
      layoutPositioning: "AUTO",
    })

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "figma_inspection_invalid" }),
        ]),
        handoff: null,
      },
    })
  })

  it("rejects component identity data attached to a non-instance node", async () => {
    const input = createDashboardInspectionInput()
    const button = input.inspection.nodes.find(
      ({ type }) => type === "INSTANCE"
    )
    if (!button) {
      throw new Error("Expected a dashboard instance fixture")
    }
    button.type = "FRAME"

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "figma_inspection_invalid" }),
        ]),
        handoff: null,
      },
    })
  })

  it("rejects descendants that could not come from the prepared inspection script", async () => {
    const input = createCopiedButtonInspectionInput()
    input.inspection.nodes.push({
      nodeId: "20:3",
      parentId: "20:2",
      name: "Impossible instance child",
      type: "TEXT",
      visible: true,
      x: 0,
      y: 0,
      width: 80,
      height: 20,
      layoutMode: null,
      layoutPositioning: "AUTO",
    })

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "figma_inspection_invalid" }),
        ]),
        handoff: null,
      },
    })
  })

  it("does not trust insideInstance to hide unbound design values", async () => {
    const input = createCopiedButtonInspectionInput()
    input.inspection.nodes.push({
      nodeId: "20:3",
      parentId: "20:1",
      name: "Hardcoded surface",
      type: "FRAME",
      visible: true,
      x: 0,
      y: 64,
      width: 120,
      height: 40,
      layoutMode: "NONE",
      layoutPositioning: "AUTO",
      insideInstance: true,
      semanticFields: [
        { property: "fills", value: "#ff0000", tokenBound: false },
      ],
    })

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "hardcoded_value" }),
        ]),
        handoff: null,
      },
    })
  })

  it("rejects a visible subtree that overrides the root Preskok theme mode", async () => {
    const input = createCopiedButtonInspectionInput()
    const button = input.inspection.nodes.find(
      ({ nodeId }) => nodeId === "20:2"
    )
    const modeCollection = input.inspection.collections.find(
      ({ name }) => name === "Mode"
    )
    if (!button || !modeCollection) {
      throw new Error("Expected copied Button and Mode fixtures")
    }
    button.explicitVariableModes = {
      "VariableCollectionId:mode": "mode-dark",
    }
    modeCollection.modes.push({ modeId: "mode-dark", name: "Dark" })

    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: input,
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: false,
        issues: expect.arrayContaining([
          expect.objectContaining({ code: "theme_mode_mismatch" }),
        ]),
        handoff: null,
      },
    })
  })

  it("recognizes an unchanged component from an official copied Figma source without keys", async () => {
    const result = await client.callTool({
      name: "ingest_preskok_figma_inspection",
      arguments: createCopiedButtonInspectionInput(),
    })

    expect(result.structuredContent).toMatchObject({
      analysis: {
        ready: true,
        discovery: {
          components: [{ codeName: "button", instanceCount: 1 }],
          unmappedInstances: [],
        },
        handoff: {
          installCommands: ["pnpm dlx shadcn@latest add @preskok/button"],
          components: [
            expect.objectContaining({
              codeName: "button",
              figmaInstances: [expect.objectContaining({ nodeId: "20:2" })],
            }),
          ],
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

function createDashboardInspectionInput(): FigmaInspectionInput {
  const rootNodeId = "3:13"
  const componentInstances: Array<{
    nodeId: string
    name: string
    componentKey: string
    assetName: string
    properties: Record<string, string | number | boolean>
  }> = [
    {
      nodeId: "3:1519",
      name: "Sidebar · Expanded",
      componentKey: "12e9017e37fa1e221ded95d589f1b9954a0056cc",
      assetName: "Sidebar",
      properties: { Layout: "Expanded", Intent: "Default", Side: "Left" },
    },
    {
      nodeId: "4:1794",
      name: "Export report",
      componentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
      assetName: "Button",
      properties: { Intent: "primary", Size: "md", State: "Default" },
    },
    {
      nodeId: "4:1812",
      name: "Current user",
      componentKey: "4d7d84f58f992c1c93aaabe47971d21898248a19",
      assetName: "Avatar",
      properties: { Size: "md", Shape: "Round", Content: "Initials" },
    },
    ...["4:1832", "4:1900", "4:1939"].map((nodeId, index) => ({
      nodeId,
      name: `Metric ${index + 1}`,
      componentKey: "3638039a78b1caaa933c29f5fae59882d3967a06",
      assetName: "Card",
      properties: { "Show content#3682:5": false },
    })),
    {
      nodeId: "5:277",
      name: "Revenue area chart",
      componentKey: "aecf5f15ecf73fc8543f3b042a253bf814298f29",
      assetName: "Area Chart",
      properties: { Type: "Default" },
    },
    {
      nodeId: "6:767",
      name: "Status · Paid",
      componentKey: "1c2302f26930ef3ead56664151e580d1408f2c23",
      assetName: "Badge",
      properties: { Intent: "success", isCircle: "false", Icon: "None" },
    },
    {
      nodeId: "6:769",
      name: "Status · Pending",
      componentKey: "1c2302f26930ef3ead56664151e580d1408f2c23",
      assetName: "Badge",
      properties: { Intent: "warning", isCircle: "false", Icon: "None" },
    },
    {
      nodeId: "6:771",
      name: "Recent orders table",
      componentKey: "379dad46d55a58d258e4a9242aa275345375eeb7",
      assetName: "Table",
      properties: { Variant: "Selection" },
    },
  ]

  return {
    figmaStrategy: "published" as const,
    theme: { style: "Default", mode: "Light" as const },
    libraries: {
      libraries_added_to_file: [
        {
          name: "Preskok UI",
          libraryKey:
            "lk-46e05046e297a108a9b995aad38fbb0c3b67d59a51e08a1d07250d90ca40d06ac57264cc7314adb8eec854aa2c2d9129e74e174394f8e5a83d51e9baebd9cc95",
        },
      ],
    },
    inspection: {
      schemaVersion: 1,
      fileKey: "a4aqXNsJwfMc6HRIJrBooB",
      rootNodeId,
      nodes: [
        {
          nodeId: rootNodeId,
          parentId: null,
          ancestorNodeIds: [],
          name: "Preskok Analytics Dashboard",
          type: "FRAME",
          visible: true,
          x: 0,
          y: 0,
          width: 1440,
          height: 1024,
          layoutMode: "VERTICAL",
          layoutPositioning: "AUTO",
          clipsContent: false,
          insideInstance: false,
          explicitVariableModes: {
            "VariableCollectionId:style": "style-default",
            "VariableCollectionId:mode": "mode-light",
          },
          boundVariableFields: ["fills"],
          semanticFields: [
            { property: "fills", value: "paint", tokenBound: true },
          ],
        },
        ...componentInstances.map((instance, index) => ({
          nodeId: instance.nodeId,
          parentId: rootNodeId,
          ancestorNodeIds: [rootNodeId],
          name: instance.name,
          type: "INSTANCE",
          visible: true,
          x: 32,
          y: 32 + index * 80,
          width: 320,
          height: 64,
          layoutMode: "HORIZONTAL" as const,
          layoutPositioning: "AUTO" as const,
          clipsContent: false,
          insideInstance: false,
          explicitVariableModes: {},
          boundVariableFields: [],
          semanticFields: [],
          instance: {
            assetName: instance.assetName,
            componentKey: instance.componentKey,
            remote: true,
            properties: instance.properties,
          },
        })),
      ],
      collections: [
        {
          id: "VariableCollectionId:style",
          key: "1a314502c07cb84211e881b604fbac213193fecd",
          name: "Style",
          remote: true,
          modes: [{ modeId: "style-default", name: "Default" }],
        },
        {
          id: "VariableCollectionId:mode",
          key: "edff7b77cb35e2b23575001e27610e38c18ed6ba",
          name: "Mode",
          remote: true,
          modes: [{ modeId: "mode-light", name: "Light" }],
        },
      ],
    },
  }
}

function createCopiedButtonInspectionInput(): FigmaInspectionInput {
  const propertyDefinitions: NonNullable<
    NonNullable<FigmaInspectionNode["instance"]>["contract"]
  >["propertyDefinitions"] = [
    { name: "Label#3201:0", type: "TEXT", variantOptions: [] },
    {
      name: "Show leading icon#3201:433",
      type: "BOOLEAN",
      variantOptions: [],
    },
    {
      name: "Leading icon#3201:866",
      type: "INSTANCE_SWAP",
      variantOptions: [],
    },
    {
      name: "Show trailing icon#3201:1299",
      type: "BOOLEAN",
      variantOptions: [],
    },
    {
      name: "Trailing icon#3201:1732",
      type: "INSTANCE_SWAP",
      variantOptions: [],
    },
    {
      name: "Icon#3201:2165",
      type: "INSTANCE_SWAP",
      variantOptions: [],
    },
    {
      name: "Shape",
      type: "VARIANT",
      variantOptions: ["Text", "Square", "Circle"],
    },
    {
      name: "Intent",
      type: "VARIANT",
      variantOptions: [
        "primary",
        "secondary",
        "warning",
        "danger",
        "outline",
        "plain",
      ],
    },
    {
      name: "Size",
      type: "VARIANT",
      variantOptions: ["xs", "sm", "md", "lg"],
    },
    {
      name: "State",
      type: "VARIANT",
      variantOptions: [
        "Default",
        "Hover",
        "Focus",
        "Pressed",
        "Disabled",
        "Pending",
      ],
    },
  ]
  return {
    figmaStrategy: "copied" as const,
    theme: { style: "Default", mode: "Light" as const },
    inspection: {
      schemaVersion: 1,
      fileKey: "official-preskok-copy",
      rootNodeId: "20:1",
      nodes: [
        {
          nodeId: "20:1",
          parentId: null,
          name: "Copied design root",
          type: "FRAME",
          visible: true,
          x: 0,
          y: 0,
          width: 400,
          height: 120,
          layoutMode: "VERTICAL",
          layoutPositioning: "AUTO",
          explicitVariableModes: {
            "VariableCollectionId:style": "style-default",
            "VariableCollectionId:mode": "mode-light",
          },
        },
        {
          nodeId: "20:2",
          parentId: "20:1",
          name: "Primary action",
          type: "INSTANCE",
          visible: true,
          x: 16,
          y: 16,
          width: 120,
          height: 38,
          layoutMode: "HORIZONTAL",
          layoutPositioning: "AUTO",
          instance: {
            assetName: "Button",
            componentKey: null,
            remote: false,
            properties: {
              Shape: "Text",
              Intent: "primary",
              Size: "md",
              State: "Default",
            },
            contract: {
              assetType: "component_set",
              name: "Button",
              propertyDefinitions,
            },
          },
        },
      ],
      collections: [
        {
          id: "VariableCollectionId:style",
          key: "1a314502c07cb84211e881b604fbac213193fecd",
          name: "Style",
          remote: false,
          modes: [{ modeId: "style-default", name: "Default" }],
        },
        {
          id: "VariableCollectionId:mode",
          key: "edff7b77cb35e2b23575001e27610e38c18ed6ba",
          name: "Mode",
          remote: false,
          modes: [{ modeId: "mode-light", name: "Light" }],
        },
      ],
    },
  }
}
