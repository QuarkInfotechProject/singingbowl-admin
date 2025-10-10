"use client";
import React, { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { IoArrowBackCircleSharp, IoEye, IoEyeOff } from "react-icons/io5";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Group } from "@/app/_types/group-Types/groupType";
import { ApiResponse } from "@/app/_types/inThepress-Types/inThePressShow";
import { LaunchContent } from "@/app/_types/newLaunche-Types/newLaunchShow";
import { PressData } from "@/app/_types/inThepress-Types/inThePressShow";
import { MdOutlineFileUpload } from "react-icons/md";

const formSchema = z.object({
  // id:z.string().optional(),
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

const RootEdit = ({
  setRefetch,
  editContentData,
  fileId,
  setIsSheetOpens,
}: {
  setRefetch: any;
  editContentData: ApiResponse | null;
  fileId: number;
  setIsSheetOpens: any;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState();
  const [editorData, setEditorData] = useState("");
  // const [editorValue, setEditorValue] = useState(editContentData?.data.type || '');
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [isSheetsOpens, setIsSheetsOpens] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedPreviews, setSelectedPreviews] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedPreview, setSelectedPreview] = useState<
    { id: string; url: string }[]
  >([]);

  const [formDatas, setFormDatas] = useState({ mobileImage: "" });
  const [formData, setFormData] = useState({ desktopImage: "" });

  const typeOptions = {
    "1": "Yes",
    "0": "No",
  };

  useEffect(() => {
    if (editContentData?.data.files.desktopImage.id) {
      setFormData({
        desktopImage: editContentData.data.files.desktopImage.id,
      });
    }
    if (editContentData?.data.files.mobileImage.id) {
      setFormDatas({
        mobileImage: editContentData.data.files.mobileImage.id,
      });
    }
  }, [editContentData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: editContentData?.data.link || "",
    },
  });

  const { setValue } = form;

  useEffect(() => {
    if (editContentData?.data) {
      form.setValue("link", editContentData?.data.link || "");
      form.setValue("title", editContentData?.data.title?.toString() || "");
      form.setValue(
        "publishedDate",
        editContentData?.data.publishedDate?.toString() || ""
      );
      form.setValue(
        "files.desktopImage",
        editContentData?.data.files.desktopImage.id?.toString() || ""
      );
      form.setValue(
        "files.mobileImage",
        editContentData?.data.files.mobileImage.id?.toString() || ""
      );
    }
  }, [editContentData?.data, setValue]);

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
  };
  const handleRemoveImages = (idToRemove: string) => {
    const updatedPreviews = selectedPreviews.filter(
      (preview) => preview.id !== idToRemove
    );

    const LogoId =
      updatedPreviews.length > 0
        ? updatedPreviews[updatedPreviews.length - 1].id
        : "";
    setFormDatas((prevFormData: any) => ({
      ...prevFormData,

      mobileImage: LogoId,
    }));
    setSelectedPreviews(updatedPreviews);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
    if (!formData?.desktopImage) {
      form.setError("files.desktopImage", {
        type: "manual",
        message: "Desktop image is required",
      });
      return;
    }

    if (!formDatas?.mobileImage) {
      form.setError("files.mobileImage", {
        type: "manual",
        message: "Mobile image is required",
      });
      return;
    }
    const fromData = {
      ...values,

      id: fileId,
      files: {
        desktopImage: formData?.desktopImage,
        mobileImage: formDatas?.mobileImage,
      },
    };
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/inPress/update", fromData);
      if (data) {
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        setRefetch(true);
        setIsSheetOpens(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data;

        if (errorResponse?.errors) {
          // Handle field-level errors
          Object.entries(errorResponse.errors).forEach(([field, message]) => {
            // Handle nested fields for files
            if (field === "files.desktopImage") {
              form.setError("files.desktopImage", {
                type: "manual",
                message: message as string,
              });
            } else if (field === "files.mobileImage") {
              form.setError("files.mobileImage", {
                type: "manual",
                message: message as string,
              });
            } else {
              // Handle other fields
              form.setError(field as any, {
                type: "manual",
                message: message as string,
              });
            }
          });
        }

        // Show general error toast
        if (errorResponse?.error) {
          toast({
            description: errorResponse.error,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Unexpected Error",
          description:
            error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCreateDialog = () => {
    setIsSheetsOpen(true);
  };
  const toggleCreateDialogs = () => {
    setIsSheetsOpens(true);
  };

  useEffect(() => {
    if (
      editContentData?.data.files.desktopImage.id &&
      editContentData?.data.files.desktopImage.desktopImageUrl
    ) {
      setSelectedPreview([
        {
          id: editContentData?.data.files.desktopImage.id?.toString(),
          url: editContentData?.data.files.desktopImage.desktopImageUrl,
        },
      ]);
    }

    if (
      editContentData?.data.files.mobileImage.id &&
      editContentData?.data.files.mobileImage.mobileImageUrl
    ) {
      setSelectedPreviews([
        {
          id: editContentData?.data.files.mobileImage.id?.toString(),
          url: editContentData?.data.files.mobileImage.mobileImageUrl,
        },
      ]);
    }
  }, [editContentData?.data.files]);

  const handlePreviewSelecte = (imageId) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      desktopImage: imageId.id,
    }));

    setSelectedPreview([{ url: imageId.url, id: imageId.id }]);
    form.setValue("files.desktopImage", imageId.id?.toString());
    form.clearErrors("files.desktopImage");
    // setIsSheetsOpen(false);
  };
  const handlePreviewSelectes = (imageId) => {
    setFormDatas((prevFormData: any) => ({
      ...prevFormData,

      mobileImage: imageId.id,
    }));

    setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
    form.setValue("files.mobileImage", imageId.id?.toString());
    form.clearErrors("files.mobileImage");
    // setIsSheetsOpen(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Update In The Press
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full  w-full p-6">
            {/* <h1 className="text-left font-bold text-2xl mb-6 ">Update In The Press</h1> */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="link"
                  defaultValue={editContentData?.data.link || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title"
                          {...field}
                          defaultValue={editContentData?.data.link || ""}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  defaultValue={editContentData?.data.title || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Title"
                          {...field}
                          defaultValue={editContentData?.data.title || ""}
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
                  defaultValue={editContentData?.data.publishedDate || ""}
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
                          defaultValue={
                            editContentData?.data.publishedDate || ""
                          }
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
                      {fieldState.error && (
                        <FormMessage className="text-red-500">
                          {fieldState.error.message}
                        </FormMessage>
                      )}
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
                      {fieldState.error && (
                        <FormMessage className="text-red-500">
                          {fieldState.error.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="bg-[#5e72e4] hover:bg-[#465ad1]">
                {" "}
                Update
              </Button>
            </form>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RootEdit;
