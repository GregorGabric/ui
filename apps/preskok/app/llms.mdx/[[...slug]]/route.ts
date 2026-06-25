import { cacheLife } from "next/cache"

import { getLLMText } from "@/lib/get-llm-text"
import { source } from "@/lib/source"

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs.length > 0)
    .map((page) => ({
      slug: page.slugs,
    }))
}

async function getMarkdown(slug: Array<string>) {
  "use cache"
  cacheLife("max")

  const page = source.getPage(slug)

  if (!page) {
    return null
  }

  return getLLMText(page)
}

export async function GET(
  _: Request,
  props: {
    params: Promise<{ slug?: Array<string> }>
  }
) {
  const params = await props.params
  const markdown = await getMarkdown(params.slug ?? [])

  if (markdown === null) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
