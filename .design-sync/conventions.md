## Conventions

**No provider wrapper required.** Every component in this bundle renders correctly standalone — there is no root `ThemeProvider`/context you must wrap the app in. Fonts (Geist / Geist Mono) and all color tokens are shipped as static CSS (`fonts/`, `_ds_bundle.css`) and just work once `styles.css` is linked.

### Styling idiom: Tailwind v4 utilities over semantic CSS variables

This is a shadcn-style system: components are styled with **Tailwind utility classes**, but the color/spacing utilities resolve through the DS's own semantic CSS custom properties (never raw hex or arbitrary Tailwind palette colors like `bg-blue-500`). Build new layout and composition using this same vocabulary so it matches the shipped components:

| Utility | Use for |
|---|---|
| `bg-background` / `text-foreground` | page/app background and default text |
| `bg-card` / `text-card-foreground` | card surfaces |
| `bg-popover` / `text-popover-foreground` | popovers, menus, dropdowns |
| `bg-primary` / `text-primary-foreground` | primary actions (buttons, active states) |
| `bg-secondary` / `text-secondary-foreground` | secondary actions |
| `bg-muted` / `text-muted-foreground` | de-emphasized text, subtle backgrounds |
| `bg-accent` / `text-accent-foreground` | neutral interactive/hover surface (not a brand color) |
| `bg-destructive` / `text-destructive-foreground` | destructive actions ("danger" intent — reach it via `Button intent="danger"`/`Badge`, not a raw `bg-danger` utility, which isn't generated in this build) |
| `bg-success` / `bg-warning` (+ `-foreground`) | status/intent colors |
| `bg-sidebar*` / `bg-navbar*` | dedicated surface tokens for `Sidebar`/`Navbar` compositions |
| `border-border` / `ring-ring` / `bg-input` | form control borders, focus rings, input backgrounds |
| `rounded-md` / `rounded-lg` / `rounded-xl` | standard corner radii used throughout (buttons: `md`, cards/panels: `lg`–`xl`) |
| `shadow-sm` | the standard elevation for cards, dialogs, popovers |
| `font-sans` / `font-mono` | Geist / Geist Mono (already wired to the shipped `@font-face` rules) |

Never invent new hex colors or unrelated utility classes — every visual surface in the real components maps to one of the tokens above.

### Composition patterns worth knowing

- **Compound components are separate exports.** e.g. `Card`/`CardHeader`/`CardContent`/`CardFooter`, `Dialog`/`DialogHeader`/`DialogBody`/`DialogFooter`/`DialogClose`, `Sheet`/`Modal`/`Popover` + their `*Trigger`/`*Body`/`*Close` parts. Compose the full family together rather than reaching for just the root export.
- **Overlay components** (`Modal`, `Sheet`, `Drawer`, `Popover`, `Tooltip`, `Menu`, `CommandMenu`) are react-aria-components-based triggers with real open/close state — most accept `defaultOpen`/`isOpen` for a controlled open state. `ContextMenu` only opens from a real `onContextMenu` event (no forcing prop).
- **Icons** come from `lucide-react` throughout (`<SettingsIcon />`, `<PlusIcon />`, etc.) — pass them as children of `Button`, `MenuItem`, and similar slotted components rather than as a separate icon prop.
- **Charts** (`AreaChart`, `BarChart`, `LineChart`, `PieChart`) are self-contained recharts wrappers — pass `data` and column keys directly; don't mix them with raw `recharts` imports in the same tree. The lower-level `Chart` primitive is meant to be composed with raw `recharts` children (`XAxis`, `YAxis`, `CartesianGrid`, etc. imported directly from `"recharts"`), not the DS's own chart sub-parts.

### Where the truth lives

- `styles.css` — the one stylesheet to link; it `@import`s fonts and the compiled component CSS.
- `components/<group>/<Name>/<Name>.d.ts` — the real prop types for `<Name>`.
- `components/<group>/<Name>/<Name>.prompt.md` — usage notes and examples per component.

### Minimal example

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from "preskok"
import { DownloadIcon } from "lucide-react"

function Example() {
  return (
    <Card className="w-sm rounded-xl border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Export report</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button intent="primary">
          <DownloadIcon />
          Download CSV
        </Button>
        <Button intent="outline">Cancel</Button>
      </CardContent>
    </Card>
  )
}
```
