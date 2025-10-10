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

import {
  AffiliateContent,
  ApiResponse,
} from "@/app/_types/affiliate-Types/affiliateShow";
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
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .refine((value) => value.length > 0, {
      message: "Title is required",
    }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .refine((value) => value.length > 0, {
      message: "Description is required",
    }),
  isPartner: z
    .string()
    .min(1, { message: "Please select a isPartner" })
    .refine((value) => ["0", "1"].includes(value), {
      message: " Select a isPartner",
    }),
  files: z.object({
    desktopLogo: z
      .string()
      .min(1, { message: "Desktop logo is required" })
      .refine((value) => value.length > 0, {
        message: " Select a desktop logo",
      }),
    mobileLogo: z
      .string()
      .min(1, { message: "Mobile logo is required" })
      .refine((value) => value.length > 0, {
        message: " Select a mobile logo",
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
  fileId: number | null;
  setIsSheetOpens: any;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState();
  const [editorData, setEditorData] = useState("");
  // const [editorValue, setEditorValue] = useState(editContentData?.data.isPartner || '');
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

  const [formDatas, setFormDatas] = useState({ mobileLogo: "" });
  const [formData, setFormData] = useState({ desktopLogo: "" });

  //   const typeOptions = {
  //     "1": "Yes",
  //     "0": "No",

  //   };
  useEffect(() => {
    if (editContentData?.data.files.desktopLogo.id) {
      setFormData({
        desktopLogo: editContentData.data.files.desktopLogo.id.toString(),
      });
    }
    if (editContentData?.data.files.mobileLogo.id) {
      setFormDatas({
        mobileLogo: editContentData.data.files.mobileLogo.id.toString(),
      });
    }
  }, [editContentData]);

  const descriptionRef = useRef();
  const slugRef = useRef();

  const imageRef = useRef();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editContentData?.data.title || "",
    },
  });

  const { setValue } = form;
  // useEffect(() => {
  //   if (editContentData?.data.isBanner) {
  //     setEditorValue(editContentData.data.isBanner.toString());
  //   }
  // }, [editContentData?.data.isBanner]);

  useEffect(() => {
    if (editContentData?.data) {
      form.setValue("link", editContentData?.data.link || "");
      form.setValue("title", editContentData?.data.title || "");
      form.setValue(
        "description",
        editContentData?.data.description.toString() || ""
      );
      form.setValue(
        "files.desktopLogo",
        editContentData?.data.files.desktopLogo.id?.toString() || ""
      );
      form.setValue(
        "files.mobileLogo",
        editContentData?.data.files.mobileLogo.id?.toString() || ""
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

      desktopLogo: LogoId,
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

      mobileLogo: LogoId,
    }));
    setSelectedPreviews(updatedPreviews);
  };

 

  const handleSubmits = async () => {
    console.log("click");
    const values = form.getValues();
    console.log(values);
    if (!formData?.desktopLogo) {
      form.setError("files.desktopLogo", {
        type: "manual",
        message: "Desktop image is required",
      });
      return;
    }

    if (!formDatas?.mobileLogo) {
      form.setError("files.mobileLogo", {
        type: "manual",
        message: "Mobile image is required",
      });
      return;
    }
    const fromData = {
      ...values,

      id: fileId,
      files: {
        desktopLogo: formData?.desktopLogo,
        mobileLogo: formDatas?.mobileLogo,
      },
    };
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/affiliate/update", fromData);
      if (data) {
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        setRefetch(true);
        setIsSheetOpens(false);
        // router.push('/admin/blog');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error;
        const errorPassword = error.response?.data.errors.title;
        const errorDesktop = error.response?.data?.errors?.files?.desktopLogo;
        const errorImages = error.response?.data?.errors?.files?.mobileLogo;

        if (errorMsg) {
          form.setError("title", {
            type: "manual",
            message: errorPassword || "",
          });
          form.setError("files.desktopLogo", {
            type: "manual",
            message: errorDesktop || "",
          });
          form.setError("files.mobileLogo", {
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
      editContentData?.data.files.desktopLogo.id &&
      editContentData?.data.files.desktopLogo.desktopLogoUrl
    ) {
      setSelectedPreview([
        {
          id: editContentData?.data.files.desktopLogo.id.toString(),
          url: editContentData?.data.files.desktopLogo.desktopLogoUrl,
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

      desktopLogo: imageId.id,
    }));

    setSelectedPreview([{ url: imageId.url, id: imageId.id }]);
    form.setValue("files.desktopLogo", imageId.id?.toString());
    form.clearErrors("files.desktopLogo");
    // setIsSheetsOpen(false);
  };

  useEffect(() => {
    if (
      editContentData?.data.files.mobileLogo.id &&
      editContentData?.data.files.mobileLogo.mobileLogoUrl
    ) {
      setSelectedPreviews([
        {
          id: editContentData?.data.files.mobileLogo.id.toString(),
          url: editContentData?.data.files.mobileLogo.mobileLogoUrl,
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

      mobileLogo: imageId.id,
    }));

    setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
    form.setValue("files.mobileLogo", imageId.id?.toString());
    form.clearErrors("files.mobileLogo");
    // setIsSheetsOpen(false);
  };
  // console.log("type edito",editorValue)
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold p-0">
          Update Affiliate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full  w-full p-0">
            {/* <h1 className="text-left font-bold text-2xl mb-6 ">Edit Affiliate</h1> */}
            <form className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="link"
                  defaultValue={editContentData?.data.link || ""}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.."
                          {...field}
                          defaultValue={editContentData?.data.link || ""}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                defaultValue={editContentData?.data.title || ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md text-black dark:text-white">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        {...field}
                        defaultValue={editContentData?.data.title || ""}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="files.desktopLogo"
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
                        style={{ width: "100px", height: "100px" }}
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
                                  width={100}
                                  height={100}
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
                  name="files.mobileLogo"
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
                        style={{ width: "100px", height: "100px" }}
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
                                  width={100}
                                  height={100}
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
                onClick={handleSubmits}
                className="bg-[#5e72e4] hover:bg-[#465ad1]"
              >
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
