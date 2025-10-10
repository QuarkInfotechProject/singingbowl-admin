"use client";
import React, { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
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
import { LaunchContent } from "@/app/_types/newLaunche-Types/newLaunchShow";
import { MdOutlineFileUpload } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

const formSchema = z.object({
  link: z
    .string()
    // .min(2, { message: "Must be a valid URL" })
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("http://") ||
        value.startsWith("https://")
    )
    .optional(),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .refine((value) => value.trim().length > 0, {
      message: "Name is required",
    }),
  files: z.object({
    desktopFile: z.string().min(1, { message: "Desktop image is required" }),
    mobileFile: z.string().min(1, { message: "Mobile image is required" }),
  }),
});

const RootEdit = ({
  setRefetch,
  editContentData,
  fileId,
  setIsSheetOpens,
}: {
  setRefetch: any;
  editContentData: LaunchContent | null;
  fileId: number;
  setIsSheetOpens: any;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [editorValue, setEditorValue] = useState(
    editContentData?.data.type || ""
  );
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
    if (editContentData?.data.files.desktop?.id) {
      setFormData({
        desktopImage: editContentData.data.files.desktop.id.toString(),
      });
    }
    if (editContentData?.data.files.mobile?.id) {
      setFormDatas({
        mobileImage: editContentData.data.files.mobile.id.toString(),
      });
    }
  }, [editContentData]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: editContentData?.data.link || "",
      name: editContentData?.data.isBanner?.toString() || "",
    },
  });

  const { setValue } = form;
  useEffect(() => {
    if (editContentData?.data.isBanner) {
      setEditorValue(editContentData.data.isBanner.toString());
    }
  }, [editContentData?.data.isBanner]);

  useEffect(() => {
    if (editContentData?.data) {
      form.setValue("link", editContentData?.data.link || "");
      form.setValue("name", editContentData?.data.name?.toString() || "");
      form.setValue(
        "files.desktopFile",
        editContentData?.data.files.desktop?.id?.toString() || ""
      );
      form.setValue(
        "files.mobileFile",
        editContentData?.data.files.mobile?.id?.toString() || ""
      );
    }
  }, [editContentData?.data, setValue]);

  const handleSelected = (value: any) => {
    if (value !== editorValue) {
      setEditorValue(value);
    }
  };

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
    if (!formData?.desktopImage) {
      form.setError("files.desktopFile", {
        type: "manual",
        message: "Desktop File is required",
      });
      return;
    }

    if (!formDatas?.mobileImage) {
      form.setError("files.mobileFile", {
        type: "manual",
        message: "Mobile File is required",
      });
      return;
    }
    const fromData = {
      ...values,
      //  name:editorValue,
      id: fileId,
      files: {
        desktopFile: formData.desktopImage,
        mobileFile: formDatas.mobileImage,
      },
    };
    setIsLoading(true);

    try {
      const res = await clientSideFetch({
        url: "/flash-offers/update",
        method: "post",
        toast: "skip",
        body: fromData
      });

      if (res?.status === 200) {
        toast({
          description: res.data.message,
          variant: "default",
          className: "bg-green-500 text-white font-semibold",
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
            if (field === "files.desktopFile") {
              form.setError("files.desktopFile", {
                type: "manual",
                message: message as string,
              });
            } else if (field === "files.mobileFile") {
              form.setError("files.mobileFile", {
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
      editContentData?.data.files.desktop.id &&
      editContentData?.data.files.desktop.desktopUrl
    ) {
      setSelectedPreview([
        {
          id: editContentData?.data.files.desktop.id.toString(),
          url: editContentData?.data.files.desktop.desktopUrl,
        },
      ]);
    }
  }, [editContentData?.data.files]);

  const handlePreviewSelecte = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      desktopImage: imageId.id,
    }));

    setSelectedPreview([{ url: imageId.url, id: imageId.id }]);
    form.setValue("files.desktopFile", imageId.id?.toString());
    form.clearErrors("files.desktopFile");
  };

  useEffect(() => {
    if (
      editContentData?.data.files.mobile.id &&
      editContentData?.data.files.mobile.mobileUrl
    ) {
      setSelectedPreviews([
        {
          id: editContentData?.data.files.mobile.id.toString(),
          url: editContentData?.data.files.mobile.mobileUrl,
        },
      ]);
    }
  }, [editContentData?.data.files]);

  const handlePreviewSelected = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setFormDatas((prevFormData: any) => ({
      ...prevFormData,

      mobileImage: imageId.id,
    }));

    setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
    form.setValue("files.mobileFile", imageId.id?.toString());
    form.clearErrors("files.mobileFile");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Update Best Seller</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full  w-full p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder="Link"
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
                  name="name"
                  defaultValue={editContentData?.data.isBanner?.toString()}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Banner
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          defaultValue={editContentData?.data.link || ""}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="files.desktopFile"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="text-md">Desktop File</FormLabel>
                        <FormControl>
                          <Dialog>
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
                          <div className="">
                            {selectedPreview.map((selectedImage) => (
                              <div
                                key={selectedImage.id}
                                className="relative inline-block"
                              >
                                {selectedImage.url?.endsWith(".png") ||
                                selectedImage.url?.endsWith(".jpg") ||
                                selectedImage.url?.endsWith(".jpeg") ? (
                                  <Image
                                    src={selectedImage.url}
                                    alt="Selected Image"
                                    width={150}
                                    height={150}
                                    // className="w-20 h-20"
                                  />
                                ) : (
                                  <video
                                    src={selectedImage.url}
                                    width={150}
                                    height={150}
                                    loop
                                    autoPlay
                                    // className="w-20 h-20"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                                {/* <Image src={selectedImage.url} alt="Selected Image" width={100} height={100}  className='w-20 h-20'/> */}
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
                  name="files.mobileFile"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="text-md">Mobile File</FormLabel>
                        <FormControl>
                          <Dialog>
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
                                  onLogoClick={handlePreviewSelected}
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
                                {selectedImage.url?.endsWith(".png") ||
                                selectedImage.url?.endsWith(".jpg") ||
                                selectedImage.url?.endsWith(".jpeg") ? (
                                  <Image
                                    src={selectedImage.url}
                                    alt="Selected Image"
                                    width={150}
                                    height={150}
                                    // className="w-20 h-20"
                                  />
                                ) : (
                                  <video
                                    src={selectedImage.url}
                                    width={150}
                                    height={150}
                                    loop
                                    autoPlay
                                    // className="w-20 h-20"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                                {/* <Image src={selectedImage.url} alt="Selected Image" width={100} height={100}  className='w-20 h-20'/> */}
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
