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
import { Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"

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
    description: "Advanced features with more storage.",
    price: "$20",
  },
] as const

export function CardsPaymentMethod() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Add a payment method for transport invoices and marketplace fees.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Cardholder Name</Label>
          <Input id="name" placeholder="First Last" />
        </div>
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium">Plan</legend>
          <p className="text-muted-foreground text-sm">
            Select the plan that best fits your needs.
          </p>
          <RadioGroup className="grid gap-3">
            {plans.map((plan) => (
              <Radio key={plan.id} value={plan.id}>
                <div className="grid gap-1 font-normal">
                  <div className="font-medium">{plan.name}</div>
                  <div className="text-muted-foreground pr-2 text-xs leading-snug text-balance">
                    {plan.description}
                  </div>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </fieldset>
        <div className="flex flex-col gap-3">
          <Label htmlFor="number">Card number</Label>
          <Input id="number" placeholder="" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="month">Expires</Label>
            <Select aria-label="Month">
              <SelectTrigger id="month" className="w-full" />
              <SelectContent>
                <SelectItem id="1">January</SelectItem>
                <SelectItem id="2">February</SelectItem>
                <SelectItem id="3">March</SelectItem>
                <SelectItem id="4">April</SelectItem>
                <SelectItem id="5">May</SelectItem>
                <SelectItem id="6">June</SelectItem>
                <SelectItem id="7">July</SelectItem>
                <SelectItem id="8">August</SelectItem>
                <SelectItem id="9">September</SelectItem>
                <SelectItem id="10">October</SelectItem>
                <SelectItem id="11">November</SelectItem>
                <SelectItem id="12">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="year">Year</Label>
            <Select aria-label="Year">
              <SelectTrigger id="year" className="w-full" />
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i} id={`${new Date().getFullYear() + i}`}>
                    {new Date().getFullYear() + i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="CVC" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Continue</Button>
      </CardFooter>
    </Card>
  )
}
