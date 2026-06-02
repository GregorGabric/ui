import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react"
import { findNeighbour } from "fumadocs-core/page-tree"

import { source } from "@/lib/source"
import { absoluteUrl, cn } from "@/lib/utils"
import { DocsTableOfContents } from "@/components/docs-toc"

type DocLinks = {
  api?: string
  doc?: string
}

const navIconLinkClass =
  "extend-touch-target inline-flex size-8 items-center justify-center gap-x-1.5 rounded-lg border border-transparent bg-secondary text-sm font-medium text-secondary-foreground shadow-none transition-transform duration-150 hover:bg-secondary/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-foreground md:size-7 [&_svg]:size-4"
const navTextLinkClass =
  "inline-flex items-center justify-center gap-x-1.5 rounded-lg border border-transparent bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground shadow-none transition-transform duration-150 hover:bg-secondary/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-foreground sm:px-2.5 sm:py-1.5 sm:text-sm/5 [&_svg]:size-4"
const docBadgeLinkClass =
  "inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/85 [&_svg]:size-3.5"

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
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
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
  const neighbours = await findNeighbour(source.pageTree, page.url)

  const links = "links" in doc ? (doc.links as DocLinks | undefined) : undefined

  return (
    <div
      data-slot="docs"
      className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        {/* max-w-2xl */}
        <div className="mx-auto flex w-full min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                  {doc.title}
                </h1>
                <div className="flex items-center gap-2 pt-1.5">
                  {neighbours.previous && (
                    <Link
                      href={neighbours.previous.url}
                      className={navIconLinkClass}
                    >
                      <IconArrowLeft />
                      <span className="sr-only">Previous</span>
                    </Link>
                  )}
                  {neighbours.next && (
                    <Link
                      href={neighbours.next.url}
                      className={navIconLinkClass}
                    >
                      <span className="sr-only">Next</span>
                      <IconArrowRight />
                    </Link>
                  )}
                </div>
              </div>
              {doc.description && (
                <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
                  {doc.description}
                </p>
              )}
            </div>
            {links ? (
              <div className="flex items-center space-x-2 pt-4">
                {links?.doc && (
                  <Link
                    href={links.doc}
                    target="_blank"
                    rel="noreferrer"
                    className={docBadgeLinkClass}
                  >
                    Docs <IconArrowUpRight />
                  </Link>
                )}
                {links?.api && (
                  <Link
                    href={links.api}
                    target="_blank"
                    rel="noreferrer"
                    className={docBadgeLinkClass}
                  >
                    API Reference <IconArrowUpRight />
                  </Link>
                )}
              </div>
            ) : null}
          </div>
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <MDX components={mdxComponents} />
          </div>
        </div>
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center gap-2 px-4 md:px-0">
          {neighbours.previous && (
            <Link href={neighbours.previous.url} className={navTextLinkClass}>
              <IconArrowLeft /> {neighbours.previous.name}
            </Link>
          )}
          {neighbours.next && (
            <Link
              href={neighbours.next.url}
              className={cn(navTextLinkClass, "ml-auto")}
            >
              {neighbours.next.name} <IconArrowRight />
            </Link>
          )}
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {doc.toc?.length ? (
          <div className="no-scrollbar overflow-y-auto px-8">
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
