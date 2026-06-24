import { getLLMText } from "@/lib/get-llm-text"
import { source } from "@/lib/source"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs.length > 0)
    .map((page) => ({
      slug: page.slugs,
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
  const page = source.getPage(slug)

  if (!page) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(await getLLMText(page), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
