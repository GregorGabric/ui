import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto"
import { promises as fs } from "node:fs"
import { z } from "zod"

import type { DesignToken, PreskokCatalog, PreskokComponent } from "./types.js"
import {
  getPreskokWorkflow,
  listPreskokWorkflows,
  type PreskokWorkflow,
} from "./workflows.js"

export type SearchResult = {
  kind: "component"
  name: string
  registryName: string
  description: string | null
  importPath: string
  documentationPath: string | null
  figmaStatus: PreskokComponent["figma"]["status"]
  score: number
}

export type PreskokStatus = {
  schemaVersion: number
  catalogDigest: string
  components: {
    total: number
    documented: number
    withExamples: number
  }
  tokens: {
    total: number
    colors: number
    dimensions: number
    fonts: number
  }
  figma: PreskokCatalog["figma"]["coverage"] & {
    checkedAt: string
    propertiesCheckedAt: string
    libraryName: string
    libraryKey: string
    contextFileKey: string
  }
  gaps: {
    missingDocumentation: Array<string>
    missingExamples: Array<string>
    partialFigma: Array<string>
    missingFigma: Array<string>
    notApplicableToFigma: Array<string>
  }
}

export type ArtifactComponent = {
  codeName?: string | undefined
  figmaComponentKey?: string | undefined
  figmaNodeId?: string | undefined
  figmaNodeName?: string | undefined
  figmaAssetName?: string | undefined
  properties?: Record<string, string | number | boolean> | undefined
  detached?: boolean | undefined
}

export type ArtifactToken = {
  name?: string | undefined
  hardcodedValue?: string | undefined
}

export type ValidationIssue = {
  severity: "error" | "warning"
  code:
    | "unknown_component"
    | "detached_instance"
    | "figma_key_mismatch"
    | "invalid_variant"
    | "invalid_property_type"
    | "missing_figma_mapping"
    | "partial_figma_mapping"
    | "hardcoded_value"
    | "unknown_token"
  message: string
  component: string | null
  path: string
  recommendation: string
}

export type ValidationResult = {
  valid: boolean
  issues: Array<ValidationIssue>
  resolvedComponents: Array<string>
  summary: {
    errors: number
    warnings: number
  }
}

export type HandoffInput = {
  direction:
    | "figma_to_code"
    | "code_to_figma"
    | "claude_design_to_figma"
    | "claude_design_to_code"
  components: Array<ArtifactComponent>
  tokenNames?: Array<string> | undefined
  notes?: Array<string> | undefined
}

export type FigmaStrategy = "published" | "copied"

export type DesignPlanInput = {
  intent: string
  figmaStrategy: FigmaStrategy
  theme: {
    style: string
    mode: "Light" | "Dark"
  }
  requirements?:
    | Array<{
        id?: string | undefined
        role?: string | undefined
        codeName: string
        assetName?: string | undefined
        minimumInstances?: number | undefined
        parentRequirementId?: string | undefined
        groupId?: string | undefined
        groupLayout?: "HORIZONTAL" | "VERTICAL" | undefined
      }>
    | undefined
}

export type DesignRequirement = {
  id: string
  role: string
  codeName: string
  figmaCodeName: string
  assetName: string
  representation: "native" | "fallback"
  componentKey: string
  contractFingerprint: string
  minimumInstances: number
  parentRequirementId?: string | undefined
  groupId?: string | undefined
  groupLayout?: "HORIZONTAL" | "VERTICAL" | undefined
}

export type DesignPlan = {
  contractDigest: string
  readyToBuild: boolean
  intent: string
  figmaStrategy: FigmaStrategy
  theme: DesignPlanInput["theme"]
  source: {
    url: string
    fileKey: string
    libraryKey: string
    publishedAccess: PreskokCatalog["figma"]["source"]["publishedAccess"]
    collections: {
      style: {
        name: "Style"
        key: string
        mode: string
        availableModes: Array<string>
      }
      colorMode: {
        name: "Mode"
        key: string
        mode: "Light" | "Dark"
        availableModes: Array<"Light" | "Dark">
      }
    }
  }
  codeComponents: Array<string>
  requirements: Array<DesignRequirement>
  issues: Array<{
    severity: "error" | "warning"
    code: string
    message: string
  }>
}

export type DesignEvidence = {
  fileKey: string
  rootNodeId: string
  enabledLibraryKeys: Array<string>
  instances: Array<{
    nodeId: string
    name: string
    assetName: string
    requirementId?: string | undefined
    componentKey?: string | undefined
    contractFingerprint?: string | undefined
    ancestorNodeIds?: Array<string> | undefined
    remote: boolean
    detached: boolean
    properties: Record<string, string | number | boolean>
  }>
  manualNodes: Array<{
    nodeId: string
    name: string
    type: string
    claimedAssetName?: string | undefined
    tokenBound: boolean
    reason?: string | undefined
  }>
  localComponents: Array<{
    nodeId: string
    name: string
    instanceCount: number
    reason?: string | undefined
  }>
  modes: Array<{
    collectionName: string
    collectionKey?: string | undefined
    mode: string
    explicit: boolean
    remote: boolean
  }>
  hardcodedValues: Array<{
    nodeId: string
    property: string
    value: string
  }>
  layout?:
    | {
        containers: Array<{
          nodeId: string
          name: string
          type: string
          width: number
          height: number
          layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL" | "GRID"
          primaryAxisSizingMode?: "FIXED" | "AUTO" | undefined
          counterAxisSizingMode?: "FIXED" | "AUTO" | undefined
          clipsContent: boolean
          children: Array<{
            nodeId: string
            name: string
            type: string
            x: number
            y: number
            width: number
            height: number
            visible: boolean
            layoutPositioning: "AUTO" | "ABSOLUTE"
          }>
        }>
      }
    | undefined
}

export type DesignFinalizationIssue = {
  severity: "error" | "warning"
  code:
    | "library_not_enabled"
    | "required_instance_missing"
    | "manual_component_replacement"
    | "theme_mode_missing"
    | "theme_mode_not_explicit"
    | "theme_mode_mismatch"
    | "theme_collection_origin_mismatch"
    | "theme_collection_key_mismatch"
    | "instance_origin_mismatch"
    | "component_contract_mismatch"
    | "component_hierarchy_mismatch"
    | "component_group_mismatch"
    | "ambiguous_requirement_assignment"
    | "duplicate_node_claim"
    | "invalid_component_property"
    | "plan_contract_mismatch"
    | "detached_instance"
    | "unapproved_local_component"
    | "hardcoded_value"
    | "unbound_manual_value"
    | "layout_evidence_missing"
    | "live_node_missing"
    | "layout_ancestry_mismatch"
    | "layout_participation_missing"
    | "required_instance_not_visible"
    | "required_instance_invalid_size"
    | "required_instance_not_auto_layout"
    | "invalid_layout_size"
    | "auto_layout_overflow"
    | "clipped_content"
    | "unmapped_figma_instance"
    | "figma_inspection_invalid"
  message: string
  nodeId: string | null
  requirementId: string | null
  recommendation: string
}

export type DesignFinalization = {
  ready: boolean
  issues: Array<DesignFinalizationIssue>
  coverage: {
    requiredInstances: number
    matchedInstances: number
    satisfiedInstances: number
  }
  handoff: Handoff | null
}

export type Handoff = {
  direction: HandoffInput["direction"]
  ready: boolean
  installCommands: Array<string>
  inspectFiles: Array<string>
  imports: Array<{ source: string; symbols: Array<string> }>
  components: Array<{
    codeName: string
    registryName: string
    importPath: string
    installedSourcePath: string
    sourceFiles: Array<string>
    dependencies: Array<string>
    registryDependencies: Array<string>
    exportName: string
    figmaInstances: Array<{
      nodeId: string
      name: string
      assetName: string
      properties: Record<string, string | number | boolean>
    }>
    figmaStatus: PreskokComponent["figma"]["status"]
    figmaAssets: PreskokComponent["figma"]["assets"]
    figmaFallbacks: Array<{
      codeName: string
      assets: PreskokComponent["figma"]["assets"]
    }>
    documentationPath: string | null
    usage: string | null
  }>
  tokens: ReturnType<PreskokDesignSystem["getTokens"]>
  notes: Array<string>
  validation: ValidationResult
}

export type FigmaInspectionNode = {
  nodeId: string
  parentId: string | null
  name: string
  type: string
  visible: boolean
  x: number
  y: number
  width: number
  height: number
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL" | "GRID" | null
  primaryAxisSizingMode?: "FIXED" | "AUTO" | undefined
  counterAxisSizingMode?: "FIXED" | "AUTO" | undefined
  layoutPositioning: "AUTO" | "ABSOLUTE"
  clipsContent?: boolean | undefined
  explicitVariableModes?: Record<string, string> | undefined
  semanticFields?:
    | Array<{
        property: string
        value: string
        tokenBound: boolean
      }>
    | undefined
  instance?:
    | {
        assetName: string
        componentKey: string | null
        remote: boolean
        properties: Record<string, string | number | boolean>
        contract?:
          | {
              assetType: "component" | "component_set"
              name: string
              propertyDefinitions: Array<{
                name: string
                type: "BOOLEAN" | "INSTANCE_SWAP" | "TEXT" | "VARIANT"
                variantOptions: Array<string>
              }>
            }
          | undefined
      }
    | undefined
}

export type FigmaInspection = {
  schemaVersion: 1
  fileKey: string
  rootNodeId: string
  nodes: Array<FigmaInspectionNode>
  collections: Array<{
    id: string
    key: string
    name: string
    remote: boolean
    modes: Array<{ modeId: string; name: string }>
  }>
}

export type FigmaInspectionInput = {
  figmaStrategy: FigmaStrategy
  theme: DesignPlanInput["theme"]
  inspection: FigmaInspection
  libraries?:
    | {
        libraries_added_to_file: Array<{
          name: string
          libraryKey: string
        }>
      }
    | undefined
  notes?: Array<string> | undefined
}

export type FigmaInspectionAnalysis = {
  ready: boolean
  discovery: {
    components: Array<{ codeName: string; instanceCount: number }>
    unmappedInstances: Array<{
      nodeId: string
      name: string
      componentKey: string | null
    }>
  }
  issues: Array<DesignFinalizationIssue>
  plan: DesignPlan
  finalization: DesignFinalization
  handoff: Handoff | null
}

export type PreskokDesignSystem = {
  planDesign(input: DesignPlanInput): DesignPlan
  finalizeDesign(input: {
    plan: DesignPlan
    evidence: DesignEvidence
    notes?: Array<string> | undefined
  }): DesignFinalization
  prepareFigmaInspection(input: { rootNodeId: string }): {
    rootNodeId: string
    figmaTool: "use_figma"
    code: string
    nextTool: "ingest_preskok_figma_inspection"
  }
  ingestFigmaInspection(input: FigmaInspectionInput): FigmaInspectionAnalysis
  search(input: {
    query: string
    limit?: number | undefined
  }): Array<SearchResult>
  listComponents(): Array<Omit<SearchResult, "score">>
  getComponent(identifier: string): PreskokComponent
  getTokens(input?: {
    names?: Array<string> | undefined
    mode?: "light" | "dark" | undefined
    usedBy?: string | undefined
  }): Array<DesignToken | (Omit<DesignToken, "values"> & { value: string })>
  getStatus(): PreskokStatus
  getFigmaSource(): PreskokCatalog["figma"]["source"]
  validateArtifact(input: {
    target: "figma" | "code"
    components: Array<ArtifactComponent>
    tokens?: Array<ArtifactToken> | undefined
  }): ValidationResult
  createHandoff(input: HandoffInput): Handoff
  listWorkflows(): Array<Pick<PreskokWorkflow, "name" | "title" | "goal">>
  getWorkflow(name: string): PreskokWorkflow
}

