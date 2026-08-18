import * as RadixColors from "@radix-ui/colors"
import BezierEasing from "bezier-easing"
import Color from "colorjs.io"

export type ThemeAppearance = "light" | "dark"
export type Scale12<T> = [T, T, T, T, T, T, T, T, T, T, T, T]

export type GeneratedPalette = {
  accent: Scale12<string>
  accentAlpha: Scale12<string>
  accentWideGamut: Scale12<string>
  accentAlphaWideGamut: Scale12<string>
  accentContrast: string
  accentSurface: string
  accentSurfaceWideGamut: string
  background: string
  gray: Scale12<string>
  grayAlpha: Scale12<string>
  grayWideGamut: Scale12<string>
  grayAlphaWideGamut: Scale12<string>
  graySurface: string
  graySurfaceWideGamut: string
}

const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const
const GRAY_SCALE_NAMES = [
  "gray",
  "mauve",
  "slate",
  "sage",
  "olive",
  "sand",
] as const
const SCALE_NAMES = [
  ...GRAY_SCALE_NAMES,
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "brown",
  "orange",
  "sky",
  "mint",
  "lime",
  "yellow",
  "amber",
] as const

type ScaleName = (typeof SCALE_NAMES)[number]
type GrayScaleName = (typeof GRAY_SCALE_NAMES)[number]
type ColorScale = Scale12<Color>

const RADIX_COLORS = RadixColors as unknown as Record<
  string,
  Record<string, string>
>

function createReferenceScales(
  names: readonly string[],
  suffix: string
): Record<string, ColorScale> {
  return Object.fromEntries(
    names.map((name) => {
      const source = RADIX_COLORS[`${name}${suffix}`]
      if (!source) {
        throw new Error(`Missing Radix color scale: ${name}${suffix}`)
      }

      const values = Object.values(source).map((value) => {
        return new Color(value).to("oklch")
      }) as ColorScale

      return [name, values]
    })
  )
}

const LIGHT_COLORS = createReferenceScales(SCALE_NAMES, "P3") as Record<
  ScaleName,
  ColorScale
>
const DARK_COLORS = createReferenceScales(SCALE_NAMES, "DarkP3") as Record<
  ScaleName,
  ColorScale
>
const LIGHT_GRAY_COLORS = createReferenceScales(
  GRAY_SCALE_NAMES,
  "P3"
) as Record<GrayScaleName, ColorScale>
const DARK_GRAY_COLORS = createReferenceScales(
  GRAY_SCALE_NAMES,
  "DarkP3"
) as Record<GrayScaleName, ColorScale>

const DARK_MODE_EASING = [1, 0, 1, 0] as const
const LIGHT_MODE_EASING = [0, 2, 0, 2] as const

/**
 * Adapted from the MIT-licensed Radix Themes custom palette generator.
 * Reference scale geometry is preserved while hue, chroma, and canvas are
 * replaced by the exact project colors selected in the editor.
 */
export function generatePalette({
  appearance,
  accent,
  gray,
  background,
}: {
  appearance: ThemeAppearance
  accent: string
  gray: string
  background: string
}): GeneratedPalette {
  const allScales = appearance === "light" ? LIGHT_COLORS : DARK_COLORS
  const grayScales =
    appearance === "light" ? LIGHT_GRAY_COLORS : DARK_GRAY_COLORS
  const backgroundColor = new Color(background).to("oklch")
  const grayBaseColor = new Color(gray).to("oklch")
  const grayScale = getScaleFromColor(
    grayBaseColor,
    grayScales,
    backgroundColor
  )
  const accentBaseColor = new Color(accent).to("oklch")
  let accentScale = getScaleFromColor(
    accentBaseColor,
    allScales,
    backgroundColor
  )
  const backgroundHex = toHex(backgroundColor)
  const accentBaseHex = toHex(accentBaseColor)

  if (accentBaseHex === "#000000" || accentBaseHex === "#ffffff") {
    accentScale = grayScale.map((color) => color.clone()) as ColorScale
  }

  const [accent9, accentContrast] = getStep9Colors(accentScale, accentBaseColor)
  accentScale[8] = accent9
  accentScale[9] = getButtonHoverColor(accent9, [accentScale])

  limitTextChroma(accentScale, 10)
  limitTextChroma(accentScale, 11)

  const accentHex = accentScale.map(toHex) as Scale12<string>
  const accentWideGamut = accentScale.map(toOklchString) as Scale12<string>
  const accentAlpha = accentHex.map((color) => {
    return getAlphaColorSrgb(color, backgroundHex)
  }) as Scale12<string>
  const accentAlphaWideGamut = accentWideGamut.map((color) => {
    return getAlphaColorP3(color, backgroundHex)
  }) as Scale12<string>
  const grayHex = grayScale.map(toHex) as Scale12<string>
  const grayWideGamut = grayScale.map(toOklchString) as Scale12<string>
  const grayAlpha = grayHex.map((color) => {
    return getAlphaColorSrgb(color, backgroundHex)
  }) as Scale12<string>
  const grayAlphaWideGamut = grayWideGamut.map((color) => {
    return getAlphaColorP3(color, backgroundHex)
  }) as Scale12<string>
  const accentSurfaceAlpha = appearance === "light" ? 0.8 : 0.5
  let graySurface = "#ffffffcc"
  let graySurfaceWideGamut = "color(display-p3 1 1 1 / 80%)"

  if (appearance === "dark") {
    graySurface = "#0000000d"
    graySurfaceWideGamut = "color(display-p3 0 0 0 / 5%)"
  }

  return {
    accent: accentHex,
    accentAlpha,
    accentWideGamut,
    accentAlphaWideGamut,
    accentContrast: toHex(accentContrast),
    accentSurface: getAlphaColorSrgb(
      accentHex[1],
      backgroundHex,
      accentSurfaceAlpha
    ),
    accentSurfaceWideGamut: getAlphaColorP3(
      accentWideGamut[1],
      backgroundHex,
      accentSurfaceAlpha
    ),
    background: backgroundHex,
    gray: grayHex,
    grayAlpha,
    grayWideGamut,
    grayAlphaWideGamut,
    graySurface,
    graySurfaceWideGamut,
  }
}

