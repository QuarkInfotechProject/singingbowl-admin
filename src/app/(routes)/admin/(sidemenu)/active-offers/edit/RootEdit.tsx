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
import { ApiResponse } from "@/app/_types/content-Types/contentShow";
import { LaunchContent } from "@/app/_types/newLaunche-Types/newLaunchShow";
import { MdOutlineFileUpload } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  isActive: z.boolean().optional(),
  text: z.string().nonempty("Text is Required."),
  files: z.object({
    image: z.string().nonempty("Image is required."),
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
  const [selectedPreviews, setSelectedPreviews] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedPreview, setSelectedPreview] = useState<
    { id: string; url: string }[]
  >([]);

  const [formDatas, setFormDatas] = useState<{ image?: string }>({});
    useEffect(() => {
    if (editContentData?.data.files.image?.id) {
      setFormDatas({
        image: editContentData?.data?.files?.image.id.toString(),
      });
    }
  }, [editContentData]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: editContentData?.data.isActive === 1 ? true : false,
      text: editContentData?.data.text?.toString() || "",
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
      form.setValue(
        "isActive",
        editContentData?.data.isActive === 1 ? true : false
      );
      form.setValue("text", editContentData?.data.text?.toString() || "");
      form.setValue(
        "files.image",
        editContentData?.data.files.image?.id?.toString() || ""
      );
      // form.setValue('files.mobileFile', editContentData?.data.files.mobile?.id?.toString() || '');
    }
  }, [editContentData?.data, setValue]);
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

      image: LogoId,
    }));
    setSelectedPreviews(updatedPreviews);
  };
  const { clearErrors } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const fromData = {
      ...values,
      id: fileId,
      files: {
        image: formDatas?.image.toString(),
      },
    };

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
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/activeOffers/update", fromData);

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
        const errorPassword = error.response?.data.errors.isBanner;
        const errorDesktop = error.response?.data?.errors?.files?.desktopImage;
        const errorImages = error.response?.data?.errors?.files?.mobileImage;

        if (errorMsg) {
          form.setError("text", {
            type: "manual",
            message: errorPassword || "",
          });
          form.setError("files.image", {
            type: "manual",
            message: errorDesktop || "",
          });
          //   form.setError('files.mobileFile', { type: 'manual', message: errorImages || "" });
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
      editContentData?.data.files.image.id &&
      editContentData?.data.files.image.imageUrl
    ) {
      setSelectedPreviews([
        {
          id: editContentData?.data.files.image.id.toString(),
          url: editContentData?.data.files.image.imageUrl,
        },
      ]);
    }
  }, [editContentData?.data.files]);
// 
  const handlePreviewSelected = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setFormDatas((prevFormData: any) => ({
      ...prevFormData,
      image: imageId.id,
    }));
    setSelectedPreviews((prevSelectedPreviews) => {
      const existingImageIndex = prevSelectedPreviews.findIndex(
        (preview: any) => preview.id === imageId.id
      );
      const updatedPreviews =
        existingImageIndex >= 0
          ? prevSelectedPreviews.map((preview: any, index: number) =>
              index === existingImageIndex
                ? { url: imageId.url, id: imageId.id }
                : preview
            )
          : [{ url: imageId.url, id: imageId.id }];

      return updatedPreviews;
    });
    clearErrors("files.image");
  };

  return (
    <Card className="w-full h-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Update Active Offer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full  w-full p-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="text"
                  defaultValue={editContentData?.data.isBanner?.toString()}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Text
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="text"
                          {...field}
                          defaultValue={editContentData?.data.text || ""}
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
                  name="files.image"
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
                                className="flex flex-row gap-2 h-8"
                              >
                                <MdOutlineFileUpload />
                                <span>Upload</span>
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
                      <div className="h-28 w-28   border flex justify-center items-center  rounded-md">
                        {setSelectedPreviews.length > 0 && (
                          <div>
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
                                  className="w-28 h-28 p-2 "
                                />

                                {/* <Image src={selectedImage.url} alt="Selected Image" width={100} height={100}  className='w-20 h-20'/> */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImages(selectedImage.id)
                                  }
                                  className="absolute top-2  right-0 bg-white text-black rounded-full p-1"
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
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          defaultChecked={editContentData?.data.isActive === 1}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription className="whitespace-nowrap">
                          This Active Offer is currently{" "}
                          {field.value ? "active" : "inactive"}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="bg-[#5e72e4] hover:bg-[#465ad1]">
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

export default RootEdit;
