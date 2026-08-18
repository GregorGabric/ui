import Color from "colorjs.io"
import { formatHex, parse, rgb, wcagContrast } from "culori"

import {
  accentColors300,
  accentColors400,
  accentColors500,
  neutralColors,
} from "./colors"
import colors from "./colors.json"
import {
  deriveGraySource,
  generatePalette,
  type GeneratedPalette,
  type ThemeAppearance,
} from "./palette"

type ThemeMode = ThemeAppearance
type Shade = keyof (typeof colors)["slate"]
type PanelBackground = "solid" | "translucent"
type GrayMode = "auto" | "custom"

export const THEME_MANIFEST_VERSION = 2
export const THEME_RADIUS_OPTIONS = [
  "0rem",
  "0.125rem",
  "0.25rem",
  "0.375rem",
  "0.5rem",
  "0.6rem",
  "0.75rem",
  "1rem",
  "1.5rem",
] as const

export type ThemeRadius = (typeof THEME_RADIUS_OPTIONS)[number]

export type ThemeAppearanceSelection = {
  accent: string
  gray: string
  background: string
}

export type ThemeSelection = {
  light: ThemeAppearanceSelection
  dark: ThemeAppearanceSelection
  grayMode: GrayMode
  panelBackground: PanelBackground
  radius: ThemeRadius
}

export type ThemeManifest = {
  schemaVersion: typeof THEME_MANIFEST_VERSION
  selection: ThemeSelection
}

export const DEFAULT_THEME_SELECTION: ThemeSelection = {
  light: {
    accent: "#2563eb",
    gray: "#737b8a",
    background: "#ffffff",
  },
  dark: {
    accent: "#3b82f6",
    gray: "#737b88",
    background: "#09090b",
  },
  grayMode: "auto",
  panelBackground: "translucent",
  radius: "0.5rem",
}

export const THEME_COLOR_TOKEN_NAMES = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "muted",
  "muted-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "danger",
  "danger-foreground",
  "destructive",
  "destructive-foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "overlay",
  "overlay-foreground",
  "border",
  "input",
  "ring",
  "navbar",
  "navbar-foreground",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "surface",
  "surface-foreground",
  "panel",
  "panel-foreground",
  "panel-solid",
  "panel-solid-foreground",
  "panel-translucent",
  "panel-translucent-foreground",
  "accent-surface",
  "accent-indicator",
  "accent-track",
  "scrim",
  "code",
  "code-foreground",
  "code-highlight",
  "code-number",
  "selection",
  "selection-foreground",
] as const

export type ThemeColorTokenName = (typeof THEME_COLOR_TOKEN_NAMES)[number]

export const FIGMA_STYLE_COLOR_TOKEN_NAMES = THEME_COLOR_TOKEN_NAMES.filter(
  (token) => token !== "danger" && token !== "danger-foreground"
)

export const THEME_PRIMITIVE_STEPS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
] as const

const RADIUS_MULTIPLIERS = {
  xs: 0.5,
  sm: 0.75,
  md: 0.9,
  lg: 1,
  xl: 1.25,
  "2xl": 1.5,
  "3xl": 2,
  "4xl": 3,
} as const

const STATUS_COLORS = {
  success: { light: "#2e7d32", dark: "#46a758" },
  warning: { light: "#ffc53d", dark: "#f5d90a" },
  destructive: { light: "#e5484d", dark: "#e5484d" },
} as const

export type ThemeRadiusTokenName = keyof typeof RADIUS_MULTIPLIERS
export type ThemeColorTokens = Record<ThemeColorTokenName, string>

export type ResolvedTheme = {
  colors: Record<ThemeMode, ThemeColorTokens>
  primitives: Record<ThemeMode, GeneratedPalette>
  radii: Record<ThemeRadiusTokenName, number>
  selection: ThemeSelection
}

export type ThemeContrastCheck = {
  mode: ThemeMode
  label: string
  foregroundToken: ThemeColorTokenName
  backgroundToken: ThemeColorTokenName
  wcag: number
  apca: number
  requiredWcag: number
  passes: boolean
}

type DtcgColorValue = {
  colorSpace: "srgb"
  components: [number, number, number]
  alpha: number
  hex: string
}

type DtcgColorToken = {
  $type: "color"
  $value: DtcgColorValue
}

