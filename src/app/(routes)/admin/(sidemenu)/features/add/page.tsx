"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  text: z.string().nonempty("Text is Required."),
  isActive: z.boolean(),
});

const RootCreate = ({
  setRefetch,
  setIsSheetOpenss,
}: {
  setRefetch: any;
  setIsSheetOpenss: any;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: false,
      text: "",
    },
  });

  const handleSubmit = async () => {
    const values = form.getValues();
    const fromData = {
      isActive: values.isActive,
      text: values.text,
    };

    const result = formSchema.safeParse(fromData);
    if (!result.success) {
      // Handle validation errors
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".") as keyof typeof values;
        form.setError(path, {
          type: "manual",
          message: issue.message,
        });
      });
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/features/add", fromData);

      if (data) {
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
        setRefetch(true);
        setIsSheetOpenss(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error;
        const errorText = error.response?.data.errors?.text;

        if (errorMsg) {
          form.setError("text", {
            type: "manual",
            message: errorText || "",
          });

          setIsLoading(false);
          toast({
            description: errorMsg,
            variant: "destructive",
          });
        }
      } else {
        setIsLoading(false);
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Features</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full w-full p-4">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Text
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Text"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (fieldState.error) {
                              form.clearErrors("text");
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage> {fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription className="whitespace-nowrap">
                          This Feature is currently{" "}
                          {field.value ? "active" : "inactive"}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#5e72e4] hover:bg-[#465ad1]"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RootCreate;
