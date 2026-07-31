import { pageSchema } from "fumadocs-core/source/schema"
import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { z } from "zod"

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        dark: "github-dark",
        light: "github-light-default",
      },
      filterMetaString(metaString) {
        return metaString.replace(/\bshowLineNumbers\b/g, "lineNumbers")
      },
    },
    remarkNpmOptions: {
      persist: {
        id: "package-manager",
      },
    },
  },
})

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      status: z.string().optional(),
      // links: z
      //   .object({
      //     doc: z.string().optional(),
      //     api: z.string().optional(),
      //   })
      //   .optional(),
    }),
    postprocess: {
      extractLinkReferences: true,
      includeProcessedMarkdown: true,
    },
  },
})