type DtcgDimensionToken = {
  $type: "dimension"
  $value: {
    value: number
    unit: "px"
  }
}

type FigmaPrimitiveMode = {
  accent: Record<string, DtcgColorToken>
  "accent-alpha": Record<string, DtcgColorToken>
  gray: Record<string, DtcgColorToken>
  "gray-alpha": Record<string, DtcgColorToken>
  canvas: DtcgColorToken
  "accent-contrast": DtcgColorToken
  "accent-surface": DtcgColorToken
  "gray-surface": DtcgColorToken
}

export type FigmaThemeTokens = {
  color: Record<ThemeMode, Record<string, DtcgColorToken>>
  primitive: { color: Record<ThemeMode, FigmaPrimitiveMode> }
  radius: Record<ThemeRadiusTokenName, DtcgDimensionToken>
}

export const THEME_TOKEN_MAPPINGS = THEME_COLOR_TOKEN_NAMES.map((token) => {
  const figmaToken = token.startsWith("danger")
    ? token.replace("danger", "destructive")
    : token

  return {
    css: `--${token}`,
    figmaLight: `Style/color/light/${figmaToken}`,
    figmaDark: `Style/color/dark/${figmaToken}`,
  }
})

function createColorTokens(
  selection: ThemeSelection,
  primitives: Record<ThemeMode, GeneratedPalette>
) {
  return {
    light: createColorMode("light", selection, primitives.light),
    dark: createColorMode("dark", selection, primitives.dark),
  }
}

function createColorMode(
  mode: ThemeMode,
  selection: ThemeSelection,
  palette: GeneratedPalette
): ThemeColorTokens {
  const status = createStatusColors(mode, palette)
  const foreground = palette.gray[11]
  const primaryForeground = chooseReadableForeground(palette.accent[8], [
    palette.accentContrast,
    foreground,
    "#ffffff",
    "#000000",
  ])
  const subtleAccentForeground = chooseReadableForeground(palette.accent[2], [
    palette.accent[10],
    palette.accent[11],
    foreground,
  ])
  const mutedForeground = chooseReadableForeground(palette.gray[2], [
    palette.gray[10],
    palette.gray[11],
    foreground,
  ])
  const panelSolid = palette.gray[1]
  const panelTranslucent = palette.graySurface
  let panel = panelTranslucent
  if (selection.panelBackground === "solid") {
    panel = panelSolid
  }

  const panelForeground = chooseReadableForeground(
    flattenColor(panel, palette.background),
    [foreground, palette.gray[11], "#ffffff", "#000000"]
  )
  const surface = palette.grayAlpha[2]
  const surfaceForeground = chooseReadableForeground(
    flattenColor(surface, palette.background),
    [foreground, palette.gray[11], "#ffffff", "#000000"]
  )
  const codeNumber = chooseReadableForeground(palette.gray[2], [
    palette.gray[10],
    palette.gray[11],
  ])
  const selectionForeground = chooseReadableForeground(palette.accent[8], [
    primaryForeground,
    "#ffffff",
    "#000000",
  ])

  return {
    background: palette.background,
    foreground,
    primary: palette.accent[8],
    "primary-foreground": primaryForeground,
    secondary: palette.gray[2],
    "secondary-foreground": foreground,
    accent: palette.accent[2],
    "accent-foreground": subtleAccentForeground,
    muted: palette.gray[2],
    "muted-foreground": mutedForeground,
    success: status.success.background,
    "success-foreground": status.success.foreground,
    warning: status.warning.background,
    "warning-foreground": status.warning.foreground,
    danger: status.destructive.background,
    "danger-foreground": status.destructive.foreground,
    destructive: status.destructive.background,
    "destructive-foreground": status.destructive.foreground,
    card: panel,
    "card-foreground": panelForeground,
    popover: panelSolid,
    "popover-foreground": foreground,
    overlay: panel,
    "overlay-foreground": panelForeground,
    border: palette.gray[5],
    input: palette.gray[6],
    ring: palette.accent[7],
    navbar: panel,
    "navbar-foreground": panelForeground,
    sidebar: palette.gray[1],
    "sidebar-foreground": foreground,
    "sidebar-primary": palette.accent[3],
    "sidebar-primary-foreground": subtleAccentForeground,
    "sidebar-accent": palette.gray[3],
    "sidebar-accent-foreground": foreground,
    "sidebar-border": palette.gray[5],
    "sidebar-ring": palette.accent[7],
    "chart-1": palette.accent[8],
    "chart-2": palette.accent[10],
    "chart-3": palette.accent[6],
    "chart-4": palette.accent[4],
    "chart-5": palette.accent[2],
    surface,
    "surface-foreground": surfaceForeground,
    panel,
    "panel-foreground": panelForeground,
    "panel-solid": panelSolid,
    "panel-solid-foreground": foreground,
    "panel-translucent": panelTranslucent,
    "panel-translucent-foreground": panelForeground,
    "accent-surface": palette.accentSurface,
    "accent-indicator": palette.accent[8],
    "accent-track": palette.accent[4],
    scrim: "#00000080",
    code: palette.gray[1],
    "code-foreground": foreground,
    "code-highlight": palette.gray[3],
    "code-number": codeNumber,
    selection: palette.accent[8],
    "selection-foreground": selectionForeground,
  }
}

