import { cacheLife } from "next/cache"
import { llms } from "fumadocs-core/source"

import { source } from "@/lib/source"

async function getIndex() {
  "use cache"
  cacheLife("max")

  return llms(source).index()
}

export async function GET() {
  return new Response(await getIndex(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
