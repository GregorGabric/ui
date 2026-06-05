import { type Registry } from "shadcn/schema"

export const libPreskok: Registry["items"] = [
  {
    name: "create-ctx",
    type: "registry:lib",
    files: [
      {
        path: "lib/create-ctx.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "primitive",
    type: "registry:lib",
    files: [
      {
        path: "lib/primitive.ts",
        type: "registry:lib",
      },
    ],
  },
]
