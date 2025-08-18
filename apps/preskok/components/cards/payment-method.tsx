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
import { Input, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"
import { Select } from "@/registry/preskok/ui/preskok-ui/select"

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
              <Select.Trigger id="month" className="w-full" />
              <Select.List>
                <Select.Option id="1">January</Select.Option>
                <Select.Option id="2">February</Select.Option>
                <Select.Option id="3">March</Select.Option>
                <Select.Option id="4">April</Select.Option>
                <Select.Option id="5">May</Select.Option>
                <Select.Option id="6">June</Select.Option>
                <Select.Option id="7">July</Select.Option>
                <Select.Option id="8">August</Select.Option>
                <Select.Option id="9">September</Select.Option>
                <Select.Option id="10">October</Select.Option>
                <Select.Option id="11">November</Select.Option>
                <Select.Option id="12">December</Select.Option>
              </Select.List>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="year">Year</Label>
            <Select aria-label="Year">
              <Select.Trigger id="year" className="w-full" />
              <Select.List>
                {Array.from({ length: 10 }, (_, i) => (
                  <Select.Option key={i} id={`${new Date().getFullYear() + i}`}>
                    {new Date().getFullYear() + i}
                  </Select.Option>
                ))}
              </Select.List>
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
