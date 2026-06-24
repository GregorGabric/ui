import { notFound } from "next/navigation"
import { getMDXComponents } from "@/mdx-components"
import { createRelativeLink } from "fumadocs-ui/mdx"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page"

import { getPageImage, source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: Array<string> }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data

  if (!doc.title || !doc.description) {
    notFound()
  }

  const image = getPageImage(page)

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(page.url),
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: image,
        },
      ],
      creator: "@preskok",
    },
  }
}

export default async function Page(props: {
  params: Promise<{ slug?: Array<string> }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data
  const MDX = doc.body
  const isFullPage = doc.full === true

  return (
    <DocsPage
      className={isFullPage ? "max-w-none" : undefined}
      full={isFullPage}
      toc={doc.toc}
    >
      <DocsTitle>{doc.title}</DocsTitle>
      {doc.description ? (
        <DocsDescription>{doc.description}</DocsDescription>
      ) : null}
      <DocsBody className={isFullPage ? "max-w-none" : undefined}>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}
