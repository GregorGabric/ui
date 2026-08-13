import { Container } from "preskok"

export function Default() {
  return (
    <Container className="bg-muted p-4">
      Default padding
    </Container>
  )
}

export function Constrained() {
  return (
    <Container constrained className="bg-muted p-4">
      Constrained padding
    </Container>
  )
}
