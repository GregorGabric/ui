const fs = require("fs")
const path = require("path")

// Read registry.json
const registryPath = path.join(__dirname, "registry.json")
const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"))

// List of components that import from primitive (from grep results)
const componentsUsingPrimitive = [
  "sidebar",
  "chart",
  "checkbox",
  "radio",
  "switch",
  "input",
  "select",
  "search-field",
  "date-range-picker",
  "multiple-select",
  "date-field",
  "date-picker",
  "menu",
  "number-field",
  "combo-box",
  "multi-select",
  "popover",
  "modal",
  "text-field",
  "time-field",
  "toolbar",
  "color-field",
  "textarea",
  "field",
  "tree",
  "toggle-group",
  "tag-group",
  "table",
  "progress-bar",
  "pagination",
  "navbar",
  "meter",
  "list-box",
  "tabs",
  "link",
  "grid-list",
  "dialog",
  "command-menu",
  "color-swatch",
  "color-swatch-picker",
  "color-area",
  "carousel",
  "breadcrumbs",
  "disclosure",
  "slider",
]

let updatedCount = 0

// Update each component
for (const item of registry.items) {
  if (componentsUsingPrimitive.includes(item.name)) {
    // Initialize registryDependencies if it doesn't exist
    if (!item.registryDependencies) {
      item.registryDependencies = []
    }

    // Add primitive if not already present
    if (!item.registryDependencies.includes("primitive")) {
      item.registryDependencies.push("primitive")
      updatedCount++
      console.log(`✓ Added primitive to ${item.name}`)
    }

    // Remove tailwind-merge from dependencies if present
    // (since primitive already includes it)
    if (item.dependencies && item.dependencies.includes("tailwind-merge")) {
      item.dependencies = item.dependencies.filter(
        (dep) => dep !== "tailwind-merge"
      )
      console.log(`  Removed tailwind-merge from ${item.name} dependencies`)
    }
  }
}

// Write updated registry
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n")

console.log(`\nUpdated ${updatedCount} components`)

