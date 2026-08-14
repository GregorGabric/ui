---
name: preskok-design-sync
description: >-
  Sync Preskok UI to the Claude Design project — regenerate declarations and CSS
  inputs, decide card vs sub-part, author a preview story, re-sync and upload.
  Use after adding or changing a registry component, when a component is missing
  or shows a blank card in Claude Design, or when props show as empty stubs.
---

# Preskok UI — Claude Design sync

## When to use

- A new or changed registry component needs to reach the Claude Design project.
- A component is missing from the design pane, or its card renders blank.
- Component props show up as `{ [key: string]: unknown }` instead of real types.

## Relation to other skills

1. **preskok-component** — create the component + registry entry.
2. **preskok-demo** — add the demo, examples entry, Fumadocs page.
3. **this skill** — push it to Claude Design.

Do steps 1–2 first. The demo file from step 2 is what you port into the preview story here.

## Project

- Claude Design project: `c69a73d1-f5bb-4ba7-8169-2de3ab34cb07` ("Preskok UI Kit")
- Pinned in `.design-sync/config.json` as `projectId` — the tooling reads it; don't pass it by hand.
- Read `.design-sync/NOTES.md` before starting. It's the watch-list for what silently rots.

## Prerequisites (per fresh clone — these are gitignored/generated)

```bash
mkdir -p .ds-sync
cp -r <bundled design-sync skill dir>/{package-build.mjs,package-validate.mjs,package-capture.mjs,resync.mjs,lib,storybook} .ds-sync/
echo '{"name":"ds-sync-deps","private":true}' > .ds-sync/package.json
(cd .ds-sync && npm i esbuild ts-morph @types/react playwright)
npx playwright install chromium          # render check needs it
ln -sfn .. apps/preskok/node_modules/preskok   # makes PKG_DIR resolve to apps/preskok
```

Node/pnpm are shadowed shell functions here; prefix shell commands with:

```bash
unset -f node pnpm npm npx 2>/dev/null; export PATH="$HOME/.local/share/fnm/node-versions/v24.10.0/installation/bin:$PATH"
```

## Step 1 — Regenerate the two generated inputs (REQUIRED, easy to skip)

```bash
cd apps/preskok
pnpm build                                     # emits content-hashed CSS chunks
./node_modules/.bin/tsc -p tsconfig.dts.json   # emits types/ (128+ .d.ts)
```

Then regenerate the barrel `apps/preskok/types/index.d.ts` — one `export * from './<rel-path>'` per emitted `.d.ts` — and update `.design-sync/config.json`:

- `cssEntry` → the large compiled chunk under `.next/static/chunks/*.css` (~350KB, the one with the utilities)
- `extraFonts` → the small chunk containing `@font-face` rules (grep for `@font-face` to tell them apart)

Both filenames are **content-hashed and change on every build**. Stale values are the single most common failure.

**Why the declarations matter:** without `types/`, every emitted `.d.ts` degrades to an empty `{ [key: string]: unknown }` stub — the design agent then has zero prop information — *and* component discovery silently falls back to scanning `src/`, which produces a different component set. `apps/preskok/package.json`'s `"types": "./types/index.d.ts"` is load-bearing: it's what lets the extractor's call-signature fallback resolve props for components without a named `<Name>Props` interface.

**Check the tsc output for the "cannot be named" error family — `TS2883`, `TS4023`, `TS4058`.** None fail the build, but each *skips that file's declarations*, which drops its components from the sync entirely. Always diff the emitted file list against the source list rather than trusting exit code 0:

```bash
for f in registry/preskok/ui/preskok-ui/*.tsx; do
  b=$(basename "$f" .tsx)
  [ -f "types/registry/preskok/ui/preskok-ui/$b.d.ts" ] || echo "MISSING: $b"
done
```

Cause is always the same: an inferred type references something TS can't name portably. Fix at source with an explicit annotation.

```ts
// TS2883 — aliased re-export whose inferred type reaches through @/* into node_modules
const MenuShortcut = DropdownKeyboard                          // bad
const MenuShortcut: typeof DropdownKeyboard = DropdownKeyboard // good

// TS4058 — return type leaks a type the dependency declares but doesn't export
function getExperimentalChartTooltip(...) { ... }              // bad: leaks StoredChartSpec
function getExperimentalChartTooltip(...): TooltipResult { ... } // good
```

**If the source fix isn't yours to make** (someone else's open PR, or an upstream type that genuinely can't be named), pin the affected component instead — `componentSrcMap` with a non-null path *adds* it to discovery even with no `.d.ts`:

```json
"ExperimentalChart": "registry/preskok/ui/preskok-ui/experimental-chart.tsx"
```

It then syncs and renders, but its props stay empty stubs until the emit error is fixed. Its uncarded sub-parts still reach `window.PreskokUI`, because the bundle is built from the src synth entry, not from discovery.

