import { loader } from "fumadocs-core/source"
import { docs } from "fumadocs-mdx:collections/server"

export const docsRoute = ""
export const docsImageRoute = "/og/docs"

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
})

export function getPageImage(page: (typeof source)["$inferPage"]) {
  const path = page.slugs.length ? page.slugs.join("/") : "index"

  return `${docsImageRoute}/${path}/image.png`
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
  const segments = page.slugs.length ? [...page.slugs] : ["index"]
  const lastIndex = segments.length - 1
  segments[lastIndex] = `${segments[lastIndex]}.md`

  return `/${segments.join("/")}`
}
