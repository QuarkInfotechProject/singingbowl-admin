"use client";
import React, { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  isActive: z.boolean().optional(),
  text: z.string().nonempty("Text is Required."),
  files: z.object({
    image: z.string().nonempty(" required."),
  }),
});
const  RootCreate = ({
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
  const [selectedPreviews, setSelectedPreviews] = useState<
    { id: string; url: string }[]
  >([]);
  const [formDatas, setFormDatas] = useState<{
    image?: string;
    mobileFile?: string;
  }>({});

  const handleSelected = (value: string) => {
    setEditorValue(value);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: false,
      text: "",
      files: {
        image: "",
      },
    },
  });
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
  const handleSubmit = async () => {
    const values = form.getValues();
    const fromData = {
      isActive: values.isActive,
      text: values.text,
      files: {
        image: formDatas.image?.toString(),
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
      const { data } = await axios.post("/api/activeOffers/add", fromData);

      if (data) {
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
        setRefetch(true);
        setIsSheetOpenss(false);
        setIsSheetsOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error;
        const errorPassword = error.response?.data.errors?.text;
        const errorDesktop = error.response?.data?.errors?.files?.image;

        if (errorMsg) {
          form.setError("text", {
            type: "manual",
            message: errorPassword || "",
          });
          form.setError("files.image", {
            type: "manual",
            message: errorDesktop || "",
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
  const handleTextChange = () => {
    clearErrors("text");
  };
  const toggleCreateDialogs = () => {
    setIsSheetsOpens(true);
  };
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
 
  useEffect(() => {
    form.setValue("files.image", formDatas.image?.toString());
  }, [formDatas]);

  return (
    <Card className="w-full h-auto max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Active Offers</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full w-full p-4">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Text
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Text"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTextChange();
                          }}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage> {fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="files.image"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="text-md">Image</FormLabel>
                        <FormControl>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={toggleCreateDialog}
                                className="flex flex-row h-8 gap-2"
                              >
                                <MdOutlineFileUpload />
                                <span>Upload</span>
                              </Button>
                            </DialogTrigger>
                            {isSheetsOpen && (
                              <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                                <Tabs
                                  onLogoClick={handlePreviewSelected}
                                  setIsSheetOpen={setIsSheetsOpen}
                                />
                              </DialogContent>
                            )}
                          </Dialog>
                        </FormControl>
                      </div>
                      <div className="h-28 w-28   border flex justify-center items-center  rounded-md">
                        {selectedPreviews.length > 0 && (
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
                                  className="w-28 h-28 p-3 "
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImages(selectedImage.id)
                                  }
                                  className="absolute top-0  right-0 bg-white text-black rounded-full p-1"
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
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

              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-[#5e72e4] hover:bg-[#465ad1]"
              >
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
