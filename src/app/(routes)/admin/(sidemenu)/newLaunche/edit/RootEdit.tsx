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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { LaunchContent } from "@/app/_types/newLaunche-Types/newLaunchShow";
import { MdOutlineFileUpload } from "react-icons/md";

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
  isBanner: z
    .string()
    .min(1, { message: "Please select a isBanner" })
    .refine((value) => ["0", "1"].includes(value), {
      message: "Select a isBanner",
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
  editContentData: LaunchContent | null;
  fileId: number;
  setIsSheetOpens: any;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [editorValue, setEditorValue] = useState(
    editContentData?.data.isBanner
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
  const descriptionRef = useRef();
  const slugRef = useRef();

  const imageRef = useRef();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: editContentData?.data.link || "",
      isBanner: editContentData?.data.isBanner?.toString() || "",
    },
  });

  const { setValue } = form;
  useEffect(() => {
    if (editContentData?.data.isBanner) {
      setEditorValue(editContentData.data.isBanner);
    }
  }, [editContentData?.data.isBanner]);

  useEffect(() => {
    if (editContentData?.data) {
      form.setValue("link", editContentData?.data.link || "");
      form.setValue(
        "isBanner",
        editContentData?.data.isBanner?.toString() || ""
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
      isBanner: editorValue,
      id: fileId,
      files: {
        desktopImage: formData?.desktopImage,
        mobileImage: formDatas?.mobileImage,
      },
    };

    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/newLaunch/update", fromData);

      if (data) {
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white font-semibold",
        });
        setRefetch(true);
        setIsSheetOpens(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error;
        const errorPassword = error.response?.data.errors.isBanner;
        const errorDesktop = error.response?.data?.errors?.files?.desktopImage;
        const errorImages = error.response?.data?.errors?.files?.mobileImage;

        if (errorMsg) {
          form.setError("isBanner", {
            type: "manual",
            message: errorPassword || "",
          });
          form.setError("files.desktopImage", {
            type: "manual",
            message: errorDesktop || "",
          });
          form.setError("files.mobileImage", {
            type: "manual",
            message: errorImages || "",
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
    form.setValue("files.desktopImage", imageId.id?.toString());
    form.clearErrors("files.desktopImage");
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
    form.setValue("files.mobileImage", imageId.id?.toString());
    form.clearErrors("files.mobileImage");
  };

  console.log("editorValu e is Banner ", editorValue);
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Update New Launch</CardTitle>
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
                          placeholder="https://example"
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
                  name="isBanner"
                  defaultValue={editContentData?.data.isBanner?.toString()}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Banner
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={handleSelected}
                          value={editorValue}
                          defaultValue={editContentData?.data.isBanner?.toString()}
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
                      <FormMessage>{fieldState.error?.message}</FormMessage>
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
                        {setSelectedPreviews.length > 0 && (
                          <div className="">
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
