import Link from "next/link"

import { Button } from "@/registry/preskok/ui/button"

export default function ButtonAsChild() {
  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  )
}