## Step 2 — Decide: card or sub-part

The one real judgment call. The library exports every compound piece separately (`Dialog`, `DialogBody`, `DialogClose`…), but only ~91 are things a human would browse for.

| | Standalone component | Compound sub-part |
|---|---|---|
| Examples | `Button`, `Select`, `Table` | `CardHeader`, `CarouselItem`, `MenuTrigger` |
| Action | add to `.design-sync/scoped-components.txt`, author a preview | add `"<Name>": null` to `componentSrcMap` |
| Result | gets a card + `.d.ts` + `.prompt.md` | no card, **still importable** |

Excluding a sub-part removes its card only — the runtime export survives, because the bundle assigns every export to the global independently of component discovery. Verify after changing the exclusion list:

```js
// in a preview page console, or headless
Object.keys(window.PreskokUI).length   // expect 364; CarouselItem etc. must be present
```

If excluded parts ever vanish from the global, revert immediately — composition breaks without them.

**Miss this step and a new sub-part silently appears as its own (usually blank) card.**

## Step 3 — Author the preview story

Create `.design-sync/previews/<Name>.tsx` with 1–4 **named exports** (each = one card cell). Port realistic props from the demo file written in preskok-demo.

```tsx
import { Button } from "preskok"        // bare package name, NOT @/registry/...

export function Intents() { /* ... */ }
export function Sizes() { /* ... */ }
```

- Import from `"preskok"` — a build plugin redirects it to source.
- Real content, never `foo`/`test` — humans browse these and the design agent imitates them.
- Keep chart data small (3–6 points) so it reads at card size.
- Compose context-dependent leaves inside their parent; that's the only true render anyway.
- Avoid `Math.random()` / `Date.now()` — non-deterministic output churns the verification hashes.

Overlay or full-width components need a `cfg.overrides` entry (`cardMode: "single"` with a `primaryStory`, or `"column"`), otherwise the render check flags `[GRID_OVERFLOW]`. 14 are already configured — copy the nearest pattern.

## Step 4 — Re-sync

Fetch the project's `_ds_sync.json` into `.design-sync/.cache/remote-sync.json`, then:

```bash
node .ds-sync/resync.mjs --config .design-sync/config.json \
  --node-modules apps/preskok/node_modules --out ./ds-bundle \
  --remote .design-sync/.cache/remote-sync.json
```

That anchor is what keeps this cheap — the driver chains build → diff → validate → capture and only re-verifies **new and changed** components. Adding one component is minutes, not the hours a first import takes.

Then read the new component's sheet in `ds-bundle/_screenshots/review/<group>__<Name>.png` and grade every cell:

```jsonc
// .design-sync/.cache/review/<Name>.grade.json — keys must match export names exactly
{ "cells": { "Intents": { "verdict": "good" } } }
```

Rubric (absolute — there's no reference render): **styled** (real tokens/fonts, not browser defaults), **complete** (nothing collapsed or missing), **plausible** (a DS author would recognize it; variants actually differ). Anything `needs-work` → fix the `.tsx`, rebuild scoped to that component, recapture, regrade.

## Step 5 — Upload

Order is not optional:

1. `finalize_plan` — **always fresh**, tokens expire between sessions
2. write `_ds_needs_recompile` (sentinel fence)
3. write content (components, `_preview/**`, base files)
4. delete anything remote that the final `ds-bundle/` no longer contains
5. re-write the sentinel
6. write `_ds_sync.json` **absolutely last**

The anchor must only ever vouch for a fully-applied state. If a write or delete fails and retries don't clear it, **stop** — no sentinel, no anchor. An un-anchored project just re-verifies next time; a fresh anchor over a half-applied upload is permanent.

`delete_files` needs explicit file paths — directory paths are silently a no-op (`deleted: 0`).

## Gotchas

| Symptom | Cause |
|---|---|
| Props are `{ [key: string]: unknown }` | `types/` not regenerated, or `package.json` `"types"` missing |
| Component missing entirely from sync | a "cannot be named" error (`TS2883`/`TS4023`/`TS4058`) skipped its declaration emit — check the emitted file list, not the exit code |
| Card shows `file not found` | stale client view — hard-refresh; verify `_ds_manifest.json` server-side first |
| New sub-part appears as a blank card | missing from `componentSrcMap` |
| Preview renders unstyled | unfamiliar Tailwind utility generated no CSS — use a common class or inline `style` with the CSS var |
| Chart preview blank | direct `recharts` import creates a second module instance; use raw recharts children consistently, or the self-contained `AreaChart`/`BarChart`/etc. |
| Component renders blank at card width | responsive class (e.g. `lg:inline`) — pass an explicit override |

Deeper detail and the full re-sync risk list live in `.design-sync/NOTES.md`.
