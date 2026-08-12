# Preskok Design MCP

The Preskok Design MCP is the semantic contract between the Preskok registry,
the published Preskok UI Figma library, Claude Design, and consuming web
applications. It is generated from the repository and exposes all 96 registry
components through stdio and Streamable HTTP.

It complements two existing servers:

- the official Figma MCP owns authenticated live Figma reads and writes;
- the shadcn MCP owns generic registry installation in a consuming app;
- this MCP owns Preskok discovery, exact code/Figma mappings, tokens,
  authenticated ephemeral design plans, proof-gated handoffs, and verified cross-tool
  workflows.

Keeping those responsibilities separate means the Preskok server never stores
a Figma token and never invents a second canvas API.

## Start it

From the repository root:

```bash
pnpm --filter @preskok/design-mcp dev
```

That starts stdio, which is the default for local clients. The checked-in
`.mcp.json` already configures `preskok-design-system` and the complementary
`shadcn` server for clients that support project MCP configuration.

For a local Streamable HTTP client:

```bash
pnpm --filter @preskok/design-mcp dev -- --http --port 3333
```

The MCP endpoint is `http://127.0.0.1:3333/mcp`; the health endpoint is
`http://127.0.0.1:3333/healthz`. Host and Origin checks protect the local
server from DNS-rebinding and cross-origin requests. This local server has no
user authentication, so do not expose it to the public internet. A remote
Claude connector needs a separately deployed HTTPS endpoint with OAuth.

## Connect the whole workflow

Claude Design imports the actual repository design system through Claude
Code's `/design-sync`. It is not replaced by this MCP. A practical Claude Code
setup is:

```bash
claude mcp add --scope project --transport stdio preskok-design-system -- pnpm --filter @preskok/design-mcp dev
claude mcp add --scope project --transport stdio shadcn -- pnpm --filter preskok exec shadcn mcp
claude mcp add --scope user --transport http claude-design https://api.anthropic.com/v1/design/mcp
claude plugin install figma@claude-plugins-official
```

Then run `/design-login`, authenticate the Figma plugin with `/plugin`, and
run `/design-sync` from this repository. The official Figma remote endpoint is
`https://mcp.figma.com/mcp` if the client does not support the plugin.

Claude Code automatically discovers the checked-in
`/preskok-design-workflow` project skill. Invoke it for the strict
plan-to-Figma-to-proof flow; the matching Codex project skill is checked in
under `.agents/skills` and verified to remain byte-for-byte identical.

## Public MCP surface

Tools:

- `search_preskok`
- `get_preskok_component`
- `get_preskok_tokens`
- `get_preskok_status`
- `plan_preskok_design`
- `finalize_preskok_design`
- `validate_preskok_artifact`
- `create_preskok_handoff`
- `list_preskok_workflows`
- `get_preskok_workflow`

Resources:

- `preskok://catalog/status`
- `preskok://catalog/components`
- `preskok://catalog/tokens`
- `preskok://figma/source`
- `preskok://components/{name}`
- `preskok://workflows`
- `preskok://workflows/{name}`

Each of the seven workflow names is also an MCP prompt. A workflow prompt
states which server owns each step, what the step must produce, and which
verification gates must pass before the work is accepted.

For Figma work, call `plan_preskok_design` before writing. It selects either a
`published` strategy (remote library instances and collections) or a `copied`
strategy (local copies verified by stable component-contract fingerprints),
checks theme availability, and returns exact instance and hierarchy
requirements. The returned digest authenticates an ephemeral capability issued
by that running MCP process: finalize it with the same process, and request a
fresh plan after any restart. Plans with duplicate requirement IDs, missing or
cyclic parents, or inconsistent groups are not buildable.

After the official Figma MCP builds or inspects the design, call
`finalize_preskok_design` with live evidence. It returns a code handoff only
when the authenticated unchanged plan, instance origins, exact assigned
hierarchy, properties, explicit root modes, token bindings, deliberate local
components, and live layout proof pass. Every live node can be claimed only
once across instance, manual-node, and local-component evidence. Repeated
assets must carry their exact plan `requirementId`; a count of two Buttons or
Separators is not enough. Each required instance needs a direct live child
record and must be visible, positive-sized, and automatically positioned in
Auto Layout. Layout proof also records direct-parent bounds for the root and
local source components, so stale node IDs, fixed 1px Auto Layout containers,
cyclic parent evidence, overflow, clipping, and broken action grouping fail
before a handoff is issued. Hidden zero-sized optional slots are allowed when
they are not claimed as required instances.

