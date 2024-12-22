"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DigitalClock from "./ui/DigitalClock";
import { FileDigit } from "lucide-react";
import { Send } from "lucide-react";
import {useContext} from "react";
import {SharedDataContext} from "@/app/dashboard/layout";
import {date} from "zod";
import { ScheduleComponent} from "@/app/dashboard/list_renderer";
import {Label} from "@/components/ui/label";

type Item = {
  id?: string;
  label?: string;
  date?: string;
    courses?: {
        course_name: string;
        topics: {
        topic_name: string;
        time: string;
        }[];
    }[];
};

type Props = {
  onProgressUpdate?: (selectedItems: number, totalItems: number) => void;
};

type FormData = {
  items: string[];
};

// const defaultItems: Item[] = [
//   {
//     "date": "2024-12-21",
//     "courses": [
//       {
//         "course_name": "Compiler Design",
//         "topics": [
//           {
//             "topic_name": "Analysis of the source program",
//             "time": "30 minutes"
//           },
//           {
//             "topic_name": "Phases of a compiler",
//             "time": "60 minutes"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "date": "2024-12-24",
//     "courses": [
//       {
//         "course_name": "Compiler Design",
//         "topics": [
//           {
//             "topic_name": "Compiler writing tools",
//             "time": "60 minutes"
//           },
//           {
//             "topic_name": "Bootstrapping",
//             "time": "60 minutes"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "date": "2024-12-25",
//     "courses": [
//       {
//         "course_name": "Programming in Python",
//         "topics": [
//           {
//             "topic_name": "Getting started with Python programming",
//             "time": "60 minutes"
//           },
//           {
//             "topic_name": "Interactive shell, IDLE, iPython Notebooks",
//             "time": "60 minutes"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "date": "2024-12-26",
//     "courses": [
//       {
//         "course_name": "Programming in Python",
//         "topics": [
//           {
//             "topic_name": "Numeric data types and character sets",
//             "time": "60 minutes"
//           },
//           {
//             "topic_name": "Expressions",
//             "time": "60 minutes"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "date": "2024-12-27",
//     "courses": [
//       {
//         "course_name": "Programming in Python",
//         "topics": [
//           {
//             "topic_name": "Control statements",
//             "time": "60 minutes"
//           },
//           {
//             "topic_name": "Iteration with for/while loop",
//             "time": "60 minutes"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "date": "2024-12-28",
//     "courses": [
//       {
//         "course_name": "Comprehensive Course Work",
//         "topics": [
//           {
//             "topic_name": "Discrete Mathematical Structures - Module 1 and Module 2",
//             "time": "60 minutes"
//           },
//           {
//             "topic_name": "Data Structures - Module 1, Module 2 and Module 3",
//             "time": "60 minutes"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "date": "2024-12-29",
//     "courses": [
//       {
//         "course_name": "Comprehensive Course Work",
//         "topics": [
//           {
//             "topic_name": "Operating Systems - Module 1 and Module 2",
//             "time": "60 minutes"
//           },
//           {
//             "topic_name": "Computer Organization And Architecture - Module 1, Module 2 and Module 3",
//             "time": "60 minutes"
//           }
//         ]
//       },
//       {
//         "course_name" : "Programming in Python",
//         "topics" : [
//           {
//             "topic_name": "Test Data 1",
//             "time": "30 minutes"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "date": "2024-12-30",
//     "courses": [
//       {
//         "course_name": "Industrial Economics & Foreign Trade",
//         "topics": [
//           {
//             "topic_name": "Scarcity and choice",
//             "time": "60 minutes"
//           },
//           {
//             "topic_name": "Basic economic problems",
//             "time": "60 minutes"
//           }
//         ]
//       }
//     ]
//   }
// ]
const defaultItems = localStorage.getItem("initsch");

function formatedDate(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
}

const filterScheduleByDate = (date: { toISOString: () => string; }, scheduleData: any[]) => {
  // Convert date to YYYY-MM-DD format to match the data structure
  const formattedDate = formatedDate(date);

  const data = scheduleData.filter(schedule => schedule.date === formattedDate);

  // Find the schedule for the selected date
  return data;
};



