"use client"

import { Form } from "react-aria-components"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"

export default function RadioValidationDemo() {
  return (
    <Form onSubmit={() => {}} className="space-y-4">
      <RadioGroup isRequired name="powertrain">
        <Label>Powertrain</Label>
        <Description>Choose the drivetrain for your next vehicle</Description>

        <Radio value="hybrid">
          <Label>Hybrid</Label>
          <Description>
            Balanced fuel economy with quick city acceleration.
          </Description>
        </Radio>

        <Radio value="electric">
          <Label>Electric</Label>
          <Description>
            Quiet performance with zero tailpipe emissions.
          </Description>
        </Radio>

        <Radio value="gasoline">
          <Label>Gasoline</Label>
          <Description>
            Traditional setup with broad refueling availability.
          </Description>
        </Radio>
      </RadioGroup>

      <Button type="submit" intent="secondary">
        Submit
      </Button>
    </Form>
  )
}
