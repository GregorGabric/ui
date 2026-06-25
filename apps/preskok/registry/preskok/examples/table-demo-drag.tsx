"use client"

import { useDragAndDrop } from "react-aria-components/useDragAndDrop"
import { useListData } from "react-aria-components/useListData"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/registry/preskok/ui/preskok-ui/table"

export function ReorderableTable() {
  const list = useListData({
    initialItems: [
      {
        id: 1,
        name: "Review risk flags",
        owner: "Success",
        stage: "Blocked",
        due: "Today",
      },
      {
        id: 2,
        name: "Confirm legal terms",
        owner: "Legal",
        stage: "Ready",
        due: "Tomorrow",
      },
      {
        id: 3,
        name: "Approve invoice",
        owner: "Finance",
        stage: "Review",
        due: "Friday",
      },
      {
        id: 4,
        name: "Schedule handoff",
        owner: "Support",
        stage: "Ready",
        due: "Monday",
      },
    ],
  })

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys, items: typeof list.items) =>
      items.map((item) => ({
        "text/plain": item.name,
      })),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys)
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys)
      }
    },
  })

  return (
    <div className="bg-background w-full max-w-3xl overflow-hidden rounded-xl border p-4 shadow-sm">
      <Table
        aria-label="Renewal tasks"
        selectionMode="multiple"
        dragAndDropHooks={dragAndDropHooks}
      >
        <TableHeader>
          <TableColumn isRowHeader>Name</TableColumn>
          <TableColumn>Owner</TableColumn>
          <TableColumn>Stage</TableColumn>
          <TableColumn>Due</TableColumn>
        </TableHeader>
        <TableBody items={list.items}>
          {(item) => (
            <TableRow id={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell>
                <TaskStage stage={item.stage} />
              </TableCell>
              <TableCell>{item.due}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function TaskStage({ stage }: { stage: string }) {
  if (stage === "Blocked") {
    return <Badge intent="danger">{stage}</Badge>
  }

  if (stage === "Review") {
    return <Badge intent="warning">{stage}</Badge>
  }

  return <Badge intent="success">{stage}</Badge>
}
