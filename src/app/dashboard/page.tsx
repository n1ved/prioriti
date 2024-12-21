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
import React, {useContext} from "react";
import {SharedDataContext} from './layout';
import {Card, CardTitle} from "@/components/ui/card";

export default function Page() {
  return (
    <SidebarProvider>
      <div className="flex ">
        <AppSidebar />
        <main className="flex flex-col p-6">
          {" "}
          {/* Add a main content area */}
          <div className="flex flex-1">
            <CheckboxReactHookFormMultiple />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
