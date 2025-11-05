"use client"

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/registry/preskok/ui/preskok-ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs aria-label="Car Marketplace" className={"w-full"}>
      <TabList>
        <Tab id="m">Models</Tab>
        <Tab id="s">Specs</Tab>
        <Tab id="r">Reviews</Tab>
      </TabList>
      <TabPanel id="m">
        Browse through a wide selection of car models from various manufacturers
        and price ranges.
      </TabPanel>
      <TabPanel id="s">
        Check detailed specifications including engine, performance, and
        features for each vehicle.
      </TabPanel>
      <TabPanel id="r">
        Read reviews and ratings from experts and owners to help make your
        decision.
      </TabPanel>
    </Tabs>
  )
}
