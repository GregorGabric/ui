import { VercelToolbar as VercelToolbarScript } from "@vercel/toolbar/next"

export function VercelToolbar() {
  // On Vercel preview deployments the toolbar is injected automatically; this
  // only opts the toolbar into local development.
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return <VercelToolbarScript />
}
