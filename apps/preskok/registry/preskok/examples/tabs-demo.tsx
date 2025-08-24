"use client"

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/registry/preskok/ui/preskok-ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs aria-label="Car Catalog">
      <TabList>
        <Tab id="m">Models</Tab>
        <Tab id="s">Specifications</Tab>
        <Tab id="f">Features</Tab>
        <Tab id="v">Videos</Tab>
      </TabList>
      <TabPanel id="m">
        Browse through a wide selection of car models for all preferences and
        budgets.
      </TabPanel>
      <TabPanel id="s">
        Check the detailed specifications for your selected car models.
      </TabPanel>
      <TabPanel id="f">
        Discover premium features available across different car models.
      </TabPanel>
      <TabPanel id="v">
        Watch car review videos to learn about performance and handling.
      </TabPanel>
    </Tabs>
  )
}
