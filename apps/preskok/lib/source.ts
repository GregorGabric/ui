import { loader } from "fumadocs-core/source"
import { docs } from "fumadocs-mdx:collections/server"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"

export const source: ReturnType<typeof loader> = loader({
  baseUrl: "/docs",
  source: toFumadocsSource(docs.docs, []),
})
