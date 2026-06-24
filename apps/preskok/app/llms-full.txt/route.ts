import { getLLMText, source } from "@/lib/source"

export const revalidate = false

export async function GET() {
  const pages = await Promise.all(
    source.getPages().map(async (page) => {
      const content = await getLLMText(page)

      return `# ${page.data.title}

URL: ${page.url}

${content}`
    })
  )

  return new Response(pages.join("\n\n---\n\n"), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  })
}
