import { type Registry } from "shadcn/registry"

export const libPreskok: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["react"],
    files: [
      {
        path: "lib/create-ctx.ts",
        type: "registry:lib",
      },
    ],
  },
]