type CreateDesignSystemOptions = {
  catalog: PreskokCatalog
}

const semanticComponentGroups = {
  account: ["avatar", "badge", "button", "card", "field", "text-field"],
  profile: ["avatar", "badge", "button", "card", "field", "text-field"],
  user: ["avatar", "badge", "button", "field", "text-field"],
  settings: [
    "button",
    "card",
    "checkbox",
    "field",
    "form",
    "radio",
    "select",
    "switch",
    "tabs",
    "text-field",
  ],
  preference: ["checkbox", "radio", "select", "switch", "tabs"],
  preferences: ["checkbox", "radio", "select", "switch", "tabs"],
  form: [
    "button",
    "checkbox",
    "field",
    "form",
    "input",
    "radio",
    "select",
    "switch",
    "text-field",
    "textarea",
  ],
  navigation: ["breadcrumbs", "button", "link", "navbar", "sidebar", "tabs"],
  feedback: ["badge", "loader", "note", "progress-bar", "skeleton", "toast"],
  dashboard: [
    "area-chart",
    "bar-chart",
    "card",
    "line-chart",
    "table",
    "tracker",
  ],
  data: ["bar-list", "chart", "description-list", "grid-list", "table", "tree"],
} as const

function semanticComponentsFor(token: string) {
  return (
    Object.entries(semanticComponentGroups).find(
      ([name]) => name === token
    )?.[1] ?? []
  )
}

type RequestedDesignRequirement = NonNullable<
  DesignPlanInput["requirements"]
>[number]

const accountSettingsRequirements: Array<RequestedDesignRequirement> = [
  {
    id: "settings-card",
    role: "surface",
    codeName: "card",
    assetName: "Card",
  },
  {
    id: "email-label",
    role: "field-label",
    codeName: "field",
    assetName: "Field Label",
    parentRequirementId: "settings-card",
  },
  {
    id: "email-input",
    role: "field-control",
    codeName: "input",
    assetName: "Input",
    parentRequirementId: "settings-card",
  },
  {
    id: "email-description",
    role: "field-description",
    codeName: "field",
    assetName: "Field Description",
    parentRequirementId: "settings-card",
  },
  {
    id: "profile-separator",
    role: "content-separator",
    codeName: "separator",
    assetName: "Separator",
    parentRequirementId: "settings-card",
  },
  {
    id: "updates-switch",
    role: "preference-control",
    codeName: "switch",
    assetName: "Switch",
    parentRequirementId: "settings-card",
  },
  {
    id: "actions-separator",
    role: "actions-separator",
    codeName: "separator",
    assetName: "Separator",
    parentRequirementId: "settings-card",
  },
  {
    id: "cancel-action",
    role: "secondary-action",
    codeName: "button",
    assetName: "Button",
    parentRequirementId: "settings-card",
    groupId: "form-actions",
    groupLayout: "HORIZONTAL",
  },
  {
    id: "save-action",
    role: "primary-action",
    codeName: "button",
    assetName: "Button",
    parentRequirementId: "settings-card",
    groupId: "form-actions",
    groupLayout: "HORIZONTAL",
  },
]

