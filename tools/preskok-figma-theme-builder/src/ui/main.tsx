import { render, type ComponentChildren } from "preact"
import { useEffect, useState } from "preact/hooks"

import "./styles.css"

type ThemeState = {
  gray: string
  primary: string
  accent: string
  radius: string
}

type Rgb = {
  r: number
  g: number
  b: number
  a?: number
}

type Theme = {
  state: ThemeState
  light: Record<string, string>
  dark: Record<string, string>
  css: string
}

type Scan = {
  collections: Array<{
    id: string
    name: string
    modes: Array<string>
  }>
  sourceReady: boolean
  issues: Array<string>
  themeCollection: {
    id: string
    modes: Array<string>
    variableCount: number
  } | null
  found: {
    colors: number
    floats: number
  }
  missing: {
    colors: Array<string>
    floats: Array<string>
  }
}

type PluginMessage =
  | {
      type: "init"
      state: ThemeState
      colorKeys: Array<string>
      neutralKeys: Array<string>
      chromaticKeys: Array<string>
      radii: Array<string>
      scan: Scan
    }
  | {
      type: "preview"
      theme: Theme
    }
  | {
      type: "scan"
      scan: Scan
    }
  | {
      type: "saved"
      result: {
        modeName: string
        updated: number
        created: boolean
        copied: number
        scan: Scan
      }
    }
  | {
      type: "mode-applied"
      result: {
        changed: number
      }
    }
  | {
      type: "error"
      message: string
    }

const defaultState: ThemeState = {
  gray: "zinc",
  primary: "blue",
  accent: "zinc",
  radius: "0.5rem",
}

