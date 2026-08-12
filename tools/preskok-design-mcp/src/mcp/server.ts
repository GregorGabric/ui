import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server"
import { z } from "zod"

import {
  loadPreskokDesignSystem,
  type PreskokDesignSystem,
} from "../design-system.js"

const artifactComponentSchema = z.object({
  codeName: z.string().optional(),
  figmaComponentKey: z.string().optional(),
  figmaNodeId: z.string().optional(),
  figmaNodeName: z.string().optional(),
  figmaAssetName: z.string().optional(),
  properties: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  detached: z.boolean().optional(),
})

const artifactTokenSchema = z.object({
  name: z.string().optional(),
  hardcodedValue: z.string().optional(),
})

const designThemeSchema = z.object({
  style: z.string().min(1),
  mode: z.enum(["Light", "Dark"]),
})

const requestedDesignRequirementSchema = z.object({
  id: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  codeName: z.string().min(1),
  assetName: z.string().min(1).optional(),
  minimumInstances: z.number().int().min(1).optional(),
  parentRequirementId: z.string().min(1).optional(),
  groupId: z.string().min(1).optional(),
  groupLayout: z.enum(["HORIZONTAL", "VERTICAL"]).optional(),
})

const designRequirementSchema = z.object({
  id: z.string(),
  role: z.string(),
  codeName: z.string(),
  figmaCodeName: z.string(),
  assetName: z.string(),
  representation: z.enum(["native", "fallback"]),
  componentKey: z.string(),
  contractFingerprint: z.string(),
  minimumInstances: z.number().int().min(1),
  parentRequirementId: z.string().optional(),
  groupId: z.string().optional(),
  groupLayout: z.enum(["HORIZONTAL", "VERTICAL"]).optional(),
})

const designPlanSchema = z.object({
  contractDigest: z.string(),
  readyToBuild: z.boolean(),
  intent: z.string(),
  figmaStrategy: z.enum(["published", "copied"]),
  theme: designThemeSchema,
  source: z.object({
    url: z.string(),
    fileKey: z.string(),
    libraryKey: z.string(),
    publishedAccess: z.object({
      preferred: z.literal("enabled_library"),
      directImportByKeySupported: z.literal(true),
      assetsPanelRequiresEnabledLibrary: z.literal(true),
      proofRequirement: z.string(),
    }),
    collections: z.object({
      style: z.object({
        name: z.literal("Style"),
        key: z.string(),
        mode: z.string(),
        availableModes: z.array(z.string()),
      }),
      colorMode: z.object({
        name: z.literal("Mode"),
        key: z.string(),
        mode: z.enum(["Light", "Dark"]),
        availableModes: z.array(z.enum(["Light", "Dark"])),
      }),
    }),
  }),
  codeComponents: z.array(z.string()),
  requirements: z.array(designRequirementSchema),
  issues: z.array(
    z.object({
      severity: z.enum(["error", "warning"]),
      code: z.string(),
      message: z.string(),
    })
  ),
})

