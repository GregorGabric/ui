"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/registry/preskok/ui/preskok-ui/sheet"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function SheetDemo() {
  return (
    <div className="flex gap-4">
      <Sheet>
        <SheetTrigger>
          <Button intent="outline">Vehicle Inquiry</Button>
        </SheetTrigger>
        <SheetContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Contact Dealer</h3>
              <p className="text-muted-foreground text-sm">
                Get more information about this vehicle
              </p>
            </div>

            <div className="space-y-4">
              <TextField
                label="Full Name"
                placeholder="Enter your full name"
                isRequired
              />
              <TextField
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                isRequired
              />
              <TextField
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
              <TextField
                label="Preferred Contact Method"
                placeholder="Email, Phone, or Text"
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Vehicle of Interest</h4>
              <div className="bg-muted rounded p-3 text-sm">
                <div className="font-medium">2024 Toyota Camry LE</div>
                <div className="text-muted-foreground">Stock #: TC240156</div>
                <div className="text-muted-foreground">Price: $28,400</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">Send Inquiry</Button>
              <Button intent="outline" className="flex-1">
                Schedule Visit
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger>
          <Button intent="outline">Financing Calculator</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Financing Calculator</h3>
              <p className="text-muted-foreground text-sm">
                Estimate your monthly payment
              </p>
            </div>

            <div className="space-y-4">
              <TextField
                label="Vehicle Price"
                placeholder="32400"
                prefix="$"
                defaultValue="32400"
              />
              <TextField
                label="Down Payment"
                placeholder="5000"
                prefix="$"
                defaultValue="5000"
              />
              <TextField
                label="Interest Rate"
                placeholder="4.5"
                suffix="%"
                defaultValue="4.5"
              />
              <TextField
                label="Loan Term"
                placeholder="60"
                suffix="months"
                defaultValue="60"
              />
            </div>

            <div className="bg-primary/10 rounded p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">$487</div>
                <div className="text-muted-foreground text-sm">
                  Estimated monthly payment
                </div>
              </div>
            </div>

            <Button className="w-full">Apply for Financing</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
