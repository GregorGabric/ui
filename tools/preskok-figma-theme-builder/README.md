# Preskok Theme Builder

Development Figma plugin for creating named modes in the published Preskok `Style` variable collection from the same four-control model used by the website theme customizer at `https://preskok-ui.vercel.app/theme`.

## Load in Figma

Build the plugin first:

```bash
pnpm --filter @preskok/figma-theme-builder build
```

1. Open Figma desktop.
2. Go to `Plugins` → `Development` → `Import plugin from manifest...`.
3. Select `tools/preskok-figma-theme-builder/manifest.json`.
4. Run `Preskok Theme Builder` from `Plugins` → `Development`.

Figma reads `dist/code.js` and `dist/ui.html`, so rerun the build after UI or plugin changes.

Verify the self-contained bundle and a mocked full save/apply workflow:

```bash
pnpm --filter @preskok/figma-theme-builder verify
```

## How it works

- Runs in the Preskok UI source library and requires its local `Style` collection.
- Creates or updates a named mode in that collection. It never creates consumer-local fallback variables.
- Copies every value from `Default` into a new mode before applying generated color and radius values, so non-generated tokens stay complete.
- Keeps components bound to `Mode`, `Style`, and the internal compatibility aliases. Switching a `Style` mode updates themed color and radius values without rebinding component instances.
- Parses Preskok theme URLs or query strings such as `https://preskok-ui.vercel.app/theme?g=zinc&p=blue&a=zinc&r=0.5`.
- Also accepts explicit parameter names such as `gray=zinc&primary=blue&accent=zinc&radius=0.5`.
- Exports generated CSS variables using the same token set as the website theme page.

## Use in another Figma file

1. Publish the Preskok UI library after creating or updating Style modes.
2. Enable the Preskok UI library in the consumer file.
3. Insert a published component instance.
4. Select the containing frame and choose the desired `Style` mode in the Variables section.
5. Choose `Light` or `Dark` from `Mode` separately.

Do not copy variables into the consumer file. Keeping the variables remote is what lets published component instances follow the selected library mode.

## Limits

- Figma plan limits determine how many modes the `Style` collection can contain. The plugin reports Figma's error if the limit is reached.
- The source library must be published before consumer files can see a new or updated mode.
- Local development plugins without a plugin ID cannot use Figma `clientStorage`. The plugin still works but does not remember the previous controls between runs.

## Source layout

- `code.js`: Figma main-thread source.
- `src/ui/`: Preact UI source.
- `scripts/build.mjs`: builds and inlines UI assets into `dist/ui.html`.
- `dist/`: generated files loaded by Figma.
