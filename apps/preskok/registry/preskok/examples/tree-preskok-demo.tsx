"use client"

import {
  Tree,
  TreeContent,
  TreeItem,
} from "@/registry/preskok/ui/preskok-ui/tree"

const items = [
  {
    id: "1",
    name: "Projects",
    children: [
      { id: "1-1", name: "Website" },
      { id: "1-2", name: "Mobile App" },
    ],
  },
  {
    id: "2",
    name: "Archives",
    children: [
      { id: "2-1", name: "2024" },
      { id: "2-2", name: "2023" },
    ],
  },
]

export default function TreePreskokDemo() {
  return (
    <Tree
      aria-label="Projects"
      selectionMode="multiple"
      defaultExpandedKeys={["1"]}
    >
      {items.map((group) => (
        <TreeItem key={group.id} id={group.id} textValue={group.name}>
          <TreeContent>{group.name}</TreeContent>
          {group.children?.map((child) => (
            <TreeItem key={child.id} id={child.id} textValue={child.name}>
              <TreeContent>{child.name}</TreeContent>
            </TreeItem>
          ))}
        </TreeItem>
      ))}
    </Tree>
  )
}
