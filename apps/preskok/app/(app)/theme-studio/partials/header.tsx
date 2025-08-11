"use client"

import type React from "react"
import { twMerge } from "tailwind-merge"

import { Container } from "@/registry/preskok/ui/preskok-ui/container"
import { Heading } from "@/registry/preskok/ui/preskok-ui/heading"

export function Header({ children, className }: React.ComponentProps<"div">) {
  return (
    <div className={twMerge("py-6 lg:py-10", className)}>
      <Container constrained>
        <Heading level={1} className="text-2xl sm:text-3xl">
          {children}
        </Heading>
      </Container>
    </div>
  )
}
