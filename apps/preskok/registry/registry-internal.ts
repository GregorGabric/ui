import { type Registry } from "shadcn/schema"

export const internal: Registry["items"] = [
  // Do not move this. They are intentionally here for registry capture.
  {
    name: "sidebar-header",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-header.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-footer",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-footer.tsx",
        type: "registry:component",
      },
    ],
  },
]