export function deriveGraySource(accent: string) {
  const source = new Color(accent).to("oklch")
  const hue = Number.isNaN(source.coords[2]) ? 0 : source.coords[2]
  const chroma = Math.min(0.025, Math.max(0.006, source.coords[1] * 0.12))
  return toHex(new Color("oklch", [0.58, chroma, hue]))
}

function limitTextChroma(scale: ColorScale, index: 10 | 11) {
  const minimum = Math.max(scale[8].coords[1], scale[7].coords[1])
  scale[index].coords[1] = Math.min(minimum, scale[index].coords[1])
}

function getStep9Colors(
  scale: ColorScale,
  accentBaseColor: Color
): [Color, Color] {
  const distance = accentBaseColor.deltaEOK(scale[0]) * 100
  if (distance < 25) {
    return [scale[8], getTextColor(scale[8])]
  }

  return [accentBaseColor, getTextColor(accentBaseColor)]
}

function getTextColor(background: Color) {
  const white = new Color("oklch", [1, 0, 0])
  if (Math.abs(white.contrastAPCA(background)) < 40) {
    const [, chroma, hue] = background.coords
    const safeHue = Number.isNaN(hue) ? 0 : hue
    return new Color("oklch", [0.25, Math.max(0.08 * chroma, 0.04), safeHue])
  }

  return white
}

function getButtonHoverColor(source: Color, scales: ColorScale[]) {
  const [lightness, chroma, hue] = source.coords
  let nextLightness = lightness + 0.03 / (lightness + 0.1)
  let nextChroma = chroma

  if (lightness > 0.4) {
    nextLightness = lightness - 0.03 / (lightness + 0.1)
    if (!Number.isNaN(hue)) {
      nextChroma = chroma * 0.93
    }
  }

  const hover = new Color("oklch", [nextLightness, nextChroma, hue])
  let closest = hover
  let minimumDistance = Number.POSITIVE_INFINITY

  for (const scale of scales) {
    for (const color of scale) {
      const distance = hover.deltaEOK(color)
      if (distance < minimumDistance) {
        minimumDistance = distance
        closest = color
      }
    }
  }

  hover.coords[1] = closest.coords[1]
  hover.coords[2] = closest.coords[2]
  return hover
}

function getScaleFromColor(
  source: Color,
  scales: Record<string, ColorScale>,
  background: Color
) {
  const allColors: Array<{
    scale: string
    color: Color
    distance: number
  }> = []

  for (const [name, scale] of Object.entries(scales)) {
    for (const color of scale) {
      allColors.push({
        scale: name,
        color,
        distance: source.deltaEOK(color),
      })
    }
  }

  allColors.sort((a, b) => a.distance - b.distance)
  const closest = allColors.filter((color, index, values) => {
    return index === values.findIndex((value) => value.scale === color.scale)
  })
  const grayNames = GRAY_SCALE_NAMES as readonly string[]
  const onlyGrays = closest.every((color) => grayNames.includes(color.scale))

  if (!onlyGrays && grayNames.includes(closest[0].scale)) {
    while (closest[1] && grayNames.includes(closest[1].scale)) {
      closest.splice(1, 1)
    }
  }

  const colorA = closest[0]
  const colorB = closest[1]
  if (!colorA || !colorB) {
    throw new Error("Could not find reference colors for the palette.")
  }

  const a = colorB.distance
  const b = colorA.distance
  const c = colorA.color.deltaEOK(colorB.color)
  const ratio = getMixRatio(a, b, c)
  const scaleA = scales[colorA.scale]
  const scaleB = scales[colorB.scale]
  if (!scaleA || !scaleB) {
    throw new Error("Could not resolve reference scales for the palette.")
  }

  const scale = STEPS.map((index) => {
    return new Color(Color.mix(scaleA[index], scaleB[index], ratio)).to("oklch")
  }) as ColorScale
  const baseColor = scale.toSorted((first, second) => {
    return source.deltaEOK(first) - source.deltaEOK(second)
  })[0]
  const baseChroma = Math.max(baseColor.coords[1], 0.000_001)
  const chromaRatio = source.coords[1] / baseChroma

  for (const color of scale) {
    color.coords[1] = Math.min(
      source.coords[1] * 1.5,
      color.coords[1] * chromaRatio
    )
    color.coords[2] = source.coords[2]
  }

  if (scale[0].coords[0] > 0.5) {
    transposeLightScale(scale, background)
    return scale
  }

  transposeDarkScale(scale, background)
  return scale
}

