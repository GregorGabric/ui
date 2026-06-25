"use client"

import { ActivityIcon, BellIcon, CreditCardIcon, UsersIcon } from "lucide-react"

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/registry/preskok/ui/preskok-ui/tabs"

export default function TabsDemo() {
  return (
    <div className="grid w-full gap-8">
      <Tabs aria-label="Workspace settings" className="w-full">
        <TabList>
          <Tab id="members">
            <UsersIcon data-slot="icon" />
            Members
          </Tab>
          <Tab id="billing">
            <CreditCardIcon data-slot="icon" />
            Billing
          </Tab>
          <Tab id="alerts" isDisabled>
            <BellIcon data-slot="icon" />
            Alerts
          </Tab>
        </TabList>
        <TabPanel id="members">
          Invite teammates, manage roles, and review pending access requests.
        </TabPanel>
        <TabPanel id="billing">
          Update billing contacts, payment methods, and invoice delivery.
        </TabPanel>
        <TabPanel id="alerts">
          Notification rules are managed by admins.
        </TabPanel>
      </Tabs>

      <Tabs
        aria-label="Deployment details"
        orientation="vertical"
        className="min-h-40"
      >
        <TabList>
          <Tab id="activity">
            <ActivityIcon data-slot="icon" />
            Activity
          </Tab>
          <Tab id="logs" href="#logs">
            Logs
          </Tab>
          <Tab id="usage" href="#usage">
            Usage
          </Tab>
        </TabList>
        <TabPanel id="activity">
          Last deploy completed 8 minutes ago from the production branch.
        </TabPanel>
        <TabPanel id="logs">
          Runtime logs, build output, and failed request traces appear here.
        </TabPanel>
        <TabPanel id="usage">
          View compute, bandwidth, and function invocation totals.
        </TabPanel>
      </Tabs>
    </div>
  )
}
