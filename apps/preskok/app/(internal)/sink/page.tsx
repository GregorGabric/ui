import type { Metadata } from "next"
import { cookies } from "next/headers"

import { ThemeSelector } from "@/components/theme-selector"
import { SidebarProvider } from "@/registry/preskok/ui/preskok-ui/sidebar"
import { Separator } from "@/registry/preskok/ui/separator"
import { AccordionDemo } from "@/app/(internal)/sink/components/accordion-demo"
import { AlertDemo } from "@/app/(internal)/sink/components/alert-demo"
import { AlertDialogDemo } from "@/app/(internal)/sink/components/alert-dialog-demo"
import { AppSidebar } from "@/app/(internal)/sink/components/app-sidebar"
import { AspectRatioDemo } from "@/app/(internal)/sink/components/aspect-ratio-demo"
import { AvatarDemo } from "@/app/(internal)/sink/components/avatar-demo"
import { BadgeDemo } from "@/app/(internal)/sink/components/badge-demo"
import { BreadcrumbDemo } from "@/app/(internal)/sink/components/breadcrumb-demo"
import { ButtonDemo } from "@/app/(internal)/sink/components/button-demo"
import { CalendarDemo } from "@/app/(internal)/sink/components/calendar-demo"
import { CardDemo } from "@/app/(internal)/sink/components/card-demo"
import { CarouselDemo } from "@/app/(internal)/sink/components/carousel-demo"
import { ChartDemo } from "@/app/(internal)/sink/components/chart-demo"
import { CheckboxDemo } from "@/app/(internal)/sink/components/checkbox-demo"
import { CollapsibleDemo } from "@/app/(internal)/sink/components/collapsible-demo"
import { ComboboxDemo } from "@/app/(internal)/sink/components/combobox-demo"
import { CommandDemo } from "@/app/(internal)/sink/components/command-demo"
import { ComponentWrapper } from "@/app/(internal)/sink/components/component-wrapper"
import { ContextMenuDemo } from "@/app/(internal)/sink/components/context-menu-demo"
import { DatePickerDemo } from "@/app/(internal)/sink/components/date-picker-demo"
import { DialogDemo } from "@/app/(internal)/sink/components/dialog-demo"
import { DrawerDemo } from "@/app/(internal)/sink/components/drawer-demo"
import { DropdownMenuDemo } from "@/app/(internal)/sink/components/dropdown-menu-demo"
import { FormDemo } from "@/app/(internal)/sink/components/form-demo"
import { HoverCardDemo } from "@/app/(internal)/sink/components/hover-card-demo"
import { InputDemo } from "@/app/(internal)/sink/components/input-demo"
import { InputOTPDemo } from "@/app/(internal)/sink/components/input-otp-demo"
import { LabelDemo } from "@/app/(internal)/sink/components/label-demo"
import { MenubarDemo } from "@/app/(internal)/sink/components/menubar-demo"
import { NavigationMenuDemo } from "@/app/(internal)/sink/components/navigation-menu-demo"
import { PaginationDemo } from "@/app/(internal)/sink/components/pagination-demo"
import { PopoverDemo } from "@/app/(internal)/sink/components/popover-demo"
import { ProgressDemo } from "@/app/(internal)/sink/components/progress-demo"
import { RadioGroupDemo } from "@/app/(internal)/sink/components/radio-group-demo"
import { ResizableDemo } from "@/app/(internal)/sink/components/resizable-demo"
import { ScrollAreaDemo } from "@/app/(internal)/sink/components/scroll-area-demo"
import { SelectDemo } from "@/app/(internal)/sink/components/select-demo"
import { SeparatorDemo } from "@/app/(internal)/sink/components/separator-demo"
import { SheetDemo } from "@/app/(internal)/sink/components/sheet-demo"
import { SkeletonDemo } from "@/app/(internal)/sink/components/skeleton-demo"
import { SliderDemo } from "@/app/(internal)/sink/components/slider-demo"
import { SonnerDemo } from "@/app/(internal)/sink/components/sonner-demo"
import { SwitchDemo } from "@/app/(internal)/sink/components/switch-demo"
import { TableDemo } from "@/app/(internal)/sink/components/table-demo"
import { TabsDemo } from "@/app/(internal)/sink/components/tabs-demo"
import { TextareaDemo } from "@/app/(internal)/sink/components/textarea-demo"
import { ToggleDemo } from "@/app/(internal)/sink/components/toggle-demo"
import { ToggleGroupDemo } from "@/app/(internal)/sink/components/toggle-group-demo"
import { TooltipDemo } from "@/app/(internal)/sink/components/tooltip-demo"

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title: "Kitchen Sink",
  description: "A page with all components for testing purposes.",
}

