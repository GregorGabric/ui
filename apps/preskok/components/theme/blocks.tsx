import {
  Card as DocsCard,
  Cards as DocsCards,
} from "fumadocs-ui/components/card"
import { LayoutDashboardIcon } from "lucide-react"

// Preskok examples
import AreaChartPreskokDemo from "@/registry/preskok/examples/area-chart-preskok-demo"
import BarChartPreskokDemo from "@/registry/preskok/examples/bar-chart-preskok-demo"
import DropdownPreskokDemo from "@/registry/preskok/examples/dropdown-preskok-demo"
import { ModalPreskokDemo } from "@/registry/preskok/examples/modal-preskok-demo"
import RangeCalendarPreskokDemo from "@/registry/preskok/examples/range-calendar-preskok-demo"
import { Avatar } from "@/registry/preskok/ui/preskok-ui/avatar"
import {
  Button,
  type ButtonProps,
} from "@/registry/preskok/ui/preskok-ui/button"
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
const buttonIntents = [
  "primary",
  "secondary",
  "warning",
  "danger",
  "outline",
  "plain",
] satisfies NonNullable<ButtonProps["intent"]>[]

export function Blocks() {
  return (
    <section className="mt-3 space-y-3">
      <DocsCards className="grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        <DocsCard title="Buttons">
          <div className="not-prose mt-4 flex min-h-44 items-center justify-center text-fd-foreground">
            <div className="grid grid-cols-2 gap-2">
              {buttonIntents.map((intent) => (
                <Button key={intent} intent={intent}>
                  <LayoutDashboardIcon /> Label
                </Button>
              ))}
            </div>
          </div>
        </DocsCard>

        <DocsCard
          title="Login"
          description="Don't lose the level, just keep on going."
        >
          <div className="not-prose mt-4 space-y-6 text-fd-foreground">
            <TextField isRequired name="email" />
            <TextField isRequired name="password" type="password" />
            <div className="flex items-center justify-between">
              <Checkbox>Remember me</Checkbox>
              <Link className="text-sm" href="#">
                Forgot password?
              </Link>
            </div>
            <Button className="w-full">Login</Button>
          </div>
        </DocsCard>

        <DocsCard title="Controls">
          <div className="not-prose mt-4 flex min-h-52 items-center justify-center text-fd-foreground">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex flex-col gap-2 md:flex-row">
                <ModalPreskokDemo />
                <DropdownPreskokDemo />
              </div>
              <Select aria-label="Select a role" placeholder="Select a role">
                <SelectTrigger />
                <SelectContent items={roles}>
                  {(item: {
                    id: string
                    name: string
                    description?: string
                  }) => (
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
          </div>
        </DocsCard>

        <DocsCard title="Calendar">
          <div className="not-prose mt-4 flex min-h-80 items-center justify-center overflow-x-auto text-fd-foreground">
            <RangeCalendarPreskokDemo />
          </div>
        </DocsCard>

        <DocsCard title="Choices">
          <div className="not-prose mt-4 flex min-h-80 items-center justify-center text-fd-foreground">
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
          </div>
        </DocsCard>

        <DocsCard title="Toggles">
          <div className="not-prose mt-4 grid min-h-44 content-center gap-4 text-fd-foreground">
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
          </div>
        </DocsCard>
      </DocsCards>

      <div className="grid gap-3 lg:grid-cols-2">
        <AreaChartPreskokDemo />
        <BarChartPreskokDemo />
      </div>
    </section>
  )
}
