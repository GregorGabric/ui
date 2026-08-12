import { promises as fs } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import {
  checkPreskokCatalog,
  generatePreskokCatalog,
  writePreskokCatalog,
} from "../src/generation/catalog.js"

const packageDirectory = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(packageDirectory, "../../..")

describe("Preskok design-system catalog", () => {
  it("supports every registry UI component through one generated interface", async () => {
    const catalog = await generatePreskokCatalog({ workspaceRoot })

    expect(catalog.components).toHaveLength(96)
    expect(
      new Set(catalog.components.map((component) => component.name)).size
    ).toBe(96)

    const button = catalog.components.find(
      (component) => component.name === "button"
    )

    expect(button).toMatchObject({
      description:
        "A comprehensive button component with multiple variants and sizes",
      importPath: "@/components/ui/preskok-ui/button",
      registryName: "@preskok/button",
      documentation: {
        title: "Button",
        path: "/buttons/button",
      },
    })
    expect(button?.exports).toEqual(
      expect.arrayContaining(["Button", "buttonStyles", "ButtonProps"])
    )
    expect(button?.variants).toMatchObject({
      intent: {
        values: [
          "primary",
          "secondary",
          "warning",
          "danger",
          "outline",
          "plain",
        ],
        defaultValue: "primary",
      },
      size: {
        defaultValue: "md",
      },
    })
    expect(button?.examples.length).toBeGreaterThan(0)
  })

  it("links light and dark CSS tokens to aliases and component usage", async () => {
    const catalog = await generatePreskokCatalog({ workspaceRoot })
    const background = catalog.tokens.find(
      (token) => token.name === "--background"
    )
    const primary = catalog.tokens.find((token) => token.name === "--primary")

    expect(background).toMatchObject({
      kind: "color",
      values: {
        light: "oklch(1 0 0)",
        dark: "oklch(0.097 0.004 49.25)",
      },
    })
    expect(background?.aliases).toContain("--color-background")
    expect(primary?.aliases).toContain("--color-primary")
    expect(primary?.usedBy).toContain("button")
    expect(catalog.tokens.length).toBeGreaterThan(50)
  })

  it("reports honest Figma coverage for every code component", async () => {
    const catalog = await generatePreskokCatalog({ workspaceRoot })
    const button = catalog.components.find(
      (component) => component.name === "button"
    )
    const select = catalog.components.find(
      (component) => component.name === "select"
    )
    const localeContext = catalog.components.find(
      (component) => component.name === "locale-context"
    )

    expect(catalog.figma.coverage).toEqual({
      verified: 81,
      partial: 11,
      missing: 3,
      notApplicable: 1,
    })
    expect(button?.figma).toMatchObject({
      status: "verified",
      assets: [
        {
          name: "Button",
          componentKey: "4eb4cd0146113729c1848c95644b871e3cb88d0a",
        },
      ],
    })
    expect(select?.figma.status).toBe("missing")
    expect(select?.figma.fallbackComponents).toEqual([
      "combo-box",
      "field",
      "dropdown",
      "popover",
    ])
    expect(localeContext?.figma.status).toBe("not_applicable")
    expect(
      catalog.components.every(
        (component) =>
          component.figma.status === "not_applicable" ||
          component.figma.assets.length > 0 ||
          (component.figma.fallbackComponents?.length ?? 0) > 0
      )
    ).toBe(true)
  })

  it("records the official source and published versus copied theme modes", async () => {
    const catalog = await generatePreskokCatalog({ workspaceRoot })

    expect(catalog.schemaVersion).toBe(2)
    expect(catalog.figma.source).toMatchObject({
      url: "https://www.figma.com/design/jGwVPvHf0oT3uV4aLzGdDl/Preskok-UI",
      fileKey: "jGwVPvHf0oT3uV4aLzGdDl",
      library: {
        name: "Preskok UI",
        libraryKey:
          "lk-46e05046e297a108a9b995aad38fbb0c3b67d59a51e08a1d07250d90ca40d06ac57264cc7314adb8eec854aa2c2d9129e74e174394f8e5a83d51e9baebd9cc95",
      },
      publishedAccess: {
        preferred: "enabled_library",
        directImportByKeySupported: true,
        assetsPanelRequiresEnabledLibrary: true,
      },
      collections: {
        source: {
          style: { modes: ["Default", "Test Green", "Briefd"] },
          colorMode: { modes: ["Light", "Dark"] },
        },
        published: {
          style: { modes: ["Default", "Test Green"] },
          colorMode: { modes: ["Light", "Dark"] },
        },
      },
    })
  })

  it("keeps the Claude and Codex workflow skills in lockstep", async () => {
    const [claudeSkill, codexSkill] = await Promise.all([
      fs.readFile(
        path.join(
          workspaceRoot,
          ".claude/skills/preskok-design-workflow/SKILL.md"
        ),
        "utf8"
      ),
      fs.readFile(
        path.join(
          workspaceRoot,
          ".agents/skills/preskok-design-workflow/SKILL.md"
        ),
        "utf8"
      ),
    ])

    expect(claudeSkill).toBe(codexSkill)
  })

  it("enriches mapped assets with live Figma property definitions", async () => {
    const catalog = await generatePreskokCatalog({ workspaceRoot })
    const button = catalog.components.find(
      (component) => component.name === "button"
    )
    const asset = button?.figma.assets.find(
      ({ componentKey }) =>
        componentKey === "4eb4cd0146113729c1848c95644b871e3cb88d0a"
    )

    expect(asset).toMatchObject({
      liveName: "Button",
      variantCount: 432,
      propertyDefinitions: expect.arrayContaining([
        expect.objectContaining({
          name: "Intent",
          type: "VARIANT",
          defaultValue: "primary",
          variantOptions: [
            "primary",
            "secondary",
            "warning",
            "danger",
            "outline",
            "plain",
          ],
        }),
      ]),
    })
  })

  it("writes a deterministic catalog and detects generated drift", async () => {
    const directory = await fs.mkdtemp(
      path.join(tmpdir(), "preskok-design-mcp-")
    )
    const outputPath = path.join(directory, "catalog.json")

    await writePreskokCatalog({ workspaceRoot, outputPath })
    const first = await fs.readFile(outputPath, "utf8")
    await writePreskokCatalog({ workspaceRoot, outputPath })
    const second = await fs.readFile(outputPath, "utf8")

    expect(first).toBe(second)
    expect(await checkPreskokCatalog({ workspaceRoot, outputPath })).toBe(true)

    await fs.appendFile(outputPath, "\n")
    expect(await checkPreskokCatalog({ workspaceRoot, outputPath })).toBe(false)
  })
})
