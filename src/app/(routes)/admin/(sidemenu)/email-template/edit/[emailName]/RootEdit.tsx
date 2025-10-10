"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EmailEditResponseT } from "@/app/_types/email-Types/emailTypesEdit";
import QuillEditorComponent from "./quillEditor";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IoIosArrowBack } from "react-icons/io";

const RootEdit = ({
  editData,
  name,
}: {
  editData: EmailEditResponseT;
  name: string;
}) => {
  const router = useRouter();

  const [editorData, setEditorData] = useState("");

  useEffect(() => {
    if (editData && editData.data) {
      setEditorData(editData.data.message);
    } else {
      setEditorData("");
      console.error("editData or editData.data is undefined");
    }
  }, [editData]);

  const formSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .default(`${editData?.data?.title}`),
    subject: z
      .string()
      .min(10, {
        message: "Subject must be at least 10 characters.",
      })
      .default(`${editData?.data?.subject}`),
    name: z.string().default(`${name}`),

    message: z.string().default(`${editData?.data?.message}`),

    description: z.string().default(`${editData?.data?.description}`),
  });

  const handleEditorChange = (newData: string) => {
    console.log("New editor data:", newData);
    setEditorData(newData);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const message = editorData;
    const newData = { ...data, message };
    const apiurl = `/api/email`;

    try {
      const res = await fetch(apiurl, {
        method: "POST",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("res", res);
      if (res.status === 200) {
        router.push(`/admin/email-template`);
        toast({
          // title: 'Update Successful',
          description: "Email template has been updated successfully.",
          variant: "default",
          className: "bg-green-500 text-white",
        });
      } else {
        toast({
          // title: 'Update Failed',
          description: "There was an issue updating the data.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occrred while updating data.",
      });
    }
  };
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (editData) {
      setLoading(false);
    }
  }, [editData]);
  const handleRouter = () => {
    router.push("/admin/email-template");
  };
  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-row items-center gap-2 px-4 ">
        <Button
          onClick={handleRouter}
          variant="outline"
          size="xs"
          className="flex items-center justify-center p-1"
        >
          <IoIosArrowBack className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold"> Update Email Template</h1>
      </div>

      <div className=" py-8 px-4">
        <Card className="shadow-lg">
          <CardContent className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-1/4 h-4" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-1/4 h-4" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-1/4 h-4" />
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-10" />
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    defaultValue={editData.data.title}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500 w-96"
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    defaultValue={editData.data.subject}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500 w-96"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    defaultValue={editData.data.message}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Message
                        </FormLabel>
                        <FormControl>
                          <QuillEditorComponent
                            editData={field.value}
                            onDataChange={handleEditorChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-fit bg-blue-500 hover:bg-blue-600 hover:text-white text-white font-semibold py-2 px-4 rounded-md   "
                  >
                    Update
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RootEdit;