const designEvidenceSchema = z.object({
  fileKey: z.string().min(1),
  rootNodeId: z.string().min(1),
  enabledLibraryKeys: z.array(z.string()),
  instances: z.array(
    z.object({
      nodeId: z.string().min(1),
      name: z.string().min(1),
      assetName: z.string().min(1),
      requirementId: z.string().min(1).optional(),
      componentKey: z.string().optional(),
      contractFingerprint: z.string().optional(),
      ancestorNodeIds: z.array(z.string()).optional(),
      remote: z.boolean(),
      detached: z.boolean(),
      properties: z.record(
        z.string(),
        z.union([z.string(), z.number(), z.boolean()])
      ),
    })
  ),
  manualNodes: z.array(
    z.object({
      nodeId: z.string().min(1),
      name: z.string().min(1),
      type: z.string().min(1),
      claimedAssetName: z.string().optional(),
      tokenBound: z.boolean(),
      reason: z.string().optional(),
    })
  ),
  localComponents: z.array(
    z.object({
      nodeId: z.string().min(1),
      name: z.string().min(1),
      instanceCount: z.number().int().min(0),
      reason: z.string().optional(),
    })
  ),
  modes: z.array(
    z.object({
      collectionName: z.string().min(1),
      collectionKey: z.string().optional(),
      mode: z.string().min(1),
      explicit: z.boolean(),
      remote: z.boolean(),
    })
  ),
  hardcodedValues: z.array(
    z.object({
      nodeId: z.string().min(1),
      property: z.string().min(1),
      value: z.string(),
    })
  ),
  layout: z
    .object({
      containers: z.array(
        z.object({
          nodeId: z.string().min(1),
          name: z.string().min(1),
          type: z.string().min(1),
          width: z.number().finite().nonnegative(),
          height: z.number().finite().nonnegative(),
          layoutMode: z.enum(["NONE", "HORIZONTAL", "VERTICAL", "GRID"]),
          primaryAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional(),
          counterAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional(),
          clipsContent: z.boolean(),
          children: z.array(
            z.object({
              nodeId: z.string().min(1),
              name: z.string().min(1),
              type: z.string().min(1),
              x: z.number().finite(),
              y: z.number().finite(),
              width: z.number().finite().nonnegative(),
              height: z.number().finite().nonnegative(),
              visible: z.boolean(),
              layoutPositioning: z.enum(["AUTO", "ABSOLUTE"]),
            })
          ),
        })
      ),
    })
    .optional(),
})

