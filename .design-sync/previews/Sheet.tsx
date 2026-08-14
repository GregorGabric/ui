import {
  Button,
  Checkbox,
  CheckboxLabel,
  Description,
  Input,
  Label,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  TextField,
} from "preskok"

export function ServiceAppointment() {
  return (
    <Sheet defaultOpen>
      <Button intent="outline">Book Service</Button>
      <SheetContent>
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
          <Checkbox defaultSelected>
            <CheckboxLabel>Enable service reminders</CheckboxLabel>
            <Description>
              Receive notifications for upcoming maintenance schedules.
            </Description>
          </Checkbox>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
          <Button intent="primary" type="submit">
            Book Appointment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function QuickSettings() {
  return (
    <Sheet defaultOpen>
      <Button intent="outline">Quick Settings</Button>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Quick Settings</SheetTitle>
          <SheetDescription>Adjust workspace preferences.</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-3">
          <Checkbox defaultSelected>
            <CheckboxLabel>Compact layout</CheckboxLabel>
          </Checkbox>
          <Checkbox>
            <CheckboxLabel>Email notifications</CheckboxLabel>
          </Checkbox>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
