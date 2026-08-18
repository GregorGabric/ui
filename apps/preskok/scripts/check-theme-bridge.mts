import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

import {
  createThemeArtifacts,
  createThemeContrastChecks,
  createThemeTokens,
  DEFAULT_THEME_SELECTION,
  FIGMA_STYLE_COLOR_TOKEN_NAMES,
  generateFigmaThemeJson,
  generateFigmaThemeTokens,
  generateTheme,
  generateThemeManifestJson,
  parseThemeManifestJson,
  resolveThemeBackground,
  THEME_BACKGROUND_MODES,
  THEME_COLOR_TOKEN_NAMES,
  THEME_MANIFEST_VERSION,
  THEME_PRIMITIVE_STEPS,
  THEME_RADIUS_OPTIONS,
  THEME_TOKEN_MAPPINGS,
  type ThemeSelection,
} from "../components/theme/themes"

function extractCssBlock(source: string, selector: string) {
  const selectorStart = source.indexOf(selector)
  assert.notEqual(selectorStart, -1, `Missing ${selector} CSS block`)

  const openBrace = source.indexOf("{", selectorStart)
  const closeBrace = source.indexOf("}", openBrace)
  assert.notEqual(openBrace, -1, `Missing opening brace for ${selector}`)
  assert.notEqual(closeBrace, -1, `Missing closing brace for ${selector}`)
  return source.slice(openBrace + 1, closeBrace)
}

function extractCssVariables(source: string) {
  return Object.fromEntries(
    [...source.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
      name,
      value.trim(),
    ])
  )
}