export function createPreskokDesignSystem({
  catalog,
}: CreateDesignSystemOptions): PreskokDesignSystem {
  const planSigningKey = randomBytes(32)
  const componentsByName = new Map(
    catalog.components.map((component) => [component.name, component])
  )
  const componentsByFigmaKey = new Map<string, PreskokComponent>()
  for (const component of catalog.components) {
    for (const asset of component.figma.assets) {
      const existing = componentsByFigmaKey.get(asset.componentKey)
      if (!existing) {
        componentsByFigmaKey.set(asset.componentKey, component)
        continue
      }
      const existingAsset = existing.figma.assets.find(
        ({ componentKey }) => componentKey === asset.componentKey
      )
      const candidateScore = figmaKeyOwnershipScore(component, asset.name)
      const existingScore = figmaKeyOwnershipScore(
        existing,
        existingAsset?.name ?? ""
      )
      if (
        candidateScore > existingScore ||
        (candidateScore === existingScore &&
          component.name.localeCompare(existing.name) < 0)
      ) {
        componentsByFigmaKey.set(asset.componentKey, component)
      }
    }
  }

  return {
    prepareFigmaInspection({ rootNodeId }) {
      return {
        rootNodeId,
        figmaTool: "use_figma",
        code: createFigmaInspectionScript(rootNodeId),
        nextTool: "ingest_preskok_figma_inspection",
      }
    },

    ingestFigmaInspection(input) {
      const expectedCollections =
        input.figmaStrategy === "published"
          ? catalog.figma.source.collections.published
          : catalog.figma.source.collections.source
      const inspected = analyzeFigmaInspection(input.inspection, [
        expectedCollections.style.key,
        expectedCollections.colorMode.key,
      ])
      const inspectedRoot = inspected.root
      const inspectionNodesById = inspected.nodesById
      const inspectionIssues = [...inspected.issues]
      const isEffectivelyVisible = (node: FigmaInspectionNode) =>
        inspected.visibleNodeIds.has(node.nodeId)

      const discoveredInstances = input.inspection.nodes.flatMap((node) => {
        if (
          node.type !== "INSTANCE" ||
          !isEffectivelyVisible(node) ||
          !node.instance
        ) {
          return []
        }
        const resolved = resolveInspectedComponent({
          node,
          strategy: input.figmaStrategy,
          componentsByFigmaKey,
        })
        return [{ node, resolved }]
      })
      const unmappedInstances = discoveredInstances.flatMap(
        ({ node, resolved }) => {
          if (resolved) {
            return []
          }
          return [
            {
              nodeId: node.nodeId,
              name: node.name,
              componentKey: node.instance?.componentKey ?? null,
            },
          ]
        }
      )
      for (const instance of unmappedInstances) {
        inspectionIssues.push({
          severity: "error",
          code: "unmapped_figma_instance",
          message: `${instance.name} is a visible component instance that does not resolve to the generated Preskok catalog.`,
          nodeId: instance.nodeId,
          requirementId: null,
          recommendation:
            "Replace it with a linked Preskok UI instance or explicitly redesign the composition before requesting a code handoff.",
        })
      }

      const mappedInstances = discoveredInstances.flatMap(
        ({ node, resolved }) => (resolved ? [{ node, ...resolved }] : [])
      )
      const requirementIdByNodeId = new Map(
        mappedInstances.map(({ node }) => [
          node.nodeId,
          `figma-${requirementIdSegment(node.nodeId)}`,
        ])
      )
      const requirements = mappedInstances.map(({ node, component, asset }) => {
        const ancestorNodeIds = inspectionAncestors(node, inspectionNodesById)
        const parentRequirementId = [...ancestorNodeIds]
          .reverse()
          .map((nodeId) => requirementIdByNodeId.get(nodeId))
          .find((value): value is string => value !== undefined)
        const requirement: RequestedDesignRequirement = {
          id: requirementIdByNodeId.get(node.nodeId)!,
          role: node.name,
          codeName: component.name,
          assetName: asset.name,
        }
        if (parentRequirementId) {
          requirement.parentRequirementId = parentRequirementId
        }
        return requirement
      })
      const plan = this.planDesign({
        intent: `Implement inspected Figma root ${input.inspection.rootNodeId}`,
        figmaStrategy: input.figmaStrategy,
        theme: input.theme,
        requirements,
      })
      const requirementsById = new Map(
        plan.requirements.map((requirement) => [requirement.id, requirement])
      )
      const evidenceInstances = mappedInstances.flatMap(({ node, asset }) => {
        const requirementId = requirementIdByNodeId.get(node.nodeId)
        const requirement = requirementId
          ? requirementsById.get(requirementId)
          : undefined
        if (!requirement || !node.instance) {
          return []
        }
        const instance: DesignEvidence["instances"][number] = {
          nodeId: node.nodeId,
          requirementId: requirement.id,
          name: node.name,
          assetName: asset.name,
          ancestorNodeIds: inspectionAncestors(node, inspectionNodesById),
          remote: node.instance.remote,
          detached: false,
          properties: node.instance.properties,
        }
        if (input.figmaStrategy === "published") {
          instance.componentKey = asset.componentKey
        } else {
          instance.contractFingerprint = requirement.contractFingerprint
        }
        return [instance]
      })
      const nodesByParentId = new Map<string, Array<FigmaInspectionNode>>()
      for (const node of input.inspection.nodes) {
        if (!node.parentId) {
          continue
        }
        const siblings = nodesByParentId.get(node.parentId) ?? []
        siblings.push(node)
        nodesByParentId.set(node.parentId, siblings)
      }
      const layoutContainers = input.inspection.nodes
        .filter(
          (node) =>
            node.nodeId === input.inspection.rootNodeId ||
            nodesByParentId.has(node.nodeId)
        )
        .map((node) => {
          const container: NonNullable<
            DesignEvidence["layout"]
          >["containers"][number] = {
            nodeId: node.nodeId,
            name: node.name,
            type: node.type,
            width: node.width,
            height: node.height,
            layoutMode: node.layoutMode ?? "NONE",
            clipsContent: node.clipsContent ?? false,
            children: (nodesByParentId.get(node.nodeId) ?? []).map((child) => ({
              nodeId: child.nodeId,
              name: child.name,
              type: child.type,
              x: child.x,
              y: child.y,
              width: child.width,
              height: child.height,
              visible: isEffectivelyVisible(child),
              layoutPositioning: child.layoutPositioning,
            })),
          }
          if (node.primaryAxisSizingMode) {
            container.primaryAxisSizingMode = node.primaryAxisSizingMode
          }
          if (node.counterAxisSizingMode) {
            container.counterAxisSizingMode = node.counterAxisSizingMode
          }
          return container
        })
      const manualNodes = input.inspection.nodes.flatMap((node) => {
        if (
          node.nodeId === input.inspection.rootNodeId ||
          node.type === "INSTANCE" ||
          node.type === "COMPONENT" ||
          !isEffectivelyVisible(node) ||
          (node.semanticFields ?? []).length === 0
        ) {
          return []
        }
        return [
          {
            nodeId: node.nodeId,
            name: node.name,
            type: node.type,
            tokenBound: (node.semanticFields ?? []).every(
              ({ tokenBound }) => tokenBound
            ),
          },
        ]
      })
      const localComponents = input.inspection.nodes.flatMap((node) => {
        if (node.type !== "COMPONENT" || !isEffectivelyVisible(node)) {
          return []
        }
        return [{ nodeId: node.nodeId, name: node.name, instanceCount: 0 }]
      })
      const hardcodedValues = input.inspection.nodes.flatMap((node) => {
        if (node.type === "INSTANCE" || !isEffectivelyVisible(node)) {
          return []
        }
        return (node.semanticFields ?? []).flatMap((field) =>
          field.tokenBound
            ? []
            : [
                {
                  nodeId: node.nodeId,
                  property: field.property,
                  value: field.value,
                },
              ]
        )
      })
      const rootModes = inspectedRoot?.explicitVariableModes ?? {}
      const modes = Object.entries(rootModes).flatMap(
        ([collectionId, modeId]) => {
          const collection = input.inspection.collections.find(
            ({ id }) => id === collectionId
          )
          const mode = collection?.modes.find(
            (candidate) => candidate.modeId === modeId
          )
          if (!collection || !mode) {
            return []
          }
          return [
            {
              collectionName: collection.name,
              collectionKey: collection.key,
              mode: mode.name,
              explicit: true,
              remote: collection.remote,
            },
          ]
        }
      )
      const evidence: DesignEvidence = {
        fileKey: input.inspection.fileKey,
        rootNodeId: input.inspection.rootNodeId,
        enabledLibraryKeys:
          input.libraries?.libraries_added_to_file.map(
            ({ libraryKey }) => libraryKey
          ) ?? [],
        instances: evidenceInstances,
        manualNodes,
        localComponents,
        modes,
        hardcodedValues,
        layout: { containers: layoutContainers },
      }
      const finalization = this.finalizeDesign({
        plan,
        evidence,
        notes: [
          "Discovered from the unchanged return value of the official Figma MCP inspection script.",
          ...(input.notes ?? []),
        ],
      })
      const issues = [...inspectionIssues, ...finalization.issues]
      const ready =
        finalization.ready &&
        !inspectionIssues.some(({ severity }) => severity === "error")
      const componentCounts = new Map<string, number>()
      for (const { component } of mappedInstances) {
        componentCounts.set(
          component.name,
          (componentCounts.get(component.name) ?? 0) + 1
        )
      }
      return {
        ready,
        discovery: {
          components: [...componentCounts.entries()]
            .map(([codeName, instanceCount]) => ({ codeName, instanceCount }))
            .sort((left, right) => left.codeName.localeCompare(right.codeName)),
          unmappedInstances,
        },
        issues,
        plan,
        finalization,
        handoff: ready ? finalization.handoff : null,
      }
    },

    planDesign(input) {
      const collectionSource =
        input.figmaStrategy === "published"
          ? catalog.figma.source.collections.published
          : catalog.figma.source.collections.source
      const issues = [] as DesignPlan["issues"]
      if (!collectionSource.style.modes.includes(input.theme.style)) {
        issues.push({
          severity: "error",
          code: "theme_mode_unavailable",
          message: `Style=${input.theme.style} is not available through the ${input.figmaStrategy} Preskok strategy. Available modes: ${collectionSource.style.modes.join(", ")}.`,
        })
      }
      if (!collectionSource.colorMode.modes.includes(input.theme.mode)) {
        issues.push({
          severity: "error",
          code: "theme_mode_unavailable",
          message: `Mode=${input.theme.mode} is not available through the ${input.figmaStrategy} Preskok strategy. Available modes: ${collectionSource.colorMode.modes.join(", ")}.`,
        })
      }
      const inferredRequirements = isAccountSettingsIntent(input.intent)
        ? accountSettingsRequirements
        : []
      const requestedRequirements = input.requirements ?? inferredRequirements
      if (requestedRequirements.length === 0) {
        issues.push({
          severity: "error",
          code: "composition_requirements_needed",
          message:
            "Provide the intended Preskok components so the MCP can create a verifiable Figma composition contract.",
        })
      }
      const codeComponents = uniqueStrings(
        requestedRequirements.map(({ codeName }) => codeName)
      )
      const requirements = requestedRequirements.flatMap(
        (requested, requestedIndex): Array<DesignRequirement> => {
          const component = componentsByName.get(
            requested.codeName.replace(/^@preskok\//, "")
          )
          if (!component) {
            issues.push({
              severity: "error",
              code: "unknown_component",
              message: `Unknown Preskok component: ${requested.codeName}.`,
            })
            return []
          }
          if (component.figma.status === "not_applicable") {
            issues.push({
              severity: "warning",
              code: "figma_representation_not_applicable",
              message: `${component.name} is a code-only context contract and does not require a Figma instance.`,
            })
            return []
          }
          const directAssets = requested.assetName
            ? component.figma.assets.filter(
                ({ name }) => name === requested.assetName
              )
            : component.figma.assets.slice(0, 1)
          if (directAssets.length > 0) {
            return directAssets.map((asset, assetIndex) =>
              createDesignRequirement({
                requested,
                requestedIndex,
                assetIndex,
                codeName: component.name,
                figmaCodeName: component.name,
                asset,
                representation: "native",
                expandedIdentity:
                  directAssets.length > 1
                    ? `${component.name}-${asset.name}`
                    : undefined,
              })
            )
          }
          if (requested.assetName && component.figma.assets.length > 0) {
            issues.push({
              severity: "error",
              code: "unknown_figma_asset",
              message: `${requested.assetName} is not a mapped Figma asset for ${component.name}.`,
            })
            return []
          }
          const fallbacks = component.figma.fallbackComponents ?? []
          const fallbackRequirements = fallbacks.flatMap(
            (fallbackName, fallbackIndex): Array<DesignRequirement> => {
              const fallback = componentsByName.get(fallbackName)
              const asset = fallback?.figma.assets[0]
              if (!fallback || !asset) {
                return []
              }
              return [
                createDesignRequirement({
                  requested,
                  requestedIndex,
                  assetIndex: fallbackIndex,
                  codeName: component.name,
                  figmaCodeName: fallback.name,
                  asset,
                  representation: "fallback",
                }),
              ]
            }
          )
          if (fallbackRequirements.length === 0) {
            issues.push({
              severity: "error",
              code: "figma_representation_missing",
              message: `${component.name} has no native Figma asset or verified fallback composition.`,
            })
          }
          if (!requested.id || fallbackRequirements.length < 2) {
            return fallbackRequirements
          }
          return fallbackRequirements.map((requirement) => ({
            ...requirement,
            id: `${requested.id}--${requirementIdSegment(
              `${requirement.figmaCodeName}-${requirement.assetName}`
            )}`,
          }))
        }
      )
      validateRequirementGraph(requirements, issues)
      const planWithoutDigest = {
        readyToBuild: !issues.some(({ severity }) => severity === "error"),
        intent: input.intent,
        figmaStrategy: input.figmaStrategy,
        theme: input.theme,
        source: {
          url: catalog.figma.source.url,
          fileKey: catalog.figma.source.fileKey,
          libraryKey: catalog.figma.source.library.libraryKey,
          publishedAccess: catalog.figma.source.publishedAccess,
          collections: {
            style: {
              name: collectionSource.style.name,
              key: collectionSource.style.key,
              mode: input.theme.style,
              availableModes: collectionSource.style.modes,
            },
            colorMode: {
              name: collectionSource.colorMode.name,
              key: collectionSource.colorMode.key,
              mode: input.theme.mode,
              availableModes: collectionSource.colorMode.modes,
            },
          },
        },
        codeComponents,
        requirements,
        issues,
      }
      return {
        contractDigest: signDesignPlan(planWithoutDigest, planSigningKey),
        ...planWithoutDigest,
      }
    },

    finalizeDesign({ plan, evidence, notes = [] }) {
      const issues: Array<DesignFinalizationIssue> = []
      const evidenceInstances = validateUniqueEvidenceNodeClaims(
        evidence,
        issues
      )
      const layout = validateDesignLayoutEvidence(plan, evidence, issues)
      const { contractDigest, ...planContract } = plan
      if (!verifyDesignPlan(planContract, contractDigest, planSigningKey)) {
        issues.push({
          severity: "error",
          code: "plan_contract_mismatch",
          message:
            "The design plan changed after its contract digest was issued.",
          nodeId: evidence.rootNodeId,
          requirementId: null,
          recommendation:
            "Request a fresh plan and build from that unchanged contract.",
        })
      }
      const hasCompletePublishedIdentity =
        plan.figmaStrategy === "published" &&
        plan.requirements.every((requirement) => {
          const linkedRemoteInstances = evidenceInstances.filter(
            (instance) =>
              instance.componentKey === requirement.componentKey &&
              instance.remote === true
          )
          return linkedRemoteInstances.length >= requirement.minimumInstances
        }) &&
        [
          plan.source.collections.style,
          plan.source.collections.colorMode,
        ].every((expected) =>
          evidence.modes.some(
            (mode) =>
              mode.collectionName === expected.name &&
              mode.collectionKey === expected.key &&
              mode.remote === true
          )
        )
      if (
        plan.figmaStrategy === "published" &&
        !evidence.enabledLibraryKeys.includes(plan.source.libraryKey)
      ) {
        const severity = hasCompletePublishedIdentity ? "warning" : "error"
        issues.push({
          severity,
          code: "library_not_enabled",
          message: hasCompletePublishedIdentity
            ? "Preskok assets are linked by published keys, but the library is not enabled for manual browsing in this file."
            : "The published Preskok UI library is not enabled in this file.",
          nodeId: evidence.rootNodeId,
          requirementId: null,
          recommendation: hasCompletePublishedIdentity
            ? "Enable Preskok UI in Figma Libraries to make the same assets available in the Assets panel and receive normal library update UX."
            : "Enable Preskok UI in Figma Libraries before composing the screen, or import every planned component and collection by its published key.",
        })
      }

      let satisfiedInstances = 0
      let matchedInstances = 0
      const matchingInstancesByRequirement = new Map<
        string,
        Array<DesignEvidence["instances"][number]>
      >()
      const requirementsByIdentity = new Map<string, Array<DesignRequirement>>()
      for (const requirement of plan.requirements) {
        const identity = designRequirementIdentity(plan, requirement)
        const existing = requirementsByIdentity.get(identity) ?? []
        existing.push(requirement)
        requirementsByIdentity.set(identity, existing)
      }
      for (const requirements of requirementsByIdentity.values()) {
        if (requirements.length < 2) {
          continue
        }
        const firstRequirement = requirements[0]
        if (!firstRequirement) {
          continue
        }
        for (const instance of evidenceInstances) {
          if (
            matchesRequirementIdentity(plan, firstRequirement, instance) &&
            !instance.requirementId
          ) {
            issues.push({
              severity: "error",
              code: "ambiguous_requirement_assignment",
              message: `${instance.name} could satisfy more than one planned requirement but has no requirementId.`,
              nodeId: instance.nodeId,
              requirementId: null,
              recommendation: `Assign this live instance to one of: ${requirements.map(({ id }) => id).join(", ")}.`,
            })
          }
        }
      }
      const assignedInstancesByRequirement = assignEvidenceInstances({
        plan,
        instances: evidenceInstances,
      })
      for (const requirement of plan.requirements) {
        const assetNameMatches = evidenceInstances.filter(
          (instance) => instance.assetName === requirement.assetName
        )
        const allIdentityMatches = evidenceInstances.filter((instance) =>
          matchesRequirementIdentity(plan, requirement, instance)
        )
        const identityMatches =
          assignedInstancesByRequirement.get(requirement) ?? []
        let hierarchyMatchingInstances = identityMatches
        if (requirement.parentRequirementId) {
          const parentRequirement = plan.requirements.find(
            ({ id }) => id === requirement.parentRequirementId
          )
          const parentNodeIds = parentRequirement
            ? (assignedInstancesByRequirement.get(parentRequirement) ?? []).map(
                ({ nodeId }) => nodeId
              )
            : []
          hierarchyMatchingInstances = identityMatches.filter((instance) =>
            parentNodeIds.some((nodeId) =>
              layout
                ? collectLayoutAncestors(
                    instance.nodeId,
                    layout.parentByNodeId
                  ).includes(nodeId)
                : false
            )
          )
        }
        const matchingInstances = hierarchyMatchingInstances.filter(
          (instance) =>
            validateRequiredInstanceLayoutParticipation({
              instance,
              requirement,
              layout,
              issues,
            })
        )
        const misplacedInstances = identityMatches.filter(
          (instance) => !hierarchyMatchingInstances.includes(instance)
        )
        matchedInstances += Math.min(
          identityMatches.length,
          requirement.minimumInstances
        )
        const satisfied = Math.min(
          matchingInstances.length,
          requirement.minimumInstances
        )
        matchingInstancesByRequirement.set(
          requirement.id,
          matchingInstances.slice(0, requirement.minimumInstances)
        )
        satisfiedInstances += satisfied
        if (
          plan.figmaStrategy === "copied" &&
          assetNameMatches.length > 0 &&
          allIdentityMatches.length === 0
        ) {
          issues.push({
            severity: "error",
            code: "component_contract_mismatch",
            message: `${requirement.assetName} does not match the Preskok component contract in this plan.`,
            nodeId: assetNameMatches[0]?.nodeId ?? null,
            requirementId: requirement.id,
            recommendation:
              "Replace it with an unchanged instance from the copied Preskok UI source file.",
          })
        } else if (misplacedInstances.length > 0) {
          for (const instance of misplacedInstances) {
            issues.push({
              severity: "error",
              code: "component_hierarchy_mismatch",
              message: `${instance.name} is not inside the required ${requirement.parentRequirementId} composition.`,
              nodeId: instance.nodeId,
              requirementId: requirement.id,
              recommendation:
                "Move the linked instance into the planned parent component without detaching it.",
            })
          }
        } else if (satisfied < requirement.minimumInstances) {
          const manualReplacement = evidence.manualNodes.find(
            (node) => node.claimedAssetName === requirement.assetName
          )
          issues.push({
            severity: "error",
            code: manualReplacement
              ? "manual_component_replacement"
              : "required_instance_missing",
            message: manualReplacement
              ? `${requirement.assetName} is represented by a manual ${manualReplacement.type} instead of a Preskok instance.`
              : `${requirement.assetName} requires ${requirement.minimumInstances} linked instance(s); found ${matchingInstances.length}.`,
            nodeId: manualReplacement?.nodeId ?? null,
            requirementId: requirement.id,
            recommendation: `Use the ${requirement.assetName} asset from the Preskok UI ${plan.figmaStrategy === "published" ? "library" : "copy"}.`,
          })
        }

        for (const instance of identityMatches) {
          const expectedRemote = plan.figmaStrategy === "published"
          if (instance.remote !== expectedRemote) {
            issues.push({
              severity: "error",
              code: "instance_origin_mismatch",
              message: `${instance.name} has the wrong component origin for the ${plan.figmaStrategy} strategy.`,
              nodeId: instance.nodeId,
              requirementId: requirement.id,
              recommendation: expectedRemote
                ? "Replace it with the published Preskok UI instance."
                : "Replace it with an instance of the copied local Preskok component.",
            })
          }
          if (instance.detached) {
            issues.push({
              severity: "error",
              code: "detached_instance",
              message: `${instance.name} is detached from its Preskok main component.`,
              nodeId: instance.nodeId,
              requirementId: requirement.id,
              recommendation: "Replace it with a linked Preskok instance.",
            })
          }
          const component = componentsByName.get(requirement.figmaCodeName)
          const asset = component?.figma.assets.find(
            ({ componentKey }) => componentKey === requirement.componentKey
          )
          for (const [propertyName, propertyValue] of Object.entries(
            instance.properties
          )) {
            const property = asset?.propertyDefinitions.find(
              (definition) =>
                normalizeFigmaContractName(definition.name) ===
                normalizeFigmaContractName(propertyName)
            )
            const invalidVariant =
              property?.type === "VARIANT" &&
              !property.variantOptions.includes(String(propertyValue))
            const invalidType =
              property !== undefined &&
              !isFigmaPropertyValueValid(property.type, propertyValue)
            if (!property || invalidVariant || invalidType) {
              issues.push({
                severity: "error",
                code: "invalid_component_property",
                message: `${instance.name}.${propertyName} is not valid for the planned ${requirement.assetName} contract.`,
                nodeId: instance.nodeId,
                requirementId: requirement.id,
                recommendation:
                  "Use a property name, type, and value returned in the planned component contract.",
              })
            }
          }
        }
      }

      validateRequirementGroups({
        plan,
        evidence,
        issues,
        layout,
        matchingInstancesByRequirement,
      })

      for (const expected of [
        plan.source.collections.style,
        plan.source.collections.colorMode,
      ]) {
        const actual = evidence.modes.find(
          (mode) => mode.collectionName === expected.name
        )
        if (!actual) {
          issues.push({
            severity: "error",
            code: "theme_mode_missing",
            message: `${expected.name} is not applied to the design root.`,
            nodeId: evidence.rootNodeId,
            requirementId: null,
            recommendation: `Apply ${expected.name}=${expected.mode} to the root frame.`,
          })
          continue
        }
        if (actual.mode !== expected.mode) {
          issues.push({
            severity: "error",
            code: "theme_mode_mismatch",
            message: `${expected.name} resolves to ${actual.mode}; expected ${expected.mode}.`,
            nodeId: evidence.rootNodeId,
            requirementId: null,
            recommendation: `Set ${expected.name} to ${expected.mode}.`,
          })
        }
        if (!actual.explicit) {
          issues.push({
            severity: "error",
            code: "theme_mode_not_explicit",
            message: `${expected.name} is inherited instead of explicitly applied to the design root.`,
            nodeId: evidence.rootNodeId,
            requirementId: null,
            recommendation: `Explicitly apply ${expected.name}=${expected.mode} to the root frame.`,
          })
        }
        const expectedRemote = plan.figmaStrategy === "published"
        if (actual.remote !== expectedRemote) {
          issues.push({
            severity: "error",
            code: "theme_collection_origin_mismatch",
            message: `${expected.name} has the wrong origin for the ${plan.figmaStrategy} strategy.`,
            nodeId: evidence.rootNodeId,
            requirementId: null,
            recommendation: expectedRemote
              ? "Apply the published Preskok collection."
              : "Apply the local collection from the copied Preskok file.",
          })
        }
        if (
          plan.figmaStrategy === "published" &&
          actual.collectionKey !== expected.key
        ) {
          issues.push({
            severity: "error",
            code: "theme_collection_key_mismatch",
            message: `${expected.name} is not the published Preskok collection from the plan.`,
            nodeId: evidence.rootNodeId,
            requirementId: null,
            recommendation: `Apply the published Preskok ${expected.name} collection with key ${expected.key}.`,
          })
        }
      }

      for (const node of evidence.manualNodes) {
        if (!node.tokenBound) {
          issues.push({
            severity: "error",
            code: "unbound_manual_value",
            message: `${node.name} contains styling that is not bound to Preskok variables.`,
            nodeId: node.nodeId,
            requirementId: null,
            recommendation:
              "Bind semantic styling to Preskok variables or document it as an exported media asset.",
          })
        }
      }

      for (const component of evidence.localComponents) {
        if (!component.reason) {
          issues.push({
            severity: "error",
            code: "unapproved_local_component",
            message: `${component.name} is a local component without an explicit product-specific reason.`,
            nodeId: component.nodeId,
            requirementId: null,
            recommendation:
              "Use a Preskok component or record why this local component is product-specific.",
          })
        }
      }

      for (const value of evidence.hardcodedValues) {
        issues.push({
          severity: "error",
          code: "hardcoded_value",
          message: `${value.property} uses hardcoded value ${value.value}.`,
          nodeId: value.nodeId,
          requirementId: null,
          recommendation: "Bind the property to the matching Preskok variable.",
        })
      }

      const requiredInstances = plan.requirements.reduce(
        (total, requirement) => total + requirement.minimumInstances,
        0
      )
      const ready =
        plan.readyToBuild &&
        satisfiedInstances === requiredInstances &&
        !issues.some((issue) => issue.severity === "error")
      const componentNames = plan.codeComponents
      const handoffComponents = componentNames.flatMap((codeName) => {
        const matched = plan.requirements
          .filter((requirement) => requirement.codeName === codeName)
          .flatMap((requirement) =>
            (matchingInstancesByRequirement.get(requirement.id) ?? []).map(
              (instance) => ({
                codeName,
                figmaComponentKey: instance.componentKey,
                figmaNodeId: instance.nodeId,
                figmaNodeName: instance.name,
                figmaAssetName: instance.assetName,
                properties: instance.properties,
              })
            )
          )
        return matched.length > 0 ? matched : [{ codeName }]
      })
      return {
        ready,
        issues,
        coverage: { requiredInstances, matchedInstances, satisfiedInstances },
        handoff: ready
          ? this.createHandoff({
              direction: "figma_to_code",
              components: handoffComponents,
              notes: [
                `Verified Figma root ${evidence.rootNodeId} against plan ${plan.contractDigest}.`,
                ...notes,
              ],
            })
          : null,
      }
    },

    search({ query, limit = 10 }) {
      const queryTokens = tokenize(query)
      const semanticNames = new Set(queryTokens.flatMap(semanticComponentsFor))
      return catalog.components
        .map((component) => ({
          component,
          score: scoreComponent(component, query, queryTokens, semanticNames),
        }))
        .filter((result) => result.score > 0)
        .sort((left, right) => {
          const scoreDifference = right.score - left.score
          if (scoreDifference !== 0) {
            return scoreDifference
          }
          return left.component.name.localeCompare(right.component.name)
        })
        .slice(0, Math.max(1, Math.min(limit, 50)))
        .map(({ component, score }) => ({
          kind: "component" as const,
          name: component.name,
          registryName: component.registryName,
          description: component.description,
          importPath: component.importPath,
          documentationPath: component.documentation?.path ?? null,
          figmaStatus: component.figma.status,
          score,
        }))
    },

    listComponents() {
      return catalog.components.map((component) => ({
        kind: "component" as const,
        name: component.name,
        registryName: component.registryName,
        description: component.description,
        importPath: component.importPath,
        documentationPath: component.documentation?.path ?? null,
        figmaStatus: component.figma.status,
      }))
    },

    getComponent(identifier) {
      const normalized = identifier.replace(/^@preskok\//, "")
      const component =
        componentsByName.get(normalized) ?? componentsByFigmaKey.get(identifier)
      if (!component) {
        throw new Error(`Unknown Preskok component: ${identifier}`)
      }
      return component
    },

    getTokens(input = {}) {
      const requestedNames = new Set(input.names ?? [])
      const filtered = catalog.tokens.filter((token) => {
        if (requestedNames.size > 0 && !requestedNames.has(token.name)) {
          return false
        }
        if (input.usedBy && !token.usedBy.includes(input.usedBy)) {
          return false
        }
        return true
      })
      if (!input.mode) {
        return filtered
      }
      return filtered.map((token) => {
        const { values, ...metadata } = token
        return {
          ...metadata,
          value: values[input.mode!],
        }
      })
    },

    getStatus() {
      const byFigmaStatus = (status: PreskokComponent["figma"]["status"]) =>
        catalog.components
          .filter((component) => component.figma.status === status)
          .map((component) => component.name)

      return {
        schemaVersion: catalog.schemaVersion,
        catalogDigest: createHash("sha256")
          .update(JSON.stringify(catalog))
          .digest("hex"),
        components: {
          total: catalog.components.length,
          documented: catalog.components.filter(
            (component) => component.documentation
          ).length,
          withExamples: catalog.components.filter(
            (component) => component.examples.length > 0
          ).length,
        },
        tokens: {
          total: catalog.tokens.length,
          colors: catalog.tokens.filter((token) => token.kind === "color")
            .length,
          dimensions: catalog.tokens.filter(
            (token) => token.kind === "dimension"
          ).length,
          fonts: catalog.tokens.filter((token) => token.kind === "font").length,
        },
        figma: {
          ...catalog.figma.coverage,
          checkedAt: catalog.figma.checkedAt,
          propertiesCheckedAt: catalog.figma.propertiesCheckedAt,
          libraryName: catalog.figma.library.name,
          libraryKey: catalog.figma.library.libraryKey,
          contextFileKey: catalog.figma.contextFileKey,
        },
        gaps: {
          missingDocumentation: catalog.components
            .filter((component) => !component.documentation)
            .map((component) => component.name),
          missingExamples: catalog.components
            .filter((component) => component.examples.length === 0)
            .map((component) => component.name),
          partialFigma: byFigmaStatus("partial"),
          missingFigma: byFigmaStatus("missing"),
          notApplicableToFigma: byFigmaStatus("not_applicable"),
        },
      }
    },

    getFigmaSource() {
      return catalog.figma.source
    },

    validateArtifact({ target, components, tokens = [] }) {
      const issues: Array<ValidationIssue> = []
      const resolvedComponents: Array<string> = []

      for (const [index, input] of components.entries()) {
        const component = resolveComponent(
          input,
          componentsByName,
          componentsByFigmaKey
        )
        const path = `components[${index}]`
        if (!component) {
          issues.push({
            severity: "error",
            code: "unknown_component",
            message: `Could not resolve component from ${input.codeName ?? input.figmaComponentKey ?? "empty input"}.`,
            component: input.codeName ?? null,
            path,
            recommendation:
              "Use search_preskok, then supply a Preskok component name or published Figma component key.",
          })
          continue
        }
        resolvedComponents.push(component.name)

        if (input.detached) {
          issues.push({
            severity: "error",
            code: "detached_instance",
            message: `${component.name} is detached from its published Figma component.`,
            component: component.name,
            path,
            recommendation:
              "Replace it with an instance from the published Preskok UI library and reapply supported properties.",
          })
        }

        if (
          input.figmaComponentKey &&
          !component.figma.assets.some(
            (asset) => asset.componentKey === input.figmaComponentKey
          )
        ) {
          issues.push({
            severity: "error",
            code: "figma_key_mismatch",
            message: `${input.figmaComponentKey} is not mapped to ${component.name}.`,
            component: component.name,
            path: `${path}.figmaComponentKey`,
            recommendation:
              "Use one of the published component keys returned by get_component.",
          })
        }

        for (const [propertyName, propertyValue] of Object.entries(
          input.properties ?? {}
        )) {
          const figmaProperty = component.figma.assets
            .flatMap((asset) => asset.propertyDefinitions)
            .find((definition) => definition.name === propertyName)
          const variant =
            component.variants[propertyName] ??
            Object.entries(component.variants).find(
              ([name]) => name.toLowerCase() === propertyName.toLowerCase()
            )?.[1]
          const allowedValues =
            figmaProperty?.type === "VARIANT"
              ? figmaProperty.variantOptions
              : (variant?.values ?? [])

          if (
            allowedValues.length > 0 &&
            !allowedValues.includes(String(propertyValue))
          ) {
            issues.push({
              severity: "error",
              code: "invalid_variant",
              message: `${String(propertyValue)} is not a supported ${component.name}.${propertyName} value.`,
              component: component.name,
              path: `${path}.properties.${propertyName}`,
              recommendation: `Use one of: ${allowedValues.join(", ")}.`,
            })
          }
          if (
            figmaProperty &&
            !isFigmaPropertyValueValid(figmaProperty.type, propertyValue)
          ) {
            issues.push({
              severity: "error",
              code: "invalid_property_type",
              message: `${component.name}.${propertyName} expects a ${figmaProperty.type.toLowerCase()} value.`,
              component: component.name,
              path: `${path}.properties.${propertyName}`,
              recommendation: `Use the property type returned by get_preskok_component for ${propertyName}.`,
            })
          }
        }

        if (target === "figma" && component.figma.status === "missing") {
          const fallbacks = component.figma.fallbackComponents ?? []
          issues.push({
            severity: "warning",
            code: "missing_figma_mapping",
            message: `${component.name} has no published Preskok UI Figma component.`,
            component: component.name,
            path,
            recommendation: `Compose it from mapped Preskok primitives (${fallbacks.join(", ")}) and record the deviation in the handoff.`,
          })
        }
        if (target === "figma" && component.figma.status === "partial") {
          issues.push({
            severity: "warning",
            code: "partial_figma_mapping",
            message: `${component.name} has partial Figma coverage: ${component.figma.reason}`,
            component: component.name,
            path,
            recommendation:
              "Use the mapped visual assets and keep layout-only or compound behavior explicit in the handoff.",
          })
        }
      }

      const tokensByName = new Map(
        catalog.tokens.map((token) => [token.name, token])
      )
      for (const [index, token] of tokens.entries()) {
        const path = `tokens[${index}]`
        if (token.hardcodedValue) {
          issues.push({
            severity: "warning",
            code: "hardcoded_value",
            message: `Hardcoded value ${token.hardcodedValue} bypasses Preskok variables.`,
            component: null,
            path,
            recommendation:
              "Replace the hardcoded value with the nearest Preskok semantic token.",
          })
        }
        if (token.name && !tokensByName.has(token.name)) {
          issues.push({
            severity: "error",
            code: "unknown_token",
            message: `${token.name} is not a generated Preskok token.`,
            component: null,
            path: `${path}.name`,
            recommendation: "Use get_tokens to select a current token name.",
          })
        }
      }

      const errors = issues.filter((issue) => issue.severity === "error").length
      const warnings = issues.length - errors
      return {
        valid: errors === 0,
        issues,
        resolvedComponents: [...new Set(resolvedComponents)],
        summary: { errors, warnings },
      }
    },

    createHandoff(input) {
      const targetsCode =
        input.direction === "figma_to_code" ||
        input.direction === "claude_design_to_code"
      const target = targetsCode ? "code" : "figma"
      const validation = this.validateArtifact({
        target,
        components: input.components,
        tokens: (input.tokenNames ?? []).map((name) => ({ name })),
      })
      const resolved = input.components.flatMap((item) => {
        const component = resolveComponent(
          item,
          componentsByName,
          componentsByFigmaKey
        )
        if (!component) {
          return []
        }
        return [
          {
            component,
            input: item,
          },
        ]
      })
      const resolvedByComponent = new Map<
        string,
        {
          component: PreskokComponent
          figmaInstances: Handoff["components"][number]["figmaInstances"]
        }
      >()
      for (const { component, input: artifact } of resolved) {
        const existing = resolvedByComponent.get(component.name)
        const figmaInstance =
          artifact.figmaNodeId && artifact.figmaNodeName
            ? [
                {
                  nodeId: artifact.figmaNodeId,
                  name: artifact.figmaNodeName,
                  assetName:
                    artifact.figmaAssetName ??
                    component.figma.assets[0]?.name ??
                    component.name,
                  properties: artifact.properties ?? {},
                },
              ]
            : []
        if (existing) {
          existing.figmaInstances.push(...figmaInstance)
          continue
        }
        resolvedByComponent.set(component.name, {
          component,
          figmaInstances: figmaInstance,
        })
      }
      const componentPlans = [...resolvedByComponent.values()]
        .sort((left, right) =>
          left.component.name.localeCompare(right.component.name)
        )
        .map(({ component, figmaInstances }) => ({
          codeName: component.name,
          registryName: component.registryName,
          importPath: component.importPath,
          installedSourcePath: installedSourcePath(component.importPath),
          sourceFiles: component.sourceFiles,
          dependencies: component.dependencies,
          registryDependencies: component.registryDependencies,
          exportName: primaryExport(component),
          figmaInstances,
          figmaStatus: component.figma.status,
          figmaAssets: component.figma.assets,
          figmaFallbacks: (component.figma.fallbackComponents ?? []).map(
            (fallbackName) => {
              const fallback = componentsByName.get(fallbackName)
              if (!fallback) {
                throw new Error(
                  `Unknown generated Figma fallback ${fallbackName} for ${component.name}`
                )
              }
              return { codeName: fallback.name, assets: fallback.figma.assets }
            }
          ),
          documentationPath: component.documentation?.path ?? null,
          usage: component.documentation?.usage ?? null,
        }))
      const importsBySource = new Map<string, Set<string>>()
      for (const plan of componentPlans) {
        const symbols =
          importsBySource.get(plan.importPath) ?? new Set<string>()
        symbols.add(plan.exportName)
        importsBySource.set(plan.importPath, symbols)
      }
      const selectedTokens = catalog.tokens.filter((token) =>
        (input.tokenNames ?? []).includes(token.name)
      )

      return {
        direction: input.direction,
        ready: validation.valid,
        installCommands:
          componentPlans.length > 0
            ? [
                `pnpm dlx shadcn@latest add ${uniqueStrings(
                  componentPlans.map((plan) => plan.registryName)
                ).join(" ")}`,
              ]
            : [],
        inspectFiles: componentPlans.map(
          ({ installedSourcePath: path }) => path
        ),
        imports: [...importsBySource.entries()].map(([source, symbols]) => ({
          source,
          symbols: [...symbols].sort(),
        })),
        components: componentPlans,
        tokens: selectedTokens,
        notes: input.notes ?? [],
        validation,
      }
    },

    listWorkflows() {
      return listPreskokWorkflows()
    },

    getWorkflow(name) {
      return getPreskokWorkflow(name)
    },
  }
}

function figmaAssetContractFingerprint(
  asset: PreskokComponent["figma"]["assets"][number]
): string {
  const contract = {
    assetType: asset.assetType,
    name: normalizeFigmaContractName(asset.name),
    properties: asset.propertyDefinitions
      .map((property) => ({
        name: normalizeFigmaContractName(property.name),
        type: property.type,
        variantOptions: [...property.variantOptions].sort(),
      }))
      .sort((left, right) => {
        const leftKey = `${left.name}:${left.type}`
        const rightKey = `${right.name}:${right.type}`
        return leftKey.localeCompare(rightKey)
      }),
  }
  return createHash("sha256").update(JSON.stringify(contract)).digest("hex")
}

function createFigmaInspectionScript(rootNodeId: string): string {
  const serializedRootNodeId = JSON.stringify(rootNodeId)
  return `const root = await figma.getNodeByIdAsync(${serializedRootNodeId});
if (!root || !("children" in root)) {
  throw new Error("Expected an inspectable Figma container root");
}
const nodes = [];
const collectionIds = new Set();
const semanticFieldsFor = (node) => {
  if (!("boundVariables" in node)) return [];
  const bound = node.boundVariables || {};
  const fields = [];
  const add = (property, value, meaningful) => {
    if (!meaningful) return;
    const binding = bound[property];
    const tokenBound = Array.isArray(binding) ? binding.length > 0 : Boolean(binding);
    fields.push({ property, value: String(value), tokenBound });
  };
  if ("fills" in node && node.fills !== figma.mixed) {
    add("fills", "paint", node.fills.some((paint) => paint.visible !== false));
  }
  if ("strokes" in node && node.strokes !== figma.mixed) {
    add("strokes", "paint", node.strokes.some((paint) => paint.visible !== false));
  }
  if ("effects" in node && node.effects !== figma.mixed) {
    add("effects", "effect", node.effects.some((effect) => effect.visible !== false));
  }
  if ("itemSpacing" in node) add("itemSpacing", node.itemSpacing, node.itemSpacing !== 0);
  for (const property of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]) {
    if (property in node) add(property, node[property], node[property] !== 0);
  }
  for (const property of ["topLeftRadius", "topRightRadius", "bottomRightRadius", "bottomLeftRadius"]) {
    if (property in node) add(property, node[property], node[property] !== 0 && node[property] !== figma.mixed);
  }
  return fields;
};
const visit = async (node, parentId) => {
  const isSceneNode = "visible" in node;
  const entry = {
    nodeId: node.id,
    parentId,
    name: node.name,
    type: node.type,
    visible: isSceneNode ? node.visible : true,
    x: "x" in node ? node.x : 0,
    y: "y" in node ? node.y : 0,
    width: "width" in node ? node.width : 0,
    height: "height" in node ? node.height : 0,
    layoutMode: "layoutMode" in node ? node.layoutMode : null,
    layoutPositioning: "layoutPositioning" in node ? node.layoutPositioning : "AUTO"
  };
  if ("primaryAxisSizingMode" in node) entry.primaryAxisSizingMode = node.primaryAxisSizingMode;
  if ("counterAxisSizingMode" in node) entry.counterAxisSizingMode = node.counterAxisSizingMode;
  if ("clipsContent" in node && node.clipsContent) entry.clipsContent = true;
  const explicitVariableModes = isSceneNode ? node.explicitVariableModes : {};
  if (Object.keys(explicitVariableModes).length > 0) entry.explicitVariableModes = explicitVariableModes;
  for (const collectionId of Object.keys(explicitVariableModes)) collectionIds.add(collectionId);
  if (node.type !== "INSTANCE") {
    const semanticFields = isSceneNode ? semanticFieldsFor(node) : [];
    if (semanticFields.length > 0) entry.semanticFields = semanticFields;
  }
  if (node.type === "INSTANCE") {
    const main = await node.getMainComponentAsync();
    const componentSet = main && main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : null;
    const asset = componentSet || main;
    const definitions = asset && "componentPropertyDefinitions" in asset ? asset.componentPropertyDefinitions : {};
    let assetType = "component";
    if (asset && asset.type === "COMPONENT_SET") assetType = "component_set";
    const inspectedInstance = {
      assetName: asset ? asset.name : node.name,
      componentKey: asset && asset.key ? asset.key : null,
      remote: main ? main.remote : false,
      properties: Object.fromEntries(Object.entries(node.componentProperties).map(([name, property]) => [name, property.value]))
    };
    if (!main || !main.remote) {
      inspectedInstance.contract = {
        assetType,
        name: asset ? asset.name : node.name,
        propertyDefinitions: Object.entries(definitions).map(([name, definition]) => ({
          name,
          type: definition.type,
          variantOptions: definition.variantOptions || []
        }))
      };
    }
    entry.instance = inspectedInstance;
  }
  nodes.push(entry);
  if (node.type === "INSTANCE") return;
  if (!("children" in node)) return;
  for (const child of node.children) {
    await visit(child, node.id);
  }
};
await visit(root, null);
const collections = [];
for (const id of collectionIds) {
  const collection = await figma.variables.getVariableCollectionByIdAsync(id);
  if (!collection) continue;
  collections.push({
    id: collection.id,
    key: collection.key,
    name: collection.name,
    remote: collection.remote,
    modes: collection.modes.map((mode) => ({ modeId: mode.modeId, name: mode.name }))
  });
}
return { schemaVersion: 1, fileKey: figma.fileKey, rootNodeId: root.id, nodes, collections };`
}

function resolveInspectedComponent({
  node,
  strategy,
  componentsByFigmaKey,
}: {
  node: FigmaInspectionNode
  strategy: FigmaStrategy
  componentsByFigmaKey: Map<string, PreskokComponent>
}):
  | {
      component: PreskokComponent
      asset: PreskokComponent["figma"]["assets"][number]
    }
  | undefined {
  const inspected = node.instance
  if (!inspected) {
    return undefined
  }
  if (strategy === "published" && inspected.componentKey) {
    const component = componentsByFigmaKey.get(inspected.componentKey)
    const asset = component?.figma.assets.find(
      ({ componentKey }) => componentKey === inspected.componentKey
    )
    if (component && asset) {
      return { component, asset }
    }
    return undefined
  }
  if (!inspected.contract) {
    return undefined
  }
  const fingerprint = figmaInspectionContractFingerprint(inspected.contract)
  for (const component of new Set(componentsByFigmaKey.values())) {
    const asset = component.figma.assets.find(
      (candidate) =>
        figmaAssetContractFingerprint(candidate) === fingerprint &&
        normalizeFigmaContractName(candidate.name) ===
          normalizeFigmaContractName(inspected.assetName)
    )
    if (asset) {
      return { component, asset }
    }
  }
  return undefined
}

function analyzeFigmaInspection(
  inspection: FigmaInspection,
  expectedCollectionKeys: Array<string>
) {
  const issues: Array<DesignFinalizationIssue> = []
  const nodesById = new Map<string, FigmaInspectionNode>()
  const visibleNodeIds = new Set<string>()
  const reject = (
    nodeId: string,
    message: string,
    code: DesignFinalizationIssue["code"] = "figma_inspection_invalid",
    recommendation = "Rerun the exact prepared inspection script and pass its complete return value unchanged."
  ) =>
    issues.push({
      severity: "error",
      code,
      message,
      nodeId,
      requirementId: null,
      recommendation,
    })

  for (const node of inspection.nodes) {
    if (nodesById.has(node.nodeId)) {
      reject(
        node.nodeId,
        `The Figma inspection contains duplicate node ID ${node.nodeId}.`
      )
      continue
    }
    nodesById.set(node.nodeId, node)
  }

  const root = nodesById.get(inspection.rootNodeId)
  if (!root) {
    reject(
      inspection.rootNodeId,
      `The inspected root ${inspection.rootNodeId} is missing from the returned Figma node tree.`
    )
  } else if (root.parentId !== null) {
    reject(
      root.nodeId,
      `The declared Figma inspection root ${root.name} has a parent.`
    )
  }

  const collectionsById = new Map(
    inspection.collections.map((collection) => [collection.id, collection])
  )
  const expectedKeys = new Set(expectedCollectionKeys)
  for (const node of inspection.nodes) {
    const path = inspectionPath(node, nodesById)
    const connected = path.at(-1)?.nodeId === inspection.rootNodeId
    const visible = connected && path.every((candidate) => candidate.visible)
    if (visible) {
      visibleNodeIds.add(node.nodeId)
    }
    if (!connected) {
      reject(
        node.nodeId,
        `${node.name} is disconnected from the declared Figma inspection root.`
      )
    }
    if (path.slice(1).some(({ type }) => type === "INSTANCE")) {
      reject(
        node.nodeId,
        `${node.name} is reported as a descendant of an instance, but the prepared inspection stops at instance boundaries.`
      )
    }
    if (node.type !== "INSTANCE" && node.instance) {
      reject(
        node.nodeId,
        `${node.name} contains component identity data but is not a Figma instance.`
      )
    } else if (node.type === "INSTANCE" && visible && !node.instance) {
      reject(
        node.nodeId,
        `${node.name} is a visible Figma instance without component identity data.`
      )
    }
    if (!visible || node.nodeId === inspection.rootNodeId) {
      continue
    }
    for (const [collectionId, modeId] of Object.entries(
      node.explicitVariableModes ?? {}
    )) {
      const collection = collectionsById.get(collectionId)
      if (
        !collection ||
        !expectedKeys.has(collection.key) ||
        root?.explicitVariableModes?.[collectionId] === modeId
      ) {
        continue
      }
      const mode =
        collection.modes.find((candidate) => candidate.modeId === modeId)
          ?.name ?? modeId
      reject(
        node.nodeId,
        `${node.name} overrides the root Preskok ${collection.name} mode with ${mode}.`,
        "theme_mode_mismatch",
        "Apply the Preskok Style and Mode globally on the inspected root and remove visible subtree overrides before handoff."
      )
    }
  }

  return { root, nodesById, visibleNodeIds, issues }
}

function inspectionPath(
  node: FigmaInspectionNode,
  nodesById: Map<string, FigmaInspectionNode>
): Array<FigmaInspectionNode> {
  const path: Array<FigmaInspectionNode> = []
  const visited = new Set<string>()
  let current: FigmaInspectionNode | undefined = node
  while (current && !visited.has(current.nodeId)) {
    path.push(current)
    visited.add(current.nodeId)
    current = current.parentId ? nodesById.get(current.parentId) : undefined
  }
  return path
}

function inspectionAncestors(
  node: FigmaInspectionNode,
  nodesById: Map<string, FigmaInspectionNode>
): Array<string> {
  return inspectionPath(node, nodesById)
    .slice(1)
    .map(({ nodeId }) => nodeId)
    .reverse()
}

function figmaInspectionContractFingerprint(
  contract: NonNullable<
    NonNullable<FigmaInspectionNode["instance"]>["contract"]
  >
): string {
  const normalized = {
    assetType: contract.assetType,
    name: normalizeFigmaContractName(contract.name),
    properties: contract.propertyDefinitions
      .map((property) => ({
        name: normalizeFigmaContractName(property.name),
        type: property.type,
        variantOptions: [...property.variantOptions].sort(),
      }))
      .sort((left, right) => {
        const leftKey = `${left.name}:${left.type}`
        const rightKey = `${right.name}:${right.type}`
        return leftKey.localeCompare(rightKey)
      }),
  }
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex")
}

function installedSourcePath(importPath: string): string {
  return `${importPath}.tsx`
}

function signDesignPlan(
  plan: Omit<DesignPlan, "contractDigest">,
  signingKey: Buffer
): string {
  return createHmac("sha256", signingKey)
    .update(canonicalJson(plan))
    .digest("hex")
}

function verifyDesignPlan(
  plan: Omit<DesignPlan, "contractDigest">,
  contractDigest: string,
  signingKey: Buffer
): boolean {
  if (!/^[a-f0-9]{64}$/i.test(contractDigest)) {
    return false
  }
  const expected = Buffer.from(signDesignPlan(plan, signingKey), "hex")
  const actual = Buffer.from(contractDigest, "hex")
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

const jsonValueSchema = z.json()

type JsonValue = z.infer<typeof jsonValueSchema>

function canonicalJson(value: Omit<DesignPlan, "contractDigest">): string {
  const serialized = JSON.stringify(value)
  const parsed = jsonValueSchema.parse(JSON.parse(serialized))
  return JSON.stringify(canonicalizeJsonValue(parsed))
}

function canonicalizeJsonValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(canonicalizeJsonValue)
  }
  if (value === null || !(value instanceof Object)) {
    return value
  }
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, canonicalizeJsonValue(value[key]!)])
  )
}

