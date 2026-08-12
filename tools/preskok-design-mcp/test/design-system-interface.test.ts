import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { beforeAll, describe, expect, it } from "vitest"

import {
  createPreskokDesignSystem,
  type DesignEvidence,
} from "../src/design-system.js"
import { generatePreskokCatalog } from "../src/generation/catalog.js"
import type { PreskokCatalog } from "../src/types.js"

const packageDirectory = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(packageDirectory, "../../..")

let catalog: PreskokCatalog

beforeAll(async () => {
  catalog = await generatePreskokCatalog({ workspaceRoot })
})

function createPassingLayoutEvidence({
  rootNodeId,
  instances,
  localComponents = [],
}: {
  rootNodeId: string
  instances: DesignEvidence["instances"]
  localComponents?: DesignEvidence["localComponents"]
}): NonNullable<DesignEvidence["layout"]> {
  const card = instances.find(
    ({ requirementId }) => requirementId === "settings-card"
  )
  if (!card) {
    throw new Error("Expected settings card evidence")
  }
  const actionsSeparator = instances.find(
    ({ requirementId }) => requirementId === "actions-separator"
  )
  const actionButtons = instances.filter(({ requirementId }) =>
    ["cancel-action", "save-action"].includes(requirementId ?? "")
  )
  const contentInstances = instances.filter(({ requirementId }) =>
    [
      "email-label",
      "email-input",
      "email-description",
      "profile-separator",
      "updates-switch",
    ].includes(requirementId ?? "")
  )
  const child = (
    instance: DesignEvidence["instances"][number],
    x: number,
    y: number,
    width: number,
    height: number
  ) => ({
    nodeId: instance.nodeId,
    name: instance.name,
    type: "INSTANCE",
    x,
    y,
    width,
    height,
    visible: true,
    layoutPositioning: "AUTO" as const,
  })
  const containers: NonNullable<DesignEvidence["layout"]>["containers"] = [
    {
      nodeId: rootNodeId,
      name: "Design root",
      type: "FRAME",
      width: 1000,
      height: 1000,
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "FIXED",
      counterAxisSizingMode: "FIXED",
      clipsContent: false,
      children: [child(card, 0, 0, 600, 600)],
    },
    {
      nodeId: card.nodeId,
      name: card.name,
      type: "INSTANCE",
      width: 600,
      height: 600,
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      clipsContent: false,
      children: [
        {
          nodeId: `${rootNodeId}:content`,
          name: "Card content",
          type: "FRAME",
          x: 0,
          y: 0,
          width: 600,
          height: 300,
          visible: true,
          layoutPositioning: "AUTO",
        },
        {
          nodeId: `${rootNodeId}:actions`,
          name: "Card actions",
          type: "FRAME",
          x: 0,
          y: 320,
          width: 600,
          height: 120,
          visible: true,
          layoutPositioning: "AUTO",
        },
      ],
    },
    {
      nodeId: `${rootNodeId}:content`,
      name: "Card content",
      type: "FRAME",
      width: 600,
      height: 300,
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      clipsContent: false,
      children: contentInstances.map((instance, index) =>
        child(instance, 0, index * 48, 560, 32)
      ),
    },
    {
      nodeId: `${rootNodeId}:actions`,
      name: "Card actions",
      type: "FRAME",
      width: 600,
      height: 120,
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      clipsContent: false,
      children: [
        ...(actionsSeparator ? [child(actionsSeparator, 0, 0, 600, 1)] : []),
        {
          nodeId: `${rootNodeId}:action-row`,
          name: "Action row",
          type: "FRAME",
          x: 0,
          y: 24,
          width: 600,
          height: 40,
          visible: true,
          layoutPositioning: "AUTO",
        },
      ],
    },
    {
      nodeId: `${rootNodeId}:action-row`,
      name: "Action row",
      type: "FRAME",
      width: 600,
      height: 40,
      layoutMode: "HORIZONTAL",
      primaryAxisSizingMode: "FIXED",
      counterAxisSizingMode: "AUTO",
      clipsContent: false,
      children: actionButtons.map((instance, index) =>
        child(instance, 400 + index * 96, 0, 88, 40)
      ),
    },
  ]
  for (const component of localComponents) {
    containers.push({
      nodeId: component.nodeId,
      name: component.name,
      type: "COMPONENT",
      width: 600,
      height: 100,
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      clipsContent: false,
      children: [],
    })
  }
  return { containers }
}

