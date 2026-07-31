import { createElement } from "react"
import { loader } from "fumadocs-core/source"
import { statusBadgesPlugin } from "fumadocs-core/source/status-badges"
import { docs } from "fumadocs-mdx:collections/server"

export const docsRoute = ""
export const docsImageRoute = "/og/docs"

export const source = loader({
  baseUrl: docsRoute,
  plugins: [
    statusBadgesPlugin({
      renderBadge: (status) =>
        createElement(
          "small",
          {
            className:
              "bg-primary/10 text-primary dark:bg-primary/15 shrink-0 rounded-full px-1.5 py-0.5 font-medium",
            "data-status": status,
          },
          status.charAt(0).toUpperCase() + status.slice(1)
        ),
    }),
  ],
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
