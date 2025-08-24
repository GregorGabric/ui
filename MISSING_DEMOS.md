# Missing Demo Components

This document lists all the demo components that are referenced in the documentation but are missing from the `apps/preskok/registry/preskok/examples/` folder.

## Critical Missing Demos

### Navigation

- [ ] `tabs-demo.tsx` - Referenced in `docs/navigation/tabs.mdx`
- [ ] `pagination-demo.tsx` - Referenced in `docs/navigation/pagination.mdx`

### Layout Components

- [ ] `separator-demo.tsx` - Referenced in `docs/layout/separator.mdx`
- [ ] `scroll-area-demo.tsx` - Referenced in `docs/layout/scroll-area.mdx`
- [ ] `table-demo.tsx` - Referenced in `docs/layout/table.mdx`
- [ ] `toolbar-demo.tsx` - Referenced in `docs/layout/toolbar.mdx`

### Text Inputs

- [ ] `textarea-demo.tsx` - Referenced in `docs/text/textarea.mdx`

### Choice Pickers

- [ ] `select-demo.tsx` - Referenced in `docs/choice/select.mdx`
- [ ] `radio-group-demo.tsx` - Referenced in `docs/choice/radio.mdx`

### Toggles & Controls

- [ ] `switch-demo.tsx` - Referenced in `docs/toggles/switch.mdx`
- [ ] `toggle-demo.tsx` - Referenced in `docs/buttons/toggle.mdx`
- [ ] `toggle-group-demo.tsx` - Referenced in `docs/buttons/toggle-group.mdx`

### Numeric Inputs

- [ ] `slider-demo.tsx` - Referenced in `docs/numeric/slider.mdx`

### Overlay Components

- [ ] `popover-demo.tsx` - Referenced in `docs/overlay/popover.mdx`
- [ ] `tooltip-demo.tsx` - Referenced in `docs/overlay/tooltip.mdx`
- [ ] `sheet-demo.tsx` - Referenced in `docs/overlay/sheet.mdx`

### Feedback Components

- [ ] `progress-demo.tsx` - Referenced in `docs/feedback/meter.mdx`
- [ ] `skeleton-demo.tsx` - Referenced in `docs/feedback/skeleton.mdx`
- [ ] `sonner-demo.tsx` - Referenced in `docs/feedback/toast.mdx`

## Changelog Referenced Demos

These are referenced in the changelog but may be legacy or different variants:

- [ ] `breadcrumb-demo.tsx` - Referenced in `docs/(root)/changelog.mdx`
- [ ] `input-otp-demo.tsx` - Referenced in `docs/(root)/changelog.mdx`
- [ ] `carousel-demo.tsx` - Referenced in `docs/(root)/changelog.mdx`
- [ ] `drawer-demo.tsx` - Referenced in `docs/(root)/changelog.mdx`
- [ ] `resizable-demo-with-handle.tsx` - Referenced in `docs/(root)/changelog.mdx`
- [ ] `combobox-demo.tsx` - Referenced in `docs/(root)/changelog.mdx`
- [ ] `button-icon.tsx` - Referenced in `docs/(root)/changelog.mdx`
- [ ] `sheet-side.tsx` - Referenced in `docs/(root)/changelog.mdx`

## Dark Mode Demo

- [ ] `mode-toggle.tsx` - Referenced in `docs/dark-mode/next.mdx`

## Notes

### Existing vs Missing

- **Total docs with ComponentPreview**: ~95 references
- **Existing demo files**: ~66 files
- **Missing demos**: ~25-30 files

### Priority Order

1. **High Priority**: Core UI components (slider, switch, toggle, select, textarea)
2. **Medium Priority**: Layout components (separator, table, tabs, pagination)
3. **Low Priority**: Changelog legacy demos and variants

### Naming Convention

Most demos follow the pattern: `{component-name}-demo.tsx` or `{component-name}-preskok-demo.tsx`

### Implementation Notes

- All demos should be client components (`"use client"`)
- Follow existing patterns in the examples folder
- Use proper TypeScript typing
- Include meaningful example data
- Follow the user's coding rules (interfaces over types, etc.)