function getMixRatio(a: number, b: number, c: number) {
  if (a === 0 || b === 0 || c === 0) {
    return 0
  }

  const cosA = clampUnit((b ** 2 + c ** 2 - a ** 2) / (2 * b * c))
  const cosB = clampUnit((a ** 2 + c ** 2 - b ** 2) / (2 * a * c))
  const sinA = Math.sin(Math.acos(cosA))
  const sinB = Math.sin(Math.acos(cosB))
  if (sinA === 0 || sinB === 0) {
    return 0
  }

  const tangentA = cosA / sinA
  const tangentB = cosB / sinB
  if (!Number.isFinite(tangentA) || !Number.isFinite(tangentB)) {
    return 0
  }

  return Math.min(1, Math.max(0, tangentA / tangentB) * 0.5)
}

function transposeLightScale(scale: ColorScale, background: Color) {
  const lightness = scale.map((color) => color.coords[0])
  const backgroundLightness = clampUnit(background.coords[0])
  const next = transposeProgressionStart(
    backgroundLightness,
    [1, ...lightness],
    [...LIGHT_MODE_EASING]
  )
  next.shift()
  next.forEach((value, index) => {
    scale[index].coords[0] = value
  })
}

function transposeDarkScale(scale: ColorScale, background: Color) {
  const easing: [number, number, number, number] = [...DARK_MODE_EASING]
  const referenceLightness = scale[0].coords[0]
  const backgroundLightness = clampUnit(background.coords[0])
  const ratio = backgroundLightness / referenceLightness

  if (ratio > 1) {
    const maximumRatio = 1.5
    for (let index = 0; index < easing.length; index += 1) {
      const metaRatio = (ratio - 1) * (maximumRatio / (maximumRatio - 1))
      easing[index] =
        ratio > maximumRatio ? 0 : Math.max(0, easing[index] * (1 - metaRatio))
    }
  }

  const lightness = scale.map((color) => color.coords[0])
  const next = transposeProgressionStart(
    background.coords[0],
    lightness,
    easing
  )
  next.forEach((value, index) => {
    scale[index].coords[0] = value
  })
}

function transposeProgressionStart(
  destination: number,
  values: number[],
  curve: [number, number, number, number]
) {
  const easing = BezierEasing(...curve)
  const difference = values[0] - destination
  const lastIndex = values.length - 1
  return values.map((value, index) => {
    return value - difference * easing(1 - index / lastIndex)
  })
}

function getAlphaColorSrgb(
  targetColor: string,
  backgroundColor: string,
  targetAlpha?: number
) {
  const values = getAlphaColor(
    new Color(targetColor).to("srgb").coords,
    new Color(backgroundColor).to("srgb").coords,
    255,
    255,
    targetAlpha
  )
  const coordinates: [number, number, number] = [
    values[0],
    values[1],
    values[2],
  ]
  return formatHex(
    new Color("srgb", coordinates, values[3]).toString({
      format: "hex",
    })
  )
}

function getAlphaColorP3(
  targetColor: string,
  backgroundColor: string,
  targetAlpha?: number
) {
  const values = getAlphaColor(
    new Color(targetColor).to("p3").coords,
    new Color(backgroundColor).to("p3").coords,
    255,
    1000,
    targetAlpha
  )
  const coordinates: [number, number, number] = [
    values[0],
    values[1],
    values[2],
  ]
  return new Color("p3", coordinates, values[3])
    .toString({ precision: 4 })
    .replace("color(p3 ", "color(display-p3 ")
}

