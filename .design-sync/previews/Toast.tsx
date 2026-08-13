import { CircleCheckIcon, CircleXIcon } from "lucide-react"

import { Toast } from "preskok"

// Toast (the design system's <Toast /> export) is sonner's <Toaster />: an
// empty, always-mounted portal that only paints once something calls the
// imperative `toast()` API. That API lives in a *separate* bundled copy of
// "sonner" from the one closed over by <Toast />'s own module in this
// preview harness (each preview compiles as its own bundle; only react/
// react-dom and the "preskok" package itself are shared externals), so
// toast.success()/toast.error() called from here never reach this
// <Toast />'s subscriber and nothing renders — see .design-sync/learnings/F.md.
// This renders the same markup a real success/error toast paints as a
// static stand-in, with <Toast /> still mounted so the real (empty)
// container is part of the composition.
//
// Colors are applied via inline style referencing the DS's own
// --success-*/--error-* CSS custom properties (defined in
// apps/preskok/styles/toast.css, which this preview's stylesheet does load)
// rather than the semantic bg-success-background/text-success-text
// utilities: those utility classes are never generated for this preview's
// compiled CSS because Tailwind's JIT only emits classes it sees referenced
// in scanned source, and this newly authored file isn't part of that scan —
// see .design-sync/learnings/F.md.

export function Success() {
  return (
    <div className="flex items-center justify-center p-10">
      <Toast />
      <div
        className="flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg"
        style={{
          backgroundColor: "var(--success-background)",
          borderColor: "var(--success-border)",
          color: "var(--success-text)",
        }}
      >
        <CircleCheckIcon className="mt-0.5 size-4 shrink-0" />
        <div className="text-sm">
          <p className="font-medium">Test drive scheduled!</p>
          <p className="mt-0.5 opacity-80">
            We&rsquo;ll contact you within 24 hours to confirm.
          </p>
        </div>
      </div>
    </div>
  )
}

export function ErrorWithAction() {
  return (
    <div className="flex items-center justify-center p-10">
      <Toast />
      <div
        className="flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg"
        style={{
          backgroundColor: "var(--error-background)",
          borderColor: "var(--error-border)",
          color: "var(--error-text)",
        }}
      >
        <CircleXIcon className="mt-0.5 size-4 shrink-0" />
        <div className="flex-1 text-sm">
          <p className="font-medium">Vehicle unavailable</p>
          <p className="mt-0.5 opacity-80">
            This vehicle has been sold. View similar options?
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 text-sm font-medium underline underline-offset-2"
        >
          View
        </button>
      </div>
    </div>
  )
}
