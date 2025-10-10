"use client";
import React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import SelectReactSelect, { ValueType } from "react-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ApiResponse,
  MediaCategory,
} from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import makeAnimated from "react-select/animated";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FileApiResponse } from "@/app/_types/media_Types/fileShow_Types/fileShowTypes";

const formSchema = z.object({
  id: z.string().optional(),
  fileName: z.string().optional(),
  image: z.string().optional(),
  fileCategoryId: z
    .union([z.number().nullable(), z.array(z.number())])
    .optional(),
  alternativeText: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
});

const RootMediaEdit = ({
  editMediaData,
  fileId,
  setIsEditDialogOpen,
  onClickTab,
  setRefetch,
}: {
  editMediaData: FileApiResponse | null;
  setIsEditDialogOpen: any;
  fileId: string;
  onClickTab: any;
  setRefetch: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    editMediaData?.data?.thumbnailUrl || null
  );
  const [selectedCategories, setSelectedCategories] = useState<
    ValueType<MediaCategory, true>[]
  >([]);
  const { toast } = useToast();
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<MediaCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingSuccessful, setIsEditingSuccessful] = useState(false);
  const animatedComponents = makeAnimated();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (editMediaData) {
      const initialSelectedCategories = {
        value: editMediaData?.data?.fileCategoryId,
        label: getCategoryLabelById(
          editMediaData?.data?.fileCategoryId,
          categoryData
        ),
      };
      setSelectedCategories([initialSelectedCategories]);

      form.setValue("fileCategoryId", editMediaData?.data?.fileCategoryId);
    }
  }, [editMediaData, categoryData, setCategoryData, form]);

  const { setValue } = form;

  useEffect(() => {
    if (editMediaData) {
      form.setValue("fileName", editMediaData?.data?.filename);
      form.setValue("alternativeText", editMediaData?.data?.alternativeText);
      form.setValue("caption", editMediaData?.data?.caption);
      form.setValue("description", editMediaData?.data?.description);
      form.setValue("title", editMediaData?.data?.title);
      form.setValue("fileCategoryId", editMediaData?.data?.fileCategoryId);
      if (editMediaData?.data?.url) {
        setPreviewImage(editMediaData?.data?.url);
      } else {
        setPreviewImage(null);
      }
    }
  }, [editMediaData, setValue]);
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(`/api/mediaCategory`, {
          method: "GET",
        });
        const data = await res.json();
        setCategoryData(data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchCategoryData();
  }, []);

  const renderCategories = (
    categories: MediaCategory[]
  ): ValueType<MediaCategory, true>[] => {
    return categories.reduce(
      (options: ValueType<MediaCategory, true>[], category: MediaCategory) => {
        options.push({
          value: category.id,
          label: category.name,
        });

        return options;
      },
      []
    );
  };

  const handleCategoryClick = (
    selectedOptions: ValueType<ApiResponse, true>
  ) => {
    const selectedIds = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : selectedOptions
      ? [selectedOptions.value]
      : [];
    setSelectedCategories(selectedOptions);

    form.setValue("fileCategoryId", selectedIds);
  };

  const getCategoryLabelById = (
    categoryId: number,
    categories: MediaCategory[]
  ): string => {
    const findLabel = (items: MediaCategory[]): string => {
      for (const item of items) {
        if (item.id === categoryId) {
          return item.name;
        }
      }
      return "";
    };

    return findLabel(categories);
  };

  const handleButtonClick = async () => {
    console.log("clcik this ");
    try {
      const values = form.getValues();
      const formData = {
        id: values.id,
        fileName: values.fileName,
        caption: values.caption,
        description: values.description,
        title: values.title,
        alternativeText: values.alternativeText,
        fileCategoryId: values.fileCategoryId?.toString(),
      };

      //  console.log("formData of edt", formData)

      const response = await axios.post("/api/media/edit", formData);

      console.log(response.status);

      if (response.status === 200) {
        // router.push('/admin/media');

        // setIsEditDialogOpen(false)

        toast({ description: `${response.data.message}` });
        setRefetch(true);
        setIsEditingSuccessful(true);
        // setIsLoading(false);
        // setIsEditDialogOpen(false);
      } else {
        console.error("No files selected");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // setIsLoading(false);
        toast({
          description: error.response?.data.error,
          variant: "destructive",
        });
      } else {
        // setIsLoading(false);
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
  };
  useEffect(() => {
    if (isEditingSuccessful) {
      // Redirect to another page after successful edit
      onClickTab(1);
    }
  }, [isEditingSuccessful]);

  return (
    <div className=" justify-center items-center p-4 w-[250px] overflow-x-hidden h-[40rem] ">
      <h1 className="font-bold text-md  mb-4">Edit Media</h1>
      {previewImage && (
        <div className="w-28 h-28 flex items-center justify-center">
          {previewImage?.endsWith(".mp4") ? (
            <video
              // id={editMediaData?.data?.id}
              src={previewImage}
              className="w-28 h-28 object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={previewImage} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={previewImage}
              alt="Preview"
              className="w-28 h-28 object-cover"
            />
          )}
        </div>
      )}
      <p className="text-start text-sm">{editMediaData?.data?.file}</p>
      <p className="text-start text-sm">{editMediaData?.data?.size}</p>
      <p className="text-start text-sm">
        {editMediaData?.data?.height} by {editMediaData?.data.width} pixels
      </p>

      <Form {...form}>
        <form className="space-y-2 justify-center w-full items-center ">
          <FormField
            control={form.control}
            name="id"
            defaultValue={fileId ?? ""}
            render={({ field }) => (
              <Input type="hidden" defaultValue={fileId} {...field} />
            )}
          />

          <FormField
            control={form.control}
            name="fileName"
            defaultValue={editMediaData?.data?.filename}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-1">
                <FormLabel className="text-sm font-semibold dark:text-white ">
                  File
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-fit p-2  "
                    defaultValue={editMediaData?.data?.filename}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fileCategoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-1 ">
                <FormLabel className="text-sm font-semibold">
                  File Category
                </FormLabel>
                <SelectReactSelect
                  {...field}
                  components={animatedComponents}
                  options={renderCategories(categoryData)}
                  onChange={handleCategoryClick}
                  value={selectedCategories}
                  placeholder="Select the Category"
                  className="w-fit"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alternativeText"
            defaultValue={editMediaData?.data?.alternativeText}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-2 ">
                <FormLabel className="text-sm font-semibold ">
                  Alternative Text
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-fit p-2"
                    defaultValue={editMediaData?.data?.alternativeText}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            defaultValue={editMediaData?.data?.title}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-2 ">
                <FormLabel className="text-sm font-semibold ">Title</FormLabel>
                <FormControl>
                  <Input
                    className="w-fit p-2"
                    defaultValue={editMediaData?.data?.title}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caption"
            defaultValue={editMediaData?.data?.caption}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-2 ">
                <FormLabel className="text-sm font-semibold  ">
                  Caption
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-fit p-2"
                    defaultValue={editMediaData?.data?.caption}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            defaultValue={editMediaData?.data?.description}
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-2">
                <FormLabel className="text-sm font-semibold ">
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-fit mb-2 p-2"
                    defaultValue={editMediaData?.data?.description}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            onClick={handleButtonClick}
            className="w-14 mt-4 justify-center"
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RootMediaEdit;
