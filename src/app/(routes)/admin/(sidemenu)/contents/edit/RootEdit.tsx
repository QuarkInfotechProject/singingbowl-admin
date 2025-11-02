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
import { ApiResponse } from "@/app/_types/content-Types/contentShow";
import { MdOutlineFileUpload } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  // .transform((val) => (val === "" ? undefined : val)), // Handle empty strings

  type: z
    .string()
    .min(1, { message: "Please select a content type" })
    .refine(
      (val) =>
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(val),
      {
        message: "Invalid content type selected",
      }
    ),

  files: z.object({
    desktopImage: z.string().min(1, { message: "Desktop image is required" }),
    mobileImage: z.string().min(1, { message: "Mobile image is required" }),
  }),

  //   mobileImage: z
  //     .string()
  //     .min(1, { message: "Mobile image is required" })
  //     .refine((val) => val.length > 0, {
  //       message: "Please select a mobile image",
  //     }),
  // }),
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
  const [editorValue, setEditorValue] = useState(
    editContentData?.data.type?.toString() || ""
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
  "1": "Hero section",
  "2": "Offer Banner section",
  // "3": "Best Seller section",
  "3": "Pop Up section",
  "5": "Hero Section Side Image",
  "6": "Hero Section GIF",
  "7": "Flash Sales Offer",
  "8": "Category Banner Image",
  "9": "Limited Time Banner Image",
};

  const descriptionRef = useRef();
  const slugRef = useRef();

  const imageRef = useRef();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: editContentData?.data.link || "",
      type: editContentData?.data.type?.toString() || "",
      files: {
        desktopImage:
          editContentData?.data.files.desktopImage.id?.toString() || "",
        mobileImage:
          editContentData?.data.files.mobileImage.id?.toString() || "",
      },
    },
  });

  useEffect(() => {
    if (editContentData?.data.files.desktopImage.id) {
      setFormData({
        desktopImage: editContentData.data.files.desktopImage.id.toString(),
      });
    }
    if (editContentData?.data.files.mobileImage.id) {
      setFormDatas({
        mobileImage: editContentData.data.files.mobileImage.id.toString(),
      });
    }
  }, [editContentData]);
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     link: editContentData?.data.link || "",
  //     type: editContentData?.data.type?.toString() || "",
  //   },
  // });

  const { setValue } = form;
  useEffect(() => {
    if (editContentData?.data.type) {
      const typeValue = editContentData.data.type.toString();
      setEditorValue(typeValue);
      form.setValue("type", typeValue);
    }
  }, [editContentData?.data.type, form]);

  const handleSelected = (value) => {
    setEditorValue(value);
    form.setValue("type", value);
  };
  useEffect(() => {
    if (editContentData?.data) {
      form.setValue("link", editContentData?.data.link || "");
      form.setValue("type", editContentData?.data.type.toString() || "");
      form.setValue(
        "files.desktopImage",
        editContentData?.data.files.desktopImage.id.toString() || ""
      );
      form.setValue(
        "files.mobileImage",
        editContentData?.data.files.mobileImage.id.toString() || ""
      );
    }
  }, [editContentData?.data, setValue]);

  // const handleSelected = (value) => {
  //   if (value !== editorValue) {
  //     setEditorValue(value);
  //   }
  // };

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
    console.log("click");

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
      type: editorValue,
      id: fileId,
      files: {
        desktopImage: formData?.desktopImage,
        mobileImage: formDatas?.mobileImage,
      },
    };
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/content/update", fromData);
      if (data) {
        setIsSheetOpens(false);
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white font-semibold",
        });
        setRefetch(true);

        // setIsSheetsOpen(false);
        // router.push('/admin/blog');
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
          id: editContentData?.data.files.desktopImage.id.toString(),
          url: editContentData?.data.files.desktopImage.desktopImageUrl,
        },
      ]);
    }
  }, [editContentData?.data.files]);

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
    form.setValue("files.desktopImage", imageId.id?.toString());
    form.clearErrors("files.desktopImage");
    // setIsSheetsOpen(false);
  };

  useEffect(() => {
    if (
      editContentData?.data.files.mobileImage.id &&
      editContentData?.data.files.mobileImage.mobileImageUrl
    ) {
      setSelectedPreviews([
        {
          id: editContentData?.data.files.mobileImage.id.toString(),
          url: editContentData?.data.files.mobileImage.mobileImageUrl,
        },
      ]);
    }
  }, [editContentData?.data.files]);

  const handlePreviewSelected = (imageId) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setFormDatas((prevFormData: any) => ({
      ...prevFormData,

      mobileImage: imageId.id,
    }));

    setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
    form.setValue("files.mobileImage", imageId.id?.toString());
    form.clearErrors("files.mobileImage");
    // setIsSheetsOpen(false);
  };
  console.log("type edito", editorValue);
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Update Content</CardTitle>
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
                          placeholder="http://Singingbowl/admin/contents..."
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
                  name="type"
                  defaultValue={editContentData?.data.type?.toString()}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Type
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={handleSelected}
                          value={editorValue}
                          defaultValue={editContentData?.data.type?.toString()}
                          disabled={true}
                        >
                          <SelectTrigger className="w-80">
                            <SelectValue
                              className="text-xs text-gray-300"
                              placeholder="Search by Status"
                            >
                              {typeOptions[editorValue] || ""}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(typeOptions).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
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
                          <div className="">
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
                        {setSelectedPreviews.length > 0 && (
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
