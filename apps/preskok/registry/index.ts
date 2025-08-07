import { registryItemSchema, type Registry } from "shadcn/registry"
import { z } from "zod"

import { blocks } from "@/registry/registry-blocks"
import { charts } from "@/registry/registry-charts"
import { examples } from "@/registry/registry-examples"
import { hooks } from "@/registry/registry-hooks"
import { internal } from "@/registry/registry-internal"
import { lib } from "@/registry/registry-lib"
import { libPreskok } from "@/registry/registry-lib-preskok"
import { preskokUi } from "@/registry/registry-preskok"
import { themes } from "@/registry/registry-themes"
import { ui } from "@/registry/registry-ui"

export const registry = {
  name: "preskok/ui",
  // TODO: change this
  homepage: "https://ui-three-mu.vercel.app",
  items: z.array(registryItemSchema).parse(
    [
      {
        name: "index",
        type: "registry:style",
        dependencies: ["class-variance-authority", "lucide-react"],
        devDependencies: ["tw-animate-css"],
        registryDependencies: ["utils", "create-ctx", "primitive"],
        cssVars: {},
        files: [],
      },
      ...ui,
      ...preskokUi,
      ...blocks,
      ...charts,
      ...lib,
      ...libPreskok,
      ...hooks,
      ...themes,
      ...examples,
      ...internal,
    ].map((item) => {
      // Temporary fix for dashboard-01.
      if (item.name === "dashboard-01") {
        item.dependencies?.push("@tabler/icons-react")
      }

      if (item.name === "accordion" && "tailwind" in item) {
        delete item.tailwind
      }

      return item
    })
  ),
} satisfies Registry
