"use client"

import { useState } from "react"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"
import { type Selection } from "react-aria-components"

import { MultipleSelect } from "@/registry/preskok/ui/preskok-ui/searchable-multiple-select"

const queryClient = new QueryClient()

export default function Wrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchableMultiSelectPreskokDemo />
    </QueryClientProvider>
  )
}

function SearchableMultiSelectPreskokDemo() {
  const [selectedItems, setSelectedItems] = useState<Selection>()
  const [singleSelectedItem, setSingleSelectedItem] = useState<Selection>()
  const [countSelectedItems, setCountSelectedItems] = useState<Selection>()

  const query = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      // wait for a second
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        data: technologies,
        selectedItems: new Set(["react", "vue", "angular"]),
        singleSelectedItem: new Set(["react"]),
        countSelectedItems: new Set([
          "react",
          "vue",
          "angular",
          "nextjs",
          "svelte",
        ]),
      }
    },
  })

  return (
    <div className="flex flex-col justify-center gap-8 rounded-lg p-8">
      {/* Multiple selection mode with chips */}
      <MultipleSelect
        selectionMode="multiple"
        displayVariant="chips"
        isPending={query.isLoading}
        description={JSON.stringify(selectedItems, null, 2)}
        label="Multiple Selection (Chips Display)"
        items={query.data?.data}
        selectedKeys={selectedItems}
        onSelectionChange={setSelectedItems}
        placeholder="Choose technologies..."
        className="max-w-sm"
      />

      {/* Single selection mode */}
      <MultipleSelect
        selectionMode="single"
        isPending={query.isLoading}
        description={JSON.stringify(singleSelectedItem, null, 2)}
        label="Single Selection (Text Display)"
        items={query.data?.data}
        selectedKeys={singleSelectedItem}
        onSelectionChange={setSingleSelectedItem}
        placeholder="Choose one technology..."
        className="max-w-sm"
      />

      {/* Multiple selection with count display */}
      <MultipleSelect
        selectionMode="multiple"
        displayVariant="count"
        isPending={query.isLoading}
        description={JSON.stringify(countSelectedItems, null, 2)}
        label="Multiple Selection (Count Display)"
        items={query.data?.data}
        selectedKeys={countSelectedItems}
        onSelectionChange={setCountSelectedItems}
        placeholder="Choose technologies..."
        className="max-w-sm"
      />
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
