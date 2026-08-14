import { Loader } from "preskok"

export function Variants() {
  return (
    <div className="flex items-center gap-6">
      <Loader />
      <Loader size="md" />
      <Loader size="lg" intent="primary" />
      <Loader size="lg" variant="bars" intent="secondary" />
      <Loader size="lg" variant="ring" intent="success" />
    </div>
  )
}

export function InlineStatus() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader size="sm" intent="warning" />
      Checking deployment health
    </div>
  )
}