function App() {
  const [themeState, setThemeState] = useState<ThemeState>(defaultState)
  const [colorKeys, setColorKeys] = useState<Array<string>>([])
  const [neutralKeys, setNeutralKeys] = useState<Array<string>>([])
  const [radii, setRadii] = useState<Array<string>>([])
  const [theme, setTheme] = useState<Theme | null>(null)
  const [scan, setScan] = useState<Scan | null>(null)
  const [status, setStatus] = useState({ text: "Loading…", isError: false })
  const [themeUrl, setThemeUrl] = useState("")
  const [themeModeName, setThemeModeName] = useState("Custom")

  useEffect(() => {
    window.onmessage = (event: MessageEvent<{ pluginMessage?: PluginMessage }>) => {
      const message = event.data.pluginMessage
      if (!message) {
        return
      }

      if (message.type === "init") {
        setColorKeys(message.colorKeys)
        setNeutralKeys(message.neutralKeys)
        setRadii(message.radii)
        setThemeState(message.state)
        setScan(message.scan)
        setStatus({ text: "Ready.", isError: false })
      }

      if (message.type === "preview") {
        setTheme(message.theme)
      }

      if (message.type === "scan") {
        setScan(message.scan)
        setStatus({ text: "Scan complete.", isError: false })
      }

      if (message.type === "saved") {
        setScan(message.result.scan)
        setStatus({
          text: message.result.created
            ? `Created ${message.result.modeName} with ${message.result.updated} generated values.`
            : `Updated ${message.result.modeName} with ${message.result.updated} generated values.`,
          isError: false,
        })
      }

      if (message.type === "mode-applied") {
        setStatus({
          text: `Mode update touched ${message.result.changed} selected targets.`,
          isError: false,
        })
      }

      if (message.type === "error") {
        setStatus({ text: message.message, isError: true })
      }
    }

    post("ready")

    return () => {
      window.onmessage = null
    }
  }, [])

  const palette = getPalette(colorKeys, neutralKeys, themeState.gray)
  const normalizedState = normalizeState(themeState, {
    neutralKeys,
    palette,
    radii,
  })
  const hasThemeMode =
    scan?.themeCollection?.modes.some(
      (mode) => mode.toLowerCase() === themeModeName.trim().toLowerCase()
    ) ?? false

  function updateState(nextState: ThemeState) {
    const next = normalizeState(nextState, {
      neutralKeys,
      palette: getPalette(colorKeys, neutralKeys, nextState.gray),
      radii,
    })
    setThemeState(next)
    post("preview", { state: next })
  }

  function handleGrayChange(gray: string) {
    const next = { ...themeState, gray }

    if (neutralKeys.includes(next.primary)) {
      next.primary = gray
    }

    if (neutralKeys.includes(next.accent)) {
      next.accent = gray
    }

    updateState(next)
  }

  function handlePrimaryChange(primary: string) {
    updateState({ ...themeState, primary, accent: primary })
  }

  function handleAccentChange(accent: string) {
    updateState({ ...themeState, accent })
  }

  function handleRadiusChange(radius: string) {
    updateState({ ...themeState, radius })
  }

  function loadThemeUrl() {
    try {
      const parsed = parseThemeUrl(themeUrl, normalizedState)
      if (!parsed) {
        return
      }

      updateState(parsed)
      setStatus({ text: "Theme values loaded.", isError: false })
    } catch (error) {
      setStatus({
        text: error instanceof Error ? error.message : String(error),
        isError: true,
      })
    }
  }

  async function copyCss() {
    if (!theme) {
      return
    }

    await navigator.clipboard.writeText(theme.css)
    setStatus({ text: "CSS copied.", isError: false })
  }

  return (
    <main className="shell">
      <div
        className={status.isError ? "status error" : "status"}
        role={status.isError ? "alert" : "status"}
      >
        {status.text === "Ready." ? "" : status.text}
      </div>

      <section className="section">
        <h1>Theme</h1>
        <div className="grid">
          <SelectControl
            label="Gray"
            value={normalizedState.gray}
            values={neutralKeys}
            onChange={handleGrayChange}
          />
          <SelectControl
            label="Primary"
            value={normalizedState.primary}
            values={palette}
            onChange={handlePrimaryChange}
          />
          <SelectControl
            label="Accent"
            value={normalizedState.accent}
            values={palette}
            onChange={handleAccentChange}
          />
          <SelectControl
            label="Radius"
            value={normalizedState.radius}
            values={radii}
            onChange={handleRadiusChange}
          />
        </div>
        <Disclosure label="Import theme">
          <div className="details-body">
            <input
              aria-label="Theme URL or query"
              value={themeUrl}
              onInput={(event) => {
                setThemeUrl(event.currentTarget.value)
              }}
              placeholder="gray=zinc&primary=blue&accent=zinc&radius=0.5"
            />
            <div className="buttons">
              <button type="button" onClick={loadThemeUrl}>
                Import
              </button>
            </div>
          </div>
        </Disclosure>
      </section>

      <section className="section">
        <SectionHeader title="Preview" />
        <div className="preview-grid">
          {theme ? (
            <>
              <ThemePreviewCard
                label="Light"
                mode="light"
                radius={theme.state.radius}
                tokens={theme.light}
              />
              <ThemePreviewCard
                label="Dark"
                mode="dark"
                radius={theme.state.radius}
                tokens={theme.dark}
              />
            </>
          ) : (
            <div className="empty-preview">Waiting for preview…</div>
          )}
        </div>
      </section>

      <section className="section">
        <SectionHeader title="Library mode" />
        {scan ? <ScanSummary scan={scan} /> : null}
        <label>
          Theme mode name
          <input
            value={themeModeName}
            onInput={(event) => setThemeModeName(event.currentTarget.value)}
            placeholder="Brand name"
          />
        </label>
        <div className="buttons">
          <button type="button" onClick={() => post("scan")}>
            Scan
          </button>
          <button
            type="button"
            className="primary"
            disabled={!scan?.sourceReady || !themeModeName.trim()}
            onClick={() => {
              setStatus({ text: "Saving theme mode…", isError: false })
              post("save-mode", {
                state: normalizedState,
                modeName: themeModeName,
              })
            }}
          >
            Save mode
          </button>
          <button
            aria-label="Apply theme mode to selection"
            type="button"
            disabled={!hasThemeMode}
            onClick={() => post("set-mode", { themeModeName })}
          >
            Apply theme
          </button>
          <button
            aria-label="Set selection to light mode"
            type="button"
            onClick={() => post("set-mode", { colorModeName: "Light" })}
          >
            Light
          </button>
          <button
            aria-label="Set selection to dark mode"
            type="button"
            onClick={() => post("set-mode", { colorModeName: "Dark" })}
          >
            Dark
          </button>
        </div>
      </section>

      <section className="section">
        <Disclosure label="CSS">
          <div className="details-body">
            <textarea
              readOnly
              aria-label="Generated CSS"
              spellcheck={false}
              value={theme?.css ?? ""}
            />
            <div className="buttons">
              <button type="button" onClick={copyCss}>
                Copy CSS
              </button>
            </div>
          </div>
        </Disclosure>
      </section>
    </main>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <h2>{title}</h2>
}

function Disclosure({
  label,
  children,
}: {
  label: string
  children: ComponentChildren
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="disclosure" data-open={isOpen}>
      <button
        aria-expanded={isOpen}
        className="disclosure-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        <span className="disclosure-icon">
          <svg aria-hidden="true" viewBox="0 0 16 16">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </span>
      </button>
      {isOpen ? children : null}
    </div>
  )
}

function SelectControl({
  label,
  value,
  values,
  onChange,
}: {
  label: string
  value: string
  values: Array<string>
  onChange: (value: string) => void
}) {
  return (
    <label>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}

function ThemePreviewCard({
  label,
  mode,
  radius,
  tokens,
}: {
  label: string
  mode: "light" | "dark"
  radius: string
  tokens: Record<string, string>
}) {
  return (
    <div className="theme-card" data-mode={mode} style={getTokenStyle(tokens, radius)}>
      <div className="theme-card-top">
        <div className="theme-card-title">{label}</div>
        <div className="theme-button">Button</div>
      </div>
      <div className="theme-field">Muted text</div>
      <div className="bars">
        {["chart-1", "chart-2", "chart-3"].map((token) => (
          <div
            key={token}
            className="bar"
            style={{ background: tokens[token] }}
          />
        ))}
      </div>
    </div>
  )
}

function ScanSummary({ scan }: { scan: Scan }) {
  const coreFound = scan.found.colors + scan.found.floats
  const missingCore = [...scan.missing.colors, ...scan.missing.floats]
  const coreTotal = coreFound + missingCore.length

  return (
    <div className="scan">
      <div className="stats">
        <span>
          <strong>
            {coreFound}/{coreTotal}
          </strong>{" "}
          tokens
        </span>
        <span>
          <strong>{scan.themeCollection?.modes.length ?? 0}</strong> modes
        </span>
      </div>
      <p className="missing">
        {scan.sourceReady
          ? `${scan.themeCollection?.variableCount ?? 0} source variables ready.`
          : scan.issues.join(" ")}
      </p>
    </div>
  )
}

function getPalette(
  colorKeys: Array<string>,
  neutralKeys: Array<string>,
  gray: string
) {
  return colorKeys.filter(
    (color) => !neutralKeys.includes(color) || color === gray
  )
}

function normalizeState(
  rawState: ThemeState,
  options: {
    neutralKeys: Array<string>
    palette: Array<string>
    radii: Array<string>
  }
) {
  const state = { ...defaultState, ...rawState }

  if (
    options.neutralKeys.length > 0 &&
    !options.neutralKeys.includes(state.gray)
  ) {
    state.gray = defaultState.gray
  }

  if (options.palette.length > 0 && !options.palette.includes(state.primary)) {
    state.primary = defaultState.primary
  }

  if (options.palette.length > 0 && !options.palette.includes(state.accent)) {
    state.accent = state.primary
  }

  if (options.radii.length > 0 && !options.radii.includes(state.radius)) {
    state.radius = defaultState.radius
  }

  return state
}

function parseThemeUrl(value: string, currentState: ThemeState) {
  const text = value.trim()
  if (!text) {
    return null
  }

  let query = text
  if (!text.startsWith("?")) {
    query = text.includes("=") && !text.includes("://")
      ? `?${text}`
      : new URL(text, "https://preskok-ui.vercel.app").search
  }
  const params = new URLSearchParams(query)
  const next = { ...currentState }

  const gray = firstParam(params, ["g", "gray"])
  const primary = firstParam(params, ["p", "primary"])
  const accent = firstParam(params, ["a", "accent"])
  const radius = firstParam(params, ["r", "radius"])

  if (gray) {
    next.gray = gray
  }

  if (primary) {
    next.primary = primary
    next.accent = primary
  }

  if (accent) {
    next.accent = accent
  }

  if (radius) {
    next.radius = radius.endsWith("rem") ? radius : `${radius}rem`
  }

  return next
}

function firstParam(params: URLSearchParams, names: Array<string>) {
  for (const name of names) {
    const value = params.get(name)
    if (value) {
      return value
    }
  }

  return null
}

function getTokenStyle(tokens: Record<string, string>, radius: string) {
  const radiusPx = Number.parseFloat(radius) * 16
  const style: Record<string, string> = {
    "--radius-lg-px": `${radiusPx}px`,
    "--radius-md-px": `${radiusPx * 0.9}px`,
    "--radius-sm-px": `${radiusPx * 0.75}px`,
  }

  for (const [name, value] of Object.entries(tokens)) {
    style[`--${name}`] = value
  }

  return style
}

function post(type: string, payload: Record<string, unknown> = {}) {
  parent.postMessage({ pluginMessage: { type, ...payload } }, "*")
}

render(<App />, document.getElementById("root")!)
