import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"

export default function LoaderPreskokDemo() {
  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-6">
        <Loader />
        <Loader size="md" />
        <Loader size="lg" intent="primary" />
        <Loader size="lg" variant="bars" intent="secondary" />
        <Loader size="lg" variant="ring" intent="success" />
      </div>
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader size="sm" intent="warning" />
        Checking deployment health
      </div>
    </div>
  )
}
