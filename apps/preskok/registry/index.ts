import { registryItemSchema, type Registry } from "shadcn/schema"

import { examples } from "@/registry/registry-examples"
import { hooks } from "@/registry/registry-hooks"
import { internal } from "@/registry/registry-internal"
import { lib } from "@/registry/registry-lib"
import { libPreskok } from "@/registry/registry-lib-preskok"
import { preskokUi } from "@/registry/registry-preskok"
import { themes } from "@/registry/registry-themes"

export const registry = {
  name: "preskok",
  homepage: "https://ui-three-mu.vercel.app",
  items: registryItemSchema.array().parse([
    {
      name: "default",
      extends: "none",
      type: "registry:base",
      config: {
        style: "preskok",
        iconLibrary: "lucide",
        tailwind: {
          baseColor: "neutral",
          cssVariables: true,
        },
        registries: {
          "@preskok": "https://ui-three-mu.vercel.app/r/{name}.json",
        },
      },
      dependencies: ["lucide-react", "tailwindcss-react-aria-components"],
      devDependencies: ["tw-animate-css"],
      registryDependencies: ["utils", "create-ctx", "primitive"],
      tailwind: {
        config: {
          plugins: ['require("tailwindcss-react-aria-components")'],
        },
      },
      cssVars: {},
      files: [],
    },
    ...preskokUi,
    ...lib,
    ...libPreskok,
    ...hooks,
    ...themes,
    ...examples,
    ...internal,
  ]),
} satisfies Registry
