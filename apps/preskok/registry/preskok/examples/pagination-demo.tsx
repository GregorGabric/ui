"use client"

import {
  Pagination,
  PaginationFirst,
  PaginationGap,
  PaginationInfo,
  PaginationItem,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  PaginationSection,
} from "@/registry/preskok/ui/preskok-ui/pagination"

export default function PaginationDemo() {
  return (
    <div className="bg-background w-full max-w-2xl rounded-xl border p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PaginationInfo className="text-pretty">
          Showing <strong>21-40</strong> of <strong>128</strong> invoices
        </PaginationInfo>
        <Pagination className="mx-0 w-auto justify-start">
          <PaginationSection>
            <PaginationFirst href="#" />
            <PaginationPrevious href="#" />
          </PaginationSection>
          <PaginationList>
            <PaginationItem href="#">1</PaginationItem>
            <PaginationItem href="#" isCurrent>
              2
            </PaginationItem>
            <PaginationItem href="#">3</PaginationItem>
            <PaginationGap />
            <PaginationItem href="#">7</PaginationItem>
          </PaginationList>
          <PaginationSection>
            <PaginationNext href="#" />
            <PaginationLast href="#" />
          </PaginationSection>
        </Pagination>
      </div>
    </div>
  )
}
