import { LayoutDashboardIcon } from "lucide-react"

// Preskok examples
import AreaChartPreskokDemo from "@/registry/preskok/examples/area-chart-preskok-demo"
import BarChartPreskokDemo from "@/registry/preskok/examples/bar-chart-preskok-demo"
import DropdownPreskokDemo from "@/registry/preskok/examples/dropdown-preskok-demo"
import { ModalPreskokDemo } from "@/registry/preskok/examples/modal-preskok-demo"
import RangeCalendarPreskokDemo from "@/registry/preskok/examples/range-calendar-preskok-demo"
import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import { Button, buttonStyles } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/preskok/ui/preskok-ui/card"
import {
  Checkbox,
  CheckboxGroup,
} from "@/registry/preskok/ui/preskok-ui/checkbox"
import {
  ComboBox,
  ComboBoxContent,
  ComboBoxInput,
  ComboBoxItem,
} from "@/registry/preskok/ui/preskok-ui/combo-box"
import { Description, Label } from "@/registry/preskok/ui/preskok-ui/field"
import { Link } from "@/registry/preskok/ui/preskok-ui/link"
import { Radio, RadioGroup } from "@/registry/preskok/ui/preskok-ui/radio"
import {
  Select,
  SelectContent,
  SelectDescription,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"
import { Switch } from "@/registry/preskok/ui/preskok-ui/switch"
import { TextField } from "@/registry/preskok/ui/preskok-ui/text-field"

// Local demo data for lists
const roles: Array<{ id: string; name: string; description?: string }> = [
  { id: "admin", name: "Administrator", description: "Full access" },
  { id: "editor", name: "Editor", description: "Edit content" },
  { id: "viewer", name: "Viewer", description: "View only" },
]

const users: Array<{ id: string; name: string; image_url?: string }> = [
  { id: "1", name: "Alex Johnson", image_url: "/avatars/01.png" },
  { id: "2", name: "Jamie Rivera", image_url: "/avatars/02.png" },
  { id: "3", name: "Taylor Kim", image_url: "/avatars/03.png" },
]

export function Blocks() {
  return (
    <div className="grid gap-1 **:data-[slot=card]:rounded-md">
      <div className="mt-1 grid gap-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-y-6 p-6">
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(buttonStyles.variants.intent).map((intent) => (
              <Button
                key={intent}
                intent={intent as keyof typeof buttonStyles.variants.intent}
              >
                <LayoutDashboardIcon /> Label
              </Button>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Don&apos;t lose the level, just keep on going.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TextField isRequired name="email" />
            <TextField isRequired name="password" type="password" />
            <div className="flex items-center justify-between">
              <Checkbox>Remember me</Checkbox>
              <Link className="text-sm" href="#">
                Forgot password?
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Login</Button>
          </CardFooter>
        </Card>
        <Card className="flex items-center justify-center gap-2 p-6">
          <div className="space-y-2">
            <div className="flex flex-col gap-2 md:flex-row">
              <ModalPreskokDemo />
              <DropdownPreskokDemo />
            </div>
            <Select aria-label="Select a role" placeholder="Select a role">
              <SelectTrigger />
              <SelectContent items={roles}>
                {(item: { id: string; name: string; description?: string }) => (
                  <SelectItem id={item.id} textValue={item.name}>
                    <SelectLabel>{item.name}</SelectLabel>
                    <SelectDescription>{item.description}</SelectDescription>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <ComboBox aria-label="Select a user">
              <ComboBoxInput placeholder="Select a user" />
              <ComboBoxContent items={users}>
                {(item: { id: string; name: string; image_url?: string }) => (
                  <ComboBoxItem id={item.id} textValue={item.name}>
                    <Avatar src={item.image_url} />
                    {item.name}
                  </ComboBoxItem>
                )}
              </ComboBoxContent>
            </ComboBox>
          </div>
        </Card>
        <Card className="flex items-center justify-center p-6">
          <RangeCalendarPreskokDemo />
        </Card>
        <Card className="flex items-center justify-center p-6">
          <RadioGroup
            defaultValue="highSecurity"
            aria-label="Security settings"
          >
            <Radio value="highSecurity">
              <Label>High security</Label>
              <Description>Set all protections to maximum.</Description>
            </Radio>
            <CheckboxGroup
              aria-label="Advanced Security Features"
              defaultValue={["encryption", "firewall"]}
              className="ml-6"
            >
              <Checkbox value="encryption">
                <Label>Encryption</Label>
                <Description>
                  Encrypt all data at rest and in transit.
                </Description>
              </Checkbox>
              <Checkbox value="firewall">
                <Label>Firewall</Label>
                <Description>Enable network firewall.</Description>
              </Checkbox>
            </CheckboxGroup>

            <Radio value="balancedSecurity">
              <Label>Balanced security</Label>
              <Description>
                Balance between protection and performance.
              </Description>
            </Radio>
            <Radio value="lowSecurity">
              <Label>Low security</Label>
              <Description>Minimal protection enabled.</Description>
            </Radio>
          </RadioGroup>
        </Card>
        <Card className="grid place-content-center">
          <Switch aria-label="Dark mode">
            {({ isSelected }: { isSelected: boolean }) => (
              <>
                <Label>Dark mode</Label>
                <Description>
                  {isSelected
                    ? "Dark theme is enabled"
                    : "Light theme is currently active"}
                </Description>
              </>
            )}
          </Switch>

          <Switch aria-label="Location services">
            {({ isSelected }: { isSelected: boolean }) => (
              <>
                <Label>Location services</Label>
                <Description>
                  {isSelected
                    ? "Apps can access your location"
                    : "Location access is disabled"}
                </Description>
              </>
            )}
          </Switch>

          <Switch isDisabled isSelected aria-label="Email notifications">
            {({ isSelected }: { isSelected: boolean }) => (
              <>
                <Label>Email notifications</Label>
                <Description>
                  {isSelected
                    ? "You will receive email notifications"
                    : "Email notifications are turned off"}
                </Description>
              </>
            )}
          </Switch>
        </Card>
      </div>
      <div className="grid gap-1 sm:grid-cols-2">
        <AreaChartPreskokDemo />
        <BarChartPreskokDemo />
      </div>
    </div>
  )
}
