# Sidebar Migration Plan (to preskok-ui)

Scope: migrate all `sidebar-*.tsx` blocks to use `@/registry/preskok/ui/preskok-ui/sidebar` primitives.

Key replacements:

- Use `Sidebar`, `SidebarProvider`, `SidebarInset`, `SidebarTrigger`, `SidebarRail` from preskok-ui.
- Replace legacy groups/menus with:
  - Sections: `SidebarSection` (instead of SidebarGroup/Label/Content)
  - Items: `SidebarItem` + `SidebarLink` (instead of SidebarMenu\* primitives)
  - Collapsibles: `SidebarDisclosureGroup` + `SidebarDisclosure` + `SidebarDisclosureTrigger` + `SidebarDisclosurePanel` (instead of Collapsible + SidebarMenuSub\*)
- Header search: There is no `SidebarInput` in preskok-ui. Use `Input` and `Label` from `@/registry/preskok/ui/preskok-ui/field` to build the search input (see `examples/sidebar-preskok-demo.tsx`).

Active state:

- `isActive` → `isCurrent` on `SidebarItem`.

Notes:

- `variant="floating"` in legacy becomes `intent="float"` in preskok-ui.
- Minor spacing/styling changes are acceptable.
