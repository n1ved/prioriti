"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CheckboxReactHookFormMultiple } from "@/components/CheckboxReactHookFormMultiple";
import { Progress } from "@/components/ui/progress";
import DigitalClock from "@/components/ui/DigitalClock";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  return (
    <SidebarProvider>
      <div className="flex ">
        <AppSidebar />
        <main className="flex flex-row p-6">
          {" "}
          {/* Add a main content area */}
          <div className="flex flex-1">
            <CheckboxReactHookFormMultiple />
          </div>
          {/* <div className="flex-1"> */}
          <Progress className="flex flex-1" />
          {/* </div> */}
        </main>
      </div>
    </SidebarProvider>
  );
}
