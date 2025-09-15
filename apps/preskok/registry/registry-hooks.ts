import { type Registry } from "@preskok-org/ui/registry"

export const hooks: Registry["items"] = [
  {
    name: "use-mobile",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-mobile.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-layout-effect",
    type: "registry:hook",
    files: [
      {
        path: "hooks/use-layout-effect.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-controllable-state",
    type: "registry:hook",
    registryDependencies: ["use-layout-effect"],
    files: [
      {
        path: "hooks/use-controllable-state.ts",
        type: "registry:hook",
      },
    ],
  },
]
