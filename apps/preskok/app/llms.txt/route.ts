import { llms } from "fumadocs-core/source"

import { source } from "@/lib/source"

export const revalidate = false

export function GET() {
  return new Response(llms(source).index(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
