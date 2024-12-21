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

type Item = {
  id: string;
  label: string;
};

type Props = {
  onProgressUpdate?: (selectedItems: number, totalItems: number) => void;
};

type FormData = {
  items: string[];
};

const defaultItems: Item[] = [
  { id: "recents", label: "Recents" },
  { id: "home", label: "Home" },
  { id: "applications", label: "Applications" },
  { id: "desktop", label: "Desktop" },
  { id: "downloads", label: "Downloads" },
  { id: "documents", label: "Documents" },
];

export function CheckboxReactHookFormMultiple({ onProgressUpdate }: Props) {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [progress, setProgress] = useState(0);

  // Load items from localStorage on component mount
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
      const selectedCount = value.items?.length || 0;
      const totalCount = items.length;
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
    <div className="space-y-4 flex flex-row-reverse ">
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex flex-row justify-center">
          <DigitalClock />
        </div>
        <Card className="w-[645px] h-[200px] p-4 ml-2">
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
            <CardDescription>Your completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% Complete
            </p>
          </CardContent>
        </Card>
        <div className="flex flex-row w-[670px] items-center space-x-2 p-6">
          <Input type="text" placeholder="Type in your feedback..." />
          <Button type="submit" className="rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8 p-4 rounded-lg shadow-md  overflow-y-scroll "
        >
          <div className="flex gap-2 mb-4 ">
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
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Management of Software Systems
                  </FormLabel>
                  <FormDescription>
                    These are the topics to be studied today
                  </FormDescription>
                </div>
                <div className="flex flex-col flex-wrap gap-4 w-[500px]">
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => (
                        <FormItem
                          key={item.id}
                          className="flex flex-row flex-wrap items-center space-x-3 space-y-0 min-w-[300px]"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <Input
                            value={item.label}
                            onChange={(e) =>
                              handleEditLabel(item.id, e.target.value)
                            }
                            className="flex flex-col flex-wrap w-[400px]"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="hover:bg-sky-500">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
