"use client";
import React, { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MdOutlineFileUpload } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  link: z
    .string()
    .min(1, { message: "Must be a valid URL" })
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("http://") ||
        value.startsWith("https://")
    ),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .refine((value) => value.length > 0, {
      message: "Title is required",
    }),
  publishedDate: z
    .string()
    .min(1, { message: "Published Date is required" })
    .refine((value) => value.length > 0, {
      message: "Published Date is required",
    }),
  files: z.object({
    desktopImage: z
      .string()
      .min(1, { message: "Desktop image is required" })
      .refine((value) => value.length > 0, {
        message: "Select a desktop image",
      }),
    mobileImage: z
      .string()
      .min(1, { message: "Mobile image is required" })
      .refine((value) => value.length > 0, {
        message: "Select a mobile image",
      }),
  }),
});

const RootCreate = ({
  setRefetch,
  setIsSheetOpenss,
}: {
  setRefetch: any;
  setIsSheetOpenss: any;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [isSheetsOpens, setIsSheetsOpens] = useState(false);

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [selectedPreview, setSelectedPreview] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedPreviews, setSelectedPreviews] = useState<
    { id: string; url: string }[]
  >([]);

  const [formData, setFormData] = useState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      title: "",
      publishedDate: "",
      files: {
        desktopImage: "",
        mobileImage: "",
      },
    },
    mode: "onChange",
  });

  const handleRemoveImage = (idToRemove: string) => {
    const updatedPreviews = selectedPreview.filter(
      (preview) => preview.id !== idToRemove
    );

    const LogoId =
      updatedPreviews.length > 0
        ? updatedPreviews[updatedPreviews.length - 1].id
        : "";
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      desktopImage: LogoId,
    }));
    setSelectedPreview(updatedPreviews);
    form.setValue("files.desktopImage", LogoId);
    form.trigger("files.desktopImage");
  };

  const handleRemoveImages = (idToRemove: string) => {
    const updatedPreviews = selectedPreview.filter(
      (preview) => preview.id !== idToRemove
    );

    const LogoId =
      updatedPreviews.length > 0
        ? updatedPreviews[updatedPreviews.length - 1].id
        : "";
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      mobileImage: LogoId,
    }));
    setSelectedPreviews(updatedPreviews);
    form.setValue("files.mobileImage", LogoId);
    form.trigger("files.mobileImage");
  };

  
  const handleSubmit = async () => {
    console.log("click");
    const values = form.getValues();
    const result = formSchema.safeParse(values);
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
    const fromData = {
      ...values,
      link: values.link,

      files: {
        desktopImage: formData?.desktopImage,
        mobileImage: formData?.mobileImage,
      },
    };
    console.log("formData", fromData);
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/inPress/add", fromData);
      console.log("dataasddsf", data);
      if (data) {
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        setRefetch(true);
        setIsSheetOpenss(false);
        setIsSheetsOpen(false);
        // router.push('/admin/blog');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("errorzvxcv", error);
        const errorMsg = error?.response?.data?.error;
        const errorPassword = error.response?.data.errors?.link;
        const errorPasswords = error.response?.data.errors?.title;
        const errorDate = error.response?.data.errors?.publishedDate;
        const errorDesktop = error.response?.data?.errors?.files?.desktopImage;

        console.log(errorPassword);

        // if (errorMsg) {
        //   form.setError("link", {
        //     type: "manual",
        //     message: errorPassword || "",
        //   });
        //   form.setError("title", {
        //     type: "manual",
        //     message: errorPasswords || "",
        //   });
        //   form.setError("publishedDate", {
        //     type: "manual",
        //     message: errorDate || "",
        //   });
        //   form.setError("files.desktopImage", {
        //     type: "manual",
        //     message: errorDesktop || "",
        //   });

        //   setIsLoading(false);
        //   toast({
        //     description: errorMsg,
        //     variant: "destructive",
        //   });
        // }
      } else {
        setIsLoading(false);
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
  };

  const toggleCreateDialog = () => {
    setIsSheetsOpen(true);
  };

  const handlePreviewSelecte = (imageId) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      desktopImage: imageId.id,
    }));

    setSelectedPreview([{ url: imageId.url, id: imageId.id }]);
    // setIsSheetsOpen(false);
    form.setValue("files.desktopImage", imageId.id?.toString());
    form.trigger("files.desktopImage");
  };

  const toggleCreateDialogs = () => {
    setIsSheetsOpens(true);
  };

  const handlePreviewSelectes = (imageId) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      mobileImage: imageId.id,
    }));

    setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
    // setIsSheetsOpen(false);
    form.setValue("files.mobileImage", imageId.id?.toString());
    form.trigger("files.mobileImage");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add In The Press</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full  w-full p-0">
            {/* <h1 className="text-left font-bold text-2xl mb-6 ">Add In The Press</h1> */}
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Link
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="http://zolpa" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("title"); // Trigger validation on change
                          }}
                          onBlur={() => {
                            field.onBlur();
                            form.trigger("title"); // Trigger validation on blur
                          }}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Published Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Published Date"
                          type="date"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("publishedDate"); // Trigger validation on change
                          }}
                          onBlur={() => {
                            field.onBlur();
                            form.trigger("publishedDate"); // Trigger validation on blur
                          }}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="files.desktopImage"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="text-md">Desktop Image</FormLabel>
                        <FormControl>
                          <Dialog
                            isOpen={isSheetsOpen}
                            onClose={() => setIsSheetsOpen(false)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={toggleCreateDialog}
                                className="flex flex-row gap-2 px-1 py-1 h-8"
                              >
                                <MdOutlineFileUpload />
                                <span className="text-xs">Upload</span>
                              </Button>
                            </DialogTrigger>
                            {isSheetsOpen && (
                              <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                                <Tabs
                                  onLogoClick={handlePreviewSelecte}
                                  setIsSheetOpen={setIsSheetsOpen}
                                />
                              </DialogContent>
                            )}
                          </Dialog>
                        </FormControl>
                      </div>
                      <div
                        className="mt-4 border-2 rounded-md p-2  "
                        style={{ width: "150px", height: "150px" }}
                      >
                        {selectedPreview.length > 0 && (
                          <div className=" ">
                            {selectedPreview.map((selectedImage) => (
                              <div
                                key={selectedImage.id}
                                className="relative inline-block"
                              >
                                <Image
                                  src={selectedImage.url}
                                  alt="Selected Image"
                                  width={150}
                                  height={150}
                                  // className="w-20 h-20"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImage(selectedImage.id)
                                  }
                                  className="absolute top-0 right-0 bg-white text-black rounded-full p-1"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage> {fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="files.mobileImage"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="text-md">Mobile Image</FormLabel>
                        <FormControl>
                          <Dialog
                            isOpen={isSheetsOpens}
                            onClose={() => setIsSheetsOpens(false)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={toggleCreateDialogs}
                                className="flex flex-row gap-2 px-1 py-1 h-8"
                              >
                                <MdOutlineFileUpload />
                                <span className="text-xs">Upload</span>
                              </Button>
                            </DialogTrigger>
                            {isSheetsOpens && (
                              <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                                <Tabs
                                  onLogoClick={handlePreviewSelectes}
                                  setIsSheetOpen={setIsSheetsOpens}
                                />
                              </DialogContent>
                            )}
                          </Dialog>
                        </FormControl>
                      </div>
                      <div
                        className="mt-4 border-2 rounded-md p-2  "
                        style={{ width: "150px", height: "150px" }}
                      >
                        {selectedPreviews.length > 0 && (
                          <div className=" ">
                            {selectedPreviews.map((selectedImage) => (
                              <div
                                key={selectedImage.id}
                                className="relative inline-block"
                              >
                                <Image
                                  src={selectedImage.url}
                                  alt="Selected Image"
                                  width={150}
                                  height={150}
                                  // className="w-20 h-20"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImages(selectedImage.id)
                                  }
                                  className="absolute top-0 right-0 bg-white text-black rounded-full p-1"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage> {fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-[#5e72e4] hover:bg-[#465ad1]"
              >
                {" "}
                Submit
              </Button>
            </form>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RootCreate;
