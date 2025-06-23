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
    dependencies: ["react-number-format"],
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
    dependencies: ["react-number-format"],
    files: [
      {
        path: "ui/file-upload.tsx",
        type: "registry:ui",
      },
    ],
  },
]
