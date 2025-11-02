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
  type: z
    .string()
    .min(1, { message: "Select a content type" })
    .refine(
      (value) => ["1", "2", "3", "4", "5", "6", "7", "8","9" ,"10"].includes(value),
      {
        message: "Select a valid content type",
      }
    ),
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
  const [group, setGroup] = useState();
  const [editorData, setEditorData] = useState("");
  const [editorValue, setEditorValue] = useState();
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

  const [formDatas, setFormDatas] = useState();
  const [formData, setFormData] = useState();

  const descriptionRef = useRef();
  const slugRef = useRef();

  const imageRef = useRef();

  const handleSelected = (value) => {
    console.log("valeue", value);
    setEditorValue(value);
    form.setValue("type", value);
    form.trigger("type");
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      type: "",
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
      link: values.link,
      type: editorValue,
      files: {
        desktopImage: formData?.desktopImage,
        mobileImage: formDatas?.mobileImage,
      },
    };
    console.log("formData", fromData);
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/content/add", fromData);
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
        const errorPassword = error.response?.data.errors.type;
        const errorDesktop = error.response?.data?.errors?.files?.desktopImage;
        const errorImages = error.response?.data?.errors?.files?.mobileImage;
        console.log(errorPassword);

        if (errorMsg) {
          form.setError("type", {
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
    // setIsSheetsOpen(false);
    form.setValue("files.mobileImage", imageId.id?.toString());
    form.trigger("files.mobileImage");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full  w-full ">
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
                          placeholder="http://Singingbowl/admin/contents..."
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
                  name="type"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Type
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            handleSelected(value);
                            field.onChange(value);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-80">
                            <SelectValue
                              className="text-xs  text-gray-300"
                              placeholder="Select type"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Hero section</SelectItem>
                            <SelectItem value="2">
                              Offer Banner section
                            </SelectItem>
                            {/* <SelectItem value="3">Best Seller section</SelectItem> */}
                            <SelectItem value="3">Pop Up section</SelectItem>
                            <SelectItem value="5">
                              Hero Section Side Image
                            </SelectItem>
                            <SelectItem value="6">Hero Section GIF</SelectItem>
                            <SelectItem value="7">Flash Sales Offer</SelectItem>
                            <SelectItem value="8">
                              Category Banner Image
                            </SelectItem>
                            <SelectItem value="9">
                              Limited Time Banner Image
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                  name="files.desktopImage"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="text-md ">
                          Desktop Image
                        </FormLabel>
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
                        <FormLabel className="text-md ">Mobile Image</FormLabel>
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
