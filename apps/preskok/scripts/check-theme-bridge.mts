import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

import { neutralColors } from "../components/theme/colors"
import colors from "../components/theme/colors.json"
import {
  createThemeTokens,
  DEFAULT_THEME_SELECTION,
  FIGMA_STYLE_COLOR_TOKEN_NAMES,
  generateFigmaThemeJson,
  generateFigmaThemeTokens,
  generateTheme,
  generateThemeManifestJson,
  parseThemeManifestJson,
  THEME_COLOR_TOKEN_NAMES,
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

  for (const token of FIGMA_STYLE_COLOR_TOKEN_NAMES) {
    assertColorToken(figma.color.light[token], `color/light/${token}`)
    assertColorToken(figma.color.dark[token], `color/dark/${token}`)
  }

  assert.equal(figma.color.light.danger, undefined)
  assert.equal(figma.color.dark.danger, undefined)
  assert.equal(rootVariables["radius-lg"], selection.radius)
  assert.equal(rootVariables.radius, "var(--radius-lg)")
  assert.equal(generateFigmaThemeJson(selection).includes("var(--"), false)
}

assertSelection(DEFAULT_THEME_SELECTION)

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

for (const color of Object.keys(colors)) {
  assertSelection({
    ...DEFAULT_THEME_SELECTION,
    primary: color,
    accent: color,
  })
}

for (const gray of neutralColors) {
  assertSelection({ ...DEFAULT_THEME_SELECTION, gray })
}

for (const radius of THEME_RADIUS_OPTIONS) {
  assertSelection({ ...DEFAULT_THEME_SELECTION, radius })
}

const figma = generateFigmaThemeTokens(DEFAULT_THEME_SELECTION)
assert.deepEqual(Object.keys(figma.color.light), [
  ...FIGMA_STYLE_COLOR_TOKEN_NAMES,
])
assert.deepEqual(Object.keys(figma.color.dark), [
  ...FIGMA_STYLE_COLOR_TOKEN_NAMES,
])
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
assert.deepEqual(
  parseThemeManifestJson(manifestJson).selection,
  DEFAULT_THEME_SELECTION
)
assert.equal(
  generateThemeManifestJson(parseThemeManifestJson(manifestJson).selection),
  manifestJson,
  "Manifest generation must be deterministic"
)
assert.throws(
  () => parseThemeManifestJson('{"schemaVersion":2,"selection":{}}'),
  /unsupported schema version/
)
assert.throws(
  () =>
    parseThemeManifestJson(
      '{"schemaVersion":1,"selection":{"primary":"made-up","gray":"zinc","accent":"blue","radius":"0.5rem"}}'
    ),
  /primary color is not supported/
)
assert.throws(
  () =>
    parseThemeManifestJson(
      '{"schemaVersion":1,"selection":{"primary":"toString","gray":"zinc","accent":"blue","radius":"0.5rem"}}'
    ),
  /primary color is not supported/
)

console.log(
  `Theme bridge checks passed for ${Object.keys(colors).length} color families, ${neutralColors.length} neutrals, ${THEME_RADIUS_OPTIONS.length} radii, and ${THEME_COLOR_TOKEN_NAMES.length} semantic tokens.`
)
