export type WorkflowOwner =
  | "preskok_mcp"
  | "figma_mcp"
  | "claude_design"
  | "claude_code"
  | "designer"
  | "developer"
  | "ci"

export type WorkflowStep = {
  id: string
  owner: WorkflowOwner
  action: string
  tools: Array<string>
  output: string
}

export type WorkflowVerification = {
  id: string
  kind: "mcp" | "figma" | "catalog" | "build" | "runtime" | "visual"
  action: string
  passCondition: string
}

export type PreskokWorkflow = {
  name:
    | "claude_design_to_figma"
    | "figma_to_web_app"
    | "web_app_to_figma"
    | "claude_design_to_web_app"
    | "theme_sync"
    | "audit_figma_design"
    | "maintain_design_system"
  title: string
  goal: string
  preconditions: Array<string>
  steps: Array<WorkflowStep>
  verification: Array<WorkflowVerification>
  limitations: Array<string>
}

export const preskokWorkflows: Array<PreskokWorkflow> = [
  {
    name: "claude_design_to_figma",
    title: "Claude Design to native Preskok Figma",
    goal: "Turn a repo-aware Claude Design concept into a proven editable Figma screen using either the published Preskok UI library or an official copied source file.",
    preconditions: [
      "Claude can call the Preskok Design MCP.",
      "The official Figma MCP is connected.",
      "Choose published (library enabled when possible, otherwise complete direct imports by published keys) or copied (official source duplicated with local components and collections); never mix strategies.",
    ],
    steps: [
      {
        id: "issue-design-contract",
        owner: "claude_design",
        action:
          "Describe the product outcome, select all intended Preskok code components, choose a Figma strategy and theme, then issue an immutable composition plan before touching the canvas.",
        tools: ["search_preskok", "plan_preskok_design"],
        output:
          "A digest-bound plan containing the official source, available modes, exact assets, stable copied-file fingerprints, hierarchy, fallbacks, and code components.",
      },
      {
        id: "resolve-library-assets",
        owner: "figma_mcp",
        action:
          "For published strategy, prefer the exact enabled Preskok UI library; when the client cannot enable it, resolve every component and Style/Mode collection by the plan's published keys. For copied strategy, confirm components and collections are local copies matching the plan fingerprints. Resolve every planned asset before writing.",
        tools: ["get_libraries", "search_design_system"],
        output:
          "Verified strategy prerequisites and resolvable assets for every plan requirement.",
      },
      {
        id: "compose-native-screen",
        owner: "figma_mcp",
        action:
          "Create the wrapper first, import or instantiate the exact planned Preskok components, preserve the planned parent hierarchy, bind variables, and apply Style and Mode explicitly to the root.",
        tools: ["use_figma"],
        output:
          "An editable screen whose reusable controls remain linked to Preskok UI.",
      },
      {
        id: "prove-and-handoff",
        owner: "preskok_mcp",
        action:
          "Collect normalized live evidence for libraries, requirement-assigned instances, direct-parent layout containers and bounds, ancestors, properties, local components, manual nodes, variables, and explicit modes; finalize against the unchanged plan.",
        tools: ["finalize_preskok_design"],
        output:
          "A finalization report; an implementation-ready handoff exists only when ready=true.",
      },
    ],
    verification: [
      {
        id: "mcp-contract",
        kind: "mcp",
        action: "Finalize live evidence against the issued Preskok plan.",
        passCondition:
          "ready=true, full required-instance coverage, zero error issues, and a non-null handoff.",
      },
      {
        id: "figma-instances",
        kind: "figma",
        action:
          "Inspect the screen hierarchy, instance main components, bindings, text, direct-parent bounds, and responsive layout.",
        passCondition:
          "Mapped controls are linked instances with the required origin and live ancestry; every automatic child fits its Auto Layout bounds, action groups share the planned container, root theme modes are explicit, and no unintended detaches, hardcoded semantic values, overlap, clipping, or placeholder content remain.",
      },
      {
        id: "visual-review",
        kind: "visual",
        action:
          "Review full-screen and section screenshots at useful resolution.",
        passCondition:
          "Typography, hierarchy, responsive intent, spacing, and all requested states match the approved concept.",
      },
    ],
    limitations: [
      "This is a deterministic translation workflow, not continuous two-way synchronization.",
      "Published and copied assets cannot be mixed in one finalized plan.",
      "A published direct-import design remains linked and can pass proof, but Figma Assets-panel browsing and normal library update UX still require enabling Preskok UI in the file.",
      "Components without a direct Figma asset use catalog-declared fallback compositions; code-only context modules require no Figma instance.",
    ],
  },
  {
    name: "figma_to_web_app",
    title: "Preskok Figma to a real web application",
    goal: "Implement a Figma screen with the actual Preskok registry components and tokens instead of generated lookalikes.",
    preconditions: [
      "A node-specific Figma URL or file key and node ID is available.",
      "The target web application can install the @preskok registry.",
    ],
    steps: [
      {
        id: "prepare-inspection",
        owner: "preskok_mcp",
        action:
          "Prepare the deterministic read-only inspection script for the target node.",
        tools: ["prepare_preskok_figma_inspection"],
        output:
          "Exact code to run unchanged with the official Figma MCP and the name of the ingestion tool.",
      },
      {
        id: "inspect-live-design",
        owner: "figma_mcp",
        action:
          "Run the prepared code unchanged with use_figma, read the file's enabled libraries, and capture a screenshot and design context for visual and content reference.",
        tools: [
          "use_figma",
          "get_libraries",
          "get_screenshot",
          "get_design_context",
        ],
        output:
          "Compact live inspection data, the unchanged library result, and visual reference material.",
      },
      {
        id: "discover-and-prove",
        owner: "preskok_mcp",
        action:
          "Ingest the unchanged official Figma results, discover every visible top-level Preskok instance, prove identity and layout, and fail closed on unknown or incomplete evidence.",
        tools: ["ingest_preskok_figma_inspection"],
        output:
          "A proven handoff with one atomic registry install, copied-source inspection paths, raw Figma instance properties, tokens, usage references, and explicit gaps.",
      },
      {
        id: "implement",
        owner: "claude_code",
        action:
          "Run the handoff's atomic install, read every returned copied source file as the component API, then implement the design's content, composition, behavior, and responsive states. Treat raw Figma properties as design intent, not React props.",
        tools: ["shadcn", "repository tools"],
        output:
          "A working application implementation using Preskok components.",
      },
      {
        id: "verify-implementation",
        owner: "developer",
        action:
          "Run focused tests, typecheck, production build, runtime interaction checks, accessibility checks, and visual comparison.",
        tools: ["project verification commands", "browser"],
        output: "Repeatable implementation evidence.",
      },
    ],
    verification: [
      {
        id: "protocol-handoff",
        kind: "mcp",
        action:
          "Prepare, run, and ingest the automatic live inspection through the MCP protocol.",
        passCondition:
          "The analysis is ready, its handoff is non-null, every visible top-level Preskok instance resolves exactly once, and each installed component has a copied-source inspection path.",
      },
      {
        id: "production-build",
        kind: "build",
        action: "Run the target application's production build and typecheck.",
        passCondition:
          "Both commands exit successfully without generated-path or dependency errors.",
      },
      {
        id: "browser-runtime",
        kind: "runtime",
        action:
          "Load the built page and exercise its primary interaction, keyboard path, disabled/loading states, and responsive layout.",
        passCondition:
          "The page renders and behaves correctly with no runtime or accessibility regressions.",
      },
      {
        id: "visual-diff",
        kind: "visual",
        action: "Compare implementation screenshots with the Figma reference.",
        passCondition:
          "Any visible difference is corrected or explicitly accepted in the handoff notes.",
      },
    ],
    limitations: [
      "Figma-generated React and Tailwind are reference material, not production code.",
      "The MCP preserves raw Figma component properties but does not maintain a separate Figma-to-React prop mapping; the installed source is authoritative.",
      "Code-only composition that is not represented by a Figma component instance is implemented from the visual design and installed source without being claimed as automatically discovered.",
      "Temporary Figma asset URLs must be downloaded or replaced with the application's durable asset source.",
    ],
  },
  {
    name: "web_app_to_figma",
    title: "Real web application to native Preskok Figma",
    goal: "Translate a running Preskok application screen into an editable, library-linked Figma specification.",
    preconditions: [
      "The source page runs locally or at an accessible URL.",
      "The target Figma file is editable and satisfies either the published or copied Preskok strategy.",
    ],
    steps: [
      {
        id: "inspect-and-plan",
        owner: "claude_code",
        action:
          "Identify sections, Preskok components, props, tokens, fonts, responsive behavior, interactions, and images from source; issue the matching Figma composition plan.",
        tools: ["repository tools", "search_preskok", "plan_preskok_design"],
        output:
          "A source-grounded inventory and digest-bound Figma composition plan.",
      },
      {
        id: "capture-reference",
        owner: "figma_mcp",
        action:
          "Capture the running web page into the target file as a temporary pixel-accurate reference.",
        tools: ["generate_figma_design"],
        output:
          "A temporary visual reference with source images available in-file.",
      },
      {
        id: "rebuild-native",
        owner: "figma_mcp",
        action:
          "Build a separate native screen using the plan's published or copied instances, explicit variable modes, required hierarchy, and auto-layout; transfer image hashes when required.",
        tools: ["get_libraries", "search_design_system", "use_figma"],
        output: "A clean native Figma screen linked to Preskok UI.",
      },
      {
        id: "compare-and-clean",
        owner: "designer",
        action:
          "Compare the native screen against the capture, correct discrepancies, collect normalized evidence, finalize the unchanged plan, then remove the temporary reference.",
        tools: ["get_screenshot", "finalize_preskok_design", "use_figma"],
        output:
          "A verified native specification without duplicate reference content.",
      },
    ],
    verification: [
      {
        id: "source-contract",
        kind: "mcp",
        action:
          "Resolve and finalize every source component through the current catalog.",
        passCondition:
          "Every registry component is resolved, fallbacks are explicit, and finalization returns ready=true with a non-null handoff.",
      },
      {
        id: "native-structure",
        kind: "figma",
        action:
          "Inspect instance keys, requirement assignments, bindings, hierarchy, direct-parent layout bounds, and text properties.",
        passCondition:
          "Reusable UI is instance-based and linked; manual frames are limited to layout structure.",
      },
      {
        id: "capture-comparison",
        kind: "visual",
        action:
          "Compare full and section screenshots with the running web page.",
        passCondition:
          "No unexplained visual, font, image, or responsive discrepancy remains.",
      },
    ],
    limitations: [
      "The captured page is only a visual reference and does not automatically map DOM nodes to library instances.",
      "The reference must be deleted after the native reconstruction is verified.",
    ],
  },
  {
    name: "claude_design_to_web_app",
    title: "Claude Design directly to a Preskok web application",
    goal: "Implement a repo-aware Claude Design concept without requiring a Figma round trip while preserving Preskok contracts.",
    preconditions: [
      "Claude Design has repository context and can call the Preskok MCP.",
      "The target application and acceptance criteria are known.",
    ],
    steps: [
      {
        id: "shape-concept",
        owner: "claude_design",
        action:
          "Explore the product concept using real content and explicit interaction states.",
        tools: [
          "search_preskok",
          "get_preskok_component",
          "get_preskok_tokens",
        ],
        output: "A concept expressed in available Preskok patterns.",
      },
      {
        id: "generate-code-handoff",
        owner: "preskok_mcp",
        action:
          "Create a code-directed handoff for all selected components and tokens.",
        tools: ["create_preskok_handoff(direction: claude_design_to_code)"],
        output:
          "Registry installs, imports, props, usage references, and documented gaps.",
      },
      {
        id: "implement-and-test",
        owner: "claude_code",
        action:
          "Implement with existing project architecture and run focused, build, runtime, responsive, and accessibility verification.",
        tools: ["repository tools", "browser"],
        output: "A production-ready implementation with evidence.",
      },
    ],
    verification: [
      {
        id: "handoff-contract",
        kind: "mcp",
        action: "Validate the component/token plan and generated handoff.",
        passCondition:
          "No unresolved components, invalid known variants, or unknown tokens remain.",
      },
      {
        id: "application-build",
        kind: "build",
        action: "Run target typecheck, tests, and production build.",
        passCondition: "All commands succeed.",
      },
      {
        id: "application-runtime",
        kind: "runtime",
        action:
          "Exercise the primary user journey and responsive states in a browser.",
        passCondition:
          "The accepted design intent works for pointer, keyboard, and target viewports.",
      },
    ],
    limitations: [
      "Figma collaboration, annotations, and multiplayer review are skipped unless the design is later transferred through web_app_to_figma.",
    ],
  },
  {
    name: "theme_sync",
    title: "Preskok theme synchronization",
    goal: "Keep website tokens, Figma Style modes, component instances, and implementation handoff aligned.",
    preconditions: [
      "The generated token catalog is current.",
      "Theme changes are made in the Preskok source library, not copied into consumer files.",
    ],
    steps: [
      {
        id: "resolve-theme",
        owner: "preskok_mcp",
        action:
          "Resolve light/dark token values, aliases, component usage, and requested theme controls.",
        tools: ["get_preskok_tokens"],
        output: "A canonical token plan derived from globals.css.",
      },
      {
        id: "update-source-library",
        owner: "designer",
        action:
          "Use Preskok Theme Builder in the source library to create or update the named Style mode, then publish it.",
        tools: ["Preskok Theme Builder"],
        output:
          "A published remote Style mode; no consumer-local variable copies.",
      },
      {
        id: "apply-and-handoff",
        owner: "figma_mcp",
        action:
          "Issue a plan for the affected components and strategy, apply Style and Mode explicitly to the containing frame, collect evidence, and finalize a token-aware handoff.",
        tools: ["plan_preskok_design", "use_figma", "finalize_preskok_design"],
        output:
          "Proven themed designs and matching CSS-token references when finalization is ready.",
      },
    ],
    verification: [
      {
        id: "catalog-current",
        kind: "catalog",
        action: "Regenerate and check the token catalog.",
        passCondition: "Generation produces no diff and all aliases resolve.",
      },
      {
        id: "figma-mode-binding",
        kind: "figma",
        action: "Inspect selected frames and instances after switching modes.",
        passCondition:
          "Remote variables resolve, instances remain linked, and no local fallback collection is introduced.",
      },
      {
        id: "theme-visuals",
        kind: "visual",
        action: "Compare representative components in light and dark modes.",
        passCondition:
          "Semantic roles and contrast match the generated CSS values.",
      },
    ],
    limitations: [
      "Figma plan limits may restrict the number of Style modes.",
      "Consumer files receive new modes only after the source library is published.",
    ],
  },
  {
    name: "audit_figma_design",
    title: "Audit a Figma design against Preskok",
    goal: "Find detached, foreign, stale, hardcoded, or unsupported design-system usage before engineering handoff.",
    preconditions: [
      "The target Figma nodes can be inspected through the official Figma MCP.",
    ],
    steps: [
      {
        id: "inspect-context",
        owner: "figma_mcp",
        action:
          "Collect instances, explicit requirement IDs for repeated assets, main component keys, properties, bindings, direct-parent layout bounds, styles, and hardcoded values.",
        tools: ["get_metadata", "get_design_context", "use_figma"],
        output: "Normalized design evidence for the selected scope.",
      },
      {
        id: "plan-and-validate",
        owner: "preskok_mcp",
        action:
          "Infer the intended code components from observed instances, issue the matching strategy plan, and finalize the normalized evidence against it.",
        tools: ["plan_preskok_design", "finalize_preskok_design"],
        output: "Severity-ranked issues with exact remediation.",
      },
      {
        id: "correct-and-recheck",
        owner: "designer",
        action:
          "Replace or reconnect invalid usage, then rerun finalization against a fresh unchanged plan and review screenshots.",
        tools: ["use_figma", "get_screenshot", "finalize_preskok_design"],
        output: "A clean audit result or an explicit accepted-deviation list.",
      },
    ],
    verification: [
      {
        id: "audit-clean",
        kind: "mcp",
        action: "Rerun Preskok finalization after corrections.",
        passCondition:
          "ready=true, no error-severity issue remains, and the handoff is non-null.",
      },
      {
        id: "design-clean",
        kind: "figma",
        action: "Reinspect instance and variable structure.",
        passCondition:
          "Mapped controls remain linked and semantic values are variable-backed.",
      },
      {
        id: "visual-clean",
        kind: "visual",
        action: "Review affected sections after replacements.",
        passCondition: "Corrections introduce no visual or content regression.",
      },
    ],
    limitations: [
      "The MCP validates normalized Figma evidence; the official Figma MCP remains responsible for canvas access.",
    ],
  },
  {
    name: "maintain_design_system",
    title: "Maintain Preskok code and Figma coverage",
    goal: "Regenerate contracts, detect drift, refresh live Figma coverage, and keep every registry component supported.",
    preconditions: [
      "Repository component, documentation, registry, or token changes are available locally.",
      "Live Figma refreshes use the published Preskok UI library as their scope.",
    ],
    steps: [
      {
        id: "regenerate",
        owner: "developer",
        action:
          "Build the registry and regenerate the deterministic Preskok design catalog.",
        tools: ["registry:build", "catalog:generate"],
        output:
          "Updated code, docs, examples, props, variants, token, and dependency contracts.",
      },
      {
        id: "refresh-figma",
        owner: "figma_mcp",
        action:
          "Search every registry component against the scoped published library and refresh verified, partial, missing, or nonvisual coverage without guessing keys.",
        tools: ["get_libraries", "search_design_system", "use_figma"],
        output: "A dated Figma coverage snapshot and property evidence.",
      },
      {
        id: "verify-all-seams",
        owner: "ci",
        action:
          "Run catalog drift checks, protocol tests over stdio and HTTP, workflow fixtures, typecheck, package build, and representative live checks.",
        tools: [
          "catalog:check",
          "test",
          "typecheck",
          "build",
          "verify:workflows",
        ],
        output:
          "Repeatable evidence that every exposed workflow remains callable.",
      },
    ],
    verification: [
      {
        id: "deterministic-catalog",
        kind: "catalog",
        action: "Run catalog generation twice and then catalog:check.",
        passCondition:
          "The second generation is byte-identical and catalog:check succeeds.",
      },
      {
        id: "protocol-coverage",
        kind: "mcp",
        action:
          "Exercise tools, resources, and prompts through real MCP clients.",
        passCondition:
          "stdio and Streamable HTTP negotiate and every interface returns schema-valid output.",
      },
      {
        id: "package-build",
        kind: "build",
        action: "Typecheck and build the package from a clean generated state.",
        passCondition: "No type, export, path, or packaging error remains.",
      },
    ],
    limitations: [
      "Live Figma checks are rate-limited and must resume safely without downgrading existing verified mappings.",
      "Code Connect remains optional and plan-gated; the generated manifest is the canonical mapping source.",
    ],
  },
]

export function listPreskokWorkflows() {
  return preskokWorkflows.map(({ name, title, goal }) => ({
    name,
    title,
    goal,
  }))
}

export function getPreskokWorkflow(name: string) {
  const workflow = preskokWorkflows.find((candidate) => candidate.name === name)
  if (!workflow) {
    throw new Error(`Unknown Preskok workflow: ${name}`)
  }
  return workflow
}
