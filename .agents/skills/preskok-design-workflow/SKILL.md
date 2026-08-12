---
name: preskok-design-workflow
description: Orchestrate Preskok product design across Claude Design, the repository-backed Preskok Design MCP, the official Preskok UI Figma file/library, the official Figma MCP, and consuming web apps. Use for concept-to-Figma, Figma-to-code, code-to-Figma, theme transfer, design audits, or any request that must reuse real Preskok components instead of visual look-alikes.
---

# Preskok Design Workflow

Run Preskok's plan-to-Figma-to-proof contract. Treat the Preskok MCP as the semantic authority and the official Figma MCP as the only canvas reader/writer.

## Execute the contract

1. Call `get_preskok_status` and read `preskok://figma/source`. Stop on catalog drift or an unavailable requested theme.
2. Resolve intended code components with `search_preskok` and `get_preskok_component`.
3. Call `plan_preskok_design` before changing Figma. Supply every intended component explicitly unless the MCP exposes a named composition for the intent.
4. Preserve the returned plan and `contractDigest` unchanged.
5. Satisfy exactly one Figma strategy:
   - `published`: prefer enabling the plan's exact Preskok library. If the client cannot enable it, direct-import every component and Style/Mode collection by the published keys in the plan. Both routes require remote linked instances and remote collections; direct import produces a warning because Assets-panel browsing still needs the enabled library.
   - `copied`: work from a copy of the official Preskok source; use local component instances and local collections; prove each component with the planned stable contract fingerprint.
6. Build with the official Figma MCP. Use planned instances for all reusable UI, keep them linked, preserve `parentRequirementId` ancestry, and apply Style and Mode explicitly to the root frame.
7. Permit manual nodes only for layout, product content, or artwork. Bind semantic styling to Preskok variables. Give every local component a concrete product-specific reason.
8. Collect normalized live evidence and call `finalize_preskok_design` with the unchanged plan.
9. Fix every error and re-inspect live Figma. Repeat finalization until `ready=true`, coverage is complete, and `handoff` is non-null.
10. Review full-screen and section screenshots for content, hierarchy, layout, responsive intent, clipping, and states.

Never create or use a code handoff before successful finalization.

## Collect evidence

Record:

- target `fileKey` and inspected `rootNodeId`;
- exact enabled library keys;
- every relevant instance's node ID, asset name, component key or copied fingerprint, remote/local origin, detached state, normalized properties, and ancestor node IDs;
- manual nodes, claimed Preskok equivalents, token-binding state, and reason;
- local components, instance count, and product-specific reason;
- root Style and Mode names, keys, selected modes, explicitness, and remote/local origin;
- hardcoded semantic values.

Derive evidence from live Figma inspection. Do not infer an enabled library, explicit mode, component origin, ancestry, or token binding from appearance.

## Translate after proof

For Figma-to-code, use only the handoff returned by successful finalization. Install its registry items atomically, use its imports and code component contracts, then run the consumer's typecheck, production build, browser interactions, keyboard path, accessibility checks, responsive checks, and screenshot comparison.

For code-to-Figma, inventory actual Preskok imports and props first, request a matching plan, use a page capture only as a temporary visual reference, rebuild natively, finalize, and remove the capture after comparison.

For direct Claude Design-to-code work that intentionally skips Figma, use `create_preskok_handoff` with `claude_design_to_code`, then perform the same application verification. Do not describe that route as Figma-verified.

## Fail closed

- Do not mix published and copied component or variable origins.
- Do not count a manually drawn equivalent as a required Preskok instance.
- Do not detach an instance to force content or layout.
- Do not certify a copied component whose fingerprint changed.
- Do not treat inherited Style or Mode as explicit root application.
- Do not claim a published mode exists unless the source resource lists it.
- If the Figma client cannot enable the official library, use only a complete direct-import-by-key route or switch to a genuine copied-source workflow; never treat a partial import as valid and never fabricate evidence.
