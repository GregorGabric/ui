import { type Registry } from "@preskok-org/ui/registry"

export const libPreskok: Registry["items"] = [
  {
    name: "create-ctx",
    type: "registry:lib",
    dependencies: ["react"],
    files: [
      {
        path: "lib/create-ctx.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "primitive",
    type: "registry:lib",
    dependencies: ["react-aria-components", "tailwind-merge"],
    files: [
      {
        path: "lib/primitive.ts",
        type: "registry:lib",
      },
    ],
  },
]