Inspect both the product-specific source component and its placed nested
instance after an instance-swap update. Figma can retain an old nested override
even when the main component is correct; finalization treats missing live nodes
as an error instead of accepting constructed evidence.

For `published`, enabling Preskok UI is preferred because designers get Assets
panel discovery and normal library update UX. Clients that cannot enable a
library may direct-import every planned component and Style/Mode collection by
the immutable published keys. A complete direct-import design remains linked
and can finalize with a warning; partial imports fail.

`create_preskok_handoff` remains available for non-Figma and compatibility
flows. It accepts each supported translation direction:
`claude_design_to_code`, `claude_design_to_figma`, `figma_to_code`, and
`code_to_figma`. Handoffs install all selected registry components in one
atomic shadcn command so shared dependency files do not trigger partial
overwrite prompts.

## Supported workflows

1. Claude Design to native Preskok Figma
2. Preskok Figma to a real web application
3. A running Preskok web application to native Preskok Figma
4. Claude Design directly to a Preskok web application
5. CSS token and Figma theme synchronization
6. Figma design-system audit
7. Code/Figma design-system maintenance

This is deterministic translation with explicit validation, not invisible
continuous two-way sync. Missing or compound Figma coverage remains visible in
handoff warnings. Every registry component still has an executable route:
published assets are returned directly, while the three missing sets include
published native-Figma fallback recipes instead of guessed component keys.
The code-only locale context correctly requires no Figma instance.

The project-local `preskok-design-workflow` skill orchestrates the Preskok and
official Figma MCPs. It fails closed when published identity is incomplete, a
copied contract drifted, theme application is inherited, or evidence is
incomplete.

Live reference screens exercise both accepted strategies:

- [published direct imports](https://www.figma.com/design/MgQbBtbb503ZchJt0ZFz2k/Preskok-MCP-Workflow-Demo?node-id=17-246)
- [official copied source with Briefd/Dark](https://www.figma.com/design/jGwVPvHf0oT3uV4aLzGdDl/Preskok-UI?node-id=4441-3)

Their normalized audits, including direct-parent layout trees, are checked in
as positive finalization fixtures. The old mixed/manual showcase and an
explicit 1px Auto Layout overflow case remain negative fixtures.

## Generated sources

- `config/figma-library.snapshot.json` records scoped, live library search
  coverage for every registry component.
- `config/figma-properties.snapshot.json` records the published component
  properties for every mapped asset.
- `config/figma-source.snapshot.json` records the official file and library
  keys plus source and published Style/Mode availability.
- `generated/catalog.json` combines registry source, exports, prop
  declarations, variants, documentation, examples, tokens, Figma keys, and
  live property definitions.

Regenerate after registry, documentation, token, or snapshot changes:

```bash
pnpm --filter @preskok/design-mcp catalog:generate
pnpm --filter @preskok/design-mcp verify
```

`catalog:check` fails when the checked-in catalog drifts. Live Figma refreshes
are deliberately separate because they require authentication and are
rate-limited.

## Verification

```bash
pnpm --filter @preskok/design-mcp verify
pnpm --filter @preskok/design-mcp verify:workflows
```

The first command checks deterministic generation, lint and formatting, unit
behavior, real MCP clients over stdio and Streamable HTTP, the built CLI entry
point, type safety, and package output. The second verifies the companion
shadcn MCP from `apps/preskok`, then creates a fresh temporary Vite application,
obtains and finalizes a design plan through the MCP protocol, installs the actual public
`@preskok` registry items, typechecks and builds the app, serves the production
build through Vite preview, asserts that its HTML references a hashed `/assets/`
build artifact, and uses Chrome to verify pointer and keyboard behavior plus
desktop and mobile layout. It also builds the Preskok Theme Builder and
exercises a complete mocked Figma scan/save/apply flow, including explicit
Style and Mode assignments.

Live Figma QA additionally verifies both accepted strategies against the two
reference nodes above, including source-component hug sizing, placed-slot
refresh, token-bound horizontal insets, unique repeated-instance assignment,
and full-screen screenshots.
