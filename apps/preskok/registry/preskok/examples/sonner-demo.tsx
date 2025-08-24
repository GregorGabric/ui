"use client"

import { toast } from "sonner"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Toast } from "@/registry/preskok/ui/preskok-ui/toast"

export default function SonnerDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          intent="outline"
          size="sm"
          onPress={() =>
            toast.success("Test drive scheduled!", {
              description: "We'll contact you within 24 hours to confirm.",
            })
          }
        >
          Success Toast
        </Button>

        <Button
          intent="outline"
          size="sm"
          onPress={() =>
            toast.error("Vehicle unavailable", {
              description: "This vehicle has been sold. View similar options?",
            })
          }
        >
          Error Toast
        </Button>

        <Button
          intent="outline"
          size="sm"
          onPress={() =>
            toast.info("Price drop alert!", {
              description: "The 2024 Honda Accord is now $2,000 less.",
            })
          }
        >
          Info Toast
        </Button>

        <Button
          intent="outline"
          size="sm"
          onPress={() =>
            toast.warning("Low inventory", {
              description: "Only 2 vehicles left in this configuration.",
            })
          }
        >
          Warning Toast
        </Button>

        <Button
          intent="outline"
          size="sm"
          onPress={() =>
            toast("Vehicle saved to favorites", {
              description: "2024 Toyota Camry LE added to your watchlist.",
              action: {
                label: "View",
                onClick: () => console.log("View favorites"),
              },
            })
          }
        >
          Action Toast
        </Button>

        <Button
          intent="outline"
          size="sm"
          onPress={() =>
            toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
              loading: "Processing financing application...",
              success: "Application approved! Check your email for next steps.",
              error: "Application failed. Please try again.",
            })
          }
        >
          Promise Toast
        </Button>
      </div>

      <Toast />
    </div>
  )
}
