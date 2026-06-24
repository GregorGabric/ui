import { loader } from "fumadocs-core/source"
import { docs } from "fumadocs-mdx:collections/server"

export const docsRoute = ""
export const docsImageRoute = "/og/docs"
export const docsContentRoute = "/llms.mdx"

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
})

export function getPageImage(page: (typeof source)["$inferPage"]) {
  const path = page.slugs.length ? page.slugs.join("/") : "index"

  return `${docsImageRoute}/${path}/image.png`
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
  const path = page.slugs.length ? page.slugs.join("/") : "index"

  return `${docsContentRoute}/${path}/content.md`
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  return page.data.getText("processed")
}
