import { cn } from "@/registry/preskok/lib/utils"
import { Label } from "@/registry/preskok/ui/label"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { PreskokAuthButton } from "@/registry/preskok/ui/preskok-ui/preskok-auth-button"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <PreskokAuthButton type="button" className="w-full" />
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <TextField>
                  <Label>Email</Label>
                  <Input aria-label="Email" type="email" required />
                </TextField>

                <TextField>
                  <Label>Password</Label>
                  <Input aria-label="Password" type="password" required />
                </TextField>

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