function createDesignRequirement({
  requested,
  requestedIndex,
  assetIndex,
  codeName,
  figmaCodeName,
  asset,
  representation,
  expandedIdentity,
}: {
  requested: RequestedDesignRequirement
  requestedIndex: number
  assetIndex: number
  codeName: string
  figmaCodeName: string
  asset: PreskokComponent["figma"]["assets"][number]
  representation: DesignRequirement["representation"]
  expandedIdentity?: string | undefined
}): DesignRequirement {
  const generatedId = `${codeName}-${requestedIndex}-${figmaCodeName}-${assetIndex}`
  const requestedId = requested.id
  const id =
    requestedId && expandedIdentity
      ? `${requestedId}--${requirementIdSegment(expandedIdentity)}`
      : (requestedId ?? generatedId)
  return {
    id,
    role: requested.role ?? "component",
    codeName,
    figmaCodeName,
    assetName: asset.name,
    representation,
    componentKey: asset.componentKey,
    contractFingerprint: figmaAssetContractFingerprint(asset),
    minimumInstances: requested.minimumInstances ?? 1,
    parentRequirementId: requested.parentRequirementId,
    groupId: requested.groupId,
    groupLayout: requested.groupLayout,
  }
}

function requirementIdSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function validateRequirementGraph(
  requirements: Array<DesignRequirement>,
  issues: DesignPlan["issues"]
) {
  const requirementsById = new Map<string, DesignRequirement>()
  const duplicateIds = new Set<string>()
  for (const requirement of requirements) {
    if (requirementsById.has(requirement.id)) {
      duplicateIds.add(requirement.id)
      continue
    }
    requirementsById.set(requirement.id, requirement)
  }
  for (const id of duplicateIds) {
    issues.push({
      severity: "error",
      code: "duplicate_requirement_id",
      message: `Requirement ID ${id} is used more than once.`,
    })
  }

  for (const requirement of requirements) {
    if (requirement.groupLayout && !requirement.groupId) {
      issues.push({
        severity: "error",
        code: "group_layout_without_group",
        message: `Requirement ${requirement.id} declares ${requirement.groupLayout} layout without a groupId.`,
      })
    }
    if (!requirement.parentRequirementId) {
      continue
    }
    if (requirement.parentRequirementId === requirement.id) {
      issues.push({
        severity: "error",
        code: "self_parent_requirement",
        message: `Requirement ${requirement.id} cannot be its own parent.`,
      })
      continue
    }
    if (!requirementsById.has(requirement.parentRequirementId)) {
      issues.push({
        severity: "error",
        code: "missing_parent_requirement",
        message: `Requirement ${requirement.id} references missing parent ${requirement.parentRequirementId}.`,
      })
    }
  }

  const layoutsByGroup = new Map<
    string,
    Set<NonNullable<DesignRequirement["groupLayout"]>>
  >()
  for (const requirement of requirements) {
    if (!requirement.groupId || !requirement.groupLayout) {
      continue
    }
    const layouts = layoutsByGroup.get(requirement.groupId) ?? new Set()
    layouts.add(requirement.groupLayout)
    layoutsByGroup.set(requirement.groupId, layouts)
  }
  for (const [groupId, layouts] of layoutsByGroup) {
    if (layouts.size < 2) {
      continue
    }
    issues.push({
      severity: "error",
      code: "conflicting_group_layout",
      message: `Group ${groupId} declares conflicting layouts: ${[...layouts].join(", ")}.`,
    })
  }

  const visitState = new Map<string, "visiting" | "visited">()
  const stack: Array<string> = []
  const reportedCycles = new Set<string>()
  const visit = (requirementId: string) => {
    if (visitState.get(requirementId) === "visited") {
      return
    }
    if (visitState.get(requirementId) === "visiting") {
      const cycleStart = stack.indexOf(requirementId)
      const cycle = [...stack.slice(cycleStart), requirementId]
      const cycleKey = [...new Set(cycle)].sort().join(":")
      if (!reportedCycles.has(cycleKey)) {
        reportedCycles.add(cycleKey)
        issues.push({
          severity: "error",
          code: "requirement_parent_cycle",
          message: `Requirement parent cycle detected: ${cycle.join(" -> ")}.`,
        })
      }
      return
    }
    visitState.set(requirementId, "visiting")
    stack.push(requirementId)
    const parentRequirementId =
      requirementsById.get(requirementId)?.parentRequirementId
    if (
      parentRequirementId &&
      parentRequirementId !== requirementId &&
      requirementsById.has(parentRequirementId)
    ) {
      visit(parentRequirementId)
    }
    stack.pop()
    visitState.set(requirementId, "visited")
  }
  for (const requirementId of requirementsById.keys()) {
    visit(requirementId)
  }
}

