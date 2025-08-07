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
]