function getAlphaColor(
  targetRgb: number[],
  backgroundRgb: number[],
  rgbPrecision: number,
  alphaPrecision: number,
  targetAlpha?: number
): [number, number, number, number] {
  const [targetRed, targetGreen, targetBlue] = targetRgb.map((channel) => {
    return Math.round(channel * rgbPrecision)
  })
  const [backgroundRed, backgroundGreen, backgroundBlue] = backgroundRgb.map(
    (channel) => Math.round(channel * rgbPrecision)
  )
  const channels = [
    targetRed,
    targetGreen,
    targetBlue,
    backgroundRed,
    backgroundGreen,
    backgroundBlue,
  ]
  if (channels.some((channel) => channel === undefined)) {
    throw new Error("Color channel is undefined.")
  }

  let desiredRgb = 0
  if (
    targetRed > backgroundRed ||
    targetGreen > backgroundGreen ||
    targetBlue > backgroundBlue
  ) {
    desiredRgb = rgbPrecision
  }

  const alphaRed = (targetRed - backgroundRed) / (desiredRgb - backgroundRed)
  const alphaGreen =
    (targetGreen - backgroundGreen) / (desiredRgb - backgroundGreen)
  const alphaBlue =
    (targetBlue - backgroundBlue) / (desiredRgb - backgroundBlue)
  const alphas = [alphaRed, alphaGreen, alphaBlue]
  const isPureGray = alphas.every((alpha) => alpha === alphaRed)

  if (targetAlpha === undefined && isPureGray) {
    const value = desiredRgb / rgbPrecision
    return [value, value, value, alphaRed]
  }

  const maximumAlpha = targetAlpha ?? Math.max(alphaRed, alphaGreen, alphaBlue)
  const alpha =
    clampPrecision(maximumAlpha * alphaPrecision, alphaPrecision, true) /
    alphaPrecision
  let red = calculateAlphaChannel(backgroundRed, targetRed, alpha, rgbPrecision)
  let green = calculateAlphaChannel(
    backgroundGreen,
    targetGreen,
    alpha,
    rgbPrecision
  )
  let blue = calculateAlphaChannel(
    backgroundBlue,
    targetBlue,
    alpha,
    rgbPrecision
  )

  const blendedRed = blendAlpha(red, alpha, backgroundRed)
  const blendedGreen = blendAlpha(green, alpha, backgroundGreen)
  const blendedBlue = blendAlpha(blue, alpha, backgroundBlue)

  if (desiredRgb === 0) {
    red = correctAlphaRounding(targetRed, backgroundRed, blendedRed, red, false)
    green = correctAlphaRounding(
      targetGreen,
      backgroundGreen,
      blendedGreen,
      green,
      false
    )
    blue = correctAlphaRounding(
      targetBlue,
      backgroundBlue,
      blendedBlue,
      blue,
      false
    )
  } else {
    red = correctAlphaRounding(targetRed, backgroundRed, blendedRed, red, true)
    green = correctAlphaRounding(
      targetGreen,
      backgroundGreen,
      blendedGreen,
      green,
      true
    )
    blue = correctAlphaRounding(
      targetBlue,
      backgroundBlue,
      blendedBlue,
      blue,
      true
    )
  }

  return [red / rgbPrecision, green / rgbPrecision, blue / rgbPrecision, alpha]
}

function calculateAlphaChannel(
  background: number,
  target: number,
  alpha: number,
  precision: number
) {
  if (alpha === 0) {
    return 0
  }

  return Math.ceil(
    clampPrecision(
      ((background * (1 - alpha) - target) / alpha) * -1,
      precision
    )
  )
}

function correctAlphaRounding(
  target: number,
  background: number,
  blended: number,
  channel: number,
  lighten: boolean
) {
  const isEligible = lighten ? target >= background : target <= background
  if (!isEligible || target === blended) {
    return channel
  }

  return target > blended ? channel + 1 : channel - 1
}

function clampPrecision(value: number, maximum: number, roundUp = false) {
  if (Number.isNaN(value)) {
    return 0
  }

  const clamped = Math.min(maximum, Math.max(0, value))
  return roundUp ? Math.ceil(clamped) : clamped
}

function blendAlpha(foreground: number, alpha: number, background: number) {
  return Math.round(background * (1 - alpha)) + Math.round(foreground * alpha)
}

function formatHex(value: string) {
  if (!value.startsWith("#")) {
    return value
  }

  if (value.length === 4 || value.length === 5) {
    const characters = [...value.slice(1)]
    return `#${characters.map((character) => character.repeat(2)).join("")}`
  }

  return value
}

function toHex(color: Color) {
  return formatHex(color.to("srgb").toString({ format: "hex" })).toLowerCase()
}

function toOklchString(color: Color) {
  const lightness = Number((color.coords[0] * 100).toFixed(1))
  return color
    .to("oklch")
    .toString({ precision: 4 })
    .replace(/(\S+)(.+)/, `oklch(${lightness}%$2`)
}

function clampUnit(value: number) {
  return Math.min(1, Math.max(-1, value))
}