function isAccountSettingsIntent(intent: string) {
  const normalizedIntent = normalize(intent)
  return (
    normalizedIntent.includes("account settings") ||
    normalizedIntent === "settings" ||
    normalizedIntent === "account"
  )
}

function validateUniqueEvidenceNodeClaims(
  evidence: DesignEvidence,
  issues: Array<DesignFinalizationIssue>
): DesignEvidence["instances"] {
  const claimsByNodeId = new Map<string, Array<string>>()
  const addClaim = (nodeId: string, category: string) => {
    const claims = claimsByNodeId.get(nodeId) ?? []
    claims.push(category)
    claimsByNodeId.set(nodeId, claims)
  }
  for (const instance of evidence.instances) {
    addClaim(instance.nodeId, "instance")
  }
  for (const node of evidence.manualNodes) {
    addClaim(node.nodeId, "manual node")
  }
  for (const component of evidence.localComponents) {
    addClaim(component.nodeId, "local component")
  }

  const duplicateNodeIds = new Set<string>()
  for (const [nodeId, claims] of claimsByNodeId) {
    if (claims.length < 2) {
      continue
    }
    duplicateNodeIds.add(nodeId)
    issues.push({
      severity: "error",
      code: "duplicate_node_claim",
      message: `Live node ${nodeId} is claimed more than once (${claims.join(", ")}).`,
      nodeId,
      requirementId: null,
      recommendation:
        "Report each live node exactly once in exactly one evidence category.",
    })
  }
  return evidence.instances.filter(
    (instance) => !duplicateNodeIds.has(instance.nodeId)
  )
}

