import type { Metadata } from "next"

import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/app/(app)/examples/authentication/components/user-auth-form"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <div className="relative container hidden flex-1 shrink-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r">
        <div className="bg-primary/5 absolute inset-0" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="w-64" />
          <div className="sr-only">Preskok d.o.o.</div>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="leading-normal text-balance">
            &ldquo;Preskok is an industry-leading partner for cross-border
            remarketing and vehicle logistics—reliable, transparent, and built
            for scale.&rdquo;
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center lg:h-[1000px] lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email below to login
            </p>
          </div>
          <UserAuthForm />
          {/* <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p> */}
        </div>
      </div>
    </div>
  )
}
