"use client"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/registry/preskok/ui/preskok-ui/table"

type ProjectStatus = "On track" | "Review" | "At risk" | "Queued"

export function TableDemoResizable() {
  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl border bg-background p-4 shadow-sm">
      <Table allowResize aria-label="Project delivery">
        <TableHeader>
          <TableColumn width={52} minWidth={44}>
            ID
          </TableColumn>
          <TableColumn isRowHeader isResizable width={240} minWidth={180}>
            Workstream
          </TableColumn>
          <TableColumn isResizable width={160} minWidth={132}>
            Owner
          </TableColumn>
          <TableColumn width={116} minWidth={104}>
            Budget
          </TableColumn>
          <TableColumn isResizable width={140} minWidth={120}>
            Status
          </TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow id={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.project}</TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell className="tabular-nums">{item.budget}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === "On track") {
    return <Badge intent="success">{status}</Badge>
  }

  if (status === "Review") {
    return <Badge intent="warning">{status}</Badge>
  }

  if (status === "At risk") {
    return <Badge intent="danger">{status}</Badge>
  }

  return <Badge intent="secondary">{status}</Badge>
}

const items = [
  {
    id: 1,
    project: "Enterprise onboarding",
    owner: "Maya Chen",
    budget: "$42,000",
    status: "On track" as const,
  },
  {
    id: 2,
    project: "Usage reporting",
    owner: "Noah Reed",
    budget: "$18,500",
    status: "Review" as const,
  },
  {
    id: 3,
    project: "Audit trail",
    owner: "Iris Patel",
    budget: "$26,800",
    status: "At risk" as const,
  },
  {
    id: 4,
    project: "Partner portal",
    owner: "Sam Ortiz",
    budget: "$31,200",
    status: "On track" as const,
  },
  {
    id: 5,
    project: "Invoice approvals",
    owner: "Lena Park",
    budget: "$14,900",
    status: "Queued" as const,
  },
  {
    id: 6,
    project: "Team analytics",
    owner: "Owen Brooks",
    budget: "$22,400",
    status: "Review" as const,
  },
  {
    id: 7,
    project: "Regional failover",
    owner: "Ava Stone",
    budget: "$54,000",
    status: "On track" as const,
  },
]
