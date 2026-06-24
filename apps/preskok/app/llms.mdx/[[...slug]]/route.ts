import { getLLMText, source } from "@/lib/source"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: [...(page.slugs.length ? page.slugs : ["index"]), "content.md"],
  }))
}

export async function GET(
  _: Request,
  props: {
    params: Promise<{ slug?: Array<string> }>
  }
) {
  const params = await props.params
  const slug = params.slug ?? []
  const path = slug.at(-1)

  if (path !== "content.md") {
    return new Response("Not found", { status: 404 })
  }

  const pageSlug = slug.slice(0, -1)
  const normalizedSlug =
    pageSlug.length === 1 && pageSlug[0] === "index" ? [] : pageSlug
  const page = source.getPage(normalizedSlug)

  if (!page) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(await getLLMText(page), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
