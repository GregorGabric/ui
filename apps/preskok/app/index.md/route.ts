import { getLLMText } from "@/lib/get-llm-text"
import { source } from "@/lib/source"

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  const page = source.getPages().find((item) => item.url === "/")

  if (!page) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(await getLLMText(page), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