function createStatusColors(mode: ThemeMode, palette: GeneratedPalette) {
  return Object.fromEntries(
    Object.entries(STATUS_COLORS).map(([name, values]) => {
      const scale = generatePalette({
        appearance: mode,
        accent: values[mode],
        gray: palette.gray[8],
        background: palette.background,
      })
      return [
        name,
        {
          background: scale.accent[8],
          foreground: chooseReadableForeground(scale.accent[8], [
            scale.accentContrast,
            palette.gray[11],
            "#ffffff",
            "#000000",
          ]),
        },
      ]
    })
  ) as Record<
    keyof typeof STATUS_COLORS,
    { background: string; foreground: string }
  >
}

function chooseReadableForeground(background: string, candidates: string[]) {
  let best = candidates[0]
  let bestContrast = 0

  for (const candidate of candidates) {
    const contrast = wcagContrast(background, candidate)
    if (contrast >= 4.5) {
      return candidate
    }

    if (contrast > bestContrast) {
      best = candidate
      bestContrast = contrast
    }
  }

  return best
}

function flattenColor(value: string, canvas: string) {
  const foreground = new Color(value).to("srgb")
  const background = new Color(canvas).to("srgb")
  const alpha = foreground.alpha ?? 1
  if (alpha === 1) {
    return value
  }

  const coordinates: [number, number, number] = [0, 1, 2].map((index) => {
    return (
      foreground.coords[index] * alpha + background.coords[index] * (1 - alpha)
    )
  }) as [number, number, number]
  return new Color("srgb", coordinates).toString({ format: "hex" })
}

function radiusToPixels(radius: ThemeRadius) {
  return Number.parseFloat(radius) * 16
}

function createRadii(radius: ThemeRadius) {
  const basePixels = radiusToPixels(radius)
  return Object.fromEntries(
    Object.entries(RADIUS_MULTIPLIERS).map(([name, multiplier]) => [
      name,
      Number((basePixels * multiplier).toFixed(3)),
    ])
  ) as Record<ThemeRadiusTokenName, number>
}

export function createThemeTokens(selection: ThemeSelection): ResolvedTheme {
  assertThemeSelection(selection)
  const primitives = {
    light: generatePalette({ appearance: "light", ...selection.light }),
    dark: generatePalette({ appearance: "dark", ...selection.dark }),
  }

  return {
    colors: createColorTokens(selection, primitives),
    primitives,
    radii: createRadii(selection.radius),
    selection,
  }
}

export function createThemeContrastChecks(
  selection: ThemeSelection
): ThemeContrastCheck[] {
  return createThemeContrastChecksFromTheme(createThemeTokens(selection))
}