export function CheckboxReactHookFormMultiple({ onProgressUpdate }: Props) {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const {curDate , setCurDate , count , setCount , totalCount , setTotalCount} = useContext(SharedDataContext);
  const filteredEvents = filterScheduleByDate(
      curDate,
      defaultItems
  );
  // Load items from localStorage on component mountsetTotalCount(0);

  useEffect(() => {
    const savedItems = localStorage.getItem("sidebarItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems(defaultItems);
      localStorage.setItem("sidebarItems", JSON.stringify(defaultItems));
    }
    }, []);

  // Load selected items from localStorage for form default values
  const savedSelectedItems =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("selectedItems") || '["recents", "home"]',
        )
      : ["recents", "home"];

  const form = useForm<FormData>({
    defaultValues: {
      items: savedSelectedItems,
    },
    mode: "onSubmit",
  });

  // Track progress and save to localStorage
  useEffect(() => {
    const subscription = form.watch((value) => {
      const selectedCount = count;
      // @ts-ignore
      const totalCount = totalCount;
      const progressValue =
        totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;
      setProgress(progressValue);

      if (value.items) {
        localStorage.setItem("selectedItems", JSON.stringify(value.items));
      }
    });
    return () => subscription.unsubscribe();

  }, [form.watch, items]);

  const handleAddItem = () => {
    if (newItemLabel.trim()) {
      const newId = newItemLabel.toLowerCase().replace(/\s+/g, "-");
      const updatedItems = [...items, { id: newId, label: newItemLabel }];
      setItems(updatedItems);
      localStorage.setItem("sidebarItems", JSON.stringify(updatedItems));
      setNewItemLabel("");
    }
  };

  const handleEditLabel = (id: string, newLabel: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, label: newLabel } : item,
    );
    setItems(updatedItems);
    localStorage.setItem("sidebarItems", JSON.stringify(updatedItems));
  };

  const handleDeleteItem = (idToDelete: string) => {
    const updatedItems = items.filter((item) => item.id !== idToDelete);
    setItems(updatedItems);
    localStorage.setItem("sidebarItems", JSON.stringify(updatedItems));

    // Update selected items
    const currentItems = form.getValues().items;
    const updatedSelectedItems = currentItems.filter((id) => id !== idToDelete);
    form.setValue("items", updatedSelectedItems);
    localStorage.setItem("selectedItems", JSON.stringify(updatedSelectedItems));
  };

  function onSubmit(data: FormData) {
    if (!data.items || data.items.length === 0) {
      toast({
        title: "Error",
        description: "You must select at least one item.",
      });
      return;
    }

    localStorage.setItem("selectedItems", JSON.stringify(data.items));

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }



  return (
      <div className="space-y-4 grid grid-cols-4 max-w-screen h-screen box-border">

        <div className="w-full col-span-2 h-screen box-border">
          <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-8 p-4 rounded-lg shadow-md  h-screen overflow-y-scroll justify-between box-border"
            >
              <div>
                <div className="flex gap-2 mb-4">
                  <Input
                      placeholder="New item label"
                      value={newItemLabel}
                      onChange={(e) => setNewItemLabel(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddItem}>
                    Add Item
                  </Button>
                </div>

                <FormField
                    control={form.control}
                    name="items"
                    render={() =>
                        (filteredEvents.length === 0 ? <Label className="p-5">No Tasks Available for this day</Label> : <ScheduleComponent data={filteredEvents}/>)
                    }
                />
              </div>
              <div className="flex flex-col">
                <Button type="submit" className="hover:bg-sky-500">
                  Update
                </Button>
                <div className="min-h-10"/>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex flex-row-reverse w-full col-span-2 justify-between items-start h-screen overflow-hidden">
          <div className="flex flex-row justify-center">
            <DigitalClock/>
          </div>
          <Card className="w-[645px] h-[200px] p-4 ml-2">
            <CardHeader>
              <CardTitle>Task Progress</CardTitle>
              <CardDescription>Your completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2"/>
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% Complete ({count}/{totalCount})
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