export default async function SinkPage() {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="theme-container">
      <AppSidebar />
      <main className="flex flex-1 flex-col">
        <header className="bg-background sticky top-0 z-10 flex h-14 items-center border-b p-4">
          <button className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Toggle Sidebar</span>
          </button>
          <Separator orientation="vertical" className="mr-4 ml-2 !h-4" />
          <h1 className="text-base font-medium">Kitchen Sink</h1>
          <ThemeSelector className="ml-auto" />
        </header>
        <div className="@container grid flex-1 gap-4 p-4">
          <ComponentWrapper name="accordion">
            <AccordionDemo />
          </ComponentWrapper>
          <ComponentWrapper name="alert">
            <AlertDemo />
          </ComponentWrapper>
          <ComponentWrapper name="alert-dialog">
            <AlertDialogDemo />
          </ComponentWrapper>
          <ComponentWrapper name="aspect-ratio">
            <AspectRatioDemo />
          </ComponentWrapper>
          <ComponentWrapper name="avatar">
            <AvatarDemo />
          </ComponentWrapper>
          <ComponentWrapper name="badge">
            <BadgeDemo />
          </ComponentWrapper>
          <ComponentWrapper name="breadcrumb">
            <BreadcrumbDemo />
          </ComponentWrapper>
          <ComponentWrapper name="button">
            <ButtonDemo />
          </ComponentWrapper>
          <ComponentWrapper name="calendar">
            <CalendarDemo />
          </ComponentWrapper>
          <ComponentWrapper name="card">
            <CardDemo />
          </ComponentWrapper>
          <ComponentWrapper name="carousel">
            <CarouselDemo />
          </ComponentWrapper>
          <ComponentWrapper name="chart" className="w-full">
            <ChartDemo />
          </ComponentWrapper>
          <ComponentWrapper name="checkbox">
            <CheckboxDemo />
          </ComponentWrapper>
          <ComponentWrapper name="collapsible">
            <CollapsibleDemo />
          </ComponentWrapper>
          <ComponentWrapper name="combobox">
            <ComboboxDemo />
          </ComponentWrapper>
          <ComponentWrapper name="command">
            <CommandDemo />
          </ComponentWrapper>
          <ComponentWrapper name="context-menu">
            <ContextMenuDemo />
          </ComponentWrapper>
          <ComponentWrapper name="date-picker">
            <DatePickerDemo />
          </ComponentWrapper>
          <ComponentWrapper name="dialog">
            <DialogDemo />
          </ComponentWrapper>
          <ComponentWrapper name="drawer">
            <DrawerDemo />
          </ComponentWrapper>
          <ComponentWrapper name="dropdown-menu">
            <DropdownMenuDemo />
          </ComponentWrapper>
          <ComponentWrapper name="form">
            <FormDemo />
          </ComponentWrapper>
          <ComponentWrapper name="hover-card">
            <HoverCardDemo />
          </ComponentWrapper>
          <ComponentWrapper name="input">
            <InputDemo />
          </ComponentWrapper>
          <ComponentWrapper name="input-otp">
            <InputOTPDemo />
          </ComponentWrapper>
          <ComponentWrapper name="label">
            <LabelDemo />
          </ComponentWrapper>
          <ComponentWrapper name="menubar">
            <MenubarDemo />
          </ComponentWrapper>
          <ComponentWrapper name="navigation-menu">
            <NavigationMenuDemo />
          </ComponentWrapper>
          <ComponentWrapper name="pagination">
            <PaginationDemo />
          </ComponentWrapper>
          <ComponentWrapper name="popover">
            <PopoverDemo />
          </ComponentWrapper>
          <ComponentWrapper name="progress">
            <ProgressDemo />
          </ComponentWrapper>
          <ComponentWrapper name="radio-group">
            <RadioGroupDemo />
          </ComponentWrapper>
          <ComponentWrapper name="resizable">
            <ResizableDemo />
          </ComponentWrapper>
          <ComponentWrapper name="scroll-area">
            <ScrollAreaDemo />
          </ComponentWrapper>
          <ComponentWrapper name="select">
            <SelectDemo />
          </ComponentWrapper>
          <ComponentWrapper name="separator">
            <SeparatorDemo />
          </ComponentWrapper>
          <ComponentWrapper name="sheet">
            <SheetDemo />
          </ComponentWrapper>
          <ComponentWrapper name="skeleton">
            <SkeletonDemo />
          </ComponentWrapper>
          <ComponentWrapper name="slider">
            <SliderDemo />
          </ComponentWrapper>
          <ComponentWrapper name="sonner">
            <SonnerDemo />
          </ComponentWrapper>
          <ComponentWrapper name="switch">
            <SwitchDemo />
          </ComponentWrapper>
          <ComponentWrapper name="table">
            <TableDemo />
          </ComponentWrapper>
          <ComponentWrapper name="tabs">
            <TabsDemo />
          </ComponentWrapper>
          <ComponentWrapper name="textarea">
            <TextareaDemo />
          </ComponentWrapper>
          <ComponentWrapper name="toggle">
            <ToggleDemo />
          </ComponentWrapper>
          <ComponentWrapper name="toggle-group">
            <ToggleGroupDemo />
          </ComponentWrapper>
          <ComponentWrapper name="tooltip">
            <TooltipDemo />
          </ComponentWrapper>
        </div>
      </main>
    </SidebarProvider>
  )
}