function assignEvidenceInstances({
  plan,
  instances,
}: {
  plan: DesignPlan
  instances: DesignEvidence["instances"]
}): Map<DesignRequirement, DesignEvidence["instances"]> {
  const assignments = new Map<DesignRequirement, DesignEvidence["instances"]>()
  for (const instance of instances) {
    const candidates = plan.requirements.filter((requirement) =>
      matchesRequirementIdentity(plan, requirement, instance)
    )
    let assigned: DesignRequirement | undefined
    if (instance.requirementId) {
      assigned = candidates.find(({ id }) => id === instance.requirementId)
    } else if (candidates.length === 1) {
      assigned = candidates[0]
    }
    if (!assigned) {
      continue
    }
    const existing = assignments.get(assigned) ?? []
    existing.push(instance)
    assignments.set(assigned, existing)
  }
  return assignments
}

type LayoutContainer = NonNullable<
  DesignEvidence["layout"]
>["containers"][number]

type LayoutChild = LayoutContainer["children"][number]

type LayoutValidation = {
  containersById: Map<string, LayoutContainer>
  parentByNodeId: Map<string, string>
  childrenById: Map<string, LayoutChild>
}

function validateDesignLayoutEvidence(
  plan: DesignPlan,
  evidence: DesignEvidence,
  issues: Array<DesignFinalizationIssue>
): LayoutValidation | null {
  if (!evidence.layout) {
    if (plan.requirements.length > 0) {
      issues.push({
        severity: "error",
        code: "layout_evidence_missing",
        message: "The live Figma layout tree was not included in the evidence.",
        nodeId: evidence.rootNodeId,
        requirementId: null,
        recommendation:
          "Inspect the root and every product-specific local component with the official Figma MCP, then include normalized container bounds and direct children.",
      })
    }
    return null
  }

  const containersById = new Map<string, LayoutContainer>()
  const parentByNodeId = new Map<string, string>()
  const childrenById = new Map<string, LayoutChild>()
  const observedNodeIds = new Set<string>()
  const tolerance = 0.5

  for (const container of evidence.layout.containers) {
    if (containersById.has(container.nodeId)) {
      issues.push({
        severity: "error",
        code: "layout_ancestry_mismatch",
        message: `${container.name} appears more than once in the normalized layout evidence.`,
        nodeId: container.nodeId,
        requirementId: null,
        recommendation:
          "Collect each live container once with its direct children.",
      })
      continue
    }
    containersById.set(container.nodeId, container)
    observedNodeIds.add(container.nodeId)
    if (container.width <= 0 || container.height <= 0) {
      issues.push({
        severity: "error",
        code: "invalid_layout_size",
        message: `${container.name} has invalid bounds ${container.width}×${container.height}.`,
        nodeId: container.nodeId,
        requirementId: null,
        recommendation:
          "Give the container positive dimensions or use Auto Layout hug sizing after its children are inserted.",
      })
    }

    for (const child of container.children) {
      observedNodeIds.add(child.nodeId)
      if (!childrenById.has(child.nodeId)) {
        childrenById.set(child.nodeId, child)
      }
      const existingParent = parentByNodeId.get(child.nodeId)
      if (existingParent && existingParent !== container.nodeId) {
        issues.push({
          severity: "error",
          code: "layout_ancestry_mismatch",
          message: `${child.name} is reported under multiple live parents.`,
          nodeId: child.nodeId,
          requirementId: null,
          recommendation:
            "Reinspect the live Figma tree and report each node under its direct parent only.",
        })
      } else {
        parentByNodeId.set(child.nodeId, container.nodeId)
      }
      if (child.visible && (child.width <= 0 || child.height <= 0)) {
        issues.push({
          severity: "error",
          code: "invalid_layout_size",
          message: `${child.name} has invalid bounds ${child.width}×${child.height}.`,
          nodeId: child.nodeId,
          requirementId: null,
          recommendation:
            "Give the node positive dimensions before finalization.",
        })
      }
      if (!child.visible) {
        continue
      }
      const overflows =
        child.x < -tolerance ||
        child.y < -tolerance ||
        child.x + child.width > container.width + tolerance ||
        child.y + child.height > container.height + tolerance
      if (!overflows) {
        continue
      }
      if (
        container.layoutMode !== "NONE" &&
        child.layoutPositioning === "AUTO"
      ) {
        issues.push({
          severity: "error",
          code: "auto_layout_overflow",
          message: `${child.name} overflows the ${container.name} Auto Layout bounds.`,
          nodeId: child.nodeId,
          requirementId: null,
          recommendation:
            "Restore hug sizing after resize operations and keep automatic children inside the generated container bounds.",
        })
      }
      if (container.clipsContent) {
        issues.push({
          severity: "error",
          code: "clipped_content",
          message: `${child.name} is clipped by ${container.name}.`,
          nodeId: child.nodeId,
          requirementId: null,
          recommendation:
            "Correct the parent sizing or child placement before handoff.",
        })
      }
    }
  }

  validateLayoutParentCycles(parentByNodeId, issues)

  const referencedNodes = [
    { nodeId: evidence.rootNodeId, name: "Design root" },
    ...evidence.instances.map(({ nodeId, name }) => ({ nodeId, name })),
    ...evidence.manualNodes.map(({ nodeId, name }) => ({ nodeId, name })),
    ...evidence.localComponents.map(({ nodeId, name }) => ({ nodeId, name })),
  ]
  for (const node of referencedNodes) {
    if (observedNodeIds.has(node.nodeId)) {
      continue
    }
    issues.push({
      severity: "error",
      code: "live_node_missing",
      message: `${node.name} (${node.nodeId}) is claimed by the evidence but missing from the live layout inspection.`,
      nodeId: node.nodeId,
      requirementId: null,
      recommendation:
        "Refresh the evidence from the live Figma document; do not reuse stale or constructed node IDs.",
    })
  }

  for (const instance of evidence.instances) {
    if (!observedNodeIds.has(instance.nodeId)) {
      continue
    }
    const actualAncestors = collectLayoutAncestors(
      instance.nodeId,
      parentByNodeId
    )
    if (!actualAncestors.includes(evidence.rootNodeId)) {
      issues.push({
        severity: "error",
        code: "layout_ancestry_mismatch",
        message: `${instance.name} is not connected to the inspected design root.`,
        nodeId: instance.nodeId,
        requirementId: instance.requirementId ?? null,
        recommendation:
          "Collect the complete parent chain or move the instance inside the planned root.",
      })
    }
    for (const claimedAncestor of instance.ancestorNodeIds ?? []) {
      if (actualAncestors.includes(claimedAncestor)) {
        continue
      }
      issues.push({
        severity: "error",
        code: "layout_ancestry_mismatch",
        message: `${instance.name} claims ancestor ${claimedAncestor}, but the live layout tree does not.`,
        nodeId: instance.nodeId,
        requirementId: instance.requirementId ?? null,
        recommendation:
          "Use ancestor IDs derived from the same live Figma inspection as the node bounds.",
      })
    }
  }

  return { containersById, parentByNodeId, childrenById }
}