function createThemeContrastChecksFromTheme(
  theme: ResolvedTheme
): ThemeContrastCheck[] {
  const pairs = [
    ["Body", "foreground", "background"],
    ["Primary action", "primary-foreground", "primary"],
    ["Secondary", "secondary-foreground", "secondary"],
    ["Accent", "accent-foreground", "accent"],
    ["Muted text", "muted-foreground", "muted"],
    ["Success", "success-foreground", "success"],
    ["Warning", "warning-foreground", "warning"],
    ["Destructive", "destructive-foreground", "destructive"],
    ["Panel", "panel-foreground", "panel"],
    ["Control surface", "surface-foreground", "surface"],
  ] as const

  return (["light", "dark"] as const).flatMap((mode) => {
    return pairs.map(([label, foregroundToken, backgroundToken]) => {
      const foreground = theme.colors[mode][foregroundToken]
      const background = flattenColor(
        theme.colors[mode][backgroundToken],
        theme.colors[mode].background
      )
      const wcag = wcagContrast(background, foreground)
      const apca = Math.abs(
        new Color(foreground).contrastAPCA(new Color(background))
      )

      return {
        mode,
        label,
        foregroundToken,
        backgroundToken,
        wcag: Number(wcag.toFixed(2)),
        apca: Number(apca.toFixed(1)),
        requiredWcag: 4.5,
        passes: wcag >= 4.5,
      }
    })
  })
}

function serializeCssVariables(values: Record<string, string>) {
  return Object.entries(values)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n")
}

function createCssRadii(radius: ThemeRadius) {
  return {
    "radius-lg": radius,
    radius: "var(--radius-lg)",
    "radius-xs": "calc(var(--radius-lg) * 0.5)",
    "radius-sm": "calc(var(--radius-lg) * 0.75)",
    "radius-md": "calc(var(--radius-lg) * 0.9)",
    "radius-xl": "calc(var(--radius-lg) * 1.25)",
    "radius-2xl": "calc(var(--radius-lg) * 1.5)",
    "radius-3xl": "calc(var(--radius-lg) * 2)",
    "radius-4xl": "calc(var(--radius-lg) * 3)",
  }
}

function createPrimitiveCssVariables(
  palette: GeneratedPalette,
  wideGamut = false
) {
  const values: Record<string, string> = {}
  const accent = wideGamut ? palette.accentWideGamut : palette.accent
  const accentAlpha = wideGamut
    ? palette.accentAlphaWideGamut
    : palette.accentAlpha
  const gray = wideGamut ? palette.grayWideGamut : palette.gray
  const grayAlpha = wideGamut ? palette.grayAlphaWideGamut : palette.grayAlpha

  THEME_PRIMITIVE_STEPS.forEach((step, index) => {
    values[`accent-${step}`] = accent[index]
    values[`accent-a${step}`] = accentAlpha[index]
    values[`gray-${step}`] = gray[index]
    values[`gray-a${step}`] = grayAlpha[index]
  })

  values["accent-contrast"] = palette.accentContrast
  values["accent-surface-primitive"] = wideGamut
    ? palette.accentSurfaceWideGamut
    : palette.accentSurface
  values["gray-surface"] = wideGamut
    ? palette.graySurfaceWideGamut
    : palette.graySurface
  return values
}

export function generateTheme(selection: ThemeSelection) {
  return generateThemeFromTokens(createThemeTokens(selection))
}

function generateThemeFromTokens(theme: ResolvedTheme) {
  const { selection } = theme
  const light = {
    ...createPrimitiveCssVariables(theme.primitives.light),
    ...theme.colors.light,
    ...createCssRadii(selection.radius),
  }
  const dark = {
    ...createPrimitiveCssVariables(theme.primitives.dark),
    ...theme.colors.dark,
  }
  const lightWideGamut = createPrimitiveCssVariables(
    theme.primitives.light,
    true
  )
  const darkWideGamut = createPrimitiveCssVariables(theme.primitives.dark, true)

  return `:root {\n${serializeCssVariables(light)}\n}\n\n.dark {\n${serializeCssVariables(dark)}\n}\n\n@supports (color: color(display-p3 1 1 1)) {\n  :root {\n${indentCssVariables(lightWideGamut, 4)}\n  }\n\n  .dark {\n${indentCssVariables(darkWideGamut, 4)}\n  }\n}`
}

