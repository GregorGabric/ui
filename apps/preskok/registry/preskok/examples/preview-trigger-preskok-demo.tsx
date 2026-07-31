"use client"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Link } from "@/registry/preskok/ui/preskok-ui/link"
import {
  PreviewContent,
  PreviewTrigger,
} from "@/registry/preskok/ui/preskok-ui/preview-trigger"

export default function PreviewTriggerPreskokDemo() {
  return (
    <p className="text-muted-foreground max-w-xl text-base/7 text-pretty sm:text-sm/6">
      Compare{" "}
      <PreviewTrigger delay={300} closeDelay={150}>
        <Link
          href="#volvo-ex30"
          className="text-primary decoration-primary/50 hover:decoration-primary/70 font-normal underline underline-offset-2"
        >
          2025 Volvo EX30
        </Link>
        <PreviewContent arrow className="w-72 min-w-72 p-3">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-foreground font-semibold">Volvo EX30</p>
              <p className="text-muted-foreground text-base/6 sm:text-sm/5">
                Single Motor · 2025
              </p>
            </div>
            <Button size="xs" intent="outline">
              View
            </Button>
          </div>
          <div className="border-foreground/10 mt-3 flex items-end justify-between gap-3 border-t pt-3">
            <div>
              <p className="text-muted-foreground text-sm/5">Offer price</p>
              <p className="text-foreground font-semibold tabular-nums">
                €39,900
              </p>
            </div>
            <Badge intent="success">Available</Badge>
          </div>
        </PreviewContent>
      </PreviewTrigger>{" "}
      and{" "}
      <PreviewTrigger delay={300} closeDelay={150}>
        <Link
          href="#cupra-born"
          className="text-primary decoration-primary/50 hover:decoration-primary/70 font-normal underline underline-offset-2"
        >
          2024 Cupra Born
        </Link>
        <PreviewContent arrow className="w-72 min-w-72 p-3">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-foreground font-semibold">Cupra Born</p>
              <p className="text-muted-foreground text-base/6 sm:text-sm/5">
                77 kWh e-Boost · 2024
              </p>
            </div>
            <Button size="xs" intent="outline">
              View
            </Button>
          </div>
          <div className="border-foreground/10 mt-3 flex items-end justify-between gap-3 border-t pt-3">
            <div>
              <p className="text-muted-foreground text-sm/5">Offer price</p>
              <p className="text-foreground font-semibold tabular-nums">
                €37,500
              </p>
            </div>
            <Badge intent="warning">Reserved</Badge>
          </div>
        </PreviewContent>
      </PreviewTrigger>
      .
    </p>
  )
}
