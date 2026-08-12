import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import vm from "node:vm"

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
)
const source = await readFile(path.join(packageRoot, "code.js"), "utf8")
const ui = await readFile(path.join(packageRoot, "dist/ui.html"), "utf8")
const builtCode = await readFile(path.join(packageRoot, "dist/code.js"), "utf8")

const postedMessages = []
const notifications = []
const assignments = []
let storedState = null
let variables = []

const styleCollection = makeCollection("style", "Style", ["Default"])
const modeCollection = makeCollection("mode", "Mode", ["Light", "Dark"])
const collections = [styleCollection, modeCollection]
const selectedFrame = {
  setExplicitVariableModeForCollection(collection, modeId) {
    assignments.push({ collection: collection.name, modeId })
  },
}
const figma = {
  clientStorage: {
    async getAsync() {
      return storedState
    },
    async setAsync(_key, value) {
      storedState = value
    },
  },
  closePlugin() {},
  currentPage: { selection: [selectedFrame] },
  notify(message) {
    notifications.push(message)
  },
  showUI() {},
  ui: {
    onmessage: null,
    postMessage(message) {
      postedMessages.push(message)
    },
  },
  variables: {
    async getLocalVariableCollectionsAsync() {
      return collections
    },
    async getLocalVariablesAsync() {
      return variables
    },
  },
}

const context = vm.createContext({
  URL,
  URLSearchParams,
  __html__: "<main>Preskok Theme Builder</main>",
  console,
  figma,
})
new vm.Script(source, { filename: "code.js" }).runInContext(context)

const required = JSON.parse(
  new vm.Script("JSON.stringify(getRequiredThemeVariableNames())").runInContext(
    context
  )
)
variables = [
  ...required.colors.map((name) => makeVariable(name, "COLOR")),
  ...required.floats.map((name) => makeVariable(name, "FLOAT")),
  makeVariable("metadata/passthrough", "STRING"),
]

assert.equal(typeof figma.ui.onmessage, "function")
await figma.ui.onmessage({ type: "ready" })
const init = postedMessages.find(({ type }) => type === "init")
const initialPreview = postedMessages.find(({ type }) => type === "preview")
assert.equal(init.scan.sourceReady, true)
assert.equal(init.scan.found.colors, required.colors.length)
assert.equal(init.scan.found.floats, required.floats.length)
assert.match(initialPreview.theme.css, /--primary:/)
assert.deepEqual(normalize(initialPreview.theme.state), {
  gray: "zinc",
  primary: "blue",
  accent: "zinc",
  radius: "0.5rem",
})

await figma.ui.onmessage({
  type: "save-mode",
  modeName: "Verified",
  state: {
    gray: "slate",
    primary: "violet",
    accent: "amber",
    radius: "0.75rem",
  },
})
const saved = postedMessages.find(({ type }) => type === "saved")
const verifiedMode = styleCollection.modes.find(
  ({ name }) => name === "Verified"
)
assert.ok(verifiedMode)
assert.equal(saved.result.created, true)
assert.equal(
  saved.result.updated,
  required.colors.length + required.floats.length
)
assert.equal(saved.result.copied, variables.length)
assert.deepEqual(normalize(storedState), {
  gray: "slate",
  primary: "violet",
  accent: "amber",
  radius: "0.75rem",
})
for (const variable of variables) {
  assert.notEqual(variable.valuesByMode[verifiedMode.modeId], undefined)
}

await figma.ui.onmessage({
  type: "set-mode",
  themeModeName: "Verified",
  colorModeName: "Dark",
})
assert.deepEqual(assignments, [
  { collection: "Style", modeId: verifiedMode.modeId },
  { collection: "Mode", modeId: "mode:Dark" },
])
assert.ok(notifications.includes("Applied variable mode to selection."))

assert.doesNotMatch(ui, /<script[^>]+src=/)
assert.doesNotMatch(ui, /<link[^>]+stylesheet/)
assert.match(ui, /Preskok Theme Builder/)
new vm.Script(builtCode, { filename: "dist/code.js" })

console.log(
  JSON.stringify({
    status: "passed",
    requiredColors: required.colors.length,
    requiredFloats: required.floats.length,
    copiedVariables: variables.length,
    explicitModeAssignments: assignments.length,
    uiSelfContained: true,
  })
)

function makeCollection(id, name, modeNames) {
  return {
    id,
    name,
    modes: modeNames.map((modeName) => ({
      modeId: `${id}:${modeName}`,
      name: modeName,
    })),
    addMode(modeName) {
      const modeId = `${id}:${modeName}`
      this.modes.push({ modeId, name: modeName })
      return modeId
    },
  }
}

function normalize(value) {
  return JSON.parse(JSON.stringify(value))
}

function makeVariable(name, resolvedType) {
  const defaultValue = resolvedType === "FLOAT" ? 8 : { r: 0, g: 0, b: 0 }
  if (resolvedType === "STRING") {
    return {
      name,
      resolvedType,
      variableCollectionId: styleCollection.id,
      valuesByMode: { "style:Default": "Preskok" },
      setValueForMode(modeId, value) {
        this.valuesByMode[modeId] = value
      },
    }
  }
  return {
    name,
    resolvedType,
    variableCollectionId: styleCollection.id,
    valuesByMode: { "style:Default": defaultValue },
    setValueForMode(modeId, value) {
      this.valuesByMode[modeId] = value
    },
  }
}
