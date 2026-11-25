"use client"

import { useState } from "react"

import {
  GridList,
  GridListDescription,
  GridListHeader,
  GridListItem,
  GridListLabel,
  GridListSection,
  GridListSpacer,
  GridListStart,
} from "@/registry/preskok/ui/preskok-ui/grid-list"
import { Switch } from "@/registry/preskok/ui/preskok-ui/switch"

const ALL_BRANDS_KEY = "all"

export default function GridListControlsPreskokDemo() {
  const [officialBrands, setOfficialBrands] = useState(
    new Set(["Audi", "Volkswagen"])
  )

  const isEveryBrandOfficial = officialBrands.size === brands.length

  const setBrand = (brand: string, isOfficial: boolean) => {
    setOfficialBrands((previous) => {
      const next = new Set(previous)

      if (isOfficial) {
        next.add(brand)
      } else {
        next.delete(brand)
      }

      return next
    })
  }

  const setEveryBrand = (isOfficial: boolean) => {
    setOfficialBrands(new Set(isOfficial ? brands : []))
  }

  return (
    <GridList
      variant="bordered"
      aria-label="Official dealer per brand"
      className="w-sm max-w-full"
      // The whole row toggles its switch, so the label is as easy to hit as the switch.
      onAction={(key) => {
        if (key === ALL_BRANDS_KEY) {
          setEveryBrand(!isEveryBrandOfficial)
        } else {
          setBrand(String(key), !officialBrands.has(String(key)))
        }
      }}
    >
      <GridListSection>
        <GridListHeader>Official dealer</GridListHeader>
        <GridListItem id={ALL_BRANDS_KEY} textValue="All brands">
          <GridListStart>
            <div>
              <GridListLabel>All brands</GridListLabel>
              <GridListDescription>
                {officialBrands.size} of {brands.length} on
              </GridListDescription>
            </div>
          </GridListStart>
          <GridListSpacer />
          <Switch
            aria-label="Official dealer for all brands"
            className="sm:*:data-[slot=indicator]:mt-0"
            isSelected={isEveryBrandOfficial}
            onChange={setEveryBrand}
          />
        </GridListItem>
        {brands.map((brand) => (
          <GridListItem key={brand} id={brand} textValue={brand}>
            <GridListLabel className="font-normal">{brand}</GridListLabel>
            <GridListSpacer />
            <Switch
              aria-label={`Official dealer for ${brand}`}
              className="sm:*:data-[slot=indicator]:mt-0"
              isSelected={officialBrands.has(brand)}
              onChange={(isOfficial) => setBrand(brand, isOfficial)}
            />
          </GridListItem>
        ))}
      </GridListSection>
    </GridList>
  )
}

const brands = ["Audi", "BMW", "Citroën", "Volkswagen", "Škoda"]
