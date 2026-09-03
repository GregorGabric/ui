import { parse, rgb } from "culori"

import {
  accentColors300,
  accentColors400,
  accentColors500,
  adjustLightness,
  neutralColors,
} from "./colors"
import colors from "./colors.json"

type BlackWhite = "white" | "black"
type Shade = keyof (typeof colors)["slate"]
type ForegroundColor = Shade | BlackWhite
type ThemeMode = "light" | "dark"

export const THEME_MANIFEST_VERSION = 1
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

export type ThemeSelection = {
  primary: string
  gray: string
  accent: string
  radius: ThemeRadius
}

export type ThemeManifest = {
  schemaVersion: typeof THEME_MANIFEST_VERSION
  selection: ThemeSelection
}

export const DEFAULT_THEME_SELECTION: ThemeSelection = {
  primary: "blue",
  gray: "zinc",
  accent: "zinc",
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

export type ThemeRadiusTokenName = keyof typeof RADIUS_MULTIPLIERS
export type ThemeColorTokens = Record<ThemeColorTokenName, string>

export type ResolvedTheme = {
  colors: Record<ThemeMode, ThemeColorTokens>
  radii: Record<ThemeRadiusTokenName, number>
  selection: ThemeSelection
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

export type FigmaThemeTokens = {
  color: Record<ThemeMode, Record<string, DtcgColorToken>>
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

export const getColorValue = (colorKey: string | BlackWhite, shade?: Shade) => {
  if (colorKey === "white") {
    return "oklch(1 0 0)"
  }

  if (colorKey === "black") {
    return "oklch(0 0 0)"
  }

  if (!shade) {
    throw new Error(`Shade is required for colorKey: ${colorKey}`)
  }

  const colorFamily = colors[colorKey as keyof typeof colors]
  if (!colorFamily) {
    throw new Error(`Unknown color family: ${colorKey}`)
  }

  return colorFamily[shade]
}

function getForegroundValue(colorKey: string, foreground: ForegroundColor) {
  if (foreground === "white" || foreground === "black") {
    return getColorValue(foreground)
  }

  return getColorValue(colorKey, foreground)
}

function determineShade(
  isNeutral: boolean,
  isShade500: boolean,
  isShade300: boolean,
  isShade400: boolean,
  isDarkMode = false
): Shade {
  if (isNeutral) {
    return isDarkMode ? "50" : "950"
  }

  if (isShade500) {
    return "500"
  }

  if (isShade300) {
    return "300"
  }

  if (isShade400) {
    return "400"
  }

  return "600"
}

function determineForeground(
  isNeutral: boolean,
  isShade400: boolean,
  isDarkMode = false
): ForegroundColor {
  if (isNeutral) {
    return isDarkMode ? "950" : "50"
  }

  return isShade400 ? "950" : "white"
}

function getPalette(selection: ThemeSelection) {
  const { primary, accent } = selection
  const isNeutralPrimary = neutralColors.includes(primary)
  const isShade400Primary = accentColors400.includes(primary)
  const isShade500Primary = accentColors500.includes(primary)
  const isShade300Primary = accentColors300.includes(primary)
  const isNeutralAccent = neutralColors.includes(accent)
  const isShade400Accent = accentColors400.includes(accent)
  const isShade500Accent = accentColors500.includes(accent)
  const isShade300Accent = accentColors300.includes(accent)

  const lightPrimary = determineShade(
    isNeutralPrimary,
    isShade500Primary,
    isShade300Primary,
    isShade400Primary
  )
  const darkPrimary = determineShade(
    isNeutralPrimary,
    isShade500Primary,
    isShade300Primary,
    isShade400Primary,
    true
  )
  const lightPrimaryForeground = determineForeground(
    isNeutralPrimary,
    isShade400Primary
  )
  const darkPrimaryForeground = determineForeground(
    isNeutralPrimary,
    isShade400Primary,
    true
  )

  let lightAccent: Shade = "200"
  let lightAccentForeground: ForegroundColor = "950"
  let darkAccent: Shade = "800"
  let darkAccentForeground: ForegroundColor = "50"

  if (!isNeutralAccent) {
    lightAccent = determineShade(
      false,
      isShade500Accent,
      isShade300Accent,
      isShade400Accent
    )
    lightAccentForeground = determineForeground(false, isShade400Accent)
    darkAccent = determineShade(
      false,
      isShade500Accent,
      isShade300Accent,
      isShade400Accent,
      true
    )
    darkAccentForeground = determineForeground(false, isShade400Accent, true)
  }

  return {
    lightPrimary,
    lightPrimaryForeground,
    darkPrimary,
    darkPrimaryForeground,
    lightAccent,
    lightAccentForeground,
    darkAccent,
    darkAccentForeground,
    isNeutralPrimary,
  }
}

function createColorTokens(selection: ThemeSelection) {
  const { primary, gray, accent } = selection
  const palette = getPalette(selection)
  const white = getColorValue("white")
  const gray50 = getColorValue(gray, "50")
  const gray100 = getColorValue(gray, "100")
  const gray200 = getColorValue(gray, "200")
  const gray300 = getColorValue(gray, "300")
  const gray400 = getColorValue(gray, "400")
  const gray500 = getColorValue(gray, "500")
  const gray700 = getColorValue(gray, "700")
  const gray800 = getColorValue(gray, "800")
  const gray900 = getColorValue(gray, "900")
  const gray950 = getColorValue(gray, "950")
  const lightForeground = gray950
  const darkForeground = gray50
  const destructive =
    primary === "red"
      ? adjustLightness(getColorValue("red", "600"), -4)
      : getColorValue("red", "600")
  const warning = getColorValue("amber", primary === "amber" ? "200" : "400")
  const destructiveForeground = getColorValue("red", "50")
  const warningForeground = getColorValue("amber", "950")
  const lightBorder = adjustLightness(gray300, 4)
  const darkBorder = adjustLightness(gray700, -10)
  const lightSecondary = gray200
  const darkSecondary = adjustLightness(gray800, -3)
  const lightSurface = gray50
  const darkSurface = gray900

  const lightChartShades: Array<Shade> = palette.isNeutralPrimary
    ? ["900", "700", "600", "500", "400"]
    : ["600", "400", "300", "200", "100"]
  const darkChartShades: Array<Shade> = palette.isNeutralPrimary
    ? ["800", "700", "500", "400", "300"]
    : ["700", "500", "400", "300", "200"]
  const lightRingShade = palette.isNeutralPrimary ? "950" : "600"
  const darkRingShade = palette.isNeutralPrimary ? "50" : "600"

  const light = {
    background: white,
    foreground: lightForeground,
    primary: getColorValue(primary, palette.lightPrimary),
    "primary-foreground": getForegroundValue(
      primary,
      palette.lightPrimaryForeground
    ),
    secondary: lightSecondary,
    "secondary-foreground": lightForeground,
    accent: getColorValue(accent, palette.lightAccent),
    "accent-foreground": getForegroundValue(
      accent,
      palette.lightAccentForeground
    ),
    muted: gray100,
    "muted-foreground": gray500,
    success: getColorValue("emerald", "600"),
    "success-foreground": white,
    warning,
    "warning-foreground": warningForeground,
    danger: destructive,
    "danger-foreground": destructiveForeground,
    destructive,
    "destructive-foreground": destructiveForeground,
    card: white,
    "card-foreground": lightForeground,
    popover: white,
    "popover-foreground": lightForeground,
    overlay: white,
    "overlay-foreground": lightForeground,
    border: lightBorder,
    input: gray300,
    ring: getColorValue(primary, lightRingShade),
    navbar: adjustLightness(gray50, 1),
    "navbar-foreground": lightForeground,
    sidebar: gray100,
    "sidebar-foreground": lightForeground,
    "sidebar-primary": lightSecondary,
    "sidebar-primary-foreground": lightForeground,
    "sidebar-accent": lightSecondary,
    "sidebar-accent-foreground": lightForeground,
    "sidebar-border": lightBorder,
    "sidebar-ring": adjustLightness(gray500, 10),
    "chart-1": getColorValue(primary, lightChartShades[0]),
    "chart-2": getColorValue(primary, lightChartShades[1]),
    "chart-3": getColorValue(primary, lightChartShades[2]),
    "chart-4": getColorValue(primary, lightChartShades[3]),
    "chart-5": getColorValue(primary, lightChartShades[4]),
    surface: lightSurface,
    "surface-foreground": lightForeground,
    code: lightSurface,
    "code-foreground": lightForeground,
    "code-highlight": gray100,
    "code-number": gray500,
    selection: gray950,
    "selection-foreground": white,
  } satisfies ThemeColorTokens

  const dark = {
    background: adjustLightness(gray950, -5),
    foreground: darkForeground,
    primary: getColorValue(primary, palette.darkPrimary),
    "primary-foreground": getForegroundValue(
      primary,
      palette.darkPrimaryForeground
    ),
    secondary: darkSecondary,
    "secondary-foreground": darkForeground,
    accent: getColorValue(accent, palette.darkAccent),
    "accent-foreground": getForegroundValue(
      accent,
      palette.darkAccentForeground
    ),
    muted: gray900,
    "muted-foreground": gray400,
    success: getColorValue("emerald", "600"),
    "success-foreground": white,
    warning,
    "warning-foreground": warningForeground,
    danger: destructive,
    "danger-foreground": destructiveForeground,
    destructive,
    "destructive-foreground": destructiveForeground,
    card: adjustLightness(gray900, -3),
    "card-foreground": darkForeground,
    popover: gray900,
    "popover-foreground": darkForeground,
    overlay: adjustLightness(gray900, -3),
    "overlay-foreground": darkForeground,
    border: darkBorder,
    input: adjustLightness(gray700, -5),
    ring: getColorValue(primary, darkRingShade),
    navbar: adjustLightness(gray900, -2),
    "navbar-foreground": darkForeground,
    sidebar: adjustLightness(gray900, -5),
    "sidebar-foreground": darkForeground,
    "sidebar-primary": darkSecondary,
    "sidebar-primary-foreground": darkForeground,
    "sidebar-accent": darkSecondary,
    "sidebar-accent-foreground": darkForeground,
    "sidebar-border": darkBorder,
    "sidebar-ring": gray500,
    "chart-1": getColorValue(primary, darkChartShades[0]),
    "chart-2": getColorValue(primary, darkChartShades[1]),
    "chart-3": getColorValue(primary, darkChartShades[2]),
    "chart-4": getColorValue(primary, darkChartShades[3]),
    "chart-5": getColorValue(primary, darkChartShades[4]),
    surface: darkSurface,
    "surface-foreground": gray400,
    code: darkSurface,
    "code-foreground": gray400,
    "code-highlight": gray800,
    "code-number": gray400,
    selection: gray200,
    "selection-foreground": gray800,
  } satisfies ThemeColorTokens

  return { light, dark }
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

  return {
    colors: createColorTokens(selection),
    radii: createRadii(selection.radius),
    selection,
  }
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

export function generateTheme(selection: ThemeSelection) {
  const theme = createThemeTokens(selection)
  const light = {
    ...theme.colors.light,
    ...createCssRadii(selection.radius),
  }

  return `:root {\n${serializeCssVariables(light)}\n}\n\n.dark {\n${serializeCssVariables(theme.colors.dark)}\n}`
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

function createFigmaColorMode(tokens: ThemeColorTokens) {
  return Object.fromEntries(
    FIGMA_STYLE_COLOR_TOKEN_NAMES.map((name) => [
      name,
      {
        $type: "color",
        $value: toDtcgColor(tokens[name]),
      } satisfies DtcgColorToken,
    ])
  )
}

export function generateFigmaThemeTokens(
  selection: ThemeSelection
): FigmaThemeTokens {
  const theme = createThemeTokens(selection)
  const radiusTokens = Object.fromEntries(
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
    radius: radiusTokens,
  }
}

export function generateFigmaThemeJson(selection: ThemeSelection) {
  return `${JSON.stringify(generateFigmaThemeTokens(selection), null, 2)}\n`
}

export function createThemeManifest(selection: ThemeSelection): ThemeManifest {
  assertThemeSelection(selection)

  return {
    schemaVersion: THEME_MANIFEST_VERSION,
    selection,
  }
}

export function generateThemeManifestJson(selection: ThemeSelection) {
  return `${JSON.stringify(createThemeManifest(selection), null, 2)}\n`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isKnownColor(value: unknown) {
  return typeof value === "string" && Object.hasOwn(colors, value)
}

function isThemeRadius(value: unknown): value is ThemeRadius {
  return (
    typeof value === "string" &&
    THEME_RADIUS_OPTIONS.some((option) => option === value)
  )
}

export function assertThemeSelection(
  selection: unknown
): asserts selection is ThemeSelection {
  if (!isRecord(selection)) {
    throw new Error("Theme selection must be an object.")
  }

  if (!isKnownColor(selection.primary)) {
    throw new Error("Theme primary color is not supported.")
  }

  if (!isKnownColor(selection.accent)) {
    throw new Error("Theme accent color is not supported.")
  }

  if (
    typeof selection.gray !== "string" ||
    !neutralColors.includes(selection.gray)
  ) {
    throw new Error("Theme gray color must be a neutral family.")
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

  if (parsed.schemaVersion !== THEME_MANIFEST_VERSION) {
    throw new Error(
      `Theme file uses an unsupported schema version. Expected ${THEME_MANIFEST_VERSION}.`
    )
  }

  assertThemeSelection(parsed.selection)

  return {
    schemaVersion: THEME_MANIFEST_VERSION,
    selection: parsed.selection,
  }
}
