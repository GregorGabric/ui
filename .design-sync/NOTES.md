# Design-sync notes — preskok/ui

## Setup summary

- No published npm package for the design system — components live as source-only files under `apps/preskok/registry/preskok/ui/preskok-ui/`, consumed via a copy-paste CLI (`packages/cli`). The converter runs in **synth-entry mode**: `cfg.pkg: "preskok"`, `cfg.srcDir` points into the registry, and `--node-modules apps/preskok/node_modules` resolves `PKG_DIR` via a symlink `apps/preskok/node_modules/preskok -> ..` (recreate this symlink on a fresh clone — it's gitignored under the `node_modules` rule).
- `cfg.cssEntry` points at a **compiled** Tailwind chunk from a real `pnpm build` of `apps/preskok` (`.next/static/chunks/<hash>.css`), not the raw `styles/globals.css` source — the raw file only has `@theme`/`@import` directives, not the generated utility classes. **This filename is content-hashed and will change on every rebuild** — re-run `pnpm build` in `apps/preskok` and update `cssEntry` to the new hash before re-syncing.
- `cfg.extraFonts` points at a second, smaller compiled chunk that carries the `@font-face` rules (Geist/Geist Mono, self-hosted via `next/font/google`) — also content-hashed, also needs updating on rebuild.
- The exported surface is 339 components (every composable sub-part is its own export — e.g. `Dialog`, `DialogBody`, `DialogClose`, `DialogTrigger` are 4 separate exports). Authoring was scoped to **91 real top-level components** (`.design-sync/scoped-components.txt`); the other 248 are compound sub-parts that ship as fully-functional floor cards (composed inside their parent's authored preview, never demoed standalone).

## REQUIRED pre-sync step: regenerate TypeScript declarations

`apps/preskok/types/` is **gitignored and generated** — a fresh clone has none. Regenerate it before every sync:

```bash
cd apps/preskok
./node_modules/.bin/tsc -p tsconfig.dts.json      # emits 128 .d.ts into types/
# then regenerate the barrel (types/index.d.ts): one `export * from './<rel-path>'` per emitted .d.ts
```

**Why this matters far more than it looks.** Without it the sync silently degrades in two ways at once:

1. **All prop contracts vanish.** Every emitted `<Name>.d.ts` falls back to `{ [key: string]: unknown }`, so the design agent gets zero prop information — it can't know `Button` has `intent`/`size`/`isCircle`. (Measured: 0/339 components had real props before this was wired up; 90/91 scoped components have them now.)
2. **Component discovery changes source.** With a `.d.ts` tree present, discovery reads it; without one it falls back to scanning `src/`. The two produce different component sets.

Supporting pieces, all committed:
- `apps/preskok/tsconfig.dts.json` — declaration-emit config (extends the app tsconfig, overrides `noEmit`).
- `apps/preskok/package.json` `"types": "./types/index.d.ts"` — **load-bearing**. `lib/dts.mjs` has a fallback that derives props from a component's call signature when it has no named `<Name>Props` interface, but that fallback needs `project.getSourceFile(entry)` to resolve. Without this field `entry` points at a non-existent `index.d.ts` and the fallback silently no-ops — which is exactly why `Card`, `Switch`, `Dialog`, `TextField` etc. had empty props even after declarations existed.
- `apps/preskok/types/` is in `.gitignore` and in the app tsconfig's `exclude` (otherwise `**/*.ts` pulls generated declarations into the app's typecheck).

The `tsc -p tsconfig.dts.json` run prints ~5 non-fatal errors (missing `@types/node`, a CSS side-effect import, a `NumberFormatContextProviderProps` portability warning). These do **not** block emit — but any error of the `TS2883 "cannot be named"` family **does** silently skip that file's declaration, which drops its components from the sync entirely. Two such errors were fixed at source (see below); if a new one appears, fix it rather than ignoring it.

## Source fixes made for declaration emit

Two shipped source files carried `TS2883` errors that prevented their declarations from being emitted, which silently dropped `Menu` and `ContextMenu` (and 12 sub-parts) from the sync:

- `registry/preskok/ui/preskok-ui/menu.tsx`: `const MenuShortcut: typeof DropdownKeyboard = DropdownKeyboard`
- `registry/preskok/ui/preskok-ui/context-menu.tsx`: `const ContextMenuShortcut: typeof MenuShortcut = MenuShortcut`

Both are **pure type annotations, no behavior change**. The bare aliased re-exports forced TS to inline a type reaching through the `@/*` alias into `node_modules` (`react-aria-components/dist/types/src/Keyboard`), which isn't portably nameable. This is a genuine latent bug, not just a sync artifact — anyone running `tsc --declaration` on the library hits it.

## Re-sync risks

- **`cssEntry`/`extraFonts` paths will go stale.** They're content-hashed `.next/static/chunks/*.css` filenames from one specific production build. Any re-sync must re-run `pnpm build` in `apps/preskok` first and re-resolve which chunk carries the compiled utilities vs. the `@font-face` rules (grep for `@font-face` to tell them apart — see below).
- **`bg-danger` utility doesn't exist** in the compiled CSS even though `--color-danger` is defined as a token — Tailwind v4's JIT only emits utilities it sees referenced in the scanned app source, and no page uses `className="bg-danger"` literally (the real `Button`/`Badge` danger intent uses bracket-notation arbitrary values, not the plain utility). Verified while writing `conventions.md`. If a future re-sync needs this class, either use it somewhere in the app source first or reach the color via `var(--color-danger)` directly.
- **The `node_modules/preskok` symlink is not committed** (gitignored) — recreate it on every fresh clone: `ln -sfn .. apps/preskok/node_modules/preskok` (run from inside `apps/preskok/node_modules/`).
- Grades/carried-forward state lives in `.design-sync/.cache/review/*.grade.json` (gitignored) — a fresh clone re-verifies everything from scratch unless the uploaded project's `_ds_sync.json` anchor is fetched first for a real re-sync.

## Sub-part exclusion: importable but not carded

`componentSrcMap` sets **251 compound sub-parts to `null`** (`CarouselItem`, `DialogBody`, `CardHeader`, `MenuItem`, `TableRow`, …), leaving 91 carded components.

The key distinction: **excluding a component from `componentSrcMap` removes its card, `.d.ts` and `.prompt.md` — but NOT its runtime export.** The bundle is built by esbuild from the entry and assigns every export to the global independently of component discovery. Verified empirically in headless chromium after the change: `Object.keys(window.PreskokUI).length === 364` (unchanged), with `CarouselItem`, `DialogBody`, `CardHeader`, `MenuItem`, `SelectItem`, `PopoverContent`, `DialogTrigger`, `TableRow` all present. **Re-verify this after any change to the exclusion list** — if sub-parts ever drop off the global, composition breaks (you cannot build a Carousel without `CarouselItem`).

Rationale: nobody browses a component picker for "CarouselItem", and ~250 cards reading *"preview not yet authored"* (36 of which rendered visually blank, being layout wrappers with no default children) was noise. Their real usage is demonstrated inside the parent's authored preview instead. Side benefit: the render check went from 36 flagged to **91/91 clean**, because every previously-flagged blank was one of these sub-parts.

## Known render warns (accepted, not chased)

**None.** The render check is currently **91/91 clean**. The 36 previously-flagged blank/thin cards were all compound sub-parts (`DialogBody`, `CardHeader`, `MenuTrigger`, `Logo`, …), now excluded per the section above — they were layout wrappers with no default children, so they legitimately rendered empty on their own.

If a new warn appears on a re-sync, it is genuinely new: investigate rather than assuming it's a known blank.

## cardMode overrides applied (14)

These 14 scoped components render via `position:fixed`/portal-style overlays or content wider than a standard grid cell, and were flagged `[GRID_OVERFLOW]` by the render check. Fixed via `cfg.overrides` in `config.json`:

- **`single` + `primaryStory`** (fixed/portal content, no grid layout can present them): `CommandMenu` (Open), `Drawer` (BottomDrawer), `Menu` (Open), `Modal` (DeleteConfirmation), `MultiSelect` (Selected), `Popover` (DeploymentSummary), `Sheet` (QuickSettings), `Sidebar` (Default), `Tooltip` (Default).
- **`column`** (renders wider than a grid cell, keep full width): `Breadcrumbs`, `InputOTP`, `Navbar`, `RangeCalendar`, `Skeleton`.

## Findings from preview authoring (fold into future re-syncs)

- **`MultiSelect`** takes `defaultValue`/`value` (array of keys) for its selection state, **not** `defaultSelectedKeys`/`selectedKeys` like its siblings `ComboBox`/`ListBox`/`Select` — an easy trap when authoring or documenting.
- **`ContextMenu`** has no `isOpen`/`defaultOpen` prop — it only opens via its own real `onContextMenu` event handler writing to internal state. A static preview can only show the closed/dashed trigger box; there's no way to force it open short of a synthetic event dispatch. `Menu` and `CommandMenu`, by contrast, both honor `isOpen` for a forced-open preview.
- **Tailwind JIT scope**: an unfamiliar/rarely-used utility class (e.g. `max-w-64`) can silently generate no CSS rule if nothing in the scanned app source uses it, even though more common classes work fine. When a preview needs a class that might not be in the scanned set, verify it renders (or fall back to an inline `style` referencing the DS's own CSS custom properties).
- **`recharts` module duplication**: `preview-rebuild.mjs` bundles the `preskok` package (with its own internal `recharts`) separately from a preview file's own direct `import ... from "recharts"` — two independent module instances. The `Chart` primitive (meant to be composed with raw `recharts` children per its real demo) needs those children imported directly from `"recharts"` too, matching the same module instance — mixing `preskok`'s own `XAxis`/`CartesianGrid`/etc. wrappers as children of a raw `recharts` primitive silently drops them. `AreaChart`/`BarChart`/`LineChart`/`PieChart` are self-contained and don't hit this.
- **`Keyboard`**'s base class includes `hidden ... lg:inline` — it renders blank in a capture column narrower than the `lg` breakpoint. Pass `className="inline"` (matching how the real `keyboard-shortcuts-preskok-demo.tsx` demo already does) to force visibility in the capture viewport.
- **`Toast`/sonner**: the DS's `<Toast />` is sonner's `<Toaster />`, an always-mounted, empty-until-triggered portal. Its imperative `toast()` API lives in a *different* bundled copy of `sonner` than the one `<Toast />`'s own module subscribes to inside a preview's isolated compile — calling `toast.success()` from the preview never reaches it. Fixed with a static visual stand-in (the same markup a real toast paints) styled via inline `style` referencing the DS's own `--success-*`/`--error-*` CSS custom properties (from `apps/preskok/styles/toast.css`) rather than semantic utility classes, which also aren't Tailwind-JIT-scanned for a new preview file.
- **`ColorSwatchPicker`**: the capture harness renders each cell in an unconstrained ~980px-wide canvas, so a demo relying on a fluid `grid-cols-N` layout can stretch its selection-ring indicator into a visually broken elongated outline that doesn't occur at realistic widths. Fixed with an explicit `style={{ maxWidth: 260 }}` wrapper. Any future preview reusing a fluid-grid demo class should get the same treatment.
