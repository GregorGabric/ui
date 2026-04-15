import type { Registry } from "@preskok-org/ui/registry"

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
    name: "range-calendar-controlled-preskok-demo",
    type: "registry:example",
    registryDependencies: ["range-calendar", "calendar"],
    files: [
      {
        path: "examples/range-calendar-controlled-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "range-calendar-disabled-preskok-demo",
    type: "registry:example",
    registryDependencies: ["range-calendar", "calendar"],
    files: [
      {
        path: "examples/range-calendar-disabled-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "range-calendar-validation-preskok-demo",
    type: "registry:example",
    registryDependencies: ["range-calendar", "calendar"],
    files: [
      {
        path: "examples/range-calendar-validation-preskok-demo.tsx",
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
    name: "time-field-hour-cycle-preskok-demo",
    type: "registry:example",
    registryDependencies: ["time-field", "date-field", "field", "switch"],
    files: [
      {
        path: "examples/time-field-hour-cycle-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "time-field-validation-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "time-field",
      "date-field",
      "field",
      "form",
      "button",
    ],
    files: [
      {
        path: "examples/time-field-validation-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
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
    name: "link-button-preskok-demo",
    type: "registry:example",
    registryDependencies: ["link", "button"],
    files: [
      {
        path: "examples/link-button-preskok-demo.tsx",
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
    name: "calendar-with-range-preskok-demo",
    type: "registry:example",
    registryDependencies: ["range-calendar", "calendar"],
    files: [
      {
        path: "examples/calendar-with-range-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-with-disabled-dates-preskok-demo",
    type: "registry:example",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "examples/calendar-with-disabled-dates-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-min-max-preskok-demo",
    type: "registry:example",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "examples/calendar-min-max-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-multiple-months-preskok-demo",
    type: "registry:example",
    registryDependencies: ["range-calendar", "calendar"],
    files: [
      {
        path: "examples/calendar-multiple-months-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-controlled-preskok-demo",
    type: "registry:example",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "examples/calendar-controlled-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-controlled-month-year-preskok-demo",
    type: "registry:example",
    registryDependencies: ["calendar", "button"],
    files: [
      {
        path: "examples/calendar-controlled-month-year-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "calendar-disabled-preskok-demo",
    type: "registry:example",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "examples/calendar-disabled-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-validation-preskok-demo",
    type: "registry:example",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "examples/calendar-validation-preskok-demo.tsx",
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
    name: "async-image-demo",
    type: "registry:example",
    registryDependencies: ["async-image"],
    files: [
      {
        path: "examples/async-image-demo.tsx",
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
    name: "date-picker-controlled-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "date-picker",
      "calendar",
      "popover",
      "modal",
      "field",
    ],
    files: [
      {
        path: "examples/date-picker-controlled-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "date-picker-disabled-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "date-picker",
      "calendar",
      "popover",
      "modal",
      "field",
    ],
    files: [
      {
        path: "examples/date-picker-disabled-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "date-picker-validation-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "date-picker",
      "calendar",
      "popover",
      "modal",
      "field",
      "form",
      "button",
    ],
    files: [
      {
        path: "examples/date-picker-validation-preskok-demo.tsx",
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
    name: "date-range-picker-controlled-preskok-demo",
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
        path: "examples/date-range-picker-controlled-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "date-range-picker-disabled-preskok-demo",
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
        path: "examples/date-range-picker-disabled-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
    dependencies: ["@internationalized/date"],
  },
  {
    name: "date-range-picker-validation-preskok-demo",
    type: "registry:example",
    registryDependencies: [
      "date-range-picker",
      "calendar",
      "popover",
      "modal",
      "field",
      "form",
      "button",
    ],
    files: [
      {
        path: "examples/date-range-picker-validation-preskok-demo.tsx",
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
    name: "slider-demo",
    type: "registry:example",
    registryDependencies: ["slider"],
    files: [
      {
        path: "examples/slider-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "switch-demo",
    type: "registry:example",
    registryDependencies: ["switch"],
    files: [
      {
        path: "examples/switch-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-demo",
    type: "registry:example",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "examples/toggle-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "select-demo",
    type: "registry:example",
    registryDependencies: ["select"],
    files: [
      {
        path: "examples/select-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-demo",
    type: "registry:example",
    registryDependencies: ["textarea"],
    files: [
      {
        path: "examples/textarea-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "radio-group-demo",
    type: "registry:example",
    registryDependencies: ["radio"],
    files: [
      {
        path: "examples/radio-group-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "radio-validation-demo",
    type: "registry:example",
    registryDependencies: ["radio", "field", "button"],
    files: [
      {
        path: "examples/radio-validation-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "radio-controlled-demo",
    type: "registry:example",
    registryDependencies: ["radio", "field"],
    files: [
      {
        path: "examples/radio-controlled-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "separator-demo",
    type: "registry:example",
    registryDependencies: ["separator"],
    files: [
      {
        path: "examples/separator-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "table-demo",
    type: "registry:example",
    registryDependencies: ["table"],
    files: [
      {
        path: "examples/table-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "table-demo-sort",
    type: "registry:example",
    registryDependencies: ["table"],
    files: [
      {
        path: "examples/table-demo-sort.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "table-demo-drag",
    type: "registry:example",
    registryDependencies: ["table"],
    files: [
      {
        path: "examples/table-demo-drag.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "table-demo-resizable",
    type: "registry:example",
    registryDependencies: ["table"],
    files: [
      {
        path: "examples/table-demo-resizable.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tabs-demo",
    type: "registry:example",
    registryDependencies: ["tabs"],
    files: [
      {
        path: "examples/tabs-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "pagination-demo",
    type: "registry:example",
    registryDependencies: ["pagination"],
    files: [
      {
        path: "examples/pagination-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-area-demo",
    type: "registry:example",
    registryDependencies: ["scroll-area"],
    files: [
      {
        path: "examples/scroll-area-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-demo",
    type: "registry:example",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "examples/toggle-group-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "popover-demo",
    type: "registry:example",
    registryDependencies: ["popover", "button"],
    files: [
      {
        path: "examples/popover-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tooltip-demo",
    type: "registry:example",
    registryDependencies: ["tooltip", "button"],
    files: [
      {
        path: "examples/tooltip-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sheet-demo",
    type: "registry:example",
    registryDependencies: ["sheet", "button", "text-field"],
    files: [
      {
        path: "examples/sheet-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "progress-demo",
    type: "registry:example",
    registryDependencies: ["meter", "progress-bar"],
    files: [
      {
        path: "examples/progress-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "skeleton-demo",
    type: "registry:example",
    registryDependencies: ["skeleton"],
    files: [
      {
        path: "examples/skeleton-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sonner-demo",
    type: "registry:example",
    registryDependencies: ["toast", "button"],
    files: [
      {
        path: "examples/sonner-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-demo",
    type: "registry:example",
    registryDependencies: ["breadcrumbs"],
    files: [
      {
        path: "examples/breadcrumb-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-demo",
    type: "registry:example",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "examples/input-otp-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-demo",
    type: "registry:example",
    registryDependencies: ["carousel", "card"],
    files: [
      {
        path: "examples/carousel-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "drawer-demo",
    type: "registry:example",
    registryDependencies: ["drawer", "button", "text-field"],
    files: [
      {
        path: "examples/drawer-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-demo",
    type: "registry:example",
    registryDependencies: ["combo-box"],
    files: [
      {
        path: "examples/combobox-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-icon",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-icon.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sheet-side",
    type: "registry:example",
    registryDependencies: ["sheet", "button"],
    files: [
      {
        path: "examples/sheet-side.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "mode-toggle",
    type: "registry:example",
    registryDependencies: ["menu", "button"],
    dependencies: ["next-themes"],
    files: [
      {
        path: "examples/mode-toggle.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "resizable-demo",
    type: "registry:example",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "examples/resizable-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "resizable-demo-with-handle",
    type: "registry:example",
    registryDependencies: ["card"],
    files: [
      {
        path: "examples/resizable-demo-with-handle.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-demo",
    type: "registry:example",
    registryDependencies: ["field"],
    files: [
      {
        path: "example/field-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "menu-preskok-demo",
    type: "registry:example",
    registryDependencies: ["menu", "button"],
    files: [
      {
        path: "examples/menu-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "menu-submenu-demo",
    type: "registry:example",
    registryDependencies: ["menu", "button"],
    files: [
      {
        path: "examples/menu-submenu-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "menu-description-demo",
    type: "registry:example",
    registryDependencies: ["menu", "button"],
    files: [
      {
        path: "examples/menu-description-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "menu-multiple-demo",
    type: "registry:example",
    registryDependencies: ["menu", "button"],
    files: [
      {
        path: "examples/menu-multiple-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "text-basic-demo",
    type: "registry:example",
    registryDependencies: ["text"],
    files: [
      {
        path: "example/text-basic-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "text-preskok-demo",
    type: "registry:example",
    registryDependencies: ["text"],
    files: [
      {
        path: "examples/text-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toolbar-preskok-demo",
    type: "registry:example",
    registryDependencies: ["toolbar"],
    files: [
      {
        path: "examples/toolbar-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-basic-demo",
    type: "registry:example",
    registryDependencies: ["input"],
    files: [
      {
        path: "example/input-basic-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-controlled-demo",
    type: "registry:example",
    registryDependencies: ["input"],
    files: [
      {
        path: "example/input-controlled-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-demo",
    type: "registry:example",
    registryDependencies: ["input"],
    files: [
      {
        path: "example/input-group-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-label-description-demo",
    type: "registry:example",
    registryDependencies: ["input", "field"],
    files: [
      {
        path: "example/input-label-description-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-text-field-demo",
    type: "registry:example",
    registryDependencies: ["input", "text-field"],
    files: [
      {
        path: "example/input-text-field-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-preskok-demo",
    type: "registry:example",
    registryDependencies: ["input", "button", "loader"],
    files: [
      {
        path: "examples/input-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-demo",
    type: "registry:example",
    registryDependencies: ["button-group", "button"],
    files: [
      {
        path: "example/button-group-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-orientation-demo",
    type: "registry:example",
    registryDependencies: ["button-group", "button"],
    files: [
      {
        path: "example/button-group-orientation-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-with-menu-demo",
    type: "registry:example",
    registryDependencies: ["button-group", "button", "menu"],
    files: [
      {
        path: "example/button-group-with-menu-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-with-text-demo",
    type: "registry:example",
    registryDependencies: ["button-group", "button"],
    files: [
      {
        path: "example/button-group-with-text-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "editor-demo",
    type: "registry:example",
    registryDependencies: ["editor"],
    files: [
      {
        path: "example/editor-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-preskok-demo",
    type: "registry:example",
    registryDependencies: ["button-group", "button"],
    files: [
      {
        path: "examples/button-group-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "meter-preskok-demo",
    type: "registry:example",
    registryDependencies: ["meter"],
    files: [
      {
        path: "examples/meter-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "command-preskok-demo",
    type: "registry:example",
    registryDependencies: ["command"],
    files: [
      {
        path: "examples/command-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "preskok-icon-preskok-demo",
    type: "registry:example",
    registryDependencies: ["preskok-icon"],
    files: [
      {
        path: "examples/preskok-icon-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "preskok-auth-button-preskok-demo",
    type: "registry:example",
    registryDependencies: ["preskok-auth-button", "button"],
    files: [
      {
        path: "examples/preskok-auth-button-preskok-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]
