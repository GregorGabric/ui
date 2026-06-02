import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  ListFilterIcon,
  PlusIcon,
} from "lucide-react"

import { Badge } from "@/registry/preskok/ui/preskok-ui/badge"
import { Button } from "@/registry/preskok/ui/preskok-ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/preskok/ui/preskok-ui/card"
import { Checkbox } from "@/registry/preskok/ui/preskok-ui/checkbox"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/preskok/ui/preskok-ui/menu"
import {
  Pagination,
  PaginationGap,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/preskok/ui/preskok-ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/registry/preskok/ui/preskok-ui/select"
import { Tab, TabList, Tabs } from "@/registry/preskok/ui/preskok-ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn as TableHead,
  TableHeader,
  TableRow,
} from "@/registry/preskok/ui/preskok-ui/table"

export function ProductsTable({
  products,
}: {
  products: {
    id: string
    name: string
    price: number
    stock: number
    dateAdded: string
    status: string
  }[]
}) {
  return (
    <Card className="flex w-full flex-col gap-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <Tabs defaultSelectedKey="all">
          <TabList className="w-full @3xl/page:w-fit">
            <Tab id="all">All Products</Tab>
            <Tab id="in-stock">In Stock</Tab>
            <Tab id="low-stock">Low Stock</Tab>
            <Tab id="add-product">
              <PlusIcon />
            </Tab>
          </TabList>
        </Tabs>
        <div className="hidden items-center gap-2 **:data-[slot=button]:size-8 **:data-[slot=select-trigger]:h-8 @3xl/page:flex">
          <Select defaultSelectedKey="all" placeholder="Select a product">
            <SelectTrigger>
              <span className="text-muted-foreground text-sm">Category:</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="all">
                <SelectLabel>All</SelectLabel>
              </SelectItem>
              <SelectItem id="in-stock">
                <SelectLabel>In Stock</SelectLabel>
              </SelectItem>
              <SelectItem id="low-stock">
                <SelectLabel>Low Stock</SelectLabel>
              </SelectItem>
              <SelectItem id="archived">
                <SelectLabel>Archived</SelectLabel>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select defaultSelectedKey="all" placeholder="Select a product">
            <SelectTrigger>
              <span className="text-muted-foreground text-sm">Price:</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="all">
                <SelectLabel>$100-$200</SelectLabel>
              </SelectItem>
              <SelectItem id="in-stock">
                <SelectLabel>$200-$300</SelectLabel>
              </SelectItem>
              <SelectItem id="low-stock">
                <SelectLabel>$300-$400</SelectLabel>
              </SelectItem>
              <SelectItem id="archived">
                <SelectLabel>$400-$500</SelectLabel>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select defaultSelectedKey="all" placeholder="Select a product">
            <SelectTrigger>
              <span className="text-muted-foreground text-sm">Status:</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="all">
                <SelectLabel>In Stock</SelectLabel>
              </SelectItem>
              <SelectItem id="in-stock">
                <SelectLabel>Low Stock</SelectLabel>
              </SelectItem>
              <SelectItem id="low-stock">
                <SelectLabel>Archived</SelectLabel>
              </SelectItem>
              <SelectItem id="archived">
                <SelectLabel>Archived</SelectLabel>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button intent="outline" size="sq-sm">
            <ListFilterIcon />
          </Button>
          <Button intent="outline" size="sq-sm">
            <ArrowUpDownIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableHead className="w-12 px-4">
              <Checkbox />
            </TableHead>
            <TableHead isRowHeader>Product</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead />
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:py-2.5">
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-4">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell>
                  <Badge
                    intent="secondary"
                    className={
                      product.status === "Low Stock"
                        ? "border-orange-700 bg-transparent text-orange-700 dark:border-orange-700 dark:bg-transparent dark:text-orange-700"
                        : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(product.dateAdded).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Menu>
                    <MenuTrigger>
                      <Button intent="plain" size="sq-xs" className="size-6">
                        <EllipsisVerticalIcon />
                      </Button>
                    </MenuTrigger>
                    <MenuContent placement="bottom end">
                      <MenuItem>Edit</MenuItem>
                      <MenuItem intent="danger">Delete</MenuItem>
                    </MenuContent>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-between border-t pt-6 @3xl/page:flex-row">
        <div className="text-muted-foreground hidden text-sm @3xl/page:block">
          Showing 1-10 of 100 products
        </div>
        <Pagination className="mx-0 w-fit">
          <PaginationList>
            <PaginationPrevious href="#" />
            <PaginationItem href="#">1</PaginationItem>
            <PaginationItem href="#" isCurrent>
              2
            </PaginationItem>
            <PaginationItem href="#">3</PaginationItem>
            <PaginationGap />
            <PaginationNext href="#" />
          </PaginationList>
        </Pagination>
      </CardFooter>
    </Card>
  )
}
