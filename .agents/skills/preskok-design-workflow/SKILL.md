---
name: preskok-design-workflow
description: Orchestrate Preskok product design across Claude Design, the repository-backed Preskok Design MCP, the official Preskok UI Figma file/library, the official Figma MCP, and consuming web apps. Use for concept-to-Figma, Figma-to-code, code-to-Figma, theme transfer, design audits, or any request that must reuse real Preskok components instead of visual look-alikes.
---

# Preskok Design Workflow

Run Preskok's design-to-proof contract. Treat the Preskok MCP as the component-identity and verification authority, the official Figma MCP as the only canvas reader/writer, and installed component source as the only code API.

## Existing Figma to code

1. Call `get_preskok_status` and read `preskok://figma/source`. Stop on catalog drift or an unavailable requested theme.
2. Call `prepare_preskok_figma_inspection` with the target root node ID.
3. Run the returned `code` unchanged with the official Figma MCP `use_figma` tool. Do not reconstruct or normalize its result by hand.
4. Call the official Figma MCP `get_libraries` tool for the same file.
5. Pass both unchanged results to `ingest_preskok_figma_inspection` with the file's `published` or `copied` strategy and explicit Style/Mode selection.
6. Fix every error in the real Figma file and rerun the inspection until `ready=true` and `handoff` is non-null. Unknown visible instances, incomplete identity, unbound semantic values, invalid modes, hidden requirements, and floating layout fail closed.
7. Run the handoff's single atomic install command. Resolve each `inspectFiles` alias through the consumer's `tsconfig`/`components.json` and open the copied `.tsx` source; it defines the component API.
8. Use `figmaInstances[].properties` only to understand design intent. Do not convert those values through a separate mapping, override table, or component annotation layer.
9. Implement product content and code-only composition from the design context and repository patterns without claiming that pixels were automatically mapped to components.
10. Run typecheck, production build, browser interactions, keyboard checks, responsive checks, accessibility checks, and screenshot comparison.

## Build or change a Figma design

1. Call `get_preskok_status` and read `preskok://figma/source`. Stop on catalog drift or an unavailable requested theme.
2. Resolve intended code components with `search_preskok` and `get_preskok_component`.
3. Call `plan_preskok_design` before changing Figma. Supply every intended component explicitly unless the MCP exposes a named composition for the intent.
4. Preserve the returned plan and `contractDigest` unchanged.
5. Satisfy exactly one Figma strategy:
   - `published`: prefer enabling the plan's exact Preskok library. If the client cannot enable it, direct-import every component and Style/Mode collection by the published keys in the plan. Both routes require remote linked instances and remote collections; direct import produces a warning because Assets-panel browsing still needs the enabled library.
   - `copied`: work from a copy of the official Preskok source; use local component instances and local collections; prove each component with the planned stable contract fingerprint.
6. Build with the official Figma MCP. Use planned instances for all reusable UI, keep them linked, preserve `parentRequirementId` ancestry, and apply Style and Mode explicitly to the root frame.
7. Permit manual nodes only for layout, product content, or artwork. Bind semantic styling to Preskok variables. Give every local component a concrete product-specific reason.
8. Prefer the prepared automatic inspection for the completed root. Manual normalized evidence is supported for advanced/custom compositions; call `finalize_preskok_design` with the unchanged plan.
9. Fix every error and re-inspect live Figma. Repeat finalization until `ready=true`, coverage is complete, and `handoff` is non-null.
10. Review full-screen and section screenshots for content, hierarchy, layout, responsive intent, clipping, and states.

Never create or use a code handoff before successful finalization.

## Manual evidence contract

Record:

- target `fileKey` and inspected `rootNodeId`;
- exact enabled library keys;
- every relevant instance's node ID, asset name, component key or copied fingerprint, remote/local origin, detached state, normalized properties, and ancestor node IDs;
- an explicit `requirementId` for every repeated asset identity (for example, two Separators or two Buttons); never satisfy repeated requirements by count alone;
- a direct-parent layout tree for the root, placed slot instances, and every product-specific local component, including bounds, Auto Layout mode and sizing, clipping, visibility, and child positioning;
- manual nodes, claimed Preskok equivalents, token-binding state, and reason;
- local components, instance count, and product-specific reason;
- root Style and Mode names, keys, selected modes, explicitness, and remote/local origin;
- hardcoded semantic values.

Derive evidence from live Figma inspection. Do not infer an enabled library, explicit mode, component origin, ancestry, or token binding from appearance.

Reject the build when any claimed node is absent from that live tree, an automatic child exceeds its parent bounds, content is clipped, or a planned action group does not share the required Auto Layout container. After changing a local component used through an instance-swap property, refresh and reinspect the placed nested instance; a correct main component is not proof that an existing instance updated.

## Translate after proof

For Figma-to-code, use only the handoff returned by successful automatic ingestion or finalization. Install its registry items atomically, then inspect the returned copied source paths before writing application code. Preserved Figma properties explain the selected design state; they are not a React prop contract.

For code-to-Figma, inventory actual Preskok imports and props first, request a matching plan, use a page capture only as a temporary visual reference, rebuild natively, finalize, and remove the capture after comparison.

For direct Claude Design-to-code work that intentionally skips Figma, use `create_preskok_handoff` with `claude_design_to_code`, then perform the same application verification. Do not describe that route as Figma-verified.

## Fail closed

- Do not mix published and copied component or variable origins.
- Do not count a manually drawn equivalent as a required Preskok instance.
- Do not detach an instance to force content or layout.
- Do not certify a copied component whose fingerprint changed.
- Do not treat inherited Style or Mode as explicit root application.
- Do not claim a published mode exists unless the source resource lists it.
- Do not maintain a component-side annotation file, prop map, or override table. Keep Preskok components unchanged and inspect the installed source.
- If the Figma client cannot enable the official library, use only a complete direct-import-by-key route or switch to a genuine copied-source workflow; never treat a partial import as valid and never fabricate evidence.
