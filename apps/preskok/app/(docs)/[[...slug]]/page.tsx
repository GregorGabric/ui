import { notFound } from "next/navigation"
import { getMDXComponents } from "@/mdx-components"
import { createRelativeLink } from "fumadocs-ui/mdx"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page"

import { getPageImage, getPageMarkdownUrl, source } from "@/lib/source"
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
  const markdownUrl = getPageMarkdownUrl(page)

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      types: {
        "text/markdown": markdownUrl,
      },
    },
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
  const markdownUrl = getPageMarkdownUrl(page)

  return (
    <DocsPage
      className={isFullPage ? "max-w-none" : undefined}
      full={isFullPage}
      breadcrumb={{ enabled: false }}
      toc={doc.toc}
    >
      <DocsTitle className="text-3xl font-semibold tracking-tight text-balance">
        {doc.title}
      </DocsTitle>
      {doc.description ? (
        <DocsDescription className="text-fd-muted-foreground mt-1.5 mb-4 text-base text-pretty">
          {doc.description}
        </DocsDescription>
      ) : null}
      <div className="border-fd-border text-fd-muted-foreground mb-4 flex gap-2 border-b pb-4 text-sm">
        <a
          className="border-fd-border hover:bg-fd-accent hover:text-fd-accent-foreground rounded-md border px-2.5 py-1.5 transition-colors"
          href={markdownUrl}
        >
          View as Markdown
        </a>
        <a
          className="border-fd-border hover:bg-fd-accent hover:text-fd-accent-foreground rounded-md border px-2.5 py-1.5 transition-colors"
          href={`https://chatgpt.com/?${new URLSearchParams({
            prompt: `Read ${absoluteUrl(page.url)}, I want to ask questions about it.`,
            hints: "search",
          })}`}
          rel="noreferrer noopener"
          target="_blank"
        >
          Ask ChatGPT
        </a>
      </div>
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