function validateRequiredInstanceLayoutParticipation({
  instance,
  requirement,
  layout,
  issues,
}: {
  instance: DesignEvidence["instances"][number]
  requirement: DesignRequirement
  layout: LayoutValidation | null
  issues: Array<DesignFinalizationIssue>
}): boolean {
  if (!layout) {
    return false
  }
  const child = layout.childrenById.get(instance.nodeId)
  if (!child) {
    issues.push({
      severity: "error",
      code: "layout_participation_missing",
      message: `${instance.name} has no direct child record in the live layout evidence.`,
      nodeId: instance.nodeId,
      requirementId: requirement.id,
      recommendation:
        "Inspect the instance under its direct live parent and include that child record.",
    })
    return false
  }
  let participates = true
  if (!child.visible) {
    participates = false
    issues.push({
      severity: "error",
      code: "required_instance_not_visible",
      message: `${instance.name} is hidden in the live composition.`,
      nodeId: instance.nodeId,
      requirementId: requirement.id,
      recommendation: "Make the required instance visible before finalization.",
    })
  }
  if (child.width <= 0 || child.height <= 0) {
    participates = false
    issues.push({
      severity: "error",
      code: "required_instance_invalid_size",
      message: `${instance.name} has invalid required-instance bounds ${child.width}×${child.height}.`,
      nodeId: instance.nodeId,
      requirementId: requirement.id,
      recommendation:
        "Give the required instance positive dimensions before finalization.",
    })
  }
  const parentNodeId = layout.parentByNodeId.get(instance.nodeId)
  const parent = parentNodeId
    ? layout.containersById.get(parentNodeId)
    : undefined
  if (child.layoutPositioning !== "AUTO" || parent?.layoutMode === "NONE") {
    participates = false
    issues.push({
      severity: "error",
      code: "required_instance_not_auto_layout",
      message: `${instance.name} does not participate in its direct parent's Auto Layout.`,
      nodeId: instance.nodeId,
      requirementId: requirement.id,
      recommendation:
        "Set the required instance to AUTO positioning in its direct Auto Layout parent.",
    })
  }
  return participates
}

