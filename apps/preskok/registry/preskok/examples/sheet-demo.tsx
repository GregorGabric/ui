"use client"

import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Checkbox,
  CheckboxLabel,
} from "@/registry/preskok/ui/preskok-ui/checkbox"
import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Input } from "@/registry/preskok/ui/preskok-ui/input"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/preskok/ui/preskok-ui/sheet"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

export default function SheetDemo() {
  return (
    <Sheet>
      <Button intent="outline">Book Service</Button>
      <SheetContent>
        {({ close }) => (
          <>
            <SheetHeader>
              <SheetTitle>Schedule Service Appointment</SheetTitle>
              <SheetDescription>
                Book your vehicle maintenance or repair service with our
                certified technicians.
              </SheetDescription>
            </SheetHeader>
            <SheetBody className="space-y-4">
              <TextField>
                <Label>Vehicle Make & Model</Label>
                <Input type="text" placeholder="e.g., Toyota Camry 2020" />
              </TextField>
              <TextField>
                <Label>License Plate</Label>
                <Input type="text" placeholder="Enter license plate number" />
              </TextField>
              <TextField>
                <Label>Phone Number</Label>
                <Input type="tel" placeholder="Enter your contact number" />
              </TextField>
              <Checkbox>
                <CheckboxLabel>Enable service reminders</CheckboxLabel>
                <Description>
                  Receive notifications for upcoming maintenance schedules.
                </Description>
              </Checkbox>
            </SheetBody>
            <SheetFooter>
              <SheetClose>Cancel</SheetClose>
              <Button onPress={close} intent="primary" type="submit">
                Book Appointment
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
