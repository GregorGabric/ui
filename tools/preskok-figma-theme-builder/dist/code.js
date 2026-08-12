(function() {
  "use strict";
  const COLLECTION_NAME = "Style";
  const MODE_COLLECTION_NAME = "Mode";
  const DEFAULT_MODE_NAME = "Default";
  const DEFAULT_STATE = {
    gray: "zinc",
    primary: "blue",
    accent: "zinc",
    radius: "0.5rem"
  };
  const NEUTRAL_COLORS = ["slate", "gray", "zinc", "neutral", "stone"];
  const ACCENT_COLORS_300 = ["yellow", "lime"];
  const ACCENT_COLORS_400 = ["amber", "yellow", "lime", "cyan"];
  const ACCENT_COLORS_500 = [
    "sky",
    "orange",
    "rose",
    "fuchsia",
    "purple",
    "violet",
    "indigo"
  ];
  const RADII = [
    "0rem",
    "0.125rem",
    "0.25rem",
    "0.375rem",
    "0.5rem",
    "0.6rem",
    "0.75rem",
    "1rem",
    "1.5rem"
  ];
  const COLORS = {
    slate: {
      50: "oklch(0.984 0.003 247.858)",
      100: "oklch(0.968 0.007 247.896)",
      200: "oklch(0.929 0.013 255.508)",
      300: "oklch(0.869 0.022 252.894)",
      400: "oklch(0.704 0.04 256.788)",
      500: "oklch(0.554 0.046 257.417)",
      600: "oklch(0.446 0.043 257.281)",
      700: "oklch(0.372 0.044 257.287)",
      800: "oklch(0.279 0.041 260.031)",
      900: "oklch(0.208 0.042 265.755)",
      950: "oklch(0.129 0.042 264.695)"
    },
    gray: {
      50: "oklch(0.985 0.002 247.839)",
      100: "oklch(0.967 0.003 264.542)",
      200: "oklch(0.928 0.006 264.531)",
      300: "oklch(0.872 0.01 258.338)",
      400: "oklch(0.707 0.022 261.325)",
      500: "oklch(0.551 0.027 264.364)",
      600: "oklch(0.446 0.03 256.802)",
      700: "oklch(0.373 0.034 259.733)",
      800: "oklch(0.278 0.033 256.848)",
      900: "oklch(0.21 0.034 264.665)",
      950: "oklch(0.13 0.028 261.692)"
    },
    zinc: {
      50: "oklch(0.985 0 0)",
      100: "oklch(0.967 0.001 286.375)",
      200: "oklch(0.92 0.004 286.32)",
      300: "oklch(0.871 0.006 286.286)",
      400: "oklch(0.705 0.015 286.067)",
      500: "oklch(0.552 0.016 285.938)",
      600: "oklch(0.442 0.017 285.786)",
      700: "oklch(0.37 0.013 285.805)",
      800: "oklch(0.274 0.006 286.033)",
      900: "oklch(0.21 0.006 285.885)",
      950: "oklch(0.141 0.005 285.823)"
    },
    neutral: {
      50: "oklch(0.985 0 0)",
      100: "oklch(0.97 0 0)",
      200: "oklch(0.922 0 0)",
      300: "oklch(0.87 0 0)",
      400: "oklch(0.708 0 0)",
      500: "oklch(0.556 0 0)",
      600: "oklch(0.439 0 0)",
      700: "oklch(0.371 0 0)",
      800: "oklch(0.269 0 0)",
      900: "oklch(0.205 0 0)",
      950: "oklch(0.145 0 0)"
    },
    stone: {
      50: "oklch(0.985 0.001 106.423)",
      100: "oklch(0.97 0.001 106.424)",
      200: "oklch(0.923 0.003 48.717)",
      300: "oklch(0.869 0.005 56.366)",
      400: "oklch(0.709 0.01 56.259)",
      500: "oklch(0.553 0.013 58.071)",
      600: "oklch(0.444 0.011 73.639)",
      700: "oklch(0.374 0.01 67.558)",
      800: "oklch(0.268 0.007 34.298)",
      900: "oklch(0.216 0.006 56.043)",
      950: "oklch(0.147 0.004 49.25)"
    },
    red: {
      50: "oklch(0.971 0.013 17.38)",
      100: "oklch(0.936 0.032 17.717)",
      200: "oklch(0.885 0.062 18.334)",
      300: "oklch(0.808 0.114 19.571)",
      400: "oklch(0.704 0.191 22.216)",
      500: "oklch(0.637 0.237 25.331)",
      600: "oklch(0.577 0.245 27.325)",
      700: "oklch(0.505 0.213 27.518)",
      800: "oklch(0.444 0.177 26.899)",
      900: "oklch(0.396 0.141 25.723)",
      950: "oklch(0.258 0.092 26.042)"
    },
    orange: {
      50: "oklch(0.98 0.016 73.684)",
      100: "oklch(0.954 0.038 75.164)",
      200: "oklch(0.901 0.076 70.697)",
      300: "oklch(0.837 0.128 66.29)",
      400: "oklch(0.75 0.183 55.934)",
      500: "oklch(0.705 0.213 47.604)",
      600: "oklch(0.646 0.222 41.116)",
      700: "oklch(0.553 0.195 38.402)",
      800: "oklch(0.47 0.157 37.304)",
      900: "oklch(0.408 0.123 38.172)",
      950: "oklch(0.266 0.079 36.259)"
    },
    amber: {
      50: "oklch(0.987 0.022 95.277)",
      100: "oklch(0.962 0.059 95.617)",
      200: "oklch(0.924 0.12 95.746)",
      300: "oklch(0.879 0.169 91.605)",
      400: "oklch(0.828 0.189 84.429)",
      500: "oklch(0.769 0.188 70.08)",
      600: "oklch(0.666 0.179 58.318)",
      700: "oklch(0.555 0.163 48.998)",
      800: "oklch(0.473 0.137 46.201)",
      900: "oklch(0.414 0.112 45.904)",
      950: "oklch(0.279 0.077 45.635)"
    },
    yellow: {
      50: "oklch(0.987 0.026 102.212)",
      100: "oklch(0.973 0.071 103.193)",
      200: "oklch(0.945 0.129 101.54)",
      300: "oklch(0.905 0.182 98.111)",
      400: "oklch(0.852 0.199 91.936)",
      500: "oklch(0.795 0.184 86.047)",
      600: "oklch(0.681 0.162 75.834)",
      700: "oklch(0.554 0.135 66.442)",
      800: "oklch(0.476 0.114 61.907)",
      900: "oklch(0.421 0.095 57.708)",
      950: "oklch(0.286 0.066 53.813)"
    },
    lime: {
      50: "oklch(0.986 0.031 120.757)",
      100: "oklch(0.967 0.067 122.328)",
      200: "oklch(0.938 0.127 124.321)",
      300: "oklch(0.897 0.196 126.665)",
      400: "oklch(0.841 0.238 128.85)",
      500: "oklch(0.768 0.233 130.85)",
      600: "oklch(0.648 0.2 131.684)",
      700: "oklch(0.532 0.157 131.589)",
      800: "oklch(0.453 0.124 130.933)",
      900: "oklch(0.405 0.101 131.063)",
      950: "oklch(0.274 0.072 132.109)"
    },
    green: {
      50: "oklch(0.982 0.018 155.826)",
      100: "oklch(0.962 0.044 156.743)",
      200: "oklch(0.925 0.084 155.995)",
      300: "oklch(0.871 0.15 154.449)",
      400: "oklch(0.792 0.209 151.711)",
      500: "oklch(0.723 0.219 149.579)",
      600: "oklch(0.627 0.194 149.214)",
      700: "oklch(0.527 0.154 150.069)",
      800: "oklch(0.448 0.119 151.328)",
      900: "oklch(0.393 0.095 152.535)",
      950: "oklch(0.266 0.065 152.934)"
    },
    emerald: {
      50: "oklch(0.979 0.021 166.113)",
      100: "oklch(0.95 0.052 163.051)",
      200: "oklch(0.905 0.093 164.15)",
      300: "oklch(0.845 0.143 164.978)",
      400: "oklch(0.765 0.177 163.223)",
      500: "oklch(0.696 0.17 162.48)",
      600: "oklch(0.596 0.145 163.225)",
      700: "oklch(0.508 0.118 165.612)",
      800: "oklch(0.432 0.095 166.913)",
      900: "oklch(0.378 0.077 168.94)",
      950: "oklch(0.262 0.051 172.552)"
    },
    teal: {
      50: "oklch(0.984 0.014 180.72)",
      100: "oklch(0.953 0.051 180.801)",
      200: "oklch(0.91 0.096 180.426)",
      300: "oklch(0.855 0.138 181.071)",
      400: "oklch(0.777 0.152 181.912)",
      500: "oklch(0.704 0.14 182.503)",
      600: "oklch(0.6 0.118 184.704)",
      700: "oklch(0.511 0.096 186.391)",
      800: "oklch(0.437 0.078 188.216)",
      900: "oklch(0.386 0.063 188.416)",
      950: "oklch(0.277 0.046 192.524)"
    },
    cyan: {
      50: "oklch(0.984 0.019 200.873)",
      100: "oklch(0.956 0.045 203.388)",
      200: "oklch(0.917 0.08 205.041)",
      300: "oklch(0.865 0.127 207.078)",
      400: "oklch(0.789 0.154 211.53)",
      500: "oklch(0.715 0.143 215.221)",
      600: "oklch(0.609 0.126 221.723)",
      700: "oklch(0.52 0.105 223.128)",
      800: "oklch(0.45 0.085 224.283)",
      900: "oklch(0.398 0.07 227.392)",
      950: "oklch(0.302 0.056 229.695)"
    },
    sky: {
      50: "oklch(0.977 0.013 236.62)",
      100: "oklch(0.951 0.026 236.824)",
      200: "oklch(0.901 0.058 230.902)",
      300: "oklch(0.828 0.111 230.318)",
      400: "oklch(0.746 0.16 232.661)",
      500: "oklch(0.685 0.169 237.323)",
      600: "oklch(0.588 0.158 241.966)",
      700: "oklch(0.5 0.134 242.749)",
      800: "oklch(0.443 0.11 240.79)",
      900: "oklch(0.391 0.09 240.876)",
      950: "oklch(0.293 0.066 243.157)"
    },
    blue: {
      50: "oklch(0.97 0.014 254.604)",
      100: "oklch(0.932 0.032 255.585)",
      200: "oklch(0.882 0.059 254.128)",
      300: "oklch(0.809 0.105 251.813)",
      400: "oklch(0.707 0.165 254.624)",
      500: "oklch(0.623 0.214 259.815)",
      600: "oklch(0.546 0.245 262.881)",
      700: "oklch(0.488 0.243 264.376)",
      800: "oklch(0.424 0.199 265.638)",
      900: "oklch(0.379 0.146 265.522)",
      950: "oklch(0.282 0.091 267.935)"
    },
    indigo: {
      50: "oklch(0.962 0.018 272.314)",
      100: "oklch(0.93 0.034 272.788)",
      200: "oklch(0.87 0.065 274.039)",
      300: "oklch(0.785 0.115 274.713)",
      400: "oklch(0.673 0.182 276.935)",
      500: "oklch(0.585 0.233 277.117)",
      600: "oklch(0.511 0.262 276.966)",
      700: "oklch(0.457 0.24 277.023)",
      800: "oklch(0.398 0.195 277.366)",
      900: "oklch(0.359 0.144 278.697)",
      950: "oklch(0.257 0.09 281.288)"
    },
    violet: {
      50: "oklch(0.969 0.016 293.756)",
      100: "oklch(0.943 0.029 294.588)",
      200: "oklch(0.894 0.057 293.283)",
      300: "oklch(0.811 0.111 293.571)",
      400: "oklch(0.702 0.183 293.541)",
      500: "oklch(0.606 0.25 292.717)",
      600: "oklch(0.541 0.281 293.009)",
      700: "oklch(0.491 0.27 292.581)",
      800: "oklch(0.432 0.232 292.759)",
      900: "oklch(0.38 0.189 293.745)",
      950: "oklch(0.283 0.141 291.089)"
    },
    purple: {
      50: "oklch(0.977 0.014 308.299)",
      100: "oklch(0.946 0.033 307.174)",
      200: "oklch(0.902 0.063 306.703)",
      300: "oklch(0.827 0.119 306.383)",
      400: "oklch(0.714 0.203 305.504)",
      500: "oklch(0.627 0.265 303.9)",
      600: "oklch(0.558 0.288 302.321)",
      700: "oklch(0.496 0.265 301.924)",
      800: "oklch(0.438 0.218 303.724)",
      900: "oklch(0.381 0.176 304.987)",
      950: "oklch(0.291 0.149 302.717)"
    },
    fuchsia: {
      50: "oklch(0.977 0.017 320.058)",
      100: "oklch(0.952 0.037 318.852)",
      200: "oklch(0.903 0.076 319.62)",
      300: "oklch(0.833 0.145 321.434)",
      400: "oklch(0.74 0.238 322.16)",
      500: "oklch(0.667 0.295 322.15)",
      600: "oklch(0.591 0.293 322.896)",
      700: "oklch(0.518 0.253 323.949)",
      800: "oklch(0.452 0.211 324.591)",
      900: "oklch(0.401 0.17 325.612)",
      950: "oklch(0.293 0.136 325.661)"
    },
    pink: {
      50: "oklch(0.971 0.014 343.198)",
      100: "oklch(0.948 0.028 342.258)",
      200: "oklch(0.899 0.061 343.231)",
      300: "oklch(0.823 0.12 346.018)",
      400: "oklch(0.718 0.202 349.761)",
      500: "oklch(0.656 0.241 354.308)",
      600: "oklch(0.592 0.249 0.584)",
      700: "oklch(0.525 0.223 3.958)",
      800: "oklch(0.459 0.187 3.815)",
      900: "oklch(0.408 0.153 2.432)",
      950: "oklch(0.284 0.109 3.907)"
    },
    rose: {
      50: "oklch(0.969 0.015 12.422)",
      100: "oklch(0.941 0.03 12.58)",
      200: "oklch(0.892 0.058 10.001)",
      300: "oklch(0.81 0.117 11.638)",
      400: "oklch(0.712 0.194 13.428)",
      500: "oklch(0.645 0.246 16.439)",
      600: "oklch(0.586 0.253 17.585)",
      700: "oklch(0.514 0.222 16.935)",
      800: "oklch(0.455 0.188 13.697)",
      900: "oklch(0.41 0.159 10.272)",
      950: "oklch(0.271 0.105 12.094)"
    }
  };
  const COLOR_TOKEN_NAMES = [
    "background",
    "foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "overlay",
    "overlay-foreground",
    "accent",
    "accent-foreground",
    "muted",
    "muted-foreground",
    "success",
    "success-foreground",
    "warning",
    "warning-foreground",
    "destructive",
    "destructive-foreground",
    "border",
    "input",
    "ring",
    "navbar",
    "navbar-foreground",
    "sidebar",
    "sidebar-foreground",
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5"
  ];
  const OPTIONAL_COLOR_TOKEN_NAMES = [
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
    "surface",
    "surface-foreground",
    "code",
    "code-foreground",
    "code-highlight",
    "code-number",
    "selection",
    "selection-foreground"
  ];
  const FLOAT_TOKEN_NAMES = [
    "radius-lg",
    "radius-xs",
    "radius-sm",
    "radius-md",
    "radius-xl",
    "radius-2xl",
    "radius-3xl",
    "radius-4xl"
  ];
  function getColorValue(colorKey, shade) {
    if (colorKey === "white") {
      return "oklch(1 0 0)";
    }
    if (colorKey === "black") {
      return "oklch(0 0 0)";
    }
    const color = COLORS[colorKey];
    if (!color || !shade || !color[shade]) {
      return COLORS.zinc[600];
    }
    return color[shade];
  }
  function getForegroundValue(colorKey, foreground) {
    if (foreground === "white" || foreground === "black") {
      return getColorValue(foreground);
    }
    return getColorValue(colorKey, foreground);
  }
  function adjustLightness(oklchColor, adjustBy) {
    const parsed = parseOklch(oklchColor);
    if (!parsed) {
      return oklchColor;
    }
    const lightness = Math.min(1, Math.max(0, parsed.l + adjustBy / 100));
    return `oklch(${lightness.toFixed(3)} ${parsed.c} ${parsed.h})`;
  }
  function parseOklch(value) {
    const match = /oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+([0-9.]+)\s*\)/i.exec(
      value
    );
    if (!match) {
      return null;
    }
    const rawLightness = match[1];
    const l = rawLightness.endsWith("%") ? Number.parseFloat(rawLightness) / 100 : Number.parseFloat(rawLightness);
    return {
      l,
      c: Number.parseFloat(match[2]),
      h: Number.parseFloat(match[3])
    };
  }
  function determineShade(isNeutral, is500, is300, is400, isDarkMode) {
    if (isNeutral) {
      return isDarkMode ? "50" : "950";
    }
    if (is500) {
      return "500";
    }
    if (is300) {
      return "300";
    }
    if (is400) {
      return "400";
    }
    return "600";
  }
  function determineForeground(isNeutral, is400, isDarkMode) {
    if (isNeutral) {
      return isDarkMode ? "950" : "50";
    }
    return is400 ? "950" : "white";
  }
  function normalizeState(input) {
    const next = { ...DEFAULT_STATE, ...input || {} };
    if (!NEUTRAL_COLORS.includes(next.gray)) {
      next.gray = DEFAULT_STATE.gray;
    }
    for (const key of ["primary", "accent"]) {
      if (!COLORS[next[key]]) {
        next[key] = DEFAULT_STATE[key];
      }
    }
    if (NEUTRAL_COLORS.includes(next.primary) && next.primary !== next.gray) {
      next.primary = next.gray;
    }
    if (NEUTRAL_COLORS.includes(next.accent) && next.accent !== next.gray) {
      next.accent = next.gray;
    }
    if (!RADII.includes(next.radius)) {
      const radiusNumber = Number.parseFloat(next.radius);
      next.radius = Number.isFinite(radiusNumber) ? `${radiusNumber}rem` : DEFAULT_STATE.radius;
    }
    return next;
  }
  function colorRgb(value) {
    const parsed = parseOklch(value);
    if (!parsed) {
      return { r: 0, g: 0, b: 0, a: 1 };
    }
    const hRadians = parsed.h * Math.PI / 180;
    const a = parsed.c * Math.cos(hRadians);
    const b = parsed.c * Math.sin(hRadians);
    const lPrime = parsed.l + 0.3963377774 * a + 0.2158037573 * b;
    const mPrime = parsed.l - 0.1055613458 * a - 0.0638541728 * b;
    const sPrime = parsed.l - 0.0894841775 * a - 1.291485548 * b;
    const l = lPrime * lPrime * lPrime;
    const m = mPrime * mPrime * mPrime;
    const s = sPrime * sPrime * sPrime;
    const linearR = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const linearG = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const linearB = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    return {
      r: clamp01(toSrgb(linearR)),
      g: clamp01(toSrgb(linearG)),
      b: clamp01(toSrgb(linearB)),
      a: 1
    };
  }
  function toSrgb(channel) {
    return channel <= 31308e-7 ? 12.92 * channel : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
  }
  function clamp01(value) {
    return Math.min(1, Math.max(0, value));
  }
  function radiusPx(radius) {
    return Number.parseFloat(radius) * 16;
  }
  function makeRadiusValues(radius) {
    const lg = radiusPx(radius);
    return {
      "radius-lg": lg,
      "radius-xs": lg * 0.5,
      "radius-sm": lg * 0.75,
      "radius-md": lg * 0.9,
      "radius-xl": lg * 1.25,
      "radius-2xl": lg * 1.5,
      "radius-3xl": lg * 2,
      "radius-4xl": lg * 3
    };
  }
  function makeTheme(input) {
    const state = normalizeState(input);
    const { primary, gray, accent, radius } = state;
    const isNeutralPrimary = NEUTRAL_COLORS.includes(primary);
    const isShade400Primary = ACCENT_COLORS_400.includes(primary);
    const isShade500Primary = ACCENT_COLORS_500.includes(primary);
    const isShade300Primary = ACCENT_COLORS_300.includes(primary);
    const isNeutralAccent = NEUTRAL_COLORS.includes(accent);
    const isShade400Accent = ACCENT_COLORS_400.includes(accent);
    const isShade500Accent = ACCENT_COLORS_500.includes(accent);
    const isShade300Accent = ACCENT_COLORS_300.includes(accent);
    const lightPrimary = determineShade(
      isNeutralPrimary,
      isShade500Primary,
      isShade300Primary,
      isShade400Primary,
      false
    );
    const darkPrimary = determineShade(
      isNeutralPrimary,
      isShade500Primary,
      isShade300Primary,
      isShade400Primary,
      true
    );
    const lightPrimaryFg = determineForeground(
      isNeutralPrimary,
      isShade400Primary,
      false
    );
    const darkPrimaryFg = determineForeground(
      isNeutralPrimary,
      isShade400Primary,
      true
    );
    const lightAccent = isNeutralAccent ? "200" : determineShade(
      isNeutralAccent,
      isShade500Accent,
      isShade300Accent,
      isShade400Accent,
      false
    );
    const darkAccent = isNeutralAccent ? "800" : determineShade(
      isNeutralAccent,
      isShade500Accent,
      isShade300Accent,
      isShade400Accent,
      true
    );
    const lightAccentFg = isNeutralAccent ? "950" : determineForeground(isNeutralAccent, isShade400Accent, false);
    const darkAccentFg = isNeutralAccent ? "50" : determineForeground(isNeutralAccent, isShade400Accent, true);
    const chartShadesLight = isNeutralPrimary ? ["900", "700", "600", "500", "400"] : ["600", "400", "300", "200", "100"];
    const chartShadesDark = isNeutralPrimary ? ["800", "700", "500", "400", "300"] : ["700", "500", "400", "300", "200"];
    const destructiveColor = primary === "red" ? adjustLightness(getColorValue("red", "600"), -4) : getColorValue("red", "600");
    const warningColor = primary === "amber" ? getColorValue("amber", "200") : getColorValue("amber", "400");
    const light = {
      background: getColorValue("white"),
      foreground: getColorValue(gray, "950"),
      primary: getColorValue(primary, lightPrimary),
      "primary-foreground": getForegroundValue(primary, lightPrimaryFg),
      secondary: getColorValue(gray, "200"),
      "secondary-foreground": getColorValue(gray, "950"),
      overlay: getColorValue("white"),
      "overlay-foreground": getColorValue(gray, "950"),
      accent: getColorValue(accent, lightAccent),
      "accent-foreground": getForegroundValue(accent, lightAccentFg),
      muted: getColorValue(gray, "100"),
      "muted-foreground": getColorValue(gray, "500"),
      success: getColorValue("emerald", "600"),
      "success-foreground": getColorValue("white"),
      warning: warningColor,
      "warning-foreground": getColorValue("amber", "950"),
      destructive: destructiveColor,
      "destructive-foreground": getColorValue("red", "50"),
      card: getColorValue("white"),
      "card-foreground": getColorValue(gray, "950"),
      popover: getColorValue("white"),
      "popover-foreground": getColorValue(gray, "950"),
      border: adjustLightness(getColorValue(gray, "300"), 4),
      input: getColorValue(gray, "300"),
      ring: getColorValue(primary, isNeutralPrimary ? "950" : "600"),
      navbar: adjustLightness(getColorValue(gray, "50"), 1),
      "navbar-foreground": getColorValue(gray, "950"),
      sidebar: getColorValue(gray, "100"),
      "sidebar-foreground": getColorValue(gray, "950"),
      "sidebar-primary": getColorValue(gray, "200"),
      "sidebar-primary-foreground": getColorValue(gray, "950"),
      "sidebar-accent": getColorValue(gray, "200"),
      "sidebar-accent-foreground": getColorValue(gray, "950"),
      "sidebar-border": adjustLightness(getColorValue(gray, "300"), 4),
      "sidebar-ring": getColorValue(primary, isNeutralPrimary ? "950" : "600"),
      "chart-1": getColorValue(primary, chartShadesLight[0]),
      "chart-2": getColorValue(primary, chartShadesLight[1]),
      "chart-3": getColorValue(primary, chartShadesLight[2]),
      "chart-4": getColorValue(primary, chartShadesLight[3]),
      "chart-5": getColorValue(primary, chartShadesLight[4]),
      surface: getColorValue(gray, "50"),
      "surface-foreground": getColorValue(gray, "950"),
      code: getColorValue(gray, "50"),
      "code-foreground": getColorValue(gray, "950"),
      "code-highlight": getColorValue(gray, "100"),
      "code-number": getColorValue(gray, "500"),
      selection: getColorValue(gray, "950"),
      "selection-foreground": getColorValue("white")
    };
    light.danger = light.destructive;
    light["danger-foreground"] = light["destructive-foreground"];
    const dark = {
      background: adjustLightness(getColorValue(gray, "950"), -5),
      foreground: getColorValue(gray, "50"),
      primary: getColorValue(primary, darkPrimary),
      "primary-foreground": getForegroundValue(primary, darkPrimaryFg),
      secondary: adjustLightness(getColorValue(gray, "800"), -3),
      "secondary-foreground": getColorValue(gray, "50"),
      overlay: adjustLightness(getColorValue(gray, "900"), -3),
      "overlay-foreground": getColorValue(gray, "50"),
      accent: getColorValue(accent, darkAccent),
      "accent-foreground": getForegroundValue(accent, darkAccentFg),
      muted: getColorValue(gray, "900"),
      "muted-foreground": getColorValue(gray, "400"),
      success: getColorValue("emerald", "600"),
      "success-foreground": getColorValue("white"),
      warning: warningColor,
      "warning-foreground": getColorValue("amber", "950"),
      destructive: destructiveColor,
      "destructive-foreground": getColorValue("red", "50"),
      card: adjustLightness(getColorValue(gray, "900"), -2),
      "card-foreground": getColorValue(gray, "50"),
      popover: getColorValue(gray, "900"),
      "popover-foreground": getColorValue(gray, "50"),
      border: adjustLightness(getColorValue(gray, "700"), -10),
      input: adjustLightness(getColorValue(gray, "700"), -5),
      ring: getColorValue(primary, isNeutralPrimary ? "50" : "600"),
      navbar: adjustLightness(getColorValue(gray, "900"), -2),
      "navbar-foreground": getColorValue(gray, "50"),
      sidebar: adjustLightness(getColorValue(gray, "900"), -5),
      "sidebar-foreground": getColorValue(gray, "50"),
      "sidebar-primary": adjustLightness(getColorValue(gray, "800"), -3),
      "sidebar-primary-foreground": getColorValue(gray, "50"),
      "sidebar-accent": adjustLightness(getColorValue(gray, "800"), -3),
      "sidebar-accent-foreground": getColorValue(gray, "50"),
      "sidebar-border": adjustLightness(getColorValue(gray, "700"), -10),
      "sidebar-ring": getColorValue(primary, isNeutralPrimary ? "50" : "600"),
      "chart-1": getColorValue(primary, chartShadesDark[0]),
      "chart-2": getColorValue(primary, chartShadesDark[1]),
      "chart-3": getColorValue(primary, chartShadesDark[2]),
      "chart-4": getColorValue(primary, chartShadesDark[3]),
      "chart-5": getColorValue(primary, chartShadesDark[4]),
      surface: getColorValue(gray, "900"),
      "surface-foreground": getColorValue(gray, "400"),
      code: getColorValue(gray, "900"),
      "code-foreground": getColorValue(gray, "400"),
      "code-highlight": getColorValue(gray, "800"),
      "code-number": getColorValue(gray, "400"),
      selection: getColorValue(gray, "200"),
      "selection-foreground": getColorValue(gray, "900")
    };
    dark.danger = dark.destructive;
    dark["danger-foreground"] = dark["destructive-foreground"];
    const radiusValues = makeRadiusValues(radius);
    return {
      state,
      light,
      dark,
      radius: radiusValues,
      css: formatCss(light, dark, radius)
    };
  }
  function formatCss(light, dark, radius) {
    const lightLines = COLOR_TOKEN_NAMES.map(
      (name) => `    --${name}: ${light[name]};`
    );
    const darkLines = COLOR_TOKEN_NAMES.map(
      (name) => `    --${name}: ${dark[name]};`
    );
    const radiusLines = [
      `    --radius-lg: ${radius};`,
      "    --radius-xs: calc(var(--radius-lg) * 0.5);",
      "    --radius-sm: calc(var(--radius-lg) * 0.75);",
      "    --radius-md: calc(var(--radius-lg) * 0.9);",
      "    --radius-xl: calc(var(--radius-lg) * 1.25);",
      "    --radius-2xl: calc(var(--radius-lg) * 1.5);",
      "    --radius-3xl: calc(var(--radius-lg) * 2);",
      "    --radius-4xl: calc(var(--radius-lg) * 3);"
    ];
    return `:root {
${lightLines.join(
      "\n"
    )}
${radiusLines.join("\n")}
}

.dark {
${darkLines.join("\n")}
}`;
  }
  async function getLocalData() {
    const [collections, variables] = await Promise.all([
      figma.variables.getLocalVariableCollectionsAsync(),
      figma.variables.getLocalVariablesAsync()
    ]);
    return {
      collections,
      variables
    };
  }
  function getRequiredThemeVariableNames() {
    return {
      colors: [...COLOR_TOKEN_NAMES, ...OPTIONAL_COLOR_TOKEN_NAMES].flatMap((name) => [
        `color/light/${name}`,
        `color/dark/${name}`
      ]),
      floats: FLOAT_TOKEN_NAMES.map((name) => `radius/${name.slice(7)}`)
    };
  }
  async function scanVariables() {
    const data = await getLocalData();
    const collection = data.collections.find((item) => item.name === COLLECTION_NAME);
    const required = getRequiredThemeVariableNames();
    const variables = collection ? data.variables.filter((variable) => variable.variableCollectionId === collection.id) : [];
    const variableByName = new Map(variables.map((variable) => [variable.name, variable]));
    const missingColors = required.colors.filter((name) => !variableByName.has(name));
    const missingFloats = required.floats.filter((name) => !variableByName.has(name));
    const defaultMode = collection?.modes.find((mode) => mode.name === DEFAULT_MODE_NAME);
    const issues = [];
    if (!collection) {
      issues.push(`Open the Preskok UI source library. The ${COLLECTION_NAME} collection is missing.`);
    } else if (!defaultMode) {
      issues.push(`The ${COLLECTION_NAME} collection needs a ${DEFAULT_MODE_NAME} mode.`);
    }
    if (missingColors.length > 0 || missingFloats.length > 0) {
      issues.push("The source library theme variable set is incomplete.");
    }
    return {
      collections: data.collections.map((collection2) => ({
        id: collection2.id,
        name: collection2.name,
        modes: collection2.modes.map((mode) => mode.name)
      })),
      sourceReady: issues.length === 0,
      issues,
      themeCollection: collection ? {
        id: collection.id,
        modes: collection.modes.map((mode) => mode.name),
        variableCount: variables.length
      } : null,
      found: {
        colors: required.colors.length - missingColors.length,
        floats: required.floats.length - missingFloats.length
      },
      missing: {
        colors: missingColors,
        floats: missingFloats
      }
    };
  }
  async function saveThemeMode(input, requestedModeName) {
    const theme = makeTheme(input);
    const data = await getLocalData();
    const collection = data.collections.find((item) => item.name === COLLECTION_NAME);
    if (!collection) {
      throw new Error(`Open the Preskok UI source library. The ${COLLECTION_NAME} collection is missing.`);
    }
    const defaultMode = collection.modes.find((mode2) => mode2.name === DEFAULT_MODE_NAME);
    if (!defaultMode) {
      throw new Error(`The ${COLLECTION_NAME} collection needs a ${DEFAULT_MODE_NAME} mode.`);
    }
    const modeName = requestedModeName.trim();
    if (!modeName) {
      throw new Error("Enter a theme mode name.");
    }
    const variables = data.variables.filter(
      (variable) => variable.variableCollectionId === collection.id
    );
    const variableByName = new Map(variables.map((variable) => [variable.name, variable]));
    const required = getRequiredThemeVariableNames();
    const missing = [...required.colors, ...required.floats].filter(
      (name) => !variableByName.has(name)
    );
    if (missing.length > 0) {
      throw new Error(`The source library is missing ${missing.length} required Style variables.`);
    }
    let mode = collection.modes.find(
      (item) => item.name.toLowerCase() === modeName.toLowerCase()
    );
    let created = false;
    if (!mode) {
      const modeId = collection.addMode(modeName);
      mode = { modeId, name: modeName };
      created = true;
    }
    for (const variable of variables) {
      const defaultValue = variable.valuesByMode[defaultMode.modeId];
      if (defaultValue === void 0) {
        throw new Error(`Style variable ${variable.name} has no ${DEFAULT_MODE_NAME} value.`);
      }
      variable.setValueForMode(mode.modeId, defaultValue);
    }
    let updated = 0;
    for (const tokenName of [...COLOR_TOKEN_NAMES, ...OPTIONAL_COLOR_TOKEN_NAMES]) {
      const lightVariable = variableByName.get(`color/light/${tokenName}`);
      const darkVariable = variableByName.get(`color/dark/${tokenName}`);
      lightVariable.setValueForMode(mode.modeId, colorRgb(theme.light[tokenName]));
      darkVariable.setValueForMode(mode.modeId, colorRgb(theme.dark[tokenName]));
      updated += 2;
    }
    for (const tokenName of FLOAT_TOKEN_NAMES) {
      const variable = variableByName.get(`radius/${tokenName.slice(7)}`);
      variable.setValueForMode(mode.modeId, theme.radius[tokenName]);
      updated += 1;
    }
    await setStoredState(theme.state);
    return {
      modeName: mode.name,
      updated,
      created,
      copied: variables.length,
      scan: await scanVariables()
    };
  }
  async function getStoredState() {
    try {
      return await figma.clientStorage.getAsync("state");
    } catch {
      return null;
    }
  }
  async function setStoredState(state) {
    try {
      await figma.clientStorage.setAsync("state", state);
    } catch {
    }
  }
  async function setSelectionMode({ themeModeName, colorModeName }) {
    const data = await getLocalData();
    const assignments = [];
    if (themeModeName) {
      const collection = data.collections.find((item) => item.name === COLLECTION_NAME);
      const mode = collection?.modes.find(
        (item) => item.name.toLowerCase() === themeModeName.toLowerCase()
      );
      if (!collection || !mode) {
        throw new Error(`Style mode ${themeModeName} was not found.`);
      }
      assignments.push({ collection, mode });
    }
    if (colorModeName) {
      const collection = data.collections.find((item) => item.name === MODE_COLLECTION_NAME);
      const mode = collection?.modes.find(
        (item) => item.name.toLowerCase() === colorModeName.toLowerCase()
      );
      if (collection && mode) {
        assignments.push({ collection, mode });
      }
    }
    let changed = 0;
    for (const node of figma.currentPage.selection) {
      if (typeof node.setExplicitVariableModeForCollection !== "function") {
        continue;
      }
      for (const assignment of assignments) {
        node.setExplicitVariableModeForCollection(
          assignment.collection,
          assignment.mode.modeId
        );
        changed += 1;
      }
    }
    return { changed, themeModeName, colorModeName };
  }
  async function postPreview(state) {
    const theme = makeTheme(state);
    figma.ui.postMessage({
      type: "preview",
      theme,
      swatches: {
        background: colorRgb(theme.light.background),
        foreground: colorRgb(theme.light.foreground),
        primary: colorRgb(theme.light.primary),
        accent: colorRgb(theme.light.accent),
        success: colorRgb(theme.light.success),
        warning: colorRgb(theme.light.warning),
        destructive: colorRgb(theme.light.destructive),
        border: colorRgb(theme.light.border)
      }
    });
  }
  figma.showUI(__html__, { width: 440, height: 760, themeColors: true });
  figma.ui.onmessage = async (message) => {
    try {
      if (message.type === "ready") {
        const storedState = await getStoredState();
        const state = normalizeState(storedState);
        figma.ui.postMessage({
          type: "init",
          state,
          colorKeys: Object.keys(COLORS),
          neutralKeys: NEUTRAL_COLORS,
          chromaticKeys: Object.keys(COLORS).filter(
            (colorKey) => !NEUTRAL_COLORS.includes(colorKey)
          ),
          radii: RADII,
          scan: await scanVariables()
        });
        await postPreview(state);
        return;
      }
      if (message.type === "preview") {
        await postPreview(message.state);
        return;
      }
      if (message.type === "scan") {
        figma.ui.postMessage({ type: "scan", scan: await scanVariables() });
        return;
      }
      if (message.type === "save-mode") {
        const result = await saveThemeMode(message.state, message.modeName);
        figma.notify(
          result.created ? `Created ${result.modeName} theme mode.` : `Updated ${result.modeName} theme mode.`
        );
        figma.ui.postMessage({ type: "saved", result });
        await postPreview(message.state);
        return;
      }
      if (message.type === "set-mode") {
        const result = await setSelectionMode({
          themeModeName: message.themeModeName,
          colorModeName: message.colorModeName
        });
        figma.notify(
          result.changed > 0 ? "Applied variable mode to selection." : "Select one or more frames/components first."
        );
        figma.ui.postMessage({ type: "mode-applied", result });
        return;
      }
      if (message.type === "close") {
        figma.closePlugin();
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : String(error);
      figma.notify(text, { error: true });
      figma.ui.postMessage({ type: "error", message: text });
    }
  };
})();