function validateLayoutParentCycles(
  parentByNodeId: Map<string, string>,
  issues: Array<DesignFinalizationIssue>
) {
  const completed = new Set<string>()
  const reportedCycles = new Set<string>()
  for (const startNodeId of parentByNodeId.keys()) {
    if (completed.has(startNodeId)) {
      continue
    }
    const path: Array<string> = []
    const pathIndexes = new Map<string, number>()
    let nodeId: string | undefined = startNodeId
    while (nodeId && !completed.has(nodeId)) {
      const cycleStart = pathIndexes.get(nodeId)
      if (cycleStart !== undefined) {
        const cycle = [...path.slice(cycleStart), nodeId]
        const cycleKey = [...new Set(cycle)].sort().join(":")
        if (!reportedCycles.has(cycleKey)) {
          reportedCycles.add(cycleKey)
          issues.push({
            severity: "error",
            code: "layout_ancestry_mismatch",
            message: `The normalized layout parent graph contains a cycle: ${cycle.join(" -> ")}.`,
            nodeId: cycle[0] ?? null,
            requirementId: null,
            recommendation:
              "Reinspect the direct-parent layout tree and report an acyclic hierarchy rooted at the design root.",
          })
        }
        break
      }
      pathIndexes.set(nodeId, path.length)
      path.push(nodeId)
      nodeId = parentByNodeId.get(nodeId)
    }
    for (const visitedNodeId of path) {
      completed.add(visitedNodeId)
    }
  }
}

function validateRequirementGroups({
  plan,
  evidence,
  issues,
  layout,
  matchingInstancesByRequirement,
}: {
  plan: DesignPlan
  evidence: DesignEvidence
  issues: Array<DesignFinalizationIssue>
  layout: LayoutValidation | null
  matchingInstancesByRequirement: Map<
    string,
    Array<DesignEvidence["instances"][number]>
  >
}) {
  if (!layout) {
    return
  }
  const groupedRequirements = new Map<string, Array<DesignRequirement>>()
  for (const requirement of plan.requirements) {
    if (!requirement.groupId) {
      continue
    }
    const existing = groupedRequirements.get(requirement.groupId) ?? []
    existing.push(requirement)
    groupedRequirements.set(requirement.groupId, existing)
  }

  for (const [groupId, requirements] of groupedRequirements) {
    const instances = requirements.flatMap(
      (requirement) => matchingInstancesByRequirement.get(requirement.id) ?? []
    )
    const expectedInstances = requirements.reduce(
      (total, requirement) => total + requirement.minimumInstances,
      0
    )
    if (instances.length < expectedInstances) {
      continue
    }
    const ancestorLists = instances.map((instance) =>
      collectLayoutAncestors(instance.nodeId, layout.parentByNodeId)
    )
    const firstAncestors = ancestorLists[0] ?? []
    const sharedAncestors = firstAncestors.filter((nodeId) =>
      ancestorLists.every((ancestors) => ancestors.includes(nodeId))
    )
    const parentRequirementIds = new Set(
      requirements
        .flatMap((requirement) => {
          if (!requirement.parentRequirementId) {
            return []
          }
          return (
            matchingInstancesByRequirement.get(
              requirement.parentRequirementId
            ) ?? []
          ).map(({ nodeId }) => nodeId)
        })
        .concat(evidence.rootNodeId)
    )
    const expectedLayout = requirements.find(
      ({ groupLayout }) => groupLayout !== undefined
    )?.groupLayout
    const validGroupContainer = sharedAncestors.find((nodeId) => {
      if (parentRequirementIds.has(nodeId)) {
        return false
      }
      const container = layout.containersById.get(nodeId)
      if (expectedLayout && container?.layoutMode !== expectedLayout) {
        return false
      }
      if (!container) {
        return false
      }
      return instances.every((instance) =>
        participatesInContainerAutoLayout({
          nodeId: instance.nodeId,
          container,
          parentByNodeId: layout.parentByNodeId,
        })
      )
    })
    if (validGroupContainer) {
      continue
    }
    const layoutDescription = expectedLayout
      ? `${expectedLayout} Auto Layout`
      : "shared layout"
    issues.push({
      severity: "error",
      code: "component_group_mismatch",
      message: `The ${groupId} instances do not share a ${layoutDescription} container below their planned parent.`,
      nodeId: instances[0]?.nodeId ?? null,
      requirementId: requirements[0]?.id ?? null,
      recommendation:
        "Place the grouped elements in one intentional Auto Layout composition; use a nested row when only part of the group is horizontal.",
    })
  }
}

function participatesInContainerAutoLayout({
  nodeId,
  container,
  parentByNodeId,
}: {
  nodeId: string
  container: LayoutContainer
  parentByNodeId: Map<string, string>
}) {
  const visited = new Set<string>([nodeId])
  let directChildId = nodeId
  let parentNodeId = parentByNodeId.get(directChildId)
  while (parentNodeId && parentNodeId !== container.nodeId) {
    if (visited.has(parentNodeId)) {
      return false
    }
    visited.add(parentNodeId)
    directChildId = parentNodeId
    parentNodeId = parentByNodeId.get(directChildId)
  }
  if (parentNodeId !== container.nodeId) {
    return false
  }
  const directChild = container.children.find(
    ({ nodeId: childNodeId }) => childNodeId === directChildId
  )
  return directChild?.visible && directChild.layoutPositioning === "AUTO"
}

function collectLayoutAncestors(
  nodeId: string,
  parentByNodeId: Map<string, string>
): Array<string> {
  const ancestors: Array<string> = []
  const visited = new Set<string>([nodeId])
  let currentNodeId = nodeId
  while (parentByNodeId.has(currentNodeId)) {
    const parentNodeId = parentByNodeId.get(currentNodeId)
    if (!parentNodeId || visited.has(parentNodeId)) {
      break
    }
    ancestors.push(parentNodeId)
    visited.add(parentNodeId)
    currentNodeId = parentNodeId
  }
  return ancestors
}

function designRequirementIdentity(
  plan: DesignPlan,
  requirement: DesignRequirement
): string {
  if (plan.figmaStrategy === "published") {
    return requirement.componentKey
  }
  return `${requirement.assetName}:${requirement.contractFingerprint}`
}

function matchesRequirementIdentity(
  plan: DesignPlan,
  requirement: DesignRequirement,
  instance: DesignEvidence["instances"][number]
): boolean {
  if (plan.figmaStrategy === "published") {
    return instance.componentKey === requirement.componentKey
  }
  return (
    instance.assetName === requirement.assetName &&
    instance.contractFingerprint === requirement.contractFingerprint
  )
}

function normalizeFigmaContractName(value: string): string {
  return value
    .replace(/#\d+:\d+$/, "")
    .trim()
    .toLowerCase()
}

export async function loadPreskokDesignSystem() {
  const catalogUrl = new URL("../generated/catalog.json", import.meta.url)
  const catalog = JSON.parse(
    await fs.readFile(catalogUrl, "utf8")
  ) as PreskokCatalog
  return createPreskokDesignSystem({ catalog })
}

function scoreComponent(
  component: PreskokComponent,
  query: string,
  queryTokens: Array<string>,
  semanticNames: Set<string>
) {
  const normalizedQuery = normalize(query)
  const normalizedName = normalize(component.name)
  let score = 0
  if (normalizedName === normalizedQuery) {
    score += 1_000
  } else if (normalizedName.includes(normalizedQuery)) {
    score += 300
  }
  if (semanticNames.has(component.name)) {
    score += 120
  }

  const searchable = normalize(
    [
      component.name,
      component.registryName,
      component.description,
      component.documentation?.title,
      component.documentation?.description,
      ...component.exports,
      ...component.examples.map((example) => example.name),
      ...Object.keys(component.variants),
      ...Object.values(component.variants).flatMap((variant) => variant.values),
    ]
      .filter(Boolean)
      .join(" ")
  )
  for (const token of queryTokens) {
    if (searchable.includes(token)) {
      score += 20
    }
    if (normalizedName.includes(token)) {
      score += 80
    }
  }
  return score
}

function tokenize(value: string) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 1)
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function resolveComponent(
  input: ArtifactComponent,
  byName: Map<string, PreskokComponent>,
  byFigmaKey: Map<string, PreskokComponent>
) {
  if (input.codeName) {
    const normalized = input.codeName.replace(/^@preskok\//, "")
    const component = byName.get(normalized)
    if (component) {
      return component
    }
  }
  if (input.figmaComponentKey) {
    return byFigmaKey.get(input.figmaComponentKey)
  }
  return undefined
}

function primaryExport(component: PreskokComponent) {
  const expected = component.name
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join("")
  const exact = component.exports.find((name) => name === expected)
  if (exact) {
    return exact
  }
  const runtimeExport = component.exports.find(
    (name) => !/(?:Props|Styles|Context)$/.test(name) && /^[A-Z]/.test(name)
  )
  return runtimeExport ?? component.exports[0] ?? expected
}

function uniqueStrings(values: Array<string>) {
  return [...new Set(values)]
}

function figmaKeyOwnershipScore(
  component: PreskokComponent,
  assetName: string
) {
  let score = 0
  if (component.figma.status === "verified") {
    score += 100
  } else if (component.figma.status === "partial") {
    score += 50
  }
  if (normalize(assetName) === normalize(component.name)) {
    score += 25
  }
  if (normalize(component.figma.query) === normalize(component.name)) {
    score += 10
  }
  return score
}

function isFigmaPropertyValueValid(
  type: "BOOLEAN" | "INSTANCE_SWAP" | "TEXT" | "VARIANT",
  value: string | number | boolean
) {
  if (type === "BOOLEAN") {
    return value === true || value === false
  }
  return value === String(value)
}
