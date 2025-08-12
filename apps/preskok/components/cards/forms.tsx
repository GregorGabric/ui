"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import { Input, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"
import { Textarea } from "@/registry/preskok/ui/preskok-ui/textarea"

import { TextField } from "../../registry/preskok/ui/preskok-ui/text-field"

const plans = [
  {
    id: "starter",
    name: "Starter Plan",
    description: "Perfect for small businesses.",
    price: "$10",
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "More features and storage.",
    price: "$20",
  },
] as const

export function CardsForms() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upgrade your subscription</CardTitle>
        <CardDescription className="text-balance">
          You are currently on the free plan. Upgrade to the pro plan to get
          access to all features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <TextField label="Name" placeholder="Matt Smith" />
            <TextField label="Email" placeholder="example@preskok.si" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-number">Card Number</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_80px_60px]">
              <Input
                id="card-number"
                placeholder="1234 1234 1234 1234"
                className="col-span-2 md:col-span-1"
              />
              <Input id="card-number-expiry" placeholder="MM/YY" />
              <Input id="card-number-cvc" placeholder="CVC" />
            </div>
          </div>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium">Plan</legend>
            <p className="text-muted-foreground text-sm">
              Select the plan that best fits your needs.
            </p>
            <RadioGroup className="grid gap-3 md:grid-cols-2">
              {plans.map((plan) => (
                <Radio key={plan.id} value={plan.id}>
                  <div className="grid gap-1 font-normal">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-muted-foreground text-xs leading-snug text-balance">
                      {plan.description}
                    </div>
                  </div>
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Enter notes" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="font-normal">
                I agree to the terms and conditions
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="newsletter" isSelected />
              <Label htmlFor="newsletter" className="font-normal">
                Allow us to send you emails
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button intent="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Upgrade Plan</Button>
      </CardFooter>
    </Card>
  )
}
