import { createHash } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { beforeAll, describe, expect, it } from "vitest"

import {
  createPreskokDesignSystem,
  type DesignEvidence,
  type DesignPlan,
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

function createSingleRequirementEvidence({
  plan,
  rootNodeId = "single-root",
  nodeId = "single-instance",
  child = {},
  manualNodes = [],
}: {
  plan: DesignPlan
  rootNodeId?: string
  nodeId?: string
  child?: Partial<
    NonNullable<
      DesignEvidence["layout"]
    >["containers"][number]["children"][number]
  >
  manualNodes?: DesignEvidence["manualNodes"]
}): DesignEvidence {
  const requirement = plan.requirements[0]
  if (!requirement) {
    throw new Error("Expected one planned requirement")
  }
  const remote = plan.figmaStrategy === "published"
  return {
    fileKey: `${rootNodeId}-file`,
    rootNodeId,
    enabledLibraryKeys: remote ? [plan.source.libraryKey] : [],
    instances: [
      {
        nodeId,
        requirementId: requirement.id,
        name: requirement.assetName,
        assetName: requirement.assetName,
        componentKey: remote ? requirement.componentKey : undefined,
        contractFingerprint: remote
          ? undefined
          : requirement.contractFingerprint,
        remote,
        detached: false,
        properties: {},
      },
    ],
    manualNodes,
    localComponents: [],
    modes: [
      {
        collectionName: "Style",
        collectionKey: remote
          ? plan.source.collections.style.key
          : "local-style-key",
        mode: plan.source.collections.style.mode,
        explicit: true,
        remote,
      },
      {
        collectionName: "Mode",
        collectionKey: remote
          ? plan.source.collections.colorMode.key
          : "local-mode-key",
        mode: plan.source.collections.colorMode.mode,
        explicit: true,
        remote,
      },
    ],
    hardcodedValues: [],
    layout: {
      containers: [
        {
          nodeId: rootNodeId,
          name: "Single requirement root",
          type: "FRAME",
          width: 320,
          height: 80,
          layoutMode: "HORIZONTAL",
          primaryAxisSizingMode: "AUTO",
          counterAxisSizingMode: "AUTO",
          clipsContent: false,
          children: [
            {
              nodeId,
              name: requirement.assetName,
              type: "INSTANCE",
              x: 0,
              y: 0,
              width: 120,
              height: 40,
              visible: true,
              layoutPositioning: "AUTO",
              ...child,
            },
          ],
        },
      ],
    },
  }
}

function ordinarySha256Digest(plan: DesignPlan): string {
  const { contractDigest, ...contract } = plan
  void contractDigest
  return createHash("sha256").update(JSON.stringify(contract)).digest("hex")
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
    expect(plan.requirements.map(({ id }) => id)).toEqual([
      "settings-card",
      "email-label",
      "email-input",
      "email-description",
      "profile-separator",
      "updates-switch",
      "actions-separator",
      "cancel-action",
      "save-action",
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

  it("authenticates canonical plans regardless of nested object key order", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Primary action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "primary-action", codeName: "button" }],
    })
    const reorderedPlan = structuredClone(plan)
    reorderedPlan.theme = {
      mode: plan.theme.mode,
      style: plan.theme.style,
    }
    reorderedPlan.source.collections.style = {
      availableModes: [...plan.source.collections.style.availableModes],
      mode: plan.source.collections.style.mode,
      key: plan.source.collections.style.key,
      name: plan.source.collections.style.name,
    }

    const result = system.finalizeDesign({
      plan: reorderedPlan,
      evidence: createSingleRequirementEvidence({ plan }),
    })

    expect(result.ready).toBe(true)
    expect(result.issues).not.toContainEqual(
      expect.objectContaining({ code: "plan_contract_mismatch" })
    )
  })

  it("rejects a modified plan with an ordinary recomputed SHA-256 digest", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Primary action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "primary-action", codeName: "button" }],
    })
    const forgedPlan = structuredClone(plan)
    const requirement = forgedPlan.requirements[0]
    if (!requirement) {
      throw new Error("Expected a planned requirement")
    }
    requirement.role = "forged-role"
    forgedPlan.contractDigest = ordinarySha256Digest(forgedPlan)

    const result = system.finalizeDesign({
      plan: forgedPlan,
      evidence: createSingleRequirementEvidence({ plan }),
    })

    expect(result.ready).toBe(false)
    expect(result.issues).toContainEqual(
      expect.objectContaining({ code: "plan_contract_mismatch" })
    )
  })

  it("rejects plans issued by another design-system instance", () => {
    const issuingSystem = createPreskokDesignSystem({ catalog })
    const finalizingSystem = createPreskokDesignSystem({ catalog })
    const plan = issuingSystem.planDesign({
      intent: "Primary action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "primary-action", codeName: "button" }],
    })

    const result = finalizingSystem.finalizeDesign({
      plan,
      evidence: createSingleRequirementEvidence({ plan }),
    })

    expect(result.ready).toBe(false)
    expect(result.issues).toContainEqual(
      expect.objectContaining({ code: "plan_contract_mismatch" })
    )
  })

  it("treats malformed plan digests as contract mismatches", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Primary action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "primary-action", codeName: "button" }],
    })
    plan.contractDigest = "not-a-hex-digest"

    expect(() =>
      system.finalizeDesign({
        plan,
        evidence: createSingleRequirementEvidence({ plan }),
      })
    ).not.toThrow()
    expect(
      system.finalizeDesign({
        plan,
        evidence: createSingleRequirementEvidence({ plan }),
      }).issues
    ).toContainEqual(
      expect.objectContaining({ code: "plan_contract_mismatch" })
    )
  })

  it.each([
    {
      name: "duplicate IDs",
      requirements: [
        { id: "duplicate", codeName: "button" },
        { id: "duplicate", codeName: "separator" },
      ],
      code: "duplicate_requirement_id",
    },
    {
      name: "missing parents",
      requirements: [
        {
          id: "child",
          codeName: "button",
          parentRequirementId: "missing",
        },
      ],
      code: "missing_parent_requirement",
    },
    {
      name: "self parents",
      requirements: [
        {
          id: "self",
          codeName: "button",
          parentRequirementId: "self",
        },
      ],
      code: "self_parent_requirement",
    },
    {
      name: "group layouts without groups",
      requirements: [
        { id: "ungrouped", codeName: "button", groupLayout: "HORIZONTAL" },
      ],
      code: "group_layout_without_group",
    },
    {
      name: "conflicting group layouts",
      requirements: [
        {
          id: "horizontal",
          codeName: "button",
          groupId: "actions",
          groupLayout: "HORIZONTAL",
        },
        {
          id: "vertical",
          codeName: "separator",
          groupId: "actions",
          groupLayout: "VERTICAL",
        },
      ],
      code: "conflicting_group_layout",
    },
    {
      name: "parent cycles",
      requirements: [
        { id: "first", codeName: "card", parentRequirementId: "second" },
        { id: "second", codeName: "card", parentRequirementId: "first" },
      ],
      code: "requirement_parent_cycle",
    },
  ] as const)(
    "rejects invalid requirement graphs with $name",
    ({ requirements, code }) => {
      const system = createPreskokDesignSystem({ catalog })
      const plan = system.planDesign({
        intent: "Invalid graph",
        figmaStrategy: "published",
        theme: { style: "Default", mode: "Light" },
        requirements: [...requirements],
      })

      expect(plan.readyToBuild).toBe(false)
      expect(plan.issues).toContainEqual(expect.objectContaining({ code }))
    }
  )

  it("gives every expanded fallback a deterministic caller-derived ID", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Preview trigger",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "preview-trigger", codeName: "preview-trigger" }],
    })

    expect(plan.readyToBuild).toBe(true)
    expect(plan.requirements.map(({ id }) => id)).toEqual([
      "preview-trigger--button-button",
      "preview-trigger--popover-popover",
    ])
    expect(new Set(plan.requirements.map(({ id }) => id)).size).toBe(
      plan.requirements.length
    )

    const oneToOnePlan = system.planDesign({
      intent: "Primary action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "caller-action", codeName: "button" }],
    })
    expect(oneToOnePlan.requirements.map(({ id }) => id)).toEqual([
      "caller-action",
    ])
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

  it("does not let one repeated live node satisfy two requirements", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Two actions",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [
        { id: "first-action", codeName: "button" },
        { id: "second-action", codeName: "button" },
      ],
    })
    const [first, second] = plan.requirements
    if (!first || !second) {
      throw new Error("Expected two action requirements")
    }
    const evidence = createSingleRequirementEvidence({ plan })
    evidence.instances = [first, second].map((requirement) => ({
      nodeId: "repeated-node",
      requirementId: requirement.id,
      name: requirement.id,
      assetName: requirement.assetName,
      componentKey: requirement.componentKey,
      remote: true,
      detached: false,
      properties: {},
    }))
    const root = evidence.layout?.containers[0]
    const child = root?.children[0]
    if (!child) {
      throw new Error("Expected repeated-node layout evidence")
    }
    child.nodeId = "repeated-node"

    const result = system.finalizeDesign({ plan, evidence })

    expect(result.ready).toBe(false)
    expect(result.coverage).toEqual({
      requiredInstances: 2,
      matchedInstances: 0,
      satisfiedInstances: 0,
    })
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "duplicate_node_claim",
        nodeId: "repeated-node",
      })
    )
  })

  it("rejects a node claimed across instance and manual evidence", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Primary action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "primary-action", codeName: "button" }],
    })
    const evidence = createSingleRequirementEvidence({
      plan,
      nodeId: "colliding-node",
      manualNodes: [
        {
          nodeId: "colliding-node",
          name: "Manual primary action",
          type: "FRAME",
          tokenBound: true,
        },
      ],
    })

    const result = system.finalizeDesign({ plan, evidence })

    expect(result.ready).toBe(false)
    expect(result.coverage.matchedInstances).toBe(0)
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "duplicate_node_claim",
        nodeId: "colliding-node",
      })
    )
  })

  it("requires a child to use the exact assigned same-component parent", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Two cards with one action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [
        { id: "expected-card", codeName: "card", assetName: "Card" },
        { id: "other-card", codeName: "card", assetName: "Card" },
        {
          id: "card-action",
          codeName: "button",
          parentRequirementId: "expected-card",
        },
      ],
    })
    const [expectedCard, otherCard, cardAction] = plan.requirements
    if (!expectedCard || !otherCard || !cardAction) {
      throw new Error("Expected two cards and one action")
    }
    const instances: DesignEvidence["instances"] = [
      {
        nodeId: "expected-card-node",
        requirementId: expectedCard.id,
        name: "Expected card",
        assetName: expectedCard.assetName,
        componentKey: expectedCard.componentKey,
        remote: true,
        detached: false,
        properties: {},
      },
      {
        nodeId: "other-card-node",
        requirementId: otherCard.id,
        name: "Other card",
        assetName: otherCard.assetName,
        componentKey: otherCard.componentKey,
        remote: true,
        detached: false,
        properties: {},
      },
      {
        nodeId: "card-action-node",
        requirementId: cardAction.id,
        name: "Card action",
        assetName: cardAction.assetName,
        componentKey: cardAction.componentKey,
        ancestorNodeIds: ["other-card-node"],
        remote: true,
        detached: false,
        properties: {},
      },
    ]
    const result = system.finalizeDesign({
      plan,
      evidence: {
        fileKey: "exact-parent-file",
        rootNodeId: "exact-parent-root",
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
        layout: {
          containers: [
            {
              nodeId: "exact-parent-root",
              name: "Root",
              type: "FRAME",
              width: 640,
              height: 400,
              layoutMode: "HORIZONTAL",
              clipsContent: false,
              children: [
                {
                  nodeId: "expected-card-node",
                  name: "Expected card",
                  type: "INSTANCE",
                  x: 0,
                  y: 0,
                  width: 300,
                  height: 300,
                  visible: true,
                  layoutPositioning: "AUTO",
                },
                {
                  nodeId: "other-card-node",
                  name: "Other card",
                  type: "INSTANCE",
                  x: 320,
                  y: 0,
                  width: 300,
                  height: 300,
                  visible: true,
                  layoutPositioning: "AUTO",
                },
              ],
            },
            {
              nodeId: "expected-card-node",
              name: "Expected card",
              type: "INSTANCE",
              width: 300,
              height: 300,
              layoutMode: "VERTICAL",
              clipsContent: false,
              children: [],
            },
            {
              nodeId: "other-card-node",
              name: "Other card",
              type: "INSTANCE",
              width: 300,
              height: 300,
              layoutMode: "VERTICAL",
              clipsContent: false,
              children: [
                {
                  nodeId: "card-action-node",
                  name: "Card action",
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
    })

    expect(result.ready).toBe(false)
    expect(result.coverage).toEqual({
      requiredInstances: 3,
      matchedInstances: 3,
      satisfiedInstances: 2,
    })
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "component_hierarchy_mismatch",
        requirementId: "card-action",
        nodeId: "card-action-node",
      })
    )
  })

  it("rejects a hidden zero-sized required Button", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Hidden action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "hidden-action", codeName: "button" }],
    })
    const evidence = createSingleRequirementEvidence({
      plan,
      child: { visible: false, width: 0, height: 0 },
    })

    const result = system.finalizeDesign({ plan, evidence })

    expect(result.ready).toBe(false)
    expect(result.coverage.satisfiedInstances).toBe(0)
    expect(result.issues.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "required_instance_not_visible",
        "required_instance_invalid_size",
      ])
    )
  })

  it("allows an unrelated hidden zero-sized optional layout child", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Primary action with an optional slot",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "primary-action", codeName: "button" }],
    })
    const evidence = createSingleRequirementEvidence({ plan })
    const root = evidence.layout?.containers[0]
    if (!root) {
      throw new Error("Expected optional-slot layout root")
    }
    root.children.push({
      nodeId: "optional-hidden-slot",
      name: "Optional hidden slot",
      type: "FRAME",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      visible: false,
      layoutPositioning: "AUTO",
    })

    const result = system.finalizeDesign({ plan, evidence })

    expect(result).toMatchObject({
      ready: true,
      issues: [],
      coverage: {
        requiredInstances: 1,
        matchedInstances: 1,
        satisfiedInstances: 1,
      },
    })
  })

  it("rejects a cycle in the normalized live layout parent graph", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Primary action",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "primary-action", codeName: "button" }],
    })
    const evidence = createSingleRequirementEvidence({ plan })
    const instance = evidence.instances[0]
    const layout = evidence.layout
    if (!instance || !layout) {
      throw new Error("Expected cyclic layout evidence inputs")
    }
    layout.containers.push({
      nodeId: instance.nodeId,
      name: instance.name,
      type: "INSTANCE",
      width: 320,
      height: 80,
      layoutMode: "HORIZONTAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "AUTO",
      clipsContent: false,
      children: [
        {
          nodeId: evidence.rootNodeId,
          name: "Cyclic root child",
          type: "FRAME",
          x: 0,
          y: 0,
          width: 320,
          height: 80,
          visible: true,
          layoutPositioning: "AUTO",
        },
      ],
    })

    const result = system.finalizeDesign({ plan, evidence })

    expect(result.ready).toBe(false)
    expect(result.handoff).toBeNull()
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "layout_ancestry_mismatch",
        message: expect.stringContaining("contains a cycle"),
      })
    )
  })

  it("rejects an in-bounds absolutely positioned required Separator", () => {
    const system = createPreskokDesignSystem({ catalog })
    const plan = system.planDesign({
      intent: "Absolute separator",
      figmaStrategy: "published",
      theme: { style: "Default", mode: "Light" },
      requirements: [{ id: "absolute-separator", codeName: "separator" }],
    })
    const evidence = createSingleRequirementEvidence({
      plan,
      child: { layoutPositioning: "ABSOLUTE" },
    })

    const result = system.finalizeDesign({ plan, evidence })

    expect(result.ready).toBe(false)
    expect(result.coverage.satisfiedInstances).toBe(0)
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "required_instance_not_auto_layout",
        requirementId: "absolute-separator",
      })
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
        "component_hierarchy_mismatch",
        "required_instance_not_auto_layout",
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
        layout: createPassingLayoutEvidence({
          rootNodeId: "300:1",
          instances,
        }),
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
    const layout = createPassingLayoutEvidence({
      rootNodeId: "500:1",
      instances,
    })
    const content = layout.containers.find(
      ({ nodeId }) => nodeId === "500:1:content"
    )
    const root = layout.containers.find(({ nodeId }) => nodeId === "500:1")
    if (!content || !root) {
      throw new Error("Expected hierarchy layout containers")
    }
    content.children = content.children.filter(
      ({ nodeId }) => nodeId !== emailInput.nodeId
    )
    root.children.push({
      nodeId: emailInput.nodeId,
      name: emailInput.name,
      type: "INSTANCE",
      x: 0,
      y: 620,
      width: 560,
      height: 32,
      visible: true,
      layoutPositioning: "AUTO",
    })

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
        layout,
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
