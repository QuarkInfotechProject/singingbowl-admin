"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  isActive: z.boolean().optional(),
  text: z.string().nonempty("Text is Required."),
});

const RootEdit = ({
  setRefetch,
  editContentData,
  fileId,
  setIsSheetOpens,
}: {
  setRefetch: any;
  editContentData: any;
  fileId: number;
  setIsSheetOpens: any;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: editContentData?.data?.isActive === 1 ? true : false,
      text: editContentData?.data?.text?.toString() || "",
    },
  });

  const { setValue } = form;

  useEffect(() => {
    if (editContentData?.data) {
      form.setValue(
        "isActive",
        editContentData?.data.isActive === 1 ? true : false
      );
      form.setValue("text", editContentData?.data.text?.toString() || "");
    }
  }, [editContentData?.data, setValue]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const fromData = {
      text: values.text.toString(),
      isActive: values.isActive,
      id: fileId.toString(),
    };
    setIsLoading(true);
    const result = formSchema.safeParse(fromData);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".") as keyof typeof values;
        form.setError(path, {
          type: "manual",
          message: issue.message,
        });
      });
      return;
    }

    try {
      const { data } = await axios.post("/api/features/update", fromData);

      if (data) {
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
        setRefetch(true);
        setIsSheetOpens(false);
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
        <CardTitle className="text-2xl font-bold">Update Features</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full w-full p-4">
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
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
                          placeholder="text"
                          {...field}
                          defaultValue={editContentData?.data?.text || ""}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          defaultChecked={editContentData?.data?.isActive === 1}
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
                type="submit" 
                disabled={isLoading}
                className="bg-[#5e72e4] hover:bg-[#465ad1]"
              >
                {isLoading ? "Updating..." : "Submit"}
              </Button>
            </form>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RootEdit;