const figmaInspectionNodeSchema = z.object({
  nodeId: z.string().min(1),
  parentId: z.string().min(1).nullable(),
  ancestorNodeIds: z.array(z.string()).optional(),
  name: z.string(),
  type: z.string().min(1),
  visible: z.boolean(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  layoutMode: z.enum(["NONE", "HORIZONTAL", "VERTICAL", "GRID"]).nullable(),
  primaryAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional(),
  counterAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional(),
  layoutPositioning: z.enum(["AUTO", "ABSOLUTE"]),
  clipsContent: z.boolean().optional(),
  insideInstance: z.boolean().optional(),
  explicitVariableModes: z.record(z.string(), z.string()).optional(),
  boundVariableFields: z.array(z.string()).optional(),
  semanticFields: z
    .array(
      z.object({
        property: z.string().min(1),
        value: z.string(),
        tokenBound: z.boolean(),
      })
    )
    .optional(),
  instance: z
    .object({
      assetName: z.string().min(1),
      componentKey: z.string().nullable(),
      remote: z.boolean(),
      properties: z.record(
        z.string(),
        z.union([z.string(), z.number(), z.boolean()])
      ),
      contract: z
        .object({
          assetType: z.enum(["component", "component_set"]),
          name: z.string().min(1),
          propertyDefinitions: z.array(
            z.object({
              name: z.string().min(1),
              type: z.enum(["BOOLEAN", "INSTANCE_SWAP", "TEXT", "VARIANT"]),
              variantOptions: z.array(z.string()),
            })
          ),
        })
        .optional(),
    })
    .optional(),
})

const figmaInspectionSchema = z.object({
  schemaVersion: z.literal(1),
  fileKey: z.string().min(1),
  rootNodeId: z.string().min(1),
  nodes: z.array(figmaInspectionNodeSchema).min(1),
  collections: z.array(
    z.object({
      id: z.string().min(1),
      key: z.string(),
      name: z.string().min(1),
      remote: z.boolean(),
      modes: z.array(
        z.object({ modeId: z.string().min(1), name: z.string().min(1) })
      ),
    })
  ),
})

const figmaLibrariesSchema = z.object({
  libraries_added_to_file: z.array(
    z.object({ name: z.string().min(1), libraryKey: z.string().min(1) })
  ),
})

const workflowNames = [
  "claude_design_to_figma",
  "figma_to_web_app",
  "web_app_to_figma",
  "claude_design_to_web_app",
  "theme_sync",
  "audit_figma_design",
  "maintain_design_system",
] as const

const workflowNameSchema = z.enum(workflowNames)

const promptArgumentsSchema = z.object({
  target: z.string().optional(),
  figmaUrl: z.string().optional(),
  sourceUrl: z.string().optional(),
  notes: z.string().optional(),
})

type JsonRecord = Record<string, unknown>

export async function createPreskokMcpServer(
  designSystem?: PreskokDesignSystem
) {
  const system = designSystem ?? (await loadPreskokDesignSystem())
  const server = new McpServer(
    {
      name: "preskok-design-system",
      version: "0.3.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
      instructions:
        "Use this server as the canonical Preskok component identity, token, planning, proof, and workflow contract. For an existing Figma design, call prepare_preskok_figma_inspection, run its code unchanged with the official Figma MCP use_figma tool, then pass that unchanged result and get_libraries output to ingest_preskok_figma_inspection. For a new Figma build, call plan_preskok_design before writing and finalize the authenticated plan in the same process. A code handoff is valid only when proof is ready. Install its registry items atomically and inspect its copied source files; raw Figma properties describe design intent and are not React prop mappings or overrides.",
    }
  )

  server.registerTool(
    "search_preskok",
    {
      title: "Search Preskok",
      description:
        "Find Preskok components by exact name, product intent, use case, or documentation text.",
      inputSchema: z.object({
        query: z.string().min(1),
        limit: z.number().int().min(1).max(50).optional(),
      }),
      annotations: readOnlyAnnotations(),
    },
    async (input) => toolResult({ results: system.search(input) })
  )

  server.registerTool(
    "get_preskok_component",
    {
      title: "Get Preskok component",
      description:
        "Resolve a registry slug, @preskok registry name, or published Figma component key to its complete code and design contract.",
      inputSchema: z.object({ identifier: z.string().min(1) }),
      annotations: readOnlyAnnotations(),
    },
    async ({ identifier }) => {
      try {
        return toolResult({ component: system.getComponent(identifier) })
      } catch (error) {
        return toolError(error)
      }
    }
  )

  server.registerTool(
    "get_preskok_tokens",
    {
      title: "Get Preskok tokens",
      description:
        "Read generated Preskok semantic tokens, optionally filtered by name, mode, or component usage.",
      inputSchema: z.object({
        names: z.array(z.string()).optional(),
        mode: z.enum(["light", "dark"]).optional(),
        usedBy: z.string().optional(),
      }),
      annotations: readOnlyAnnotations(),
    },
    async (input) => toolResult({ tokens: system.getTokens(input) })
  )

  server.registerTool(
    "get_preskok_status",
    {
      title: "Get Preskok status",
      description:
        "Report catalog integrity, component/documentation/example counts, token counts, Figma coverage, and actionable gaps.",
      inputSchema: z.object({}),
      annotations: readOnlyAnnotations(),
    },
    async () => toolResult({ status: system.getStatus() })
  )

  server.registerTool(
    "plan_preskok_design",
    {
      title: "Plan a Preskok design",
      description:
        "Create a server-authenticated ephemeral composition contract for the published-library or copied-file Figma strategy, including official source, modes, uniquely identified requirements, acyclic hierarchy, consistent groups, fallbacks, and code components. Finalize it with the same running MCP instance and request a fresh plan after restart.",
      inputSchema: z.object({
        intent: z.string().min(1),
        figmaStrategy: z.enum(["published", "copied"]),
        theme: designThemeSchema,
        requirements: z.array(requestedDesignRequirementSchema).optional(),
      }),
      annotations: readOnlyAnnotations(),
    },
    async (input) => toolResult({ plan: system.planDesign(input) })
  )

  server.registerTool(
    "prepare_preskok_figma_inspection",
    {
      title: "Prepare automatic Preskok Figma inspection",
      description:
        "Return one deterministic read-only script for the official Figma MCP use_figma tool. The script collects component identity, raw Figma properties, hierarchy, Auto Layout, explicit modes, and token bindings without changing components or requiring sidecar annotations.",
      inputSchema: z.object({ rootNodeId: z.string().min(1) }),
      annotations: readOnlyAnnotations(),
    },
    async (input) =>
      toolResult({ inspection: system.prepareFigmaInspection(input) })
  )

  server.registerTool(
    "ingest_preskok_figma_inspection",
    {
      title: "Ingest official Figma MCP inspection",
      description:
        "Accept the unchanged return value from the prepared official Figma MCP script plus the unchanged get_libraries result, automatically discover every visible top-level Preskok instance, build and prove the composition, and return one atomic install handoff with copied-source paths. The installed source remains the code API; raw Figma properties are preserved as design evidence, never converted through an override table. Unknown instances and incomplete proof fail closed.",
      inputSchema: z.object({
        figmaStrategy: z.enum(["published", "copied"]),
        theme: designThemeSchema,
        inspection: figmaInspectionSchema,
        libraries: figmaLibrariesSchema.optional(),
        notes: z.array(z.string()).optional(),
      }),
      annotations: readOnlyAnnotations(),
    },
    async (input) =>
      toolResult({ analysis: system.ingestFigmaInspection(input) })
  )

  server.registerTool(
    "finalize_preskok_design",
    {
      title: "Finalize a Preskok design",
      description:
        "Verify unique live normalized Figma evidence against an unchanged plan authenticated by this running MCP instance. A code handoff is returned only after exact requirement assignment and hierarchy, visible positive-sized required instances participating in Auto Layout, library/copy identity, bounds, overflow, clipping, grouped actions, properties, theme modes, tokens, and local deviations pass.",
      inputSchema: z.object({
        plan: designPlanSchema,
        evidence: designEvidenceSchema,
        notes: z.array(z.string()).optional(),
      }),
      annotations: readOnlyAnnotations(),
    },
    async (input) => toolResult({ finalization: system.finalizeDesign(input) })
  )

  server.registerTool(
    "validate_preskok_artifact",
    {
      title: "Validate Preskok artifact",
      description:
        "Validate normalized code or Figma evidence for unknown components, detaches, key mismatches, unsupported variants, and token drift.",
      inputSchema: z.object({
        target: z.enum(["figma", "code"]),
        components: z.array(artifactComponentSchema),
        tokens: z.array(artifactTokenSchema).optional(),
      }),
      annotations: readOnlyAnnotations(),
    },
    async (input) => toolResult({ validation: system.validateArtifact(input) })
  )

  server.registerTool(
    "create_preskok_handoff",
    {
      title: "Create Preskok handoff",
      description:
        "Create deterministic installs, imports, copied-source inspection paths, Figma identity evidence, tokens, docs, validation, and deviation notes for a supported translation direction.",
      inputSchema: z.object({
        direction: z.enum([
          "figma_to_code",
          "code_to_figma",
          "claude_design_to_figma",
          "claude_design_to_code",
        ]),
        components: z.array(artifactComponentSchema).min(1),
        tokenNames: z.array(z.string()).optional(),
        notes: z.array(z.string()).optional(),
      }),
      annotations: readOnlyAnnotations(),
    },
    async (input) => toolResult({ handoff: system.createHandoff(input) })
  )

  server.registerTool(
    "list_preskok_workflows",
    {
      title: "List Preskok workflows",
      description:
        "List the supported Claude Design, Figma, web application, theme, audit, and maintenance workflows.",
      inputSchema: z.object({}),
      annotations: readOnlyAnnotations(),
    },
    async () => toolResult({ workflows: system.listWorkflows() })
  )

  server.registerTool(
    "get_preskok_workflow",
    {
      title: "Get Preskok workflow",
      description:
        "Get an executable workflow with preconditions, tool ownership, outputs, verification gates, and honest limitations.",
      inputSchema: z.object({ name: workflowNameSchema }),
      annotations: readOnlyAnnotations(),
    },
    async ({ name }) => toolResult({ workflow: system.getWorkflow(name) })
  )

  registerResources(server, system)
  registerPrompts(server, system)

  return server
}

function registerResources(server: McpServer, system: PreskokDesignSystem) {
  const registerJsonResource = (
    name: string,
    uri: string,
    title: string,
    description: string,
    read: () => unknown
  ) => {
    server.registerResource(
      name,
      uri,
      {
        title,
        description,
        mimeType: "application/json",
      },
      async (requestedUri) => jsonResource(requestedUri, read())
    )
  }

  registerJsonResource(
    "catalog-status",
    "preskok://catalog/status",
    "Preskok catalog status",
    "Generated catalog integrity, counts, live Figma coverage, and gaps.",
    () => system.getStatus()
  )
  registerJsonResource(
    "catalog-components",
    "preskok://catalog/components",
    "Preskok component index",
    "Search-friendly summaries for every registry component.",
    () => system.listComponents()
  )
  registerJsonResource(
    "catalog-tokens",
    "preskok://catalog/tokens",
    "Preskok design tokens",
    "Every generated light and dark token with aliases and component usage.",
    () => system.getTokens()
  )
  registerJsonResource(
    "figma-source",
    "preskok://figma/source",
    "Official Preskok Figma source",
    "Checked official file, library, collection keys, and source versus published theme modes.",
    () => system.getFigmaSource()
  )
  registerJsonResource(
    "workflows",
    "preskok://workflows",
    "Preskok workflow index",
    "All supported translation, theme, audit, and maintenance workflows.",
    () => system.listWorkflows()
  )

  server.registerResource(
    "component",
    new ResourceTemplate("preskok://components/{name}", {
      list: undefined,
      complete: {
        name: (value) =>
          system
            .search({ query: value || "preskok", limit: 50 })
            .map(({ name }) => name),
      },
    }),
    {
      title: "Preskok component contract",
      description:
        "Complete generated contract for one Preskok registry component.",
      mimeType: "application/json",
    },
    async (uri, variables) => {
      const name = String(variables.name)
      return jsonResource(uri, system.getComponent(name))
    }
  )

  server.registerResource(
    "workflow",
    new ResourceTemplate("preskok://workflows/{name}", {
      list: undefined,
      complete: {
        name: (value) =>
          system
            .listWorkflows()
            .map(({ name }) => name)
            .filter((name) => name.startsWith(value)),
      },
    }),
    {
      title: "Preskok workflow",
      description:
        "Executable workflow specification including verification gates.",
      mimeType: "application/json",
    },
    async (uri, variables) =>
      jsonResource(uri, system.getWorkflow(String(variables.name)))
  )
}

function registerPrompts(server: McpServer, system: PreskokDesignSystem) {
  for (const workflowName of workflowNames) {
    const workflow = system.getWorkflow(workflowName)
    server.registerPrompt(
      workflowName,
      {
        title: workflow.title,
        description: workflow.goal,
        argsSchema: promptArgumentsSchema,
      },
      async (arguments_) => ({
        description: workflow.goal,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: renderWorkflowPrompt(workflowName, arguments_, system),
            },
          },
        ],
      })
    )
  }
}

