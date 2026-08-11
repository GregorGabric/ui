import type { Folder, Item, Node } from "fumadocs-core/page-tree"
import { Card, Cards } from "fumadocs-ui/components/card"

import { source } from "@/lib/source"

const excludedFolders = new Set(["(root)", "installation"])

export function AllComponentsList() {
  const groups = source.pageTree.children.filter(
    (node): node is Folder =>
      node.type === "folder" &&
      !node.index &&
      !excludedFolders.has(node.$id ?? "")
  )

  return (
    <div className="not-prose grid gap-10">
      {groups.map((group) => {
        const pages = collectPages(group.children)

        if (!pages.length) {
          return null
        }

        return (
          <section key={group.$id ?? String(group.name)} className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight text-fd-foreground">
              {group.name}
            </h2>
            <Cards className="grid-cols-1 gap-2 md:grid-cols-2">
              {pages.map((page) => (
                <Card
                  key={page.url}
                  href={page.url}
                  title={page.name}
                  description={page.description}
                  icon={page.icon}
                  className="p-3"
                />
              ))}
            </Cards>
          </section>
        )
      })}
    </div>
  )
}

function collectPages(nodes: Node[]): Item[] {
  return nodes.flatMap((node) => {
    if (node.type === "page") {
      return [node]
    }

    if (node.type === "folder") {
      const index = node.index ? [node.index] : []

      return [...index, ...collectPages(node.children)]
    }

    return []
  })
}
