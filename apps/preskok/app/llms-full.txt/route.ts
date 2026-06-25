import { cacheLife } from "next/cache"

import { getLLMText } from "@/lib/get-llm-text"
import { source } from "@/lib/source"

async function getFullText() {
  "use cache"
  cacheLife("max")

  const pages = await Promise.all(source.getPages().map(getLLMText))

  return pages.join("\n\n")
}

export async function GET() {
  return new Response(await getFullText(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