function indentCssVariables(values: Record<string, string>, spaces: number) {
  const indentation = " ".repeat(spaces)
  return Object.entries(values)
    .map(([name, value]) => `${indentation}--${name}: ${value};`)
    .join("\n")
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

function round(value: number) {
  return Number(value.toFixed(6))
}

function toHexChannel(value: number) {
  return Math.round(clamp(value) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()
}

function toDtcgColor(value: string): DtcgColorValue {
  const parsed = parse(value)
  if (!parsed) {
    throw new Error(`Could not parse theme color: ${value}`)
  }

  const converted = rgb(parsed)
  if (!converted) {
    throw new Error(`Could not convert theme color to sRGB: ${value}`)
  }

  const red = clamp(converted.r)
  const green = clamp(converted.g)
  const blue = clamp(converted.b)
  const alpha = clamp(converted.alpha ?? 1)
  return {
    colorSpace: "srgb",
    components: [round(red), round(green), round(blue)],
    alpha: round(alpha),
    hex: `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`,
  }
}

function createFigmaToken(value: string): DtcgColorToken {
  return { $type: "color", $value: toDtcgColor(value) }
}

function createFigmaColorMode(tokens: ThemeColorTokens) {
  return Object.fromEntries(
    FIGMA_STYLE_COLOR_TOKEN_NAMES.map((name) => [
      name,
      createFigmaToken(tokens[name]),
    ])
  )
}

function createFigmaPrimitiveMode(
  palette: GeneratedPalette
): FigmaPrimitiveMode {
  const createScale = (values: GeneratedPalette["accent"]) => {
    return Object.fromEntries(
      THEME_PRIMITIVE_STEPS.map((step, index) => [
        String(step),
        createFigmaToken(values[index]),
      ])
    )
  }

  return {
    accent: createScale(palette.accent),
    "accent-alpha": createScale(palette.accentAlpha),
    gray: createScale(palette.gray),
    "gray-alpha": createScale(palette.grayAlpha),
    canvas: createFigmaToken(palette.background),
    "accent-contrast": createFigmaToken(palette.accentContrast),
    "accent-surface": createFigmaToken(palette.accentSurface),
    "gray-surface": createFigmaToken(palette.graySurface),
  }
}

export function generateFigmaThemeTokens(
  selection: ThemeSelection
): FigmaThemeTokens {
  return generateFigmaThemeTokensFromTheme(createThemeTokens(selection))
}

function generateFigmaThemeTokensFromTheme(
  theme: ResolvedTheme
): FigmaThemeTokens {
  const radius = Object.fromEntries(
    Object.entries(theme.radii).map(([name, value]) => [
      name,
      {
        $type: "dimension",
        $value: { value, unit: "px" },
      } satisfies DtcgDimensionToken,
    ])
  ) as Record<ThemeRadiusTokenName, DtcgDimensionToken>

  return {
    color: {
      light: createFigmaColorMode(theme.colors.light),
      dark: createFigmaColorMode(theme.colors.dark),
    },
    primitive: {
      color: {
        light: createFigmaPrimitiveMode(theme.primitives.light),
        dark: createFigmaPrimitiveMode(theme.primitives.dark),
      },
    },
    radius,
  }
}

export function generateFigmaThemeJson(selection: ThemeSelection) {
  return `${JSON.stringify(generateFigmaThemeTokens(selection), null, 2)}\n`
}

export function createThemeArtifacts(selection: ThemeSelection) {
  const theme = createThemeTokens(selection)
  const figmaTokens = generateFigmaThemeTokensFromTheme(theme)

  return {
    theme,
    contrastChecks: createThemeContrastChecksFromTheme(theme),
    css: generateThemeFromTokens(theme),
    figmaJson: `${JSON.stringify(figmaTokens, null, 2)}\n`,
    manifestJson: generateThemeManifestJson(selection),
  }
}

export function createThemeManifest(selection: ThemeSelection): ThemeManifest {
  assertThemeSelection(selection)
  return { schemaVersion: THEME_MANIFEST_VERSION, selection }
}

export function generateThemeManifestJson(selection: ThemeSelection) {
  return `${JSON.stringify(createThemeManifest(selection), null, 2)}\n`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[\dA-Fa-f]{6}$/.test(value)
}

function isThemeRadius(value: unknown): value is ThemeRadius {
  return (
    typeof value === "string" &&
    THEME_RADIUS_OPTIONS.some((option) => option === value)
  )
}

function assertAppearanceSelection(
  appearance: unknown,
  name: ThemeMode
): asserts appearance is ThemeAppearanceSelection {
  if (!isRecord(appearance)) {
    throw new Error(`Theme ${name} appearance must be an object.`)
  }

  if (!isHexColor(appearance.accent)) {
    throw new Error(`Theme ${name} accent must be a six-digit hex color.`)
  }

  if (!isHexColor(appearance.gray)) {
    throw new Error(`Theme ${name} gray must be a six-digit hex color.`)
  }

  if (!isHexColor(appearance.background)) {
    throw new Error(`Theme ${name} background must be a six-digit hex color.`)
  }
}

export function assertThemeSelection(
  selection: unknown
): asserts selection is ThemeSelection {
  if (!isRecord(selection)) {
    throw new Error("Theme selection must be an object.")
  }

  assertAppearanceSelection(selection.light, "light")
  assertAppearanceSelection(selection.dark, "dark")

  if (selection.grayMode !== "auto" && selection.grayMode !== "custom") {
    throw new Error('Theme gray mode must be "auto" or "custom".')
  }

  if (
    selection.panelBackground !== "solid" &&
    selection.panelBackground !== "translucent"
  ) {
    throw new Error('Theme panel background must be "solid" or "translucent".')
  }

  if (!isThemeRadius(selection.radius)) {
    throw new Error("Theme radius is not supported.")
  }
}

export function parseThemeManifestJson(source: string): ThemeManifest {
  let parsed: unknown
  try {
    parsed = JSON.parse(source)
  } catch {
    throw new Error("Theme file is not valid JSON.")
  }

  if (!isRecord(parsed)) {
    throw new Error("Theme file must contain an object.")
  }

  if (parsed.schemaVersion === 1) {
    return {
      schemaVersion: THEME_MANIFEST_VERSION,
      selection: migrateLegacySelection(parsed.selection),
    }
  }

  if (parsed.schemaVersion !== THEME_MANIFEST_VERSION) {
    throw new Error(
      `Theme file uses an unsupported schema version. Expected ${THEME_MANIFEST_VERSION}.`
    )
  }

  assertThemeSelection(parsed.selection)
  return { schemaVersion: THEME_MANIFEST_VERSION, selection: parsed.selection }
}

function migrateLegacySelection(value: unknown): ThemeSelection {
  if (!isRecord(value)) {
    throw new Error("Legacy theme selection must be an object.")
  }

  if (!isKnownLegacyColor(value.primary)) {
    throw new Error("Legacy theme primary color is not supported.")
  }

  if (!isKnownLegacyColor(value.gray) || !neutralColors.includes(value.gray)) {
    throw new Error("Legacy theme gray color must be a neutral family.")
  }

  if (!isKnownLegacyColor(value.accent)) {
    throw new Error("Legacy theme accent color is not supported.")
  }

  if (!isThemeRadius(value.radius)) {
    throw new Error("Legacy theme radius is not supported.")
  }

  const lightAccent = legacyColorToHex(
    value.primary,
    getLegacyPrimaryShade(value.primary, false)
  )
  const darkAccent = legacyColorToHex(
    value.primary,
    getLegacyPrimaryShade(value.primary, true)
  )
  const gray = legacyColorToHex(value.gray, "500")
  return {
    light: {
      accent: lightAccent,
      gray,
      background: "#ffffff",
    },
    dark: {
      accent: darkAccent,
      gray,
      background: "#09090b",
    },
    grayMode: "custom",
    panelBackground: "translucent",
    radius: value.radius,
  }
}

function isKnownLegacyColor(value: unknown): value is keyof typeof colors {
  return typeof value === "string" && Object.hasOwn(colors, value)
}

function getLegacyPrimaryShade(color: string, dark: boolean): Shade {
  if (neutralColors.includes(color)) {
    return dark ? "50" : "950"
  }

  if (accentColors500.includes(color)) {
    return "500"
  }

  if (accentColors300.includes(color)) {
    return "300"
  }

  if (accentColors400.includes(color)) {
    return "400"
  }

  return "600"
}

function legacyColorToHex(color: keyof typeof colors, shade: Shade) {
  const parsed = parse(colors[color][shade])
  if (!parsed) {
    throw new Error(`Could not migrate legacy color ${color}-${shade}.`)
  }

  return formatHex(parsed).toLowerCase()
}

export function updateAutomaticGray(
  selection: ThemeSelection,
  mode: ThemeMode,
  accent: string
) {
  if (selection.grayMode !== "auto") {
    return selection
  }

  return {
    ...selection,
    [mode]: {
      ...selection[mode],
      gray: deriveGraySource(accent),
    },
  }
}
