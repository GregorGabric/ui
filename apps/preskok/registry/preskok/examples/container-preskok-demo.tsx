"use client"

import { Container } from "@/registry/preskok/ui/preskok-ui/container"

export default function ContainerPreskokDemo() {
  return (
    <div className="space-y-2">
      <Container className="bg-muted p-4">Default padding</Container>
      <Container constrained className="bg-muted p-4">
        Constrained padding
      </Container>
    </div>
  )
}
