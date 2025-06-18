import { type Registry } from "shadcn/registry"

export const preskokUi: Registry["items"] = [
  {
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
]
