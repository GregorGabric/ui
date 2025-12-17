import { type Registry } from "@preskok-org/ui/registry"

export const preskokUi: Registry["items"] = [
  // ===== FOUNDATION COMPONENTS (No Internal Dependencies) =====
  {
    name: "avatar",
    type: "registry:ui",
    description: "A flexible avatar component with initials and image support",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/avatar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "badge",
    type: "registry:ui",
    description: "A versatile badge component with multiple intents and styles",
    dependencies: ["tailwind-variants"],
    files: [
      {
        path: "ui/preskok-ui/badge.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    description:
      "A comprehensive button component with multiple variants and sizes",
    dependencies: ["react-aria-components", "tailwind-variants"],
    registryDependencies: ["loader"],
    files: [
      {
        path: "ui/preskok-ui/button.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "button-group",
    type: "registry:ui",
    description:
      "A component for grouping related buttons with horizontal or vertical orientation",
    dependencies: ["tailwind-merge", "tailwind-variants"],
    files: [
      {
        path: "ui/preskok-ui/button-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "card",
    type: "registry:ui",
    description:
      "A flexible card component with header, content, and footer sections",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/card.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "container",
    type: "registry:ui",
    description: "A responsive container component with optional constraints",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/container.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "heading",
    type: "registry:ui",
    description: "A semantic heading component with configurable levels",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/heading.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "keyboard",
    type: "registry:ui",
    description:
      "A component for displaying keyboard shortcuts and key combinations",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/keyboard.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "link",
    type: "registry:ui",
    description: "An accessible link component with multiple styling options",
    dependencies: ["react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/link.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "loader",
    type: "registry:ui",
    description: "A collection of loading indicators with multiple variants",
    dependencies: ["tailwind-variants"],
    files: [
      {
        path: "ui/preskok-ui/loader.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "note",
    type: "registry:ui",
    description:
      "A note component for displaying contextual information with different intents",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/note.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    description:
      "A separator component for dividing content horizontally or vertically",
    dependencies: ["react-aria-components", "tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/separator.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    description: "A skeleton loading component with soft variant option",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/skeleton.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "text",
    type: "registry:ui",
    description: "A simple typography component for consistent text styling",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/text.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    description: "An accessible switch component for boolean inputs",
    dependencies: ["react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/switch.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    description: "A tooltip component with arrow and multiple styling options",
    dependencies: ["react-aria-components", "tailwind-variants"],
    files: [
      {
        path: "ui/preskok-ui/tooltip.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== CORE FORM COMPONENTS =====
  {
    name: "field",
    type: "registry:ui",
    description:
      "Core field components including Input, Label, Description, and FieldError",
    dependencies: ["react-aria-components", "tailwind-variants"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "form",
    type: "registry:ui",
    description: "A form wrapper component with accessibility features",
    dependencies: ["react-aria-components"],
    files: [
      {
        path: "ui/preskok-ui/form.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== FORM & INPUT COMPONENTS =====
  {
    name: "checkbox",
    type: "registry:ui",
    description: "Checkbox and CheckboxGroup components with field integration",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/checkbox.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    description:
      "Input and InputGroup components for text input with icons, loaders, and buttons",
    dependencies: ["react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/input.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input-otp",
    type: "registry:ui",
    description: "One-time password input component with customizable slots",
    dependencies: ["input-otp", "tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/input-otp.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "number-field",
    type: "registry:ui",
    description: "A number input field with stepper buttons and validation",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["button", "field", "use-media-query", "primitive"],

    files: [
      {
        path: "ui/preskok-ui/number-field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "radio",
    type: "registry:ui",
    description: "Radio and RadioGroup components with field integration",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/radio.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "search-field",
    type: "registry:ui",
    description:
      "A search input field with loading state and clear functionality",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["field", "loader", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/search-field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "slider",
    type: "registry:ui",
    description:
      "A range slider component with tooltip and inline output options",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "tooltip", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/slider.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "text-field",
    type: "registry:ui",
    description:
      "A comprehensive text input field with prefix, suffix, and password reveal",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["field", "loader", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/text-field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "textarea",
    type: "registry:ui",
    description: "A multi-line text input component with field integration",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/textarea.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "time-field",
    type: "registry:ui",
    description: "A time input field with segmented time entry",
    dependencies: ["@internationalized/date", "react-aria-components"],
    registryDependencies: ["field", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/time-field.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== OVERLAY & DIALOG COMPONENTS =====
  {
    name: "popover",
    type: "registry:ui",
    description: "A popover component for displaying content in an overlay",
    dependencies: ["react-aria-components"],
    registryDependencies: ["dialog", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/popover.tsx",
        type: "registry:ui",
      },
    ],
  },

  {
    name: "dialog",
    type: "registry:ui",
    description:
      "A comprehensive dialog component with header, body, and footer sections",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["button", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/dialog.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "modal",
    type: "registry:ui",
    description: "A modal dialog component with overlay and blur effects",
    dependencies: ["react-aria-components", "tailwind-variants"],
    registryDependencies: ["dialog", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/modal.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "drawer",
    type: "registry:ui",
    description: "A drawer component that slides in from different sides",
    dependencies: ["react-aria-components", "tailwind-merge"],
    registryDependencies: ["button", "dialog"],
    files: [
      {
        path: "ui/preskok-ui/drawer.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "sheet",
    type: "registry:ui",
    description:
      "A sheet component that slides in from different sides with blur effects",
    dependencies: ["react-aria-components", "tailwind-variants"],
    registryDependencies: ["dialog"],
    files: [
      {
        path: "ui/preskok-ui/sheet.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== DROPDOWN & MENU COMPONENTS =====
  {
    name: "dropdown",
    type: "registry:ui",
    description: "Core dropdown components used by other menu-like components",
    dependencies: ["react-aria-components", "tailwind-merge"],
    registryDependencies: ["keyboard"],
    files: [
      {
        path: "ui/preskok-ui/dropdown.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "menu",
    type: "registry:ui",
    description: "A comprehensive menu component with submenus and sections",
    dependencies: [
      "lucide-react",
      "react-aria-components",
      "tailwind-variants",
    ],
    registryDependencies: ["button", "dropdown", "popover", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/menu.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "context-menu",
    type: "registry:ui",
    description: "A context menu component triggered by right-click",
    dependencies: ["react-aria-components"],
    registryDependencies: ["menu"],
    files: [
      {
        path: "ui/preskok-ui/context-menu.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== SELECT COMPONENTS =====
  {
    name: "list-box",
    type: "registry:ui",
    description: "A list box component for displaying selectable options",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/list-box.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    description:
      "A select component with searchable options and custom styling",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["primitive", "field", "popover", "dropdown"],
    files: [
      {
        path: "ui/preskok-ui/select.tsx",
        type: "registry:ui",
      },
    ],
  },

  {
    name: "combo-box",
    type: "registry:ui",
    description: "A combo box component with filtering and custom input",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "list-box", "popover", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/combo-box.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== LAYOUT & NAVIGATION COMPONENTS =====
  {
    name: "breadcrumbs",
    type: "registry:ui",
    description:
      "A breadcrumb navigation component with customizable separators",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["link", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/breadcrumbs.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "description-list",
    type: "registry:ui",
    description: "A description list component for key-value pairs",
    dependencies: ["tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/description-list.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "disclosure",
    type: "registry:ui",
    description: "Disclosure and accordion components for collapsible content",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["button", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/disclosure-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "grid-list",
    type: "registry:ui",
    description: "A grid list component for displaying items in a grid layout",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/grid-list.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    description: "A tabs component with accessible tab navigation",
    dependencies: ["react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/tabs.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tree",
    type: "registry:ui",
    description: "A tree component for hierarchical data display",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["checkbox", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/tree.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== TEST COMPONENTS =====
  {
    name: "awesome-card",
    type: "registry:ui",
    description:
      "A test card component with animations, variants and gradient backgrounds for testing the registry system",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "ui/awesome-card.tsx",
        type: "registry:ui",
      },
    ],
  },

  {
    name: "video-player",
    type: "registry:ui",
    description: "A video player component that allows you to play videos",
    files: [
      {
        path: "ui/video-player.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "file-upload",
    type: "registry:ui",
    description: "A file upload component that allows you to upload files",
    files: [
      {
        path: "ui/file-upload.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== DATE & TIME COMPONENTS =====
  {
    name: "calendar",
    type: "registry:ui",
    description: "A calendar component with single and range selection support",
    dependencies: [
      "@internationalized/date",
      "lucide-react",
      "react-aria-components",
    ],
    registryDependencies: ["button", "select"],
    files: [
      {
        path: "ui/preskok-ui/calendar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "date-field",
    type: "registry:ui",
    description:
      "A date field component with input segments for date and time entry",
    dependencies: ["@internationalized/date", "react-aria-components"],
    registryDependencies: ["field", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/date-field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "date-picker",
    type: "registry:ui",
    description:
      "A date picker component with calendar popup for date selection",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: [
      "calendar",
      "popover",
      "primitive",
      "modal",
      "range-calendar",
      "date-field",
      "field",
      "input",
      "use-media-query",
    ],
    files: [
      {
        path: "ui/preskok-ui/date-picker.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "date-range-picker",
    type: "registry:ui",
    description: "A date range picker component with calendar popup",
    dependencies: ["@internationalized/date", "react-aria-components"],
    registryDependencies: [
      "date-picker",
      "field",
      "input",
      "date-field",
      "primitive",
    ],
    files: [
      {
        path: "ui/preskok-ui/date-range-picker.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "range-calendar",
    type: "registry:ui",
    description: "A calendar component for selecting date ranges",
    dependencies: ["@internationalized/date", "react-aria-components"],
    registryDependencies: ["calendar"],
    files: [
      {
        path: "ui/preskok-ui/range-calendar.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== ADVANCED FORM COMPONENTS =====
  {
    name: "tag-group",
    type: "registry:ui",
    description: "A tag group component for displaying and managing tags",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/tag-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "multiselect",
    type: "registry:ui",
    description: "A multi-select component built on base-ui combobox component",
    dependencies: [
      "@base-ui-components/react",
      "class-variance-authority",
      "lucide-react",
    ],
    registryDependencies: [
      "button",
      "loader",
      "primitive",
      "badge",
      "use-controllable-state",
    ],
    files: [
      {
        path: "ui/preskok-ui/multiselect/combobox-base.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/preskok-ui/multiselect/multiselect.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "multiple-select",
    type: "registry:ui",
    description: "A multiple select component with tag-based selection",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: [
      "dropdown",
      "field",
      "popover",
      "tag-group",
      "primitive",
    ],
    files: [
      {
        path: "ui/preskok-ui/multiple-select.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tag-field",
    type: "registry:ui",
    description: "A tag input field for adding and removing tags",
    dependencies: ["react-aria-components"],
    registryDependencies: ["field", "tag-group"],
    files: [
      {
        path: "ui/preskok-ui/tag-field.tsx",
        type: "registry:ui",
      },
    ],
  },

  {
    name: "toggle",
    type: "registry:ui",
    description: "A toggle button component with multiple variants",
    dependencies: ["react-aria-components", "tailwind-variants"],
    files: [
      {
        path: "ui/preskok-ui/toggle.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toggle-group",
    type: "registry:ui",
    description: "A toggle group component for single or multiple selection",
    dependencies: ["react-aria-components", "tailwind-variants"],
    registryDependencies: ["toggle", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/toggle-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "choice-box",
    type: "registry:ui",
    description: "A choice box component for selecting from a grid of options",
    dependencies: [
      "lucide-react",
      "react-aria-components",
      "tailwind-merge",
      "tailwind-variants",
    ],
    registryDependencies: ["checkbox", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/choice-box.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "carousel",
    type: "registry:ui",
    description: "A carousel component with navigation and pagination",
    dependencies: ["embla-carousel-react", "lucide-react"],
    registryDependencies: ["button", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/carousel.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== MEDIA & BRAND COMPONENTS =====
  {
    name: "preskok-icon",
    type: "registry:ui",
    description: "The official Preskok brand icon component",
    files: [
      {
        path: "ui/preskok-ui/preskok-icon.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "preskok-auth-button",
    type: "registry:ui",
    description:
      "A branded authentication button component for Preskok integration",
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/preskok-ui/preskok-auth-button.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== ADVANCED NAVIGATION & LAYOUT =====
  {
    name: "navbar",
    type: "registry:ui",
    description: "A comprehensive navigation bar with responsive design",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["button", "link", "separator", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/navbar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "sidebar",
    type: "registry:ui",
    description: "A comprehensive sidebar component with collapsible sections",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: [
      "button",
      "disclosure",
      "link",
      "sheet",
      "tooltip",
      "primitive",
    ],
    files: [
      {
        path: "ui/preskok-ui/sidebar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "pagination",
    type: "registry:ui",
    description: "A pagination component with page navigation controls",
    registryDependencies: ["button", "primitive", "link"],
    files: [
      {
        path: "ui/preskok-ui/pagination.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toolbar",
    type: "registry:ui",
    description: "A toolbar component for grouping action buttons",
    dependencies: ["react-aria-components"],
    registryDependencies: ["separator", "toggle", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/toolbar.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== PROGRESS & FEEDBACK COMPONENTS =====
  {
    name: "meter",
    type: "registry:ui",
    description:
      "A meter component for displaying scalar values within a range",
    dependencies: ["react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/meter.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "progress-bar",
    type: "registry:ui",
    description: "A progress bar component for showing completion status",
    dependencies: ["react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/progress-bar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "progress-circle",
    type: "registry:ui",
    description: "A circular progress component for showing completion status",
    dependencies: ["tailwind-merge"],
    registryDependencies: ["progress-bar"],
    files: [
      {
        path: "ui/preskok-ui/progress-circle.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tracker",
    type: "registry:ui",
    description:
      "A tracker component for visualizing data over time with tooltips",
    dependencies: ["tailwind-merge"],
    registryDependencies: ["tooltip"],
    files: [
      {
        path: "ui/preskok-ui/tracker.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toast",
    type: "registry:ui",
    description: "A toast notification component using Sonner",
    dependencies: ["sonner"],
    files: [
      {
        path: "ui/preskok-ui/toast.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== CHART COMPONENTS =====
  {
    name: "chart",
    type: "registry:ui",
    description: "Core chart components and utilities for data visualization",
    dependencies: ["lucide-react", "react-aria-components", "recharts"],
    registryDependencies: ["toggle-group", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/chart.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "area-chart",
    type: "registry:ui",
    description: "An area chart component with gradient fills and animations",
    dependencies: ["recharts", "tailwind-merge"],
    registryDependencies: ["chart"],
    files: [
      {
        path: "ui/preskok-ui/area-chart.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "bar-chart",
    type: "registry:ui",
    description: "A bar chart component with stacking and percentage options",
    dependencies: ["recharts", "tailwind-merge"],
    registryDependencies: ["chart"],
    files: [
      {
        path: "ui/preskok-ui/bar-chart.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "line-chart",
    type: "registry:ui",
    description: "A line chart component with multiple line support",
    dependencies: ["recharts", "tailwind-merge"],
    registryDependencies: ["chart"],
    files: [
      {
        path: "ui/preskok-ui/line-chart.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "pie-chart",
    type: "registry:ui",
    description: "A pie/donut chart component with customizable labels",
    dependencies: ["recharts", "tailwind-merge"],
    registryDependencies: ["chart"],
    files: [
      {
        path: "ui/preskok-ui/pie-chart.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "bar-list",
    type: "registry:ui",
    description: "A horizontal bar list component for displaying ranked data",
    dependencies: ["react-aria-components", "tailwind-merge"],
    registryDependencies: ["link"],
    files: [
      {
        path: "ui/preskok-ui/bar-list.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== COLOR COMPONENTS =====
  {
    name: "color-area",
    type: "registry:ui",
    description: "A color area component for 2D color selection",
    dependencies: ["react-aria-components"],
    registryDependencies: ["color-thumb", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/color-area.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "color-field",
    type: "registry:ui",
    description: "A color input field with hex color validation",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["color-picker", "field", "loader", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/color-field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "color-slider",
    type: "registry:ui",
    description:
      "A color slider component for single-dimension color adjustment",
    dependencies: ["react-aria-components"],
    registryDependencies: ["color-thumb", "field"],
    files: [
      {
        path: "ui/preskok-ui/color-slider.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "color-swatch",
    type: "registry:ui",
    description: "A color swatch component for displaying colors",
    dependencies: ["react-aria-components"],
    registryDependencies: ["primitive"],
    files: [
      {
        path: "ui/preskok-ui/color-swatch.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "color-swatch-picker",
    type: "registry:ui",
    description: "A color swatch picker for selecting from predefined colors",
    dependencies: ["react-aria-components"],
    registryDependencies: ["color-swatch", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/color-swatch-picker.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "color-thumb",
    type: "registry:ui",
    description: "A color thumb component for color slider controls",
    dependencies: ["react-aria-components", "tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/color-thumb.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "color-wheel",
    type: "registry:ui",
    description: "A color wheel component for hue selection",
    dependencies: ["react-aria-components"],
    registryDependencies: ["color-thumb"],
    files: [
      {
        path: "ui/preskok-ui/color-wheel.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "color-picker",
    type: "registry:ui",
    description: "A comprehensive color picker with multiple input methods",
    dependencies: [
      "@react-stately/color",
      "lucide-react",
      "react-aria-components",
      "tailwind-merge",
    ],
    registryDependencies: [
      "button",
      "color-area",
      "color-field",
      "color-slider",
      "color-swatch",
      "field",
      "popover",
    ],
    files: [
      {
        path: "ui/preskok-ui/color-picker.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== FILE & MEDIA COMPONENTS =====
  {
    name: "drop-zone",
    type: "registry:ui",
    description: "A drop zone component for file uploads",
    dependencies: ["react-aria-components", "tailwind-merge"],
    files: [
      {
        path: "ui/preskok-ui/drop-zone.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "file-trigger",
    type: "registry:ui",
    description: "A file input trigger component with button styling",
    dependencies: ["react-aria-components", "tailwind-variants"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/preskok-ui/file-trigger.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    description: "A scroll area component with custom scrollbars",
    files: [
      {
        path: "ui/preskok-ui/scroll-area.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "show-more",
    type: "registry:ui",
    description: "A show more/less component for collapsible content",
    dependencies: ["lucide-react", "react-aria-components", "tailwind-merge"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/preskok-ui/show-more.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== ADVANCED MENU COMPONENTS =====
  {
    name: "command",
    type: "registry:ui",
    description: "A command palette component for searchable command lists",
    dependencies: ["cmdk", "lucide-react", "tailwind-merge"],
    registryDependencies: ["dialog"],
    files: [
      {
        path: "ui/preskok-ui/command.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "command-menu",
    type: "registry:ui",
    description: "A command menu component with search and keyboard navigation",
    dependencies: ["lucide-react", "react-aria-components"],
    registryDependencies: ["dropdown", "loader", "menu", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/command-menu.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== TABLE COMPONENT =====
  {
    name: "table",
    type: "registry:ui",
    description:
      "A comprehensive table component with sorting, resizing, and selection",
    dependencies: ["react-aria-components"],
    registryDependencies: ["checkbox", "primitive"],
    files: [
      {
        path: "ui/preskok-ui/table.tsx",
        type: "registry:ui",
      },
    ],
  },

  // ===== NUMBER FORMAT COMPONENTS (Updated) =====
  {
    name: "number-format",
    type: "registry:ui",
    description:
      "A number format component that allows you to format numbers in a variety of ways",
    dependencies: ["react-number-format"],
    registryDependencies: ["locale-context"],
    files: [
      {
        path: "ui/preskok-ui/number-format/number-format.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/preskok-ui/number-format/number-format-context.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/preskok-ui/number-format/number-format-helpers.ts",
        type: "registry:ui",
      },
      {
        path: "ui/preskok-ui/number-format/currency-helpers.ts",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "locale-context",
    type: "registry:ui",
    description: "Locale context provider for internationalization support",
    files: [
      {
        path: "ui/preskok-ui/locale-context/locale-context.tsx",
        type: "registry:ui",
      },
      {
        path: "ui/preskok-ui/locale-context/locale-helpers.ts",
        type: "registry:ui",
      },
    ],
  },
]
