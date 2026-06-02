import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { registryItemSchema, type RegistryItem } from "shadcn/schema"

import { siteConfig } from "@/lib/config"
import { getRegistryComponent, getRegistryItem } from "@/lib/registry"
import { absoluteUrl, cn } from "@/lib/utils"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCachedRegistryItem = React.cache(async (name: string) => {
  return await getRegistryItem(name)
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    name: string
  }>
}): Promise<Metadata> {
  const { name } = await params
  const item = await getCachedRegistryItem(name)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  return {
    title: item.description,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/view/${item.name}`),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
      creator: "@preskok",
    },
  }
}

export async function generateStaticParams() {
  const { Index } = await import("@/registry/__index__")
  const index: RegistryItem[] = registryItemSchema
    .array()
    .parse(Object.values(Index))

  return index
    .filter((block) =>
      ["registry:component", "registry:example", "registry:internal"].includes(
        block.type
      )
    )
    .map((block) => ({
      name: block.name,
    }))
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    name: string
  }>
}) {
  const { name } = await params
  const item = await getCachedRegistryItem(name)
  const Component = getRegistryComponent(name) as React.ComponentType

  if (!item) {
    return notFound()
  }

  const containerClassName = item.meta?.container as string | undefined

  return (
    <div className={cn("bg-background", containerClassName)}>
      {/* <SidebarProvider> */}
      <Component />
      {/* </SidebarProvider> */}
    </div>
  )
}
