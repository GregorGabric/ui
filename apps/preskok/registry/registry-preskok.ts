import { type Registry } from "shadcn/registry"

export const preskokUi: Registry["items"] = [
  {
    // Test card
    name: "awesome-card",
    type: "registry:ui",
    description:
      "A beautiful, animated card component with variants and gradient backgrounds",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: "ui/awesome-card.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "number-format",
    type: "registry:ui",
    description:
      "A number format component that allows you to format numbers in a variety of ways",
    dependencies: ["react-number-format"],
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
  {
    name: "calendar",
    type: "registry:ui",
    description: "A calendar component with single and range selection support",
    dependencies: [
      "@internationalized/date",
      "@radix-ui/react-icons",
      "react-aria-components",
    ],
    files: [
      {
        path: "ui/preskok-ui/calendar/calendar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "date-field",
    type: "registry:ui",
    description:
      "A date field component with input segments for date and time entry",
    dependencies: ["class-variance-authority", "react-aria-components"],
    files: [
      {
        path: "ui/preskok-ui/calendar/date-field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "date-picker",
    type: "registry:ui",
    description:
      "A date picker component with calendar popup for date selection",
    dependencies: ["@radix-ui/react-icons", "react-aria-components"],
    registryDependencies: ["calendar", "date-field"],
    files: [
      {
        path: "ui/preskok-ui/calendar/date-picker.tsx",
        type: "registry:ui",
      },
    ],
  },
]
