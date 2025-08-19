import { LoginForm } from "@/registry/preskok/blocks/login-03/components/login-form"
import { PreskokIcon } from "@/registry/preskok/ui/preskok-ui/preskok-icon"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary flex size-6 items-center justify-center rounded-md">
            <PreskokIcon className="size-4" />
          </div>
          Preskok d.o.o.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
