"use client"

import { useEffect, useState } from "react"
import type { Selection } from "react-aria-components"

import { MultipleSelectTest } from "@/registry/preskok/ui/preskok-ui/searchable-multiple-select"

export default function SearchableMultiSelectPreskokDemo() {
  const [selectedItems, setSelectedItems] = useState<Selection>(new Set())
  const [items, setItems] = useState<typeof technologies>([])
  const [isLoading, setIsLoading] = useState(false)

  // Simulate an async fetch for items and initial selection
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    const timer = setTimeout(() => {
      if (cancelled) return
      setItems(technologies)
      // Selected items coming from the "API"
      setSelectedItems(new Set(["react", "vue", "angular"]))
      setIsLoading(false)
    }, 1000)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex justify-center gap-4 rounded-lg p-8 sm:h-[350px]">
      <MultipleSelectTest
        description={JSON.stringify(selectedItems, null, 2)}
        label="Select Technologies"
        items={items}
        selectedKeys={selectedItems}
        onSelectionChange={(s) => {
          console.log(s, "outside")
          setSelectedItems(s)
        }}
        placeholder="Choose technologies..."
        className="max-w-sm"
        renderEmptyState={(q) => (
          <div className="text-muted-foreground p-3 text-sm">
            {isLoading ? (
              "Loading…"
            ) : q ? (
              <>
                No results found for: <strong>{q}</strong>
              </>
            ) : (
              "No options"
            )}
          </div>
        )}
      >
        {(fruit) => (
          <MultipleSelectTest.Item
            id={fruit.id}
            textValue={fruit.label}
            key={fruit.id}
          >
            {fruit.label}
          </MultipleSelectTest.Item>
        )}
      </MultipleSelectTest>
    </div>
  )
}

const technologies = [
  { id: "react", label: "React", bla: "bla" },
  { id: "vue", label: "Vue.js", bla: "bla" },
  { id: "angular", label: "Angular" },
  { id: "svelte", label: "Svelte" },
  { id: "nextjs", label: "Next.js", bla: "bla" },
  { id: "nuxt", label: "Nuxt.js", bla: "bla" },
  { id: "gatsby", label: "Gatsby", bla: "bla" },
  { id: "remix", label: "Remix" },
  { id: "astro", label: "Astro" },
  { id: "solid", label: "SolidJS" },
  { id: "preact", label: "Preact" },
  { id: "qwik", label: "Qwik" },
  { id: "alpine", label: "Alpine.js" },
  { id: "lit", label: "Lit" },
  { id: "stencil", label: "Stencil" },
  { id: "ember", label: "Ember.js" },
  { id: "backbone", label: "Backbone.js" },
  { id: "jquery", label: "jQuery" },
  { id: "stimulus", label: "Stimulus" },
  { id: "htmx", label: "HTMX" },
]
