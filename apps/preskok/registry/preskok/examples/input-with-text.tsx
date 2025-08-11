import { Input } from "@/registry/preskok/ui/input"
import { Label } from "@/registry/preskok/ui/label"

export default function InputWithText() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="email-2">Dealer Email</Label>
      <Input type="email" id="email-2" placeholder="Dealer Email" />
      <p className="text-muted-foreground text-sm">Enter your email address.</p>
    </div>
  )
}
