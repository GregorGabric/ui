import { Suspense } from "react"
import { notFound } from "next/navigation"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/glass/page"
import { createRelativeLink } from "fumadocs-ui/mdx"

import { getPageImage, getPageMarkdownUrl, source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { getMDXComponents } from "@/mdx-components"

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

type DocsPageProps = {
  params: Promise<{ slug?: Array<string> }>
}

export default function Page(props: DocsPageProps) {
  return (
    <Suspense fallback={null}>
      <DocsPageContent {...props} />
    </Suspense>
  )
}

async function DocsPageContent(props: DocsPageProps) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data
  const MDX = doc.body
  const isFullPage = doc.full === true
  const markdownUrl = getPageMarkdownUrl(page)
  const chatUrl = `https://chatgpt.com/?${new URLSearchParams({
    prompt: `Read ${absoluteUrl(page.url)}, I want to ask questions about it.`,
    hints: "search",
  })}`

  return (
    <DocsPage full={isFullPage} toc={doc.toc}>
      <DocsTitle className="text-3xl font-semibold tracking-tight text-balance">
        {doc.title}
      </DocsTitle>
      {doc.description ? (
        <DocsDescription className="mt-1.5 mb-4 text-base text-pretty text-fd-muted-foreground">
          {doc.description}
        </DocsDescription>
      ) : null}
      <div className="mb-4 flex gap-2 border-b border-fd-border pb-4 text-sm text-fd-muted-foreground">
        <a
          className="rounded-md border border-fd-border px-2.5 py-1.5 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          href={markdownUrl}
        >
          View as Markdown
        </a>
        <a
          className="rounded-md border border-fd-border px-2.5 py-1.5 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          href={chatUrl}
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
