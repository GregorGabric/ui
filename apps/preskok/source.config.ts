import { defineConfig, defineDocs } from "fumadocs-mdx/config"

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
    postprocess: {
      extractLinkReferences: true,
      includeProcessedMarkdown: true,
    },
    // TODO: Upgrade to zod 4 first
    // schema: frontmatterSchema.extend({
    //   links: z
    //     .object({
    //       doc: z.string().optional(),
    //       api: z.string().optional(),
    //     })
    //     .optional(),
    // }),
  },
})
