import { Link } from "@/registry/preskok/ui/preskok-ui/link"

export default function LinkPreskokDemo() {
  return (
    <div className="space-x-4">
      <Link href="#" intent="primary">
        Primary link
      </Link>
      <Link href="#" intent="secondary">
        Secondary link
      </Link>
      <Link href="#" intent="unstyled">
        Unstyled link
      </Link>
    </div>
  )
}
