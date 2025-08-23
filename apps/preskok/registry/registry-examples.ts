import { type Registry } from "@preskok-org/ui/registry"

export const examples: Registry["items"] = [
  {
    name: "tag-group-preskok-demo",
    type: "registry:example",
    registryDependencies: ["tag-group"],
    files: [
      {
        path: "examples/tag-group-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tag-field-preskok-demo",
    type: "registry:example",
    registryDependencies: ["tag-field", "tag-group", "field"],
    files: [
      {
        path: "examples/tag-field-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sidebar-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "sidebar",
      "button",
      "disclosure",
      "link",
      "separator",
      "sheet",
      "tooltip",
    ],
    files: [
      {
        path: "examples/sidebar-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    meta: {
      iframeHeight: "640px",
      container:
        "w-full bg-surface overflow-hidden min-h-[640px] flex items-stretch justify-stretch p-0 min-w-0",
      mobile: "component",
    },
  },
  {
    name: "number-field-preskok-demo",
    type: "registry:example",
    registryDependencies: ["number-field", "button", "field"],
    files: [
      {
        path: "examples/number-field-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "number-format-preskok-demo",
    type: "registry:example",
    registryDependencies: ["number-format"],
    files: [
      {
        path: "examples/number-format-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "pie-chart-preskok-demo",
    type: "registry:example",
    registryDependencies: ["pie-chart", "chart"],
    files: [
      {
        path: "examples/pie-chart-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "progress-bar-preskok-demo",
    type: "registry:example",
    registryDependencies: ["progress-bar"],
    files: [
      {
        path: "examples/progress-bar-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "progress-circle-preskok-demo",
    type: "registry:example",
    registryDependencies: ["progress-circle", "progress-bar"],
    files: [
      {
        path: "examples/progress-circle-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "range-calendar-preskok-demo",
    type: "registry:example",
    registryDependencies: ["range-calendar", "calendar"],
    files: [
      {
        path: "examples/range-calendar-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "search-field-preskok-demo",
    type: "registry:example",
    registryDependencies: ["search-field", "field", "loader"],
    files: [
      {
        path: "examples/search-field-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "navbar-preskok-demo",
    type: "registry:example",
    registryDependencies: ["navbar", "button", "link", "separator"],
    files: [
      {
        path: "examples/navbar-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tracker-preskok-demo",
    type: "registry:example",
    registryDependencies: ["tracker", "tooltip"],
    files: [
      {
        path: "examples/tracker-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tree-preskok-demo",
    type: "registry:example",
    registryDependencies: ["tree", "checkbox"],
    files: [
      {
        path: "examples/tree-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "text-field-preskok-demo",
    type: "registry:example",
    registryDependencies: ["text-field", "field", "loader"],
    files: [
      {
        path: "examples/text-field-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "time-field-preskok-demo",
    type: "registry:example",
    registryDependencies: ["time-field", "field"],
    files: [
      {
        path: "examples/time-field-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "file-trigger-preskok-demo",
    type: "registry:example",
    registryDependencies: ["file-trigger", "button", "loader"],
    files: [
      {
        path: "examples/file-trigger-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "form-preskok-demo",
    type: "registry:example",
    registryDependencies: ["form", "field", "text-field", "button"],
    files: [
      {
        path: "examples/form-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "grid-list-preskok-demo",
    type: "registry:example",
    registryDependencies: ["grid-list", "checkbox"],
    files: [
      {
        path: "examples/grid-list-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "heading-preskok-demo",
    type: "registry:example",
    registryDependencies: ["heading"],
    files: [
      {
        path: "examples/heading-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-preskok-demo",
    type: "registry:example",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "examples/input-otp-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "keyboard-preskok-demo",
    type: "registry:example",
    registryDependencies: ["keyboard"],
    files: [
      {
        path: "examples/keyboard-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "line-chart-preskok-demo",
    type: "registry:example",
    registryDependencies: ["line-chart", "chart", "card"],
    files: [
      {
        path: "examples/line-chart-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "link-preskok-demo",
    type: "registry:example",
    registryDependencies: ["link"],
    files: [
      {
        path: "examples/link-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "list-box-preskok-demo",
    type: "registry:example",
    registryDependencies: ["list-box", "dropdown"],
    files: [
      {
        path: "examples/list-box-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "loader-preskok-demo",
    type: "registry:example",
    registryDependencies: ["loader"],
    files: [
      {
        path: "examples/loader-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/chart-bar-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo-grid",
    type: "registry:example",
    files: [
      {
        path: "examples/chart-bar-demo-grid.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo-axis",
    type: "registry:example",
    files: [
      {
        path: "examples/chart-bar-demo-axis.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo-tooltip",
    type: "registry:example",
    files: [
      {
        path: "examples/chart-bar-demo-tooltip.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo-legend",
    type: "registry:example",
    files: [
      {
        path: "examples/chart-bar-demo-legend.tsx",
        type: "registry:example",
      },
    ],
  },

  // Preskok UI Examples
  {
    name: "bar-list-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/bar-list-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumbs-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/breadcrumbs-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-preskok-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/button-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-preskok-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/calendar-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "card-preskok-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/card-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "area-chart-preskok-demo",
    type: "registry:example",
    registryDependencies: ["area-chart"],
    files: [
      {
        path: "examples/area-chart-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "avatar-preskok-demo",
    type: "registry:example",
    registryDependencies: ["avatar"],
    files: [
      {
        path: "examples/avatar-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "badge-preskok-demo",
    type: "registry:example",
    registryDependencies: ["badge"],
    files: [
      {
        path: "examples/badge-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "bar-chart-preskok-demo",
    type: "registry:example",
    registryDependencies: ["bar-chart"],
    files: [
      {
        path: "examples/bar-chart-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-preskok-demo",
    type: "registry:example",
    registryDependencies: ["carousel", "card"],
    files: [
      {
        path: "examples/carousel-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-preskok-demo",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "examples/chart-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-preskok-demo",
    type: "registry:example",
    registryDependencies: ["checkbox", "field"],
    files: [
      {
        path: "examples/checkbox-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-single-preskok-demo",
    type: "registry:example",
    registryDependencies: ["checkbox"],
    files: [
      {
        path: "examples/checkbox-single-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "choicebox-preskok-demo",
    type: "registry:example",
    registryDependencies: ["choicebox", "checkbox"],
    files: [
      {
        path: "examples/choicebox-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "color-area-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "color-area",
      "color-slider",
      "color-field",
      "color-thumb",
    ],
    files: [
      {
        path: "examples/color-area-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "color-field-preskok-demo",
    type: "registry:example",
    registryDependencies: ["color-field", "color-picker", "field", "loader"],
    files: [
      {
        path: "examples/color-field-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "color-picker-preskok-demo",
    type: "registry:example",
    registryDependencies: ["color-picker"],
    files: [
      {
        path: "examples/color-picker-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "color-slider-preskok-demo",
    type: "registry:example",
    registryDependencies: ["color-picker", "color-slider"],
    files: [
      {
        path: "examples/color-slider-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "color-swatch-picker-preskok-demo",
    type: "registry:example",
    registryDependencies: ["color-swatch-picker", "color-swatch"],
    files: [
      {
        path: "examples/color-swatch-picker-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "color-swatch-preskok-demo",
    type: "registry:example",
    registryDependencies: ["color-swatch"],
    files: [
      {
        path: "examples/color-swatch-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "color-thumb-preskok-demo",
    type: "registry:example",
    registryDependencies: ["color-slider", "color-thumb"],
    files: [
      {
        path: "examples/color-thumb-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "color-wheel-preskok-demo",
    type: "registry:example",
    registryDependencies: ["color-wheel"],
    files: [
      {
        path: "examples/color-wheel-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combo-box-preskok-demo",
    type: "registry:example",
    registryDependencies: ["combo-box"],
    files: [
      {
        path: "examples/combo-box-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "command-menu-preskok-demo",
    type: "registry:example",
    registryDependencies: ["command-menu"],
    files: [
      {
        path: "examples/command-menu-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "container-preskok-demo",
    type: "registry:example",
    registryDependencies: ["container"],
    files: [
      {
        path: "examples/container-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "context-menu-preskok-demo",
    type: "registry:example",
    registryDependencies: ["context-menu"],
    files: [
      {
        path: "examples/context-menu-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "date-field-demo",
    type: "registry:example",
    registryDependencies: ["date-field"],
    files: [
      {
        path: "examples/date-field-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "date-picker-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "date-picker",
      "calendar",
      "popover",
      "modal",
      "button",
      "field",
    ],
    files: [
      {
        path: "examples/date-picker-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "date-range-picker-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "date-range-picker",
      "calendar",
      "popover",
      "modal",
      "field",
    ],
    files: [
      {
        path: "examples/date-range-picker-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "description-list-preskok-demo",
    type: "registry:example",
    registryDependencies: ["description-list"],
    files: [
      {
        path: "examples/description-list-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dialog-preskok-demo",
    type: "registry:example",
    registryDependencies: ["dialog", "button"],
    files: [
      {
        path: "examples/dialog-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "modal-preskok-demo",
    type: "registry:example",
    registryDependencies: ["modal", "button", "text-field"],
    files: [
      {
        path: "examples/modal-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "disclosure-preskok-demo",
    type: "registry:example",
    registryDependencies: ["disclosure"],
    files: [
      {
        path: "examples/disclosure-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "drawer-preskok-demo",
    type: "registry:example",
    registryDependencies: ["drawer", "button"],
    files: [
      {
        path: "examples/drawer-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "drop-zone-preskok-demo",
    type: "registry:example",
    registryDependencies: ["drop-zone"],
    files: [
      {
        path: "examples/drop-zone-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "multiple-select-preskok-demo",
    type: "registry:example",
    registryDependencies: ["multiple-select"],
    files: [
      {
        path: "examples/multiple-select-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "multi-select-preskok-demo",
    type: "registry:example",
    registryDependencies: ["multiple-select"],
    files: [
      {
        path: "examples/multi-select-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "show-more-preskok-demo",
    type: "registry:example",
    registryDependencies: ["show-more"],
    files: [
      {
        path: "examples/show-more-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-preskok-demo",
    type: "registry:example",
    registryDependencies: ["menu", "dropdown"],
    files: [
      {
        path: "examples/dropdown-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-preskok-demo",
    type: "registry:example",
    registryDependencies: ["field"],
    files: [
      {
        path: "examples/field-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]
