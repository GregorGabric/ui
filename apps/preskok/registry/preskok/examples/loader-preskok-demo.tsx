import { Loader } from "@/registry/preskok/ui/preskok-ui/loader"

export default function LoaderPreskokDemo() {
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
