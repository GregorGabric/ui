"use client"

import {
  Pagination,
  PaginationFirst,
  PaginationGap,
  PaginationItem,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/preskok/ui/preskok-ui/pagination"

export default function PaginationDemo() {
  return (
    <Pagination>
      <PaginationList>
        <PaginationFirst href="#" />
        <PaginationPrevious href="#" />
        <PaginationItem href="#">1</PaginationItem>
        <PaginationItem href="#" isCurrent>
          2
        </PaginationItem>
        <PaginationGap />
        <PaginationNext href="#" />
        <PaginationLast href="#" />
      </PaginationList>
    </Pagination>
  )
}
