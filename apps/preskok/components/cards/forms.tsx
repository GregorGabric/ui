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
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"
import { Textarea } from "@/registry/preskok/ui/preskok-ui/textarea"

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
        <CardTitle className="text-lg">Upgrade your Preskok plan</CardTitle>
        <CardDescription className="text-balance">
          Unlock advanced logistics and remarketing tools for your fleet and
          trading teams.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <TextField label="Company" placeholder="ACME Mobility GmbH" />
            <TextField label="Work Email" placeholder="logistics@company.com" />
          </div>
          <div className="flex flex-col gap-3">
            <TextField
              label="Card Number"
              placeholder="1234 1234 1234 1234"
              inputMode="numeric"
              className="w-full"
            />
            <div className="flex gap-3">
              <TextField
                label="Expiry"
                placeholder="MM/YY"
                inputMode="numeric"
                className="w-[120px]"
              />
              <TextField
                label="CVC"
                placeholder="CVC"
                inputMode="numeric"
                className="w-[100px]"
              />
            </div>
          </div>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium">Plan</legend>
            <p className="text-muted-foreground text-sm">
              Select the plan that best fits your vehicle transport and resale
              operations.
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
            <Textarea
              id="notes"
              placeholder="Add PO number, VIN range, or route preferences"
            />
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
                Send me updates about new logistics features and vehicle market
                insights
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
