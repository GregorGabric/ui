import { cacheLife } from "next/cache"

import { getLLMText } from "@/lib/get-llm-text"
import { source } from "@/lib/source"

async function getIndexMarkdown() {
  "use cache"
  cacheLife("max")

  const page = source.getPages().find((item) => item.url === "/")

  if (!page) {
    return null
  }

  return getLLMText(page)
}

export async function GET() {
  const markdown = await getIndexMarkdown()

  if (markdown === null) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