describe("PreskokDesignSystem interface", () => {
  it("plans account settings as a complete library-native composition", () => {
    const system = createPreskokDesignSystem({ catalog })

    const plan = system.planDesign({
      intent:
        "An account settings card with an email field, product update switch, cancel action, and save action.",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
    })

    expect(plan).toMatchObject({
      readyToBuild: true,
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      source: {
        fileKey: "jGwVPvHf0oT3uV4aLzGdDl",
        libraryKey:
          "lk-46e05046e297a108a9b995aad38fbb0c3b67d59a51e08a1d07250d90ca40d06ac57264cc7314adb8eec854aa2c2d9129e74e174394f8e5a83d51e9baebd9cc95",
        publishedAccess: {
          preferred: "enabled_library",
          directImportByKeySupported: true,
          assetsPanelRequiresEnabledLibrary: true,
        },
        collections: {
          style: { name: "Style", mode: "Default" },
          colorMode: { name: "Mode", mode: "Light" },
        },
      },
    })
    expect(
      plan.requirements.map(({ assetName, minimumInstances }) => [
        assetName,
        minimumInstances,
      ])
    ).toEqual([
      ["Card", 1],
      ["Field Label", 1],
      ["Input", 1],
      ["Field Description", 1],
      ["Separator", 1],
      ["Switch", 1],
      ["Separator", 1],
      ["Button", 1],
      ["Button", 1],
    ])
    expect(
      plan.requirements.map(({ id, groupId, groupLayout }) => ({
        id,
        groupId,
        groupLayout,
      }))
    ).toEqual(
      expect.arrayContaining([
        {
          id: "profile-separator",
          groupId: undefined,
          groupLayout: undefined,
        },
        {
          id: "actions-separator",
          groupId: undefined,
          groupLayout: undefined,
        },
        {
          id: "cancel-action",
          groupId: "form-actions",
          groupLayout: "HORIZONTAL",
        },
        {
          id: "save-action",
          groupId: "form-actions",
          groupLayout: "HORIZONTAL",
        },
      ])
    )
    expect(plan.contractDigest).toMatch(/^[a-f0-9]{64}$/)
  })

  it("requires explicit requirement IDs when planned assets repeat", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
    })
    const instances: DesignEvidence["instances"] = plan.requirements.flatMap(
      (requirement) =>
        Array.from({ length: requirement.minimumInstances }, (_, index) => ({
          nodeId: `${requirement.id}:${index}`,
          requirementId: requirement.id,
          name: `${requirement.assetName} ${index + 1}`,
          assetName: requirement.assetName,
          componentKey: requirement.componentKey,
          ancestorNodeIds: requirement.parentRequirementId
            ? ["settings-card:0"]
            : [],
          remote: true,
          detached: false,
          properties: {},
        }))
    )
    const layout = createPassingLayoutEvidence({
      rootNodeId: "ambiguous-root",
      instances,
    })
    for (const instance of instances) {
      if (["Separator", "Button"].includes(instance.assetName)) {
        instance.requirementId = undefined
      }
    }

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "ambiguous-file",
        rootNodeId: "ambiguous-root",
        enabledLibraryKeys: [plan.source.libraryKey],
        instances,
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
        layout,
      },
    })

    expect(result.ready).toBe(false)
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "ambiguous_requirement_assignment",
        }),
      ])
    )
  })

  it("rejects the mixed showcase when required library usage is only implied", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
    })

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "MgQbBtbb503ZchJt0ZFz2k",
        rootNodeId: "2:34",
        enabledLibraryKeys: ["material-library-key"],
        instances: [
          {
            nodeId: "6:1738",
            name: "Email input",
            assetName: "Input",
            componentKey: "010c896516d2d28ecb199d05d6bb44fe294c1971",
            remote: true,
            detached: false,
            properties: {},
          },
          {
            nodeId: "6:1747",
            name: "Updates switch",
            assetName: "Switch",
            componentKey: "074088f22c1be7b242db63a173c01d4bec78cec5",
            remote: true,
            detached: false,
            properties: {},
          },
          {
            nodeId: "6:1757",
            name: "Cancel",
            assetName: "Button",
            requirementId: "cancel-action",
            componentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
            remote: true,
            detached: false,
            properties: {},
          },
          {
            nodeId: "6:1784",
            name: "Save changes",
            assetName: "Button",
            requirementId: "save-action",
            componentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
            remote: true,
            detached: false,
            properties: {},
          },
        ],
        manualNodes: [
          {
            nodeId: "6:1731",
            name: "Account settings card",
            type: "FRAME",
            claimedAssetName: "Card",
            tokenBound: true,
          },
          {
            nodeId: "6:1735",
            name: "Divider",
            type: "RECTANGLE",
            claimedAssetName: "Separator",
            tokenBound: true,
          },
          {
            nodeId: "6:1737",
            name: "Label",
            type: "TEXT",
            claimedAssetName: "Field Label",
            tokenBound: true,
          },
          {
            nodeId: "6:1741",
            name: "Description",
            type: "TEXT",
            claimedAssetName: "Field Description",
            tokenBound: true,
          },
        ],
        localComponents: [
          {
            nodeId: "2:100",
            name: "Navigation item",
            instanceCount: 4,
          },
        ],
        modes: [
          {
            collectionName: "Style",
            collectionKey: "1a314502c07cb84211e881b604fbac213193fecd",
            mode: "Default",
            explicit: false,
            remote: true,
          },
          {
            collectionName: "Mode",
            collectionKey: "edff7b77cb35e2b23575001e27610e38c18ed6ba",
            mode: "Light",
            explicit: false,
            remote: true,
          },
        ],
        hardcodedValues: [],
      },
    })

    expect(result.ready).toBe(false)
    expect(result.handoff).toBeNull()
    expect(result.issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "library_not_enabled",
        "manual_component_replacement",
        "theme_mode_not_explicit",
        "unapproved_local_component",
      ])
    )
    expect(result.coverage).toMatchObject({
      requiredInstances: 9,
      matchedInstances: 4,
      satisfiedInstances: 0,
    })
  })

  it("keeps the current live showcase as a reproducible negative fixture", async () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
    })
    const evidence = JSON.parse(
      await fs.readFile(
        path.join(packageDirectory, "fixtures/current-showcase-evidence.json"),
        "utf8"
      )
    ) as DesignEvidence

    const result = system.finalizeDesign({ plan, evidence })

    expect(result.ready).toBe(false)
    expect(result.handoff).toBeNull()
    expect(result.coverage).toEqual({
      requiredInstances: 9,
      matchedInstances: 4,
      satisfiedInstances: 0,
    })
  })

  it("finalizes the live official-file copied showcase fixture", async () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "copied",
      theme: { style: "Briefd", mode: "Dark" },
    })
    const evidence = JSON.parse(
      await fs.readFile(
        path.join(
          packageDirectory,
          "fixtures/official-copied-showcase-evidence.json"
        ),
        "utf8"
      )
    ) as DesignEvidence

    const result = system.finalizeDesign({
      plan,
      evidence,
      notes: [
        "Live audited in the official Preskok source file at node 4441:3.",
      ],
    })

    expect(result).toMatchObject({
      ready: true,
      issues: [],
      coverage: {
        requiredInstances: 9,
        matchedInstances: 9,
        satisfiedInstances: 9,
      },
      handoff: {
        ready: true,
        direction: "figma_to_code",
      },
    })
  })

  it("finalizes the live published direct-import showcase fixture", async () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Dark" },
    })
    const evidence = JSON.parse(
      await fs.readFile(
        path.join(
          packageDirectory,
          "fixtures/published-direct-import-showcase-evidence.json"
        ),
        "utf8"
      )
    ) as DesignEvidence

    const result = system.finalizeDesign({
      plan,
      evidence,
      notes: [
        "Live audited in the standalone demo at node 17:246 using direct published imports.",
      ],
    })

    expect(result).toMatchObject({
      ready: true,
      issues: [
        {
          severity: "warning",
          code: "library_not_enabled",
        },
      ],
      coverage: {
        requiredInstances: 9,
        matchedInstances: 9,
        satisfiedInstances: 9,
      },
      handoff: {
        ready: true,
        direction: "figma_to_code",
      },
    })
  })

  it("finalizes a complete published-library design into a verified handoff", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Dark" },
    })
    const instances = plan.requirements.flatMap((requirement) =>
      Array.from({ length: requirement.minimumInstances }, (_, index) => ({
        nodeId: `${requirement.id}:${index}`,
        requirementId: requirement.id,
        name: `${requirement.assetName} ${index + 1}`,
        assetName: requirement.assetName,
        componentKey: requirement.componentKey,
        ancestorNodeIds: requirement.parentRequirementId
          ? ["settings-card:0"]
          : [],
        remote: true,
        detached: false,
        properties: {},
      }))
    )
    const localComponents = [
      {
        nodeId: "100:2",
        name: "Account settings content",
        instanceCount: 1,
        reason:
          "Product-specific composition placed inside the Preskok Card content slot.",
      },
    ]

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "published-consumer-file",
        rootNodeId: "100:1",
        enabledLibraryKeys: [plan.source.libraryKey],
        instances,
        manualNodes: [],
        localComponents,
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
            mode: "Dark",
            explicit: true,
            remote: true,
          },
        ],
        hardcodedValues: [],
        layout: createPassingLayoutEvidence({
          rootNodeId: "100:1",
          instances,
          localComponents,
        }),
      },
    })

    expect(result).toMatchObject({
      ready: true,
      issues: [],
      coverage: { requiredInstances: 9, satisfiedInstances: 9 },
      handoff: {
        ready: true,
        direction: "figma_to_code",
        installCommands: [
          "pnpm dlx shadcn@latest add @preskok/card @preskok/field @preskok/input @preskok/separator @preskok/switch @preskok/button",
        ],
      },
    })
  })

  it("finalizes a complete published direct-import design with a library warning", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Dark" },
    })
    const instances = plan.requirements.flatMap((requirement) =>
      Array.from({ length: requirement.minimumInstances }, (_, index) => ({
        nodeId: `${requirement.id}:${index}`,
        requirementId: requirement.id,
        name: `${requirement.assetName} ${index + 1}`,
        assetName: requirement.assetName,
        componentKey: requirement.componentKey,
        ancestorNodeIds: requirement.parentRequirementId
          ? ["settings-card:0"]
          : [],
        remote: true,
        detached: false,
        properties: {},
      }))
    )

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "published-direct-import-file",
        rootNodeId: "100:100",
        enabledLibraryKeys: [],
        instances,
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
            mode: "Dark",
            explicit: true,
            remote: true,
          },
        ],
        hardcodedValues: [],
        layout: createPassingLayoutEvidence({
          rootNodeId: "100:100",
          instances,
        }),
      },
    })

    expect(result.ready).toBe(true)
    expect(result.handoff).not.toBeNull()
    expect(result.issues).toEqual([
      expect.objectContaining({
        severity: "warning",
        code: "library_not_enabled",
      }),
    ])
  })

  it("rejects stale action evidence and overflowing one-pixel Auto Layout sources", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Dark" },
    })
    const instances = plan.requirements.flatMap((requirement) =>
      Array.from({ length: requirement.minimumInstances }, (_, index) => ({
        nodeId: `${requirement.id}:${index}`,
        requirementId: requirement.id,
        name: `${requirement.assetName} ${index + 1}`,
        assetName: requirement.assetName,
        componentKey: requirement.componentKey,
        ancestorNodeIds: requirement.parentRequirementId
          ? ["settings-card:0"]
          : [],
        remote: true,
        detached: false,
        properties: {},
      }))
    )
    const localComponents = [
      {
        nodeId: "source-content",
        name: "Product content source",
        instanceCount: 1,
        reason: "Product-specific Card content composition.",
      },
      {
        nodeId: "source-footer",
        name: "Product footer source",
        instanceCount: 1,
        reason: "Product-specific Card action composition.",
      },
    ]
    const layout = createPassingLayoutEvidence({
      rootNodeId: "overflow-root",
      instances,
      localComponents,
    })
    const actionsSeparator = instances.find(
      ({ requirementId }) => requirementId === "actions-separator"
    )
    if (!actionsSeparator) {
      throw new Error("Expected actions separator evidence")
    }
    const actionsContainer = layout.containers.find(
      ({ nodeId }) => nodeId === "overflow-root:actions"
    )
    const sourceContent = layout.containers.find(
      ({ nodeId }) => nodeId === "source-content"
    )
    const sourceFooter = layout.containers.find(
      ({ nodeId }) => nodeId === "source-footer"
    )
    const actionRow = layout.containers.find(
      ({ nodeId }) => nodeId === "overflow-root:action-row"
    )
    if (!actionsContainer || !sourceContent || !sourceFooter || !actionRow) {
      throw new Error("Expected generated layout containers")
    }
    const floatingAction = actionRow.children[0]
    if (!floatingAction) {
      throw new Error("Expected an action row child")
    }
    floatingAction.layoutPositioning = "ABSOLUTE"
    actionsContainer.children = actionsContainer.children.filter(
      ({ nodeId }) => nodeId !== actionsSeparator.nodeId
    )
    sourceContent.height = 1
    sourceContent.primaryAxisSizingMode = "FIXED"
    sourceContent.children = [
      {
        nodeId: "source-actions-separator",
        name: "Actions separator source",
        type: "INSTANCE",
        x: 0,
        y: 217,
        width: 600,
        height: 1,
        visible: true,
        layoutPositioning: "AUTO",
      },
    ]
    sourceFooter.height = 1
    sourceFooter.primaryAxisSizingMode = "FIXED"
    sourceFooter.children = [
      {
        nodeId: "source-cancel",
        name: "Cancel source",
        type: "INSTANCE",
        x: 400,
        y: -18.5,
        width: 80,
        height: 38,
        visible: true,
        layoutPositioning: "AUTO",
      },
    ]

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "overflow-file",
        rootNodeId: "overflow-root",
        enabledLibraryKeys: [plan.source.libraryKey],
        instances,
        manualNodes: [],
        localComponents,
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
            mode: "Dark",
            explicit: true,
            remote: true,
          },
        ],
        hardcodedValues: [],
        layout,
      },
    })

    expect(result.ready).toBe(false)
    expect(result.handoff).toBeNull()
    expect(result.issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "live_node_missing",
        "auto_layout_overflow",
        "component_group_mismatch",
      ])
    )
  })

  it("finalizes a copied Preskok library by stable component contracts", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "copied",
      theme: { style: "Briefd", mode: "Dark" },
    })

    expect(plan.readyToBuild).toBe(true)
    expect(
      plan.requirements.every(({ contractFingerprint }) =>
        /^[a-f0-9]{64}$/.test(contractFingerprint)
      )
    ).toBe(true)

    const instances = plan.requirements.flatMap((requirement) =>
      Array.from({ length: requirement.minimumInstances }, (_, index) => ({
        nodeId: `${requirement.id}:${index}`,
        requirementId: requirement.id,
        name: `${requirement.assetName} ${index + 1}`,
        assetName: requirement.assetName,
        contractFingerprint: requirement.contractFingerprint,
        ancestorNodeIds: requirement.parentRequirementId
          ? ["settings-card:0"]
          : [],
        remote: false,
        detached: false,
        properties: {},
      }))
    )

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "copied-preskok-file",
        rootNodeId: "200:1",
        enabledLibraryKeys: [],
        instances,
        manualNodes: [],
        localComponents: [],
        modes: [
          {
            collectionName: "Style",
            collectionKey: "local-style-key",
            mode: "Briefd",
            explicit: true,
            remote: false,
          },
          {
            collectionName: "Mode",
            collectionKey: "local-mode-key",
            mode: "Dark",
            explicit: true,
            remote: false,
          },
        ],
        hardcodedValues: [],
        layout: createPassingLayoutEvidence({
          rootNodeId: "200:1",
          instances,
        }),
      },
    })

    expect(result).toMatchObject({
      ready: true,
      issues: [],
      coverage: { requiredInstances: 9, satisfiedInstances: 9 },
      handoff: { ready: true, direction: "figma_to_code" },
    })
  })

  it("rejects copied components whose local contract drifted", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "copied",
      theme: { style: "Default", mode: "Light" },
    })
    const instances = plan.requirements.flatMap((requirement) =>
      Array.from({ length: requirement.minimumInstances }, (_, index) => ({
        nodeId: `${requirement.id}:${index}`,
        requirementId: requirement.id,
        name: `${requirement.assetName} ${index + 1}`,
        assetName: requirement.assetName,
        contractFingerprint: requirement.contractFingerprint,
        ancestorNodeIds: requirement.parentRequirementId
          ? ["settings-card:0"]
          : [],
        remote: false,
        detached: false,
        properties: {},
      }))
    )
    const input = instances.find(({ assetName }) => assetName === "Input")
    if (!input) {
      throw new Error("Expected Input evidence fixture")
    }
    input.contractFingerprint = "0".repeat(64)

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "copied-preskok-file",
        rootNodeId: "300:1",
        enabledLibraryKeys: [],
        instances,
        manualNodes: [],
        localComponents: [],
        modes: [
          {
            collectionName: "Style",
            mode: "Default",
            explicit: true,
            remote: false,
          },
          {
            collectionName: "Mode",
            mode: "Light",
            explicit: true,
            remote: false,
          },
        ],
        hardcodedValues: [],
      },
    })

    expect(result.ready).toBe(false)
    expect(result.handoff).toBeNull()
    expect(result.coverage).toMatchObject({
      requiredInstances: 9,
      satisfiedInstances: 8,
    })
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "component_contract_mismatch",
          requirementId: "email-input",
        }),
      ])
    )
  })

  it("only plans theme modes available to the selected Figma strategy", () => {
    const system = createPreskokDesignSystem({ catalog })

    const published = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Briefd", mode: "Dark" },
    })
    const copied = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "copied",
      theme: { style: "Briefd", mode: "Dark" },
    })

    expect(published.readyToBuild).toBe(false)
    expect(published.issues).toEqual([
      expect.objectContaining({ code: "theme_mode_unavailable" }),
    ])
    expect(copied.readyToBuild).toBe(true)
    expect(copied.issues).toEqual([])
  })

  it("plans every catalog component through a native, fallback, or code-only contract", () => {
    const system = createPreskokDesignSystem({ catalog })

    for (const component of catalog.components) {
      const plan = system.planDesign({
        intent: `Use ${component.name}`,
        figmaStrategy: "published",
        theme: { style: "Default", mode: "Light" },
        requirements: [{ codeName: component.name }],
      })

      expect(plan.readyToBuild, component.name).toBe(true)
      expect(plan.codeComponents).toContain(component.name)
      if (component.figma.status === "not_applicable") {
        expect(plan.requirements, component.name).toEqual([])
        continue
      }
      expect(plan.requirements.length, component.name).toBeGreaterThan(0)
      expect(
        plan.requirements.every(
          ({ componentKey, contractFingerprint }) =>
            componentKey.length > 0 &&
            /^[a-f0-9]{64}$/.test(contractFingerprint)
        ),
        component.name
      ).toBe(true)
    }
  })

  it("does not invent a composition for an underspecified design intent", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "A fresh product experience",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
    })

    expect(plan.readyToBuild).toBe(false)
    expect(plan.requirements).toEqual([])
    expect(plan.issues).toContainEqual(
      expect.objectContaining({ code: "composition_requirements_needed" })
    )
  })

  it("rejects a plan that changed after its contract digest was issued", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
    })
    plan.theme.mode = "Dark"

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "tampered-plan-file",
        rootNodeId: "400:1",
        enabledLibraryKeys: [plan.source.libraryKey],
        instances: [],
        manualNodes: [],
        localComponents: [],
        modes: [],
        hardcodedValues: [],
      },
    })

    expect(result.ready).toBe(false)
    expect(result.issues).toContainEqual(
      expect.objectContaining({ code: "plan_contract_mismatch" })
    )
  })

  it("rejects linked components placed outside the required composition hierarchy", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Account settings",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
    })
    const instances = plan.requirements.flatMap((requirement) =>
      Array.from({ length: requirement.minimumInstances }, (_, index) => ({
        nodeId: `${requirement.id}:${index}`,
        requirementId: requirement.id,
        name: `${requirement.assetName} ${index + 1}`,
        assetName: requirement.assetName,
        componentKey: requirement.componentKey,
        ancestorNodeIds: requirement.parentRequirementId
          ? ["settings-card:0"]
          : [],
        remote: true,
        detached: false,
        properties: {},
      }))
    )
    const emailInput = instances.find(
      ({ nodeId }) => nodeId === "email-input:0"
    )
    if (!emailInput) {
      throw new Error("Expected email input evidence")
    }
    emailInput.ancestorNodeIds = []

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "published-consumer-file",
        rootNodeId: "500:1",
        enabledLibraryKeys: [plan.source.libraryKey],
        instances,
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
      },
    })

    expect(result.ready).toBe(false)
    expect(result.coverage.satisfiedInstances).toBe(8)
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "component_hierarchy_mismatch",
        requirementId: "email-input",
        nodeId: "email-input:0",
      })
    )
  })

  it("rejects invalid Figma instance properties during finalization", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Email input",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ codeName: "input" }],
    })
    const requirement = plan.requirements[0]
    if (!requirement) {
      throw new Error("Expected input requirement")
    }

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "invalid-properties-file",
        rootNodeId: "600:1",
        enabledLibraryKeys: [plan.source.libraryKey],
        instances: [
          {
            nodeId: "600:2",
            name: "Email input",
            assetName: requirement.assetName,
            componentKey: requirement.componentKey,
            remote: true,
            detached: false,
            properties: { State: "Exploding" },
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
      },
    })

    expect(result.ready).toBe(false)
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "invalid_component_property",
        nodeId: "600:2",
      })
    )
  })

  it("rejects unbound manual values and wrong published collection keys", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Code-only locale provider",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ codeName: "locale-context" }],
    })

    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "unbound-manual-file",
        rootNodeId: "700:1",
        enabledLibraryKeys: [plan.source.libraryKey],
        instances: [],
        manualNodes: [
          {
            nodeId: "700:2",
            name: "Product illustration",
            type: "VECTOR",
            tokenBound: false,
            reason: "Product-specific artwork.",
          },
        ],
        localComponents: [],
        modes: [
          {
            collectionName: "Style",
            collectionKey: "wrong-published-style-key",
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
      },
    })

    expect(result.ready).toBe(false)
    expect(result.issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "unbound_manual_value",
        "theme_collection_key_mismatch",
      ])
    )
  })

  it("finds exact and use-case components without exposing generator details", () => {
    const system = createPreskokDesignSystem({ catalog })

    expect(system.search({ query: "button", limit: 3 })[0]).toMatchObject({
      kind: "component",
      name: "button",
      registryName: "@preskok/button",
    })

    const settings = system.search({
      query: "account settings form",
      limit: 12,
    })
    const names = settings.map((result) => result.name)

    expect(names).toEqual(
      expect.arrayContaining(["avatar", "button", "text-field", "switch"])
    )
  })

  it("resolves components by slug, registry name, or verified Figma key", () => {
    const system = createPreskokDesignSystem({ catalog })

    for (const component of catalog.components) {
      expect(system.getComponent(component.name)).toBe(component)
      expect(system.getComponent(component.registryName)).toBe(component)
      for (const asset of component.figma.assets) {
        expect(
          system
            .getComponent(asset.componentKey)
            .figma.assets.some(
              ({ componentKey }) => componentKey === asset.componentKey
            )
        ).toBe(true)
      }
    }

    expect(system.getComponent("button").name).toBe("button")
    expect(system.getComponent("@preskok/button").name).toBe("button")
    expect(
      system.getComponent("4eb4cd0146113729c1848c95644b871e3cb88d0a").name
    ).toBe("button")
    expect(
      system.getComponent("aecf5f15ecf73fc8543f3b042a253bf814298f29").name
    ).toBe("area-chart")
    expect(() => system.getComponent("imaginary-control")).toThrow(
      /Unknown Preskok component/
    )
  })

  it("reports actionable catalog and Figma gaps", () => {
    const system = createPreskokDesignSystem({ catalog })
    const status = system.getStatus()

    expect(status).toMatchObject({
      components: {
        total: 96,
        documented: 95,
        withExamples: 95,
      },
      figma: {
        verified: 81,
        partial: 11,
        missing: 3,
        notApplicable: 1,
      },
    })
    expect(status.gaps.missingFigma).toEqual([
      "preview-trigger",
      "select",
      "token-field",
    ])
    expect(status.catalogDigest).toMatch(/^[a-f0-9]{64}$/)
  })

  it("returns published native-Figma fallback assets for every missing set", () => {
    const system = createPreskokDesignSystem({ catalog })

    for (const codeName of ["preview-trigger", "select", "token-field"]) {
      const handoff = system.createHandoff({
        direction: "code_to_figma",
        components: [{ codeName }],
      })
      expect(handoff.ready).toBe(true)
      expect(handoff.components[0]?.figmaFallbacks.length).toBeGreaterThan(0)
      expect(
        handoff.components[0]?.figmaFallbacks.every(
          (fallback) => fallback.assets.length > 0
        )
      ).toBe(true)
      expect(handoff.validation.issues).toContainEqual(
        expect.objectContaining({ code: "missing_figma_mapping" })
      )
    }
  })

  it("validates Figma and code artifacts through the shared contract", () => {
    const system = createPreskokDesignSystem({ catalog })
    const valid = system.validateArtifact({
      target: "figma",
      components: [
        {
          codeName: "button",
          figmaComponentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
          properties: { intent: "primary", size: "md" },
        },
      ],
      tokens: [{ name: "--primary" }],
    })

    expect(valid.valid).toBe(true)
    expect(valid.issues).toEqual([])

    const invalid = system.validateArtifact({
      target: "figma",
      components: [
        {
          codeName: "button",
          figmaComponentKey: "wrong-key",
          detached: true,
          properties: { intent: "imaginary" },
        },
        { codeName: "select" },
      ],
      tokens: [{ hardcodedValue: "#ff00ff" }, { name: "--not-a-token" }],
    })

    expect(invalid.valid).toBe(false)
    expect(invalid.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "detached_instance",
        "figma_key_mismatch",
        "invalid_variant",
        "missing_figma_mapping",
        "hardcoded_value",
        "unknown_token",
      ])
    )
  })

  it("validates live Figma property names and value types", () => {
    const system = createPreskokDesignSystem({ catalog })
    const valid = system.validateArtifact({
      target: "figma",
      components: [
        {
          codeName: "input",
          figmaComponentKey: "010c896516d2d28ecb199d05d6bb44fe294c1971",
          properties: {
            "Text#3158:0": "designer@preskok.si",
            Scale: "Desktop",
            Value: "Filled",
            State: "Default",
          },
        },
        {
          codeName: "switch",
          figmaComponentKey: "074088f22c1be7b242db63a173c01d4bec78cec5",
          properties: {
            "Show description#3356:50": false,
            Selected: "On",
          },
        },
      ],
    })

    expect(valid).toMatchObject({
      valid: true,
      summary: { errors: 0, warnings: 0 },
      resolvedComponents: ["input", "switch"],
    })

    const invalid = system.validateArtifact({
      target: "figma",
      components: [
        {
          codeName: "input",
          properties: { State: "Imaginary", "Text#3158:0": true },
        },
      ],
    })
    expect(invalid.issues.map(({ code }) => code)).toEqual([
      "invalid_variant",
      "invalid_property_type",
    ])
  })

  it("creates an implementation-ready Figma-to-code handoff", () => {
    const system = createPreskokDesignSystem({ catalog })
    const handoff = system.createHandoff({
      direction: "figma_to_code",
      components: [
        {
          figmaComponentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
          properties: { intent: "primary", size: "md" },
        },
      ],
      tokenNames: ["--primary", "--primary-foreground"],
    })

    expect(handoff.ready).toBe(true)
    expect(handoff.installCommands).toEqual([
      "pnpm dlx shadcn@latest add @preskok/button",
    ])
    expect(handoff.imports).toEqual([
      {
        source: "@/components/ui/preskok-ui/button",
        symbols: ["Button"],
      },
    ])
    expect(handoff.components[0]).toMatchObject({
      codeName: "button",
      registryName: "@preskok/button",
      figmaAssets: [
        {
          name: "Button",
          componentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
        },
      ],
      properties: { intent: "primary", size: "md" },
    })
    expect(handoff.tokens).toHaveLength(2)
  })

  it("turns the representative linked Figma screen into an atomic web handoff", () => {
    const system = createPreskokDesignSystem({ catalog })
    const handoff = system.createHandoff({
      direction: "figma_to_code",
      components: [
        {
          codeName: "badge",
          figmaComponentKey: "1c2302f26930ef3ead56664151e580d1408f2c23",
          properties: { Intent: "secondary", "Label#4031:43": "Draft" },
        },
        {
          codeName: "input",
          figmaComponentKey: "010c896516d2d28ecb199d05d6bb44fe294c1971",
          properties: {
            "Text#3158:0": "designer@preskok.si",
            Scale: "Desktop",
            Value: "Filled",
            State: "Default",
          },
        },
        {
          codeName: "switch",
          figmaComponentKey: "074088f22c1be7b242db63a173c01d4bec78cec5",
          properties: { Selected: "On", State: "Default" },
        },
        {
          codeName: "button",
          figmaComponentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
          properties: {
            Intent: "primary",
            Size: "md",
            State: "Default",
            "Label#3201:0": "Save changes",
          },
        },
      ],
      tokenNames: [
        "--background",
        "--card",
        "--foreground",
        "--muted-foreground",
        "--border",
      ],
    })

    expect(handoff).toMatchObject({
      ready: true,
      validation: { summary: { errors: 0, warnings: 0 } },
      installCommands: [
        "pnpm dlx shadcn@latest add @preskok/badge @preskok/input @preskok/switch @preskok/button",
      ],
    })
    expect(handoff.tokens).toHaveLength(5)
  })

  it("installs multi-component handoffs atomically to avoid shared-file prompts", () => {
    const system = createPreskokDesignSystem({ catalog })
    const handoff = system.createHandoff({
      direction: "figma_to_code",
      components: [
        { codeName: "button" },
        { codeName: "text-field" },
        { codeName: "switch" },
      ],
    })

    expect(handoff.installCommands).toEqual([
      "pnpm dlx shadcn@latest add @preskok/button @preskok/text-field @preskok/switch",
    ])
  })

  it("supports every translation direction exposed by the workflow contract", () => {
    const system = createPreskokDesignSystem({ catalog })
    const directions = [
      "figma_to_code",
      "code_to_figma",
      "claude_design_to_figma",
      "claude_design_to_code",
    ] as const

    for (const direction of directions) {
      const handoff = system.createHandoff({
        direction,
        components: [{ codeName: "button" }],
      })
      expect(handoff).toMatchObject({ direction, ready: true })
    }
  })

  it("ships every supported workflow with executable verification gates", () => {
    const system = createPreskokDesignSystem({ catalog })
    const workflows = system.listWorkflows()

    expect(workflows.map((workflow) => workflow.name)).toEqual([
      "claude_design_to_figma",
      "figma_to_web_app",
      "web_app_to_figma",
      "claude_design_to_web_app",
      "theme_sync",
      "audit_figma_design",
      "maintain_design_system",
    ])

    for (const summary of workflows) {
      const workflow = system.getWorkflow(summary.name)
      expect(workflow.steps.length).toBeGreaterThan(2)
      expect(workflow.verification.length).toBeGreaterThan(0)
      expect(workflow.steps.every((step) => step.owner)).toBe(true)
    }

    expect(system.getWorkflow("figma_to_web_app").verification).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "mcp" }),
        expect.objectContaining({ kind: "build" }),
        expect.objectContaining({ kind: "runtime" }),
      ])
    )
    for (const name of [
      "claude_design_to_figma",
      "figma_to_web_app",
      "web_app_to_figma",
      "theme_sync",
      "audit_figma_design",
    ] as const) {
      const tools = system.getWorkflow(name).steps.flatMap((step) => step.tools)
      expect(tools, name).toContain("plan_preskok_design")
      expect(tools, name).toContain("finalize_preskok_design")
    }
    expect(() => system.getWorkflow("unknown_workflow")).toThrow(
      /Unknown Preskok workflow/
    )
  })
})