function assertColorToken(value: unknown, path: string) {
  assert.equal(typeof value, "object", `${path} must be an object`)
  assert.notEqual(value, null, `${path} must not be null`)

  const token = value as {
    $type?: unknown
    $value?: {
      colorSpace?: unknown
      components?: unknown
      alpha?: unknown
      hex?: unknown
    }
  }
  assert.equal(token.$type, "color", `${path} must be a color token`)
  assert.equal(token.$value?.colorSpace, "srgb", `${path} must use sRGB`)
  assert.equal(
    Array.isArray(token.$value?.components),
    true,
    `${path} must contain components`
  )
  assert.equal(
    token.$value?.components?.length,
    3,
    `${path} must contain three components`
  )
  assert.match(String(token.$value?.hex), /^#[\dA-F]{6}$/)
  assert.equal(typeof token.$value?.alpha, "number")
}

function assertSelection(selection: ThemeSelection) {
  const resolved = createThemeTokens(selection)
  const css = generateTheme(selection)
  const rootVariables = extractCssVariables(extractCssBlock(css, ":root"))
  const darkVariables = extractCssVariables(extractCssBlock(css, ".dark"))
  const figma = generateFigmaThemeTokens(selection)

  for (const token of THEME_COLOR_TOKEN_NAMES) {
    assert.equal(
      rootVariables[token],
      resolved.colors.light[token],
      `Light CSS token --${token} must use the canonical value`
    )
    assert.equal(
      darkVariables[token],
      resolved.colors.dark[token],
      `Dark CSS token --${token} must use the canonical value`
    )
  }

  for (const mode of ["light", "dark"] as const) {
    for (const step of THEME_PRIMITIVE_STEPS) {
      assert.equal(
        rootVariables[`accent-${step}`] !== undefined,
        true,
        `CSS must include accent step ${step}`
      )
      assertColorToken(
        figma.primitive.color[mode].accent[String(step)],
        `primitive/color/${mode}/accent/${step}`
      )
      assertColorToken(
        figma.primitive.color[mode]["accent-alpha"][String(step)],
        `primitive/color/${mode}/accent-alpha/${step}`
      )
      assertColorToken(
        figma.primitive.color[mode].gray[String(step)],
        `primitive/color/${mode}/gray/${step}`
      )
      assertColorToken(
        figma.primitive.color[mode]["gray-alpha"][String(step)],
        `primitive/color/${mode}/gray-alpha/${step}`
      )
    }

    for (const token of FIGMA_STYLE_COLOR_TOKEN_NAMES) {
      assertColorToken(figma.color[mode][token], `color/${mode}/${token}`)
    }

    const checks = createThemeContrastChecks(selection).filter((check) => {
      return check.mode === mode
    })
    assert.equal(checks.length, 10)
    assert.equal(
      checks.every((check) => Number.isFinite(check.apca)),
      true,
      `${mode} APCA checks must be numeric`
    )
  }

  assert.equal(figma.color.light.danger, undefined)
  assert.equal(figma.color.dark.danger, undefined)
  assert.equal(rootVariables["radius-lg"], selection.radius)
  assert.equal(rootVariables.radius, "var(--radius-lg)")
  assert.equal(generateFigmaThemeJson(selection).includes("var(--"), false)
  assert.match(css, /@supports \(color: color\(display-p3 1 1 1\)\)/)
}

assertSelection(DEFAULT_THEME_SELECTION)
const defaultArtifacts = createThemeArtifacts(DEFAULT_THEME_SELECTION)
assert.equal(defaultArtifacts.css, generateTheme(DEFAULT_THEME_SELECTION))
assert.equal(
  defaultArtifacts.figmaJson,
  generateFigmaThemeJson(DEFAULT_THEME_SELECTION)
)

const globalCss = readFileSync(
  new URL("../styles/globals.css", import.meta.url),
  "utf8"
)
const globalRootVariables = extractCssVariables(
  extractCssBlock(globalCss, ":root")
)
const globalSemanticTokens = Object.keys(globalRootVariables).filter((name) => {
  return (
    name !== "fd-layout-width" &&
    !name.startsWith("shiki-") &&
    name !== "radius" &&
    !name.startsWith("radius-")
  )
})

assert.deepEqual(
  globalSemanticTokens.toSorted(),
  [...THEME_COLOR_TOKEN_NAMES].toSorted(),
  "The theme bridge must cover the semantic contract in styles/globals.css"
)

for (const radius of THEME_RADIUS_OPTIONS) {
  assertSelection({ ...DEFAULT_THEME_SELECTION, radius })
}

for (const backgroundMode of THEME_BACKGROUND_MODES) {
  assertSelection({
    ...DEFAULT_THEME_SELECTION,
    light: { ...DEFAULT_THEME_SELECTION.light, backgroundMode },
    dark: { ...DEFAULT_THEME_SELECTION.dark, backgroundMode },
  })
}

assert.equal(
  resolveThemeBackground("light", {
    ...DEFAULT_THEME_SELECTION.light,
    backgroundMode: "pure",
  }),
  "#ffffff"
)
assert.equal(
  resolveThemeBackground("dark", {
    ...DEFAULT_THEME_SELECTION.dark,
    backgroundMode: "pure",
  }),
  "#09090b"
)
assert.equal(
  resolveThemeBackground("light", {
    ...DEFAULT_THEME_SELECTION.light,
    backgroundMode: "custom",
    customBackground: "#f3f4f6",
  }),
  "#f3f4f6"
)

const colorSamples = [
  "#000000",
  "#ffffff",
  "#ff006e",
  "#7c3aed",
  "#006adc",
  "#00a2c7",
  "#2e7d32",
  "#ffba18",
] as const
for (const accent of colorSamples) {
  assertSelection({
    ...DEFAULT_THEME_SELECTION,
    light: { ...DEFAULT_THEME_SELECTION.light, accent },
    dark: { ...DEFAULT_THEME_SELECTION.dark, accent },
  })
}

const defaultChecks = createThemeContrastChecks(DEFAULT_THEME_SELECTION)
assert.equal(defaultChecks.length, 20)
assert.equal(
  defaultChecks.every((check) => check.passes),
  true,
  `Default theme must pass normal-text contrast: ${defaultChecks
    .filter((check) => !check.passes)
    .map((check) => `${check.mode}/${check.label} ${check.wcag}:1`)
    .join(", ")}`
)

const figma = generateFigmaThemeTokens(DEFAULT_THEME_SELECTION)
assert.deepEqual(Object.keys(figma.color.light), [
  ...FIGMA_STYLE_COLOR_TOKEN_NAMES,
])
assert.deepEqual(Object.keys(figma.color.dark), [
  ...FIGMA_STYLE_COLOR_TOKEN_NAMES,
])
assert.equal(Object.keys(figma.primitive.color.light.accent).length, 12)
assert.equal(Object.keys(figma.primitive.color.dark.gray).length, 12)
assert.deepEqual(
  Object.fromEntries(
    Object.entries(figma.radius).map(([name, token]) => [
      name,
      token.$value.value,
    ])
  ),
  {
    xs: 4,
    sm: 6,
    md: 7.2,
    lg: 8,
    xl: 10,
    "2xl": 12,
    "3xl": 16,
    "4xl": 24,
  }
)

assert.equal(
  new Set(THEME_TOKEN_MAPPINGS.map((mapping) => mapping.css)).size,
  THEME_COLOR_TOKEN_NAMES.length,
  "Every CSS token must have one explicit mapping"
)
assert.equal(
  THEME_TOKEN_MAPPINGS.find((mapping) => mapping.css === "--danger")
    ?.figmaLight,
  "Style/color/light/destructive"
)

const manifestJson = generateThemeManifestJson(DEFAULT_THEME_SELECTION)
assert.equal(THEME_MANIFEST_VERSION, 3)
assert.deepEqual(
  parseThemeManifestJson(manifestJson).selection,
  DEFAULT_THEME_SELECTION
)
assert.equal(
  generateThemeManifestJson(parseThemeManifestJson(manifestJson).selection),
  manifestJson,
  "Manifest generation must be deterministic"
)

const migrated = parseThemeManifestJson(
  JSON.stringify({
    schemaVersion: 1,
    selection: {
      primary: "blue",
      gray: "zinc",
      accent: "violet",
      radius: "0.75rem",
    },
  })
)
assert.equal(migrated.schemaVersion, 3)
assert.equal(migrated.selection.light.accent, "#155dfc")
assert.equal(migrated.selection.dark.accent, "#155dfc")
assert.equal(migrated.selection.light.backgroundMode, "pure")
assert.equal(migrated.selection.dark.backgroundMode, "pure")
assert.equal(migrated.selection.grayMode, "custom")
assert.equal(migrated.selection.radius, "0.75rem")

const migratedVersionTwo = parseThemeManifestJson(
  JSON.stringify({
    schemaVersion: 2,
    selection: {
      light: {
        accent: "#2563eb",
        gray: "#737b8a",
        background: "#fff7ed",
      },
      dark: {
        accent: "#3b82f6",
        gray: "#737b88",
        background: "#18181b",
      },
      grayMode: "auto",
      radius: "0.5rem",
    },
  })
)
assert.equal(migratedVersionTwo.schemaVersion, 3)
assert.equal(migratedVersionTwo.selection.light.backgroundMode, "custom")
assert.equal(migratedVersionTwo.selection.light.customBackground, "#fff7ed")
assert.equal(migratedVersionTwo.selection.dark.backgroundMode, "custom")
assert.equal(migratedVersionTwo.selection.dark.customBackground, "#18181b")

assert.throws(
  () => parseThemeManifestJson('{"schemaVersion":4,"selection":{}}'),
  /unsupported schema version/
)
assert.throws(
  () =>
    parseThemeManifestJson(
      '{"schemaVersion":3,"selection":{"light":{"accent":"red"}}}'
    ),
  /six-digit hex color/
)
assert.throws(
  () =>
    parseThemeManifestJson(
      '{"schemaVersion":1,"selection":{"primary":"toString","gray":"zinc","accent":"blue","radius":"0.5rem"}}'
    ),
  /primary color is not supported/
)

console.log(
  `Theme V3 checks passed for ${colorSamples.length} source colors, ${THEME_BACKGROUND_MODES.length} background treatments, ${THEME_RADIUS_OPTIONS.length} radii, ${THEME_PRIMITIVE_STEPS.length} primitive steps per scale, ${THEME_COLOR_TOKEN_NAMES.length} semantic tokens, and ${defaultChecks.length} contrast pairs.`
)
