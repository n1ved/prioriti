"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CheckboxReactHookFormMultiple } from "@/components/CheckboxReactHookFormMultiple";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Page() {
  const [progress, setProgress] = useState(0);

  const handleProgressUpdate = (
    selectedItems: string[],
    totalItems: number,
  ) => {
    const progressValue = (selectedItems.length / totalItems) * 100;
    setProgress(progressValue);
  };

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            {/* <Card className="w-[50px]">
              <CardHeader>
                <CardTitle>Task Progress</CardTitle>
                <CardDescription>
                  Your overall completion iueiuhtatus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.round(progress)}% Complete
                </p>
              </CardContent>
            </Card> */}
          </div>
          <CheckboxReactHookFormMultiple
            onProgressUpdate={handleProgressUpdate}
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
