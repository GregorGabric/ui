import { Button } from "@/registry/preskok/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/card"
import { Input, Label } from "@/registry/preskok/ui/preskok-ui/field"

export function SidebarOptInForm() {
  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">Subscribe to our newsletter</CardTitle>
        <CardDescription>
          Opt-in to receive updates and news about the sidebar.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <form>
          <div className="grid gap-2.5">
            <Label htmlFor="optin-email" className="sr-only">
              Email
            </Label>
            <Input id="optin-email" type="email" placeholder="Email" />
            <Button
              className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none"
              size="sm"
            >
              Subscribe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