function renderWorkflowPrompt(
  workflowName: (typeof workflowNames)[number],
  arguments_: z.infer<typeof promptArgumentsSchema>,
  system: PreskokDesignSystem
) {
  const workflow = system.getWorkflow(workflowName)
  const context = [
    arguments_.target && `Target: ${arguments_.target}`,
    arguments_.figmaUrl && `Figma: ${arguments_.figmaUrl}`,
    arguments_.sourceUrl && `Source: ${arguments_.sourceUrl}`,
    arguments_.notes && `Notes: ${arguments_.notes}`,
  ].filter((line): line is string => Boolean(line))
  const steps = workflow.steps
    .map(
      (step, index) =>
        `${index + 1}. [${step.owner}] ${step.action}\n   Tools: ${step.tools.join(", ")}\n   Output: ${step.output}`
    )
    .join("\n")
  const verification = workflow.verification
    .map((gate) => `- ${gate.action}\n  Pass only when: ${gate.passCondition}`)
    .join("\n")

  return [
    `Run the Preskok workflow: ${workflow.title}`,
    workflow.goal,
    ...context,
    "",
    "Use the Preskok MCP for canonical component identity, tokens, validation, and handoff data. Use the official Figma MCP for live Figma access. Install first and read the copied component source as the code API; do not guess keys, recreate mapped controls, or invent Figma-to-React prop overrides.",
    "",
    "Steps:",
    steps,
    "",
    "Verification gates:",
    verification,
    "",
    `Known limitations: ${workflow.limitations.join(" ")}`,
  ].join("\n")
}

function readOnlyAnnotations() {
  return {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  }
}

function toolResult(data: JsonRecord) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  }
}

function toolError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  }
}

function jsonResource(uri: URL, data: unknown) {
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(data, null, 2),
      },
    ],
  }
}
