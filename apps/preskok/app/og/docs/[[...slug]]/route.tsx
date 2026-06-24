import { notFound } from "next/navigation"
import { generateOGImage } from "fumadocs-ui/og"

import { siteConfig } from "@/lib/config"
import { source } from "@/lib/source"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: [...(page.slugs.length ? page.slugs : ["index"]), "image.png"],
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

  if (path !== "image.png") {
    notFound()
  }

  const pageSlug = slug.slice(0, -1)
  const normalizedSlug =
    pageSlug.length === 1 && pageSlug[0] === "index" ? [] : pageSlug
  const page = source.getPage(normalizedSlug)

  if (!page) {
    notFound()
  }

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: siteConfig.name,
  })
}
