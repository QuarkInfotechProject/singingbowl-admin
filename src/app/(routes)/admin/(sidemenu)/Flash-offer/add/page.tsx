"use client";
import React, { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { MdOutlineFileUpload } from "react-icons/md";
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
    desktopFile: z.string().min(1, { message: "Select a desktop File" }),
    mobileFile: z.string().min(1, { message: "Select a Mobile File " }),
  }),
});

interface FormDataState {
  desktopFile?: string;
  mobileFile?: string;
}

const RootCreate = ({
  setRefetch,
  setIsSheetOpenss,
}: {
  setRefetch: any;
  setIsSheetOpenss: any;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [editorData, setEditorData] = useState("");
  const [editorValue, setEditorValue] = useState<string>();
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

  const [formDatas, setFormDatas] = useState<FormDataState>();
  const [formData, setFormData] = useState<FormDataState>();

  const handleSelected = (value: string) => {
    setEditorValue(value);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      name: "",
      files: {
        desktopFile: "",
        mobileFile: "",
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

      desktopFile: LogoId,
    }));
    setSelectedPreview(updatedPreviews);
    form.setValue("files.desktopFile", LogoId);
    form.trigger("files.desktopFile");
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

      mobileFile: LogoId,
    }));
    setSelectedPreviews(updatedPreviews);
    form.setValue("files.mobileFile", LogoId);
    form.trigger("files.mobileFile");
  };

  const handleSubmit = async () => {
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
      link: values.link,
      name: values.name,
      files: {
        desktopFile: formData?.desktopFile,
        mobileFile: formDatas?.mobileFile,
      },
    };
    setIsLoading(true);
    try {
      const response = await clientSideFetch({
        url: "/flash-offers/create",
        method: "post",
        toast: "skip",
        body: fromData,
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        setRefetch(true);
        setIsSheetOpenss(false);
        setIsSheetsOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error;
        const errorPassword = error.response?.data.errors?.name;
        const errorDesktop = error.response?.data?.errors?.files?.desktopImage;
        const errorImages = error.response?.data?.errors?.files?.mobileImage;

        if (errorMsg) {
          form.setError("name", {
            type: "manual",
            message: errorPassword || "",
          });
          form.setError("files.desktopFile", {
            type: "manual",
            message: errorDesktop || "",
          });
          form.setError("files.mobileFile", {
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

  const handlePreviewSelecte = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      desktopFile: imageId.id,
    }));

    setSelectedPreview([{ url: imageId.url, id: imageId.id }]);
    form.setValue("files.desktopFile", imageId.id?.toString());
    form.trigger("files.desktopFile"); // Trigger validation
  };

  const handlePreviewSelected = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setFormDatas((prevFormData: any) => ({
      ...prevFormData,

      mobileFile: imageId.id,
    }));

    setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
    // setIsSheetsOpen(false);
    form.setValue("files.mobileFile", imageId.id?.toString());
    form.trigger("files.mobileFile"); // Trigger validation
  };
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Flash Offers</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full  w-full p-0">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="http://zolpa.com/admin/contents..."
                          {...field}
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("name"); 
                          }}
                          onBlur={() => {
                            field.onBlur();
                            form.trigger("name"); 
                          }}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage> {fieldState.error?.message}</FormMessage>
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
                                    width={100}
                                    height={100}
                                    loop
                                    autoPlay
                                    className="w-20 h-20"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}

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
                        {setSelectedPreviews.length > 0 && (
                          <div className="">
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
                                    width={100}
                                    height={100}
                                    loop
                                    autoPlay
                                    className="w-20 h-20"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
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
